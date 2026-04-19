"""
Integration Layer for Traffic Speed Analyser
Connects: detection → OCR → CSV → API → UI
DO NOT modify existing modules - only extend
"""

import csv
import os
import json
from datetime import datetime
from typing import List, Dict, Any

# Configuration
CSV_DIR = os.path.join(os.path.dirname(__file__), 'results')
CSV_FILE = os.path.join(CSV_DIR, 'traffic_data.csv')

# Ensure CSV directory exists
os.makedirs(CSV_DIR, exist_ok=True)


def init_csv():
    """Initialize CSV file with headers if not exists"""
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([
                'timestamp', 'vehicle_id', 'speed_kmh', 'plate_text',
                'confidence', 'detection_class', 'frame_id'
            ])


def log_to_csv(vehicles: List[Dict[str, Any]], frame_id: int = 0):
    """
    Log vehicle detections to CSV
    DO NOT modify - only append data
    """
    init_csv()
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with open(CSV_FILE, 'a', newline='') as f:
        writer = csv.writer(f)
        for vehicle in vehicles:
            writer.writerow([
                timestamp,
                vehicle.get('id', 0),
                vehicle.get('speed', 0),
                vehicle.get('plate', 'N/A'),
                vehicle.get('confidence', 0),
                vehicle.get('class', 0),
                frame_id
            ])


def read_csv_data(limit: int = 100) -> List[Dict[str, Any]]:
    """
    Read CSV data dynamically for analysis
    DO NOT modify CSV writing - only read
    """
    if not os.path.exists(CSV_FILE):
        return []
    
    data = []
    try:
        with open(CSV_FILE, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                data.append({
                    'timestamp': row['timestamp'],
                    'vehicle_id': int(row['vehicle_id']),
                    'speed_kmh': float(row['speed_kmh']),
                    'plate_text': row['plate_text'],
                    'confidence': float(row['confidence']),
                    'detection_class': int(row['detection_class']),
                    'frame_id': int(row['frame_id'])
                })
                if len(data) >= limit:
                    break
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return []
    
    return data


def get_csv_summary() -> Dict[str, Any]:
    """Get summary statistics from CSV data"""
    data = read_csv_data()
    
    if not data:
        return {
            'total_vehicles': 0,
            'avg_speed': 0,
            'max_speed': 0,
            'violations': 0,
            'unique_vehicles': 0
        }
    
    speeds = [d['speed_kmh'] for d in data]
    
    return {
        'total_vehicles': len(data),
        'avg_speed': round(sum(speeds) / len(speeds), 2),
        'max_speed': round(max(speeds), 2),
        'violations': sum(1 for s in speeds if s > 60),
        'unique_vehicles': len(set(d['vehicle_id'] for d in data))
    }


def get_time_slot_data() -> Dict[str, List[Dict[str, Any]]]:
    """
    Get time-slot based traffic analysis
    Returns data grouped by hour slots
    """
    data = read_csv_data()
    
    if not data:
        return {
            'morning': [], 'afternoon': [], 'evening': [], 'night': []
        }
    
    slots = {
        'morning': [],    # 6 AM - 12 PM
        'afternoon': [],  # 12 PM - 6 PM
        'evening': [],    # 6 PM - 12 AM
        'night': []       # 12 AM - 6 AM
    }
    
    for record in data:
        try:
            hour = datetime.strptime(record['timestamp'], "%Y-%m-%d %H:%M:%S").hour
            if 6 <= hour < 12:
                slots['morning'].append(record)
            elif 12 <= hour < 18:
                slots['afternoon'].append(record)
            elif 18 <= hour < 24:
                slots['evening'].append(record)
            else:
                slots['night'].append(record)
        except:
            continue
    
    return slots


def get_speed_variance() -> Dict[str, Any]:
    """Calculate speed variance statistics"""
    data = read_csv_data()
    
    if not data:
        return {
            'min_speed': 0,
            'max_speed': 0,
            'avg_speed': 0,
            'std_dev': 0,
            'speed_ranges': {
                'low': 0,      # 0-30 km/h
                'moderate': 0, # 30-60 km/h
                'high': 0,     # 60-90 km/h
                'very_high': 0 # 90+ km/h
            }
        }
    
    speeds = [d['speed_kmh'] for d in data]
    avg = sum(speeds) / len(speeds)
    variance = sum((s - avg) ** 2 for s in speeds) / len(speeds)
    std_dev = variance ** 0.5
    
    speed_ranges = {
        'low': sum(1 for s in speeds if s < 30),
        'moderate': sum(1 for s in speeds if 30 <= s < 60),
        'high': sum(1 for s in speeds if 60 <= s < 90),
        'very_high': sum(1 for s in speeds if s >= 90)
    }
    
    return {
        'min_speed': round(min(speeds), 2),
        'max_speed': round(max(speeds), 2),
        'avg_speed': round(avg, 2),
        'std_dev': round(std_dev, 2),
        'speed_ranges': speed_ranges
    }


def get_congestion_status() -> Dict[str, Any]:
    """
    Detect congestion based on vehicle density and speed
    """
    data = read_csv_data()
    
    if not data:
        return {
            'status': 'unknown',
            'vehicle_density': 0,
            'avg_speed': 0,
            'congested_zones': []
        }
    
    speeds = [d['speed_kmh'] for d in data]
    avg_speed = sum(speeds) / len(speeds)
    
    # Congestion detection logic
    if avg_speed < 20:
        status = 'severe'
    elif avg_speed < 40:
        status = 'moderate'
    elif avg_speed < 60:
        status = 'light'
    else:
        status = 'free'
    
    return {
        'status': status,
        'vehicle_density': len(data),
        'avg_speed': round(avg_speed, 2),
        'congested_zones': []
    }


# Integration wrapper function
def process_detection_output(
    vehicles: List[Dict[str, Any]], 
    frame_id: int = 0
) -> Dict[str, Any]:
    """
    Complete integration wrapper:
    1. Log to CSV
    2. Calculate analytics
    3. Return structured data for API/UI
    
    DO NOT modify - only integrate
    """
    # Log to CSV
    log_to_csv(vehicles, frame_id)
    
    # Get analytics
    summary = get_csv_summary()
    speed_variance = get_speed_variance()
    congestion = get_congestion_status()
    time_slots = get_time_slot_data()
    
    return {
        'vehicles': vehicles,
        'summary': summary,
        'speed_variance': speed_variance,
        'congestion': congestion,
        'time_slots': time_slots,
        'timestamp': datetime.now().isoformat()
    }
