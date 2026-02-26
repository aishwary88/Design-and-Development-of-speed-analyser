from flask import Flask, render_template, request, jsonify, Response, send_file
import cv2
import pytesseract
import numpy as np
from ultralytics import YOLO
import os
import threading
import base64
from datetime import datetime
from werkzeug.utils import secure_filename
import io
import zipfile

# Configure pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi', 'mov', 'mkv'}

# allow zip for dataset uploads
app.config['ALLOWED_EXTENSIONS'].add('zip')

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('results', exist_ok=True)

# Load YOLO model
model = YOLO('yolov8n.pt')

# Global variables for camera stream
camera = None
camera_thread = None
frame_queue = None
is_camera_running = False

# Speed calculation parameters
PIXELS_PER_METER = 50
FPS = 30

# Vehicle tracker
vehicle_tracker = {}
frame_count = 0

CAR_CLASSES = [2, 5, 7]  # car, bus, truck

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def detect_license_plate(img):
    """Enhanced license plate detection and OCR"""
    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        edged = cv2.Canny(blur, 100, 200)
        
        contours, _ = cv2.findContours(edged, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        plates = []
        for cnt in contours:
            area = cv2.contourArea(cnt)
            x, y, w, h = cv2.boundingRect(cnt)
            aspect_ratio = float(w) / h if h > 0 else 0
            
            if 2000 < area < 100000 and 2 < aspect_ratio < 6:
                plate_roi = img[y:y+h, x:x+w]
                plate_text = pytesseract.image_to_string(
                    plate_roi,
                    config='--psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
                ).strip()
                
                if len(plate_text) > 2:
                    plates.append({
                        'text': plate_text,
                        'confidence': len(plate_text),
                        'bbox': (x, y, w, h)
                    })
        
        return plates[0] if plates else None
    except:
        return None

def calculate_speed(vehicle_id, current_pos, prev_pos, time_diff):
    """Calculate speed from position change"""
    if time_diff <= 0:
        return 0
    
    distance_pixels = np.linalg.norm(np.array(current_pos) - np.array(prev_pos))
    distance_meters = distance_pixels / PIXELS_PER_METER
    speed_mps = distance_meters / time_diff
    speed_kmh = speed_mps * 3.6
    
    return max(0, speed_kmh)

def track_vehicles(detections, frame_height, frame_width):
    """Simple vehicle tracking based on position"""
    global vehicle_tracker, frame_count
    
    frame_count += 1
    time_diff = 1 / FPS
    
    current_detections = {}
    
    for detection in detections:
        x1, y1, x2, y2 = detection['box']
        cls_id = detection['class']
        conf = detection['confidence']
        
        center = ((x1 + x2) / 2, (y1 + y2) / 2)
        current_detections[center] = {
            'box': detection['box'],
            'class': cls_id,
            'confidence': conf
        }
    
    for vehicle_id in list(vehicle_tracker.keys()):
        prev_center = vehicle_tracker[vehicle_id]['center']
        
        closest_center = None
        min_distance = float('inf')
        
        for current_center in current_detections:
            distance = np.linalg.norm(np.array(current_center) - np.array(prev_center))
            if distance < min_distance and distance < 100:
                min_distance = distance
                closest_center = current_center
        
        if closest_center:
            speed = calculate_speed(vehicle_id, closest_center, prev_center, time_diff)
            vehicle_tracker[vehicle_id] = {
                'center': closest_center,
                'speed': speed,
                'box': current_detections[closest_center]['box'],
                'confidence': current_detections[closest_center]['confidence'],
                'frames': vehicle_tracker[vehicle_id]['frames'] + 1,
                'plate': vehicle_tracker[vehicle_id].get('plate', None)
            }
            del current_detections[closest_center]
        else:
            if vehicle_tracker[vehicle_id]['frames'] > 5:
                del vehicle_tracker[vehicle_id]
            else:
                vehicle_tracker[vehicle_id]['frames'] -= 1
    
    new_vehicle_id = max(vehicle_tracker.keys()) + 1 if vehicle_tracker else 1
    for center, detection in current_detections.items():
        vehicle_tracker[new_vehicle_id] = {
            'center': center,
            'speed': 0,
            'box': detection['box'],
            'confidence': detection['confidence'],
            'frames': 1,
            'plate': None
        }
        new_vehicle_id += 1

def process_frame(frame):
    """Process single frame for vehicle and plate detection"""
    results = model(frame)
    detections = []
    
    for result in results:
        if result.boxes is not None:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                if cls_id in CAR_CLASSES:
                    x1, y1, x2, y2 = box.xyxy[0]
                    confidence = float(box.conf[0])
                    detections.append({
                        'box': (float(x1), float(y1), float(x2), float(y2)),
                        'class': cls_id,
                        'confidence': confidence
                    })
    
    track_vehicles(detections, frame.shape[0], frame.shape[1])
    
    output_frame = frame.copy()
    frame_data = {
        'vehicles': [],
        'timestamp': datetime.now().isoformat()
    }
    
    for vehicle_id, vehicle_data in vehicle_tracker.items():
        x1, y1, x2, y2 = vehicle_data['box']
        speed = vehicle_data['speed']
        confidence = vehicle_data['confidence']
        
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        
        # Detect license plate
        vehicle_roi = frame[y1:y2, x1:x2]
        plate_data = None
        if vehicle_roi.size > 0:
            plate_data = detect_license_plate(vehicle_roi)
            if plate_data:
                vehicle_tracker[vehicle_id]['plate'] = plate_data['text']
        
        plate_text = vehicle_tracker[vehicle_id]['plate'] or 'N/A'
        
        # Color based on speed
        color = (0, 255, 0) if speed < 60 else (0, 165, 255) if speed < 90 else (0, 0, 255)
        cv2.rectangle(output_frame, (x1, y1), (x2, y2), color, 2)
        
        cv2.putText(output_frame, f'ID: {vehicle_id} | {speed:.1f} km/h',
                    (x1, y1 - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        cv2.putText(output_frame, f'Plate: {plate_text}',
                    (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)
        
        frame_data['vehicles'].append({
            'id': vehicle_id,
            'speed': round(speed, 2),
            'plate': plate_text,
            'confidence': round(confidence, 3)
        })
    
    cv2.putText(output_frame, f'Frame: {frame_count} | Vehicles: {len(vehicle_tracker)}',
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    return output_frame, frame_data

def generate_camera_frames():
    """Generate frames from camera"""
    global is_camera_running, vehicle_tracker, frame_count
    
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Cannot open camera")
        is_camera_running = False
        return
    
    is_camera_running = True
    vehicle_tracker = {}
    frame_count = 0
    
    while is_camera_running:
        ret, frame = cap.read()
        if not ret:
            break
        
        output_frame, frame_data = process_frame(frame)
        
        # Encode frame to JPEG
        _, buffer = cv2.imencode('.jpg', output_frame)
        frame_bytes = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n'
               b'Content-Length: ' + str(len(frame_bytes)).encode() + b'\r\n\r\n' +
               frame_bytes + b'\r\n')
    
    cap.release()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/camera/start', methods=['POST'])
def start_camera():
    """Start camera stream"""
    global is_camera_running
    is_camera_running = True
    return jsonify({'status': 'Camera started'})

@app.route('/api/camera/stop', methods=['POST'])
def stop_camera():
    """Stop camera stream"""
    global is_camera_running
    is_camera_running = False
    return jsonify({'status': 'Camera stopped'})

@app.route('/api/camera/stream')
def camera_stream():
    """Stream camera feed"""
    return Response(generate_camera_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/upload', methods=['POST'])
def upload_file():
    """Handle file upload"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'File type not allowed'}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    
    try:
        file_ext = filename.rsplit('.', 1)[1].lower()
        
        if file_ext in {'png', 'jpg', 'jpeg', 'gif'}:
            return process_image_upload(filepath, filename)
        else:
            return process_video_upload(filepath, filename)
    except Exception as e:
        return jsonify({'error': f'Processing error: {str(e)}'}), 500


@app.route('/api/upload-dataset', methods=['POST'])
def upload_dataset():
    """Handle dataset upload: multiple files or a zip archive"""
    # Support both multiple files (form field 'files') and single zip in 'files' or 'file'
    files = request.files.getlist('files')
    single_file = request.files.get('file')

    if not files and not single_file:
        return jsonify({'error': 'No files provided'}), 400

    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    dataset_dir = os.path.join(app.config['UPLOAD_FOLDER'], f'dataset_{timestamp}')
    os.makedirs(dataset_dir, exist_ok=True)

    saved_files = []

    try:
        # If a single zip was uploaded
        if single_file and single_file.filename and single_file.filename.rsplit('.', 1)[1].lower() == 'zip':
            zip_path = os.path.join(dataset_dir, secure_filename(single_file.filename))
            single_file.save(zip_path)

            with zipfile.ZipFile(zip_path, 'r') as zf:
                for member in zf.namelist():
                    # avoid directory traversal
                    member_name = os.path.basename(member)
                    if not member_name:
                        continue
                    target_path = os.path.join(dataset_dir, member_name)
                    with open(target_path, 'wb') as out_f:
                        out_f.write(zf.read(member))
                    saved_files.append(member_name)
        else:
            # Save each uploaded file
            for f in files:
                if f and f.filename:
                    fname = secure_filename(f.filename)
                    fpath = os.path.join(dataset_dir, fname)
                    f.save(fpath)
                    saved_files.append(fname)

        return jsonify({'success': True, 'message': 'Dataset uploaded', 'files': saved_files, 'path': dataset_dir})
    except Exception as e:
        return jsonify({'error': f'Failed to save dataset: {str(e)}'}), 500

def process_image_upload(filepath, filename):
    """Process uploaded image"""
    global vehicle_tracker, frame_count
    vehicle_tracker = {}
    frame_count = 0
    
    frame = cv2.imread(filepath)
    if frame is None:
        return jsonify({'error': 'Cannot read image'}), 400
    
    output_frame, frame_data = process_frame(frame)
    
    output_path = os.path.join('results', f'result_{datetime.now().strftime("%Y%m%d_%H%M%S")}.jpg')
    cv2.imwrite(output_path, output_frame)
    
    # Convert to base64 for display
    _, buffer = cv2.imencode('.jpg', output_frame)
    img_base64 = base64.b64encode(buffer).decode()
    
    return jsonify({
        'success': True,
        'message': 'Image processed successfully',
        'image': f'data:image/jpeg;base64,{img_base64}',
        'detections': frame_data['vehicles'],
        'download_url': f'/api/download/{os.path.basename(output_path)}'
    })

def process_video_upload(filepath, filename):
    """Process uploaded video"""
    global vehicle_tracker, frame_count
    vehicle_tracker = {}
    frame_count = 0
    
    cap = cv2.VideoCapture(filepath)
    
    if not cap.isOpened():
        return jsonify({'error': 'Cannot open video'}), 400
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    output_filename = f'result_{datetime.now().strftime("%Y%m%d_%H%M%S")}.mp4'
    output_path = os.path.join('results', output_filename)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    all_detections = []
    frame_num = 0
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        output_frame, frame_data = process_frame(frame)
        out.write(output_frame)
        
        frame_data['frame_number'] = frame_num
        all_detections.append(frame_data)
        frame_num += 1
    
    cap.release()
    out.release()
    
    return jsonify({
        'success': True,
        'message': 'Video processed successfully',
        'download_url': f'/api/download/{output_filename}',
        'detections': all_detections,
        'total_frames': frame_num
    })

@app.route('/api/download/<filename>')
def download_file(filename):
    """Download processed file"""
    return send_file(os.path.join('results', filename), as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
