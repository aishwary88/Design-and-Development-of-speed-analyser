from flask import Flask, render_template, request, jsonify, Response, send_file
import cv2
import numpy as np
from ultralytics import YOLO
import os
import base64
from datetime import datetime
from werkzeug.utils import secure_filename
import io
import database
import threading
import time

# Try to import pytesseract for OCR (optional)
try:
    import pytesseract
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    TESSERACT_AVAILABLE = True
except:
    TESSERACT_AVAILABLE = False
    print("⚠️  Warning: Tesseract-OCR not found. OCR features disabled.")

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi', 'mov', 'mkv'}

# Add CORS headers
@app.after_request
def add_headers(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
os.makedirs('results', exist_ok=True)

# Initialize database
print("💾 Initializing robust database...")
database.init_db()

# Load YOLO model
print("📦 Loading YOLO model...")
model = YOLO('yolov8n.pt')
print("✅ YOLO model loaded successfully!")

# Global variables
is_camera_running = False
vehicle_tracker = {}
frame_count = 0
cap = None
tracker_lock = threading.Lock()
latest_raw_frame = None
ai_thread_running = False
cumulative_vehicle_count = 0
camera_ready = False  # True once camera hardware is confirmed open

# Configuration
PIXELS_PER_METER = 50
FPS = 30
SPEED_LIMIT = 60.0  # Speed limit threshold for overspeeding database
CAR_CLASSES = [2, 5, 7]  # car, bus, truck

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def detect_license_plate(img):
    """Detect and read license plates using OCR"""
    if not TESSERACT_AVAILABLE:
        return None
    
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
                try:
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
                except:
                    pass
        
        return plates[0] if plates else None
    except Exception as e:
        return None

def calculate_speed(vehicle_id, current_pos, prev_pos, time_diff):
    """Calculate speed from position changes"""
    if time_diff <= 0:
        return 0
    
    distance_pixels = np.linalg.norm(np.array(current_pos) - np.array(prev_pos))
    distance_meters = distance_pixels / PIXELS_PER_METER
    speed_mps = distance_meters / time_diff
    speed_kmh = speed_mps * 3.6
    
    return max(0, speed_kmh)

def track_vehicles(detections, frame_height, frame_width, time_diff):
    """Track vehicles across frames"""
    global vehicle_tracker, frame_count
    
    frame_count += 1
    
    current_detections = {}
    
    for detection in detections:
        x1, y1, x2, y2 = detection['box']
        cls_id = detection['class']
        conf = detection['confidence']
        
        # Track bottom-center instead of center for better stability (where tires touch road)
        center = ((x1 + x2) / 2, y2)
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
            # Increase tracking distance slightly if frame rate drops
            max_dist = 100 * max(1.0, time_diff * 30)
            if distance < min_distance and distance < max_dist:
                min_distance = distance
                closest_center = current_center
        
        if closest_center:
            raw_speed = calculate_speed(vehicle_id, closest_center, prev_center, time_diff)
            
            # Use moving average to smooth speed updates
            prev_speeds = vehicle_tracker[vehicle_id].get('speed_history', [])
            prev_speeds.append(raw_speed)
            if len(prev_speeds) > 5:
                prev_speeds.pop(0)
            smoothed_speed = sum(prev_speeds) / len(prev_speeds)
            
            current_plate = vehicle_tracker[vehicle_id].get('plate', None)
            is_logged = vehicle_tracker[vehicle_id].get('logged_to_db', False)
            
            # If vehicle breaks the speed limit and hasn't been logged yet, log it!
            if smoothed_speed > SPEED_LIMIT and not is_logged:
                database.log_violation(vehicle_id, smoothed_speed, current_plate)
                is_logged = True
            
            with tracker_lock:
                vehicle_tracker[vehicle_id] = {
                    'center': closest_center,
                    'speed': smoothed_speed,
                    'speed_history': prev_speeds,
                    'box': current_detections[closest_center]['box'],
                    'confidence': current_detections[closest_center]['confidence'],
                    'frames': vehicle_tracker[vehicle_id]['frames'] + 1,
                    'plate': current_plate,
                    'logged_to_db': is_logged
                }
            del current_detections[closest_center]
        else:
            with tracker_lock:
                if vehicle_tracker[vehicle_id]['frames'] > 5:
                    # Log to database right before the vehicle disappears
                    database.log_vehicle(vehicle_id, vehicle_tracker[vehicle_id]['speed'], vehicle_tracker[vehicle_id].get('plate'))
                    del vehicle_tracker[vehicle_id]
                else:
                    vehicle_tracker[vehicle_id]['frames'] -= 1
    
    global cumulative_vehicle_count
    with tracker_lock:
        for center, detection in current_detections.items():
            cumulative_vehicle_count += 1
            new_vehicle_id = cumulative_vehicle_count
            vehicle_tracker[new_vehicle_id] = {
                'center': center,
                'speed': 0,
                'speed_history': [0],
                'box': detection['box'],
                'confidence': detection['confidence'],
                'frames': 1,
                'plate': None,
                'logged_to_db': False
            }

def process_frame(frame, time_diff=1/30.0, skip_detection=False):
    """Process frame for vehicle detection"""
    global vehicle_tracker
    
    if not skip_detection:
        # Run YOLO with smaller image size for high FPS and disable verbose
        results = model(frame, imgsz=320, verbose=False)
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
        
        track_vehicles(detections, frame.shape[0], frame.shape[1], time_diff)
    
    output_frame = frame.copy()
    frame_data = {
        'vehicles': [],
        'timestamp': datetime.now().isoformat()
    }
    
    with tracker_lock:
        working_tracker = dict(vehicle_tracker)
    
    for vehicle_id, vehicle_data in working_tracker.items():
        x1, y1, x2, y2 = vehicle_data['box']
        speed = vehicle_data['speed']
        confidence = vehicle_data['confidence']
        
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        
        # Detect license plate ONLY if we haven't already found it and not skipping
        current_plate = vehicle_data.get('plate')
        if not current_plate and not skip_detection:
            vehicle_roi = frame[y1:y2, x1:x2]
            if vehicle_roi.size > 0:
                # Only run heavy Tesseract OCR once every 5 frames per vehicle
                if vehicle_data['frames'] % 5 == 0:
                    plate_data = detect_license_plate(vehicle_roi)
                    if plate_data:
                        with tracker_lock:
                            if vehicle_id in vehicle_tracker:
                                vehicle_tracker[vehicle_id]['plate'] = plate_data['text']
                        current_plate = plate_data['text']
        
        plate_text = current_plate or 'N/A'
        
        # Color based on speed
        if speed < 60:
            color = (0, 255, 0)  # Green
        elif speed < 90:
            color = (0, 165, 255)  # Orange
        else:
            color = (0, 0, 255)  # Red
        
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
    
    cv2.putText(output_frame, f'Frame: {frame_count} | Total Cars Screened: {cumulative_vehicle_count}',
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    return output_frame, frame_data

def ai_worker_loop():
    """Background thread to process AI without blocking camera stream"""
    global latest_raw_frame, ai_thread_running
    last_frame_time = time.time()
    
    while ai_thread_running:
        if latest_raw_frame is None:
            time.sleep(0.01)
            continue
            
        frame_to_process = latest_raw_frame.copy()
        
        current_time = time.time()
        time_diff = current_time - last_frame_time
        if time_diff <= 0:
            time_diff = 1/30.0
        last_frame_time = current_time
        
        # Run AI detection and tracking update (discard visual output here)
        process_frame(frame_to_process, time_diff, skip_detection=False)
        
        # Prevent maxing out CPU 100% loop
        time.sleep(0.01)

def init_camera_hardware():
    """Open camera hardware in background so it's ready before stream is requested."""
    global cap, camera_ready, is_camera_running
    camera_ready = False
    
    print("🎥 Attempting to open camera...")
    new_cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not new_cap.isOpened():
        print("❌ ERROR: Cannot open camera with DSHOW, trying default backend...")
        new_cap = cv2.VideoCapture(0)
    
    if not new_cap.isOpened():
        print("❌ ERROR: Cannot open camera!")
        is_camera_running = False
        return
    
    new_cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    new_cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    new_cap.set(cv2.CAP_PROP_FPS, 30)
    new_cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
    cap = new_cap
    camera_ready = True
    print("✅ Camera hardware initialized and ready!")

def generate_camera_frames():
    """Generate frames from webcam"""
    global is_camera_running, vehicle_tracker, frame_count, cap, tracker_lock
    global latest_raw_frame, ai_thread_running, camera_ready
    
    # Wait up to 5 seconds for camera to be ready
    for _ in range(50):
        if camera_ready:
            break
        time.sleep(0.1)
    
    if not camera_ready or cap is None or not cap.isOpened():
        print("❌ Camera not ready, cannot stream.")
        is_camera_running = False
        return
    
    try:
        vehicle_tracker = {}
        frame_count = 0
        latest_raw_frame = None
        global cumulative_vehicle_count
        cumulative_vehicle_count = 0
        
        # Start AI worker thread
        ai_thread_running = True
        ai_thread = threading.Thread(target=ai_worker_loop)
        ai_thread.daemon = True
        ai_thread.start()
        
        while is_camera_running:
            ret, frame = cap.read()
            if not ret:
                print("⚠️ Failed to read frame from camera")
                break
            
            # Immediately provide frame to background AI thread
            latest_raw_frame = frame.copy()
            
            try:
                # Main thread ONLY draws rectangles. This takes < 1ms, resulting in 30 FPS playback!
                output_frame, frame_data = process_frame(frame, time_diff=1/30.0, skip_detection=True)
                
                # Encode frame to JPEG with quality
                _, buffer = cv2.imencode('.jpg', output_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                frame_bytes = buffer.tobytes()
                
                # Send MJPEG frame fast
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n'
                       b'Content-Length: ' + str(len(frame_bytes)).encode() + b'\r\n'
                       b'X-Timestamp: ' + str(datetime.now().isoformat()).encode() + b'\r\n\r\n' +
                       frame_bytes + b'\r\n')
            except Exception as e:
                print(f"⚠️ Frame processing error: {type(e).__name__}: {e}")
                continue
        
        print("ℹ️ Camera stream ended")
        
    except Exception as e:
        print(f"❌ Critical camera error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        is_camera_running = False
    finally:
        is_camera_running = False
        ai_thread_running = False
        camera_ready = False
        if cap:
            cap.release()
            print("✅ Camera released")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/stream')
def stream_page():
    """Serve the video stream page"""
    return render_template('stream.html')

@app.route('/api/status')
def get_status():
    """Get system status"""
    return jsonify({
        'camera_running': is_camera_running,
        'vehicles_tracked': len(vehicle_tracker),
        'frame_count': frame_count
    })

@app.route('/api/camera/start', methods=['POST'])
def start_camera():
    """Start camera - opens hardware in background thread so stream is ready quickly"""
    global is_camera_running, camera_ready
    is_camera_running = True
    camera_ready = False
    # Launch camera hardware init in background so /api/camera/stream finds it ready
    init_thread = threading.Thread(target=init_camera_hardware, daemon=True)
    init_thread.start()
    print("🎥 Camera init thread launched")
    return jsonify({'status': 'success', 'message': 'Camera starting...'})

@app.route('/api/camera/stop', methods=['POST'])
def stop_camera():
    """Stop camera stream"""
    global is_camera_running
    is_camera_running = False
    print("🛑 Camera stream stopped")
    return jsonify({'status': 'success', 'message': 'Camera stopped'})

@app.route('/api/camera/ready')
def camera_ready_check():
    """Frontend polls this to know when camera hardware is open and streaming is safe"""
    return jsonify({'ready': camera_ready, 'camera_running': is_camera_running})

@app.route('/api/camera/stream')
def camera_stream():
    """Stream camera feed"""
    return Response(generate_camera_frames(),
                   mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/camera/frame')
def camera_frame():
    """Get single frame"""
    global is_camera_running
    if not is_camera_running:
        return jsonify({'error': 'Camera not running'}), 400
    
    try:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            return jsonify({'error': 'Cannot open camera'}), 400
        
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        
        ret, frame = cap.read()
        cap.release()
        
        if not ret:
            return jsonify({'error': 'Failed to capture frame'}), 400
        
        output_frame, frame_data = process_frame(frame)
        _, buffer = cv2.imencode('.jpg', output_frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        frame_base64 = base64.b64encode(buffer.tobytes()).decode('utf-8')
        
        return jsonify({
            'success': True,
            'image': f'data:image/jpeg;base64,{frame_base64}',
            'detections': frame_data['vehicles'],
            'frame_count': frame_count,
            'vehicles_count': len(vehicle_tracker)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/violations')
def get_violations():
    """Fetch all overspeeding violations from database"""
    try:
        violations = database.get_all_violations()
        return jsonify({'success': True, 'violations': violations, 'count': len(violations)})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

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
    if fps <= 0:
        fps = 30.0
    time_diff = 1.0 / fps
    
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
        
        output_frame, frame_data = process_frame(frame, time_diff)
        out.write(output_frame)
        
        frame_data['frame_number'] = frame_num
        all_detections.append(frame_data)
        frame_num += 1
    
    cap.release()
    out.release()
    
    # Generate Excel/CSV Database for the video
    unique_vehicles = {}
    for frame_data in all_detections:
        for v in frame_data.get('vehicles', []):
            vid = v['id']
            if vid not in unique_vehicles:
                unique_vehicles[vid] = {'plate': 'N/A', 'speeds': []}
            if v['plate'] and v['plate'] != 'N/A':
                unique_vehicles[vid]['plate'] = v['plate']
            unique_vehicles[vid]['speeds'].append(v['speed'])
            
    import csv
    csv_filename = f'database_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    csv_path = os.path.join('results', csv_filename)
    
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(['Vehicle ID', 'Average Speed (km/h)', 'Max Speed (km/h)', 'Number Plate'])
        for vid, data in unique_vehicles.items():
            if data['speeds']:
                avg_speed = round(sum(data['speeds']) / len(data['speeds']), 2)
                max_speed = round(max(data['speeds']), 2)
            else:
                avg_speed = max_speed = 0
            writer.writerow([vid, avg_speed, max_speed, data['plate']])
    
    return jsonify({
        'success': True,
        'message': 'Video processed successfully',
        'download_url': f'/api/download/{output_filename}',
        'database_url': f'/api/download/{csv_filename}',
        'detections': all_detections,
        'total_frames': frame_num
    })

@app.route('/api/download/<filename>')
def download_file(filename):
    """Download processed file"""
    return send_file(os.path.join('results', filename), as_attachment=True)

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 SentrySpeed Vehicle Analytics Starting...")
    print("="*50)
    print("📍 URL: http://localhost:5000")
    print("⏹️  Press CTRL+C to stop")
    print("="*50 + "\n")
    
    app.run(debug=False, host='0.0.0.0', port=5000, use_reloader=False)
