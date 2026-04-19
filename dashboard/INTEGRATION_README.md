# Integration Layer - Traffic Speed Analyser

## Overview
This integration layer connects all system components: **detection → OCR → CSV → API → UI**

## Architecture
```
┌─────────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Detection  │ →  │   OCR    │ →  │   CSV    │ →  │   API    │ →  │   UI     │
│  (YOLOv8)   │    │(Tesseract│    │  Logging │    │Endpoints │    │(React)   │
└─────────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

## Files Created

### 1. `dashboard/integration_layer.py`
Core integration module with:
- `init_csv()` - Initialize CSV file with headers
- `log_to_csv(vehicles, frame_id)` - Log detections to CSV
- `read_csv_data(limit)` - Read CSV data dynamically
- `get_csv_summary()` - Get summary statistics
- `get_time_slot_data()` - Time-slot based analysis
- `get_speed_variance()` - Speed variance statistics
- `get_congestion_status()` - Congestion detection
- `process_detection_output()` - Complete integration wrapper

### 2. `dashboard/src/components/CsvDataMonitor.js`
React component for real-time CSV data display with:
- Summary statistics (total vehicles, avg speed, violations)
- Speed variance visualization
- Congestion status indicator
- Recent data table

## API Endpoints Added

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/csv/summary` | GET | CSV data summary statistics |
| `/api/csv/speed-variance` | GET | Speed variance statistics |
| `/api/csv/congestion` | GET | Congestion status |
| `/api/csv/time-slots` | GET | Time-slot based traffic data |
| `/api/csv/data?limit=N` | GET | Raw CSV data (last N records) |
| `/api/integration/status` | GET | Integration layer status |

## How It Works

### 1. Detection → CSV
When `process_frame()` runs in `backend.py`:
```python
# After vehicle detection and OCR
log_to_csv(frame_data['vehicles'], frame_count)
```

### 2. CSV → API
New endpoints read from CSV:
```python
@app.get("/api/csv/summary")
def get_csv_summary_api():
    return get_csv_summary()
```

### 3. API → UI
React hooks fetch data:
```javascript
const { data: csvSummary } = useCsvSummary();
```

## CSV Format

```
timestamp,vehicle_id,speed_kmh,plate_text,confidence,detection_class,frame_id
2026-04-19 10:30:00,1,45.5,ABC123,0.95,2,150
2026-04-19 10:30:01,2,78.2,XYZ789,0.87,5,151
```

## Features

### Real-time CSV Logging
- Appends to CSV without modifying existing data
- Thread-safe file operations
- Automatic directory creation

### Dynamic CSV Reading
- Reads latest N records
- No caching - always fresh data
- Handles missing files gracefully

### Analytics
- Speed variance calculation
- Time-slot analysis (morning/afternoon/evening/night)
- Congestion detection based on speed thresholds
- Violation counting (>60 km/h)

## Usage

### Start Backend
```bash
cd dashboard
python backend.py
```

### Start Frontend
```bash
cd dashboard
npm start
```

### View Data
1. Start camera or upload video
2. Data logs to `dashboard/results/traffic_data.csv`
3. UI displays real-time CSV data in "CSV Data Monitor" panel

## No Breaking Changes

✅ Existing detection logic unchanged  
✅ Existing OCR logic unchanged  
✅ Existing database logging unchanged  
✅ Only adds CSV logging and new API endpoints  
✅ UI extends with new component  

## Troubleshooting

### CSV not logging
- Check `INTEGRATION_AVAILABLE` flag in backend
- Verify `integration_layer.py` is in dashboard folder
- Check file permissions

### UI not showing data
- Verify API is running on port 8000
- Check browser console for errors
- Ensure CSV file exists in `dashboard/results/`
