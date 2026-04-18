import sqlite3
import datetime
import threading
import os

DB_PATH = 'sentryspeed.db'
db_lock = threading.Lock()

def get_connection():
    # check_same_thread=False allows us to pass connections or use in multiple threads
    # However we use a lock to ensure thread safety
    return sqlite3.connect(DB_PATH, check_same_thread=False)

def init_db():
    with db_lock:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS overspeeding_violations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                vehicle_id INTEGER,
                speed REAL,
                plate TEXT,
                timestamp DATETIME
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS all_vehicles_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                vehicle_id INTEGER,
                speed REAL,
                plate TEXT,
                timestamp DATETIME
            )
        ''')
        conn.commit()
        conn.close()

def log_violation(vehicle_id, speed, plate):
    # Default plate text if None
    if not plate:
        plate = 'N/A'
        
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with db_lock:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO overspeeding_violations (vehicle_id, speed, plate, timestamp)
            VALUES (?, ?, ?, ?)
        ''', (vehicle_id, round(speed, 2), plate, timestamp))
        conn.commit()
        conn.close()
        
    print(f"🚨 LOGGED OVERSPEEDING: Vehicle {vehicle_id} at {speed:.1f} km/h (Plate: {plate})")

def log_vehicle(vehicle_id, speed, plate):
    # Default plate text if None
    if not plate:
        plate = 'N/A'
        
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    with db_lock:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO all_vehicles_log (vehicle_id, speed, plate, timestamp)
            VALUES (?, ?, ?, ?)
        ''', (vehicle_id, round(speed, 2), plate, timestamp))
        conn.commit()
        conn.close()

def get_all_violations():
    with db_lock:
        conn = get_connection()
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM overspeeding_violations ORDER BY id DESC')
        rows = cursor.fetchall()
        conn.close()
        
    violations = []
    for row in rows:
        violations.append({
            'id': row['id'],
            'vehicle_id': row['vehicle_id'],
            'speed': row['speed'],
            'plate': row['plate'],
            'timestamp': row['timestamp']
        })
    return violations
