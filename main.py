import cv2
import pytesseract
import numpy as np
from ultralytics import YOLO
import os
from datetime import datetime
import database

# Configure pytesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Load YOLO model for object detection
model = YOLO('yolov8n.pt')

# Initialize database
print("💾 Initializing robust database...")
database.init_db()

# Speed calculation parameters (calibrate based on your camera setup)
PIXELS_PER_METER = 50  # Adjust based on camera resolution and distance
FPS = 30
SPEED_LIMIT = 60.0  # Speed limit threshold for overspeeding database

# Track vehicles
vehicle_tracker = {}
frame_count = 0

# COCO class IDs
CAR_CLASSES = [2, 5, 7]  # car, bus, truck in COCO dataset

def detect_license_plate(img):
    """Enhanced license plate detection and OCR"""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blur, 100, 200)
    
    contours, _ = cv2.findContours(edged, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    plates = []
    for cnt in contours:
        area = cv2.contourArea(cnt)
        x, y, w, h = cv2.boundingRect(cnt)
        aspect_ratio = float(w) / h if h > 0 else 0
        
        # License plate aspect ratio is typically between 2.5 and 5
        if 2000 < area < 100000 and 2 < aspect_ratio < 6:
            plate_roi = img[y:y+h, x:x+w]
            plate_text = pytesseract.image_to_string(
                plate_roi,
                config='--psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
            ).strip()
            
            if len(plate_text) > 2:  # Filter out noise
                plates.append({
                    'text': plate_text,
                    'confidence': len(plate_text),
                    'bbox': (x, y, w, h)
                })
    
    return plates[0] if plates else None

def calculate_speed(vehicle_id, current_pos, prev_pos, time_diff):
    """Calculate speed from position change"""
    if time_diff <= 0:
        return 0
    
    distance_pixels = np.linalg.norm(np.array(current_pos) - np.array(prev_pos))
    distance_meters = distance_pixels / PIXELS_PER_METER
    speed_mps = distance_meters / time_diff
    speed_kmh = speed_mps * 3.6
    
    return max(0, speed_kmh)  # Prevent negative speeds

def track_vehicles(detections, frame_height, frame_width, time_diff):
    """Simple vehicle tracking based on position"""
    global vehicle_tracker, frame_count
    
    frame_count += 1
    
    # Current detections
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
    
    # Match with existing tracks
    for vehicle_id in list(vehicle_tracker.keys()):
        prev_center = vehicle_tracker[vehicle_id]['center']
        
        # Find closest detection
        closest_center = None
        min_distance = float('inf')
        
        for current_center in current_detections:
            distance = np.linalg.norm(np.array(current_center) - np.array(prev_center))
            # Increase tracking distance slightly if frame rate drops
            max_dist = 100 * max(1.0, time_diff * 30)
            if distance < min_distance and distance < max_dist:  # Max tracking distance
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
            
            # Check for overspeeding
            current_plate = vehicle_tracker[vehicle_id].get('plate', None)
            is_logged = vehicle_tracker[vehicle_id].get('logged_to_db', False)
            
            if smoothed_speed > SPEED_LIMIT and not is_logged:
                database.log_violation(vehicle_id, smoothed_speed, current_plate)
                is_logged = True
            
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
            # Vehicle lost
            if vehicle_tracker[vehicle_id]['frames'] > 5:
                del vehicle_tracker[vehicle_id]
            else:
                vehicle_tracker[vehicle_id]['frames'] -= 1
    
    # Add new vehicles
    new_vehicle_id = max(vehicle_tracker.keys()) + 1 if vehicle_tracker else 1
    for center, detection in current_detections.items():
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
        new_vehicle_id += 1

def process_frame(frame, time_diff=1/30.0):
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
    
    # Track vehicles
    track_vehicles(detections, frame.shape[0], frame.shape[1], time_diff)
    
    # Draw results
    output_frame = frame.copy()
    
    for vehicle_id, vehicle_data in vehicle_tracker.items():
        x1, y1, x2, y2 = vehicle_data['box']
        speed = vehicle_data['speed']
        confidence = vehicle_data['confidence']
        
        x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
        
        # Draw bounding box
        color = (0, 255, 0) if speed < 60 else (0, 165, 255) if speed < 90 else (0, 0, 255)
        cv2.rectangle(output_frame, (x1, y1), (x2, y2), color, 2)
        
        # Draw speed
        cv2.putText(output_frame, f'ID: {vehicle_id} | Speed: {speed:.1f} km/h',
                    (x1, y1 - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        cv2.putText(output_frame, f'Conf: {confidence:.2f}',
                    (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Detect license plate in vehicle region ONLY if we haven't found it yet
        vehicle_roi = frame[y1:y2, x1:x2]
        plate_text = vehicle_tracker[vehicle_id].get('plate')
        
        if vehicle_roi.size > 0 and not plate_text:
            if vehicle_tracker[vehicle_id]['frames'] % 5 == 0:
                plate_data = detect_license_plate(vehicle_roi)
                if plate_data:
                    plate_text = plate_data['text']
                    vehicle_tracker[vehicle_id]['plate'] = plate_text
                    # Log vehicle data when first detected properly
                    print(f"[{datetime.now().strftime('%H:%M:%S')}] Vehicle ID: {vehicle_id} | Speed: {speed:.1f} km/h | Plate: {plate_text}")
        
        if plate_text:
            cv2.putText(output_frame, f'Plate: {plate_text}',
                        (x1, y2 + 25), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
    
    # Add frame info
    cv2.putText(output_frame, f'Frame: {frame_count} | Vehicles: {len(vehicle_tracker)}',
                (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
    
    return output_frame

def process_camera():
    """Process live camera feed"""
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("Error: Cannot open camera")
        return
    
    print("Camera started. Press 'q' to quit.")
    
    import time
    last_frame_time = time.time()
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Error reading frame")
            break
        
        current_time = time.time()
        time_diff = current_time - last_frame_time
        if time_diff <= 0:
            time_diff = 1/30.0
        last_frame_time = current_time
        
        output_frame = process_frame(frame, time_diff)
        cv2.imshow('Vehicle Detection & Plate Recognition', output_frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    cv2.destroyAllWindows()

def process_video_file(file_path):
    """Process video file"""
    if not os.path.exists(file_path):
        print(f"Error: File not found - {file_path}")
        return
    
    cap = cv2.VideoCapture(file_path)
    
    if not cap.isOpened():
        print(f"Error: Cannot open video - {file_path}")
        return
    
    fps = cap.get(cv2.CAP_PROP_FPS)
    if fps <= 0:
        fps = 30.0
    time_diff = 1.0 / fps
    
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    
    # Setup video writer for output
    output_path = f"output_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    
    print(f"Processing video: {file_path}")
    print(f"Output will be saved to: {output_path}")
    
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        output_frame = process_frame(frame, time_diff)
        out.write(output_frame)
        cv2.imshow('Vehicle Detection & Plate Recognition', output_frame)
        
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    
    cap.release()
    out.release()
    cv2.destroyAllWindows()
    print(f"Video saved to: {output_path}")

def process_image_file(file_path):
    """Process single image"""
    if not os.path.exists(file_path):
        print(f"Error: File not found - {file_path}")
        return
    
    frame = cv2.imread(file_path)
    if frame is None:
        print(f"Error: Cannot read image - {file_path}")
        return
    
    print(f"Processing image: {file_path}")
    
    output_frame = process_frame(frame)
    
    output_path = f"output_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
    cv2.imwrite(output_path, output_frame)
    print(f"Image saved to: {output_path}")
    
    cv2.imshow('Vehicle Detection & Plate Recognition', output_frame)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def main():
    """Main function"""
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        file_ext = os.path.splitext(file_path)[1].lower()
        
        if file_ext in ['.jpg', '.jpeg', '.png', '.bmp', '.gif']:
            process_image_file(file_path)
        elif file_ext in ['.mp4', '.avi', '.mov', '.mkv', '.flv']:
            process_video_file(file_path)
        else:
            print(f"Unsupported file format: {file_ext}")
    else:
        process_camera()

if __name__ == "__main__":
    main()