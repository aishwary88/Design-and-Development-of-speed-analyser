# Traffic Speed Analyser Dashboard

A real-time vehicle analytics dashboard featuring live speed detection, license plate recognition, and intelligent traffic insights using YOLOv8 and Tesseract OCR.

## Features

- **Real-time Vehicle Detection** - YOLOv8-powered object detection
- **License Plate Recognition** - Tesseract OCR integration
- **Speed Analysis** - Real-time speed calculation and violation detection
- **Live Camera Feed** - Support for live camera streaming
- **File Upload Processing** - Process uploaded videos and images
- **Smart Insights** - AI-powered traffic analysis
- **Analytics Dashboard** - Real-time charts and visualizations

## System Requirements

### Backend
- Python 3.8+
- FastAPI
- OpenCV
- Ultralytics YOLOv8
- Tesseract OCR
- SQLite

### Frontend
- Node.js 16+
- React 18
- Tailwind CSS

## Installation

### Backend Setup

```bash
cd dashboard

# Install Python dependencies
pip install -r requirements.txt

# Install Tesseract OCR (Windows)
# Download from: https://github.com/UB-Mannheim/tesseract/wiki
# Add to PATH: C:\Program Files\Tesseract-OCR

# Verify YOLO model
# The yolov8n.pt file should be in the dashboard directory
```

### Frontend Setup

```bash
cd dashboard

# Install Node dependencies
npm install

# Start the development server
npm start
```

## Running the Application

### Option 1: Start Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd dashboard
python backend.py
```

**Terminal 2 - Frontend:**
```bash
cd dashboard
npm start
```

### Option 2: Using Quick Start Scripts

**Windows:**
```bash
start_dashboard.bat
```

**Linux/Mac:**
```bash
./start_dashboard.sh
```

## Usage

### 1. Live Camera Detection

1. Start the dashboard
2. Click "Start Camera" in the Live Detection Panel
3. Allow camera access when prompted
4. Vehicles will be detected and tracked in real-time
5. Speed violations (>60 km/h) are automatically logged

### 2. Upload Video for Processing

1. Click "Upload Video" button in the Live Detection Panel
2. Select a video file (MP4, AVI, MOV, MKV)
3. The video will be processed with YOLOv8 detection
4. Results will be saved to the `results/` directory
5. Processed video with detection overlay can be downloaded

### 3. Upload Image for Analysis

1. Use the Data Collection Panel
2. Drag and drop or click to upload an image
3. Image will be processed for vehicle detection
4. Results displayed in real-time

### 4. View Analytics

- **Traffic Speed Analytics** - View speed trends and distributions
- **Congestion Analysis** - Monitor traffic congestion levels
- **Time Slot Analysis** - Analyze traffic patterns by time
- **Speed Variance** - Track speed variations across roads
- **Smart Insights** - Get AI-powered traffic recommendations

## API Endpoints

### GET /metrics
Returns traffic metrics for dashboard cards.

### GET /analytics
Returns analytics data for charts.

### GET /api/records
Returns all vehicle records and violations.

### GET /api/insights
Returns smart insights based on traffic data.

### POST /api/upload
Upload video or image files for processing.

### POST /api/camera/start
Start live camera stream.

### POST /api/camera/stop
Stop live camera stream.

## Project Structure

```
dashboard/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── CentralVisualization.js
│   │   ├── MetricCards.js
│   │   ├── DataCollectionPanel.js
│   │   ├── SmartInsightsPanel.js
│   │   ├── TrafficSpeedAnalytics.js
│   │   ├── CongestionAnalysis.js
│   │   ├── TimeSlotTrafficAnalysis.js
│   │   ├── SpeedVarianceAnalysis.js
│   │   └── widgets/
│   ├── hooks/
│   │   └── useApi.js
│   ├── App.js
│   └── index.js
├── backend.py
├── integration_layer.py
├── data_processing.py
├── requirements.txt
└── package.json
```

## Database

The system uses SQLite to store:
- Vehicle detection logs
- Speed violation records
- License plate data
- Timestamps

Database file: `sentryspeed.db`

## CSV Integration

Vehicle data is logged to CSV for analysis:
- Location: `dashboard/results/traffic_data.csv`
- Format: timestamp, vehicle_id, speed_kmh, plate_text, confidence, detection_class, frame_id

## Troubleshooting

### Camera Not Working
- Check browser permissions
- Try different camera in browser settings
- Restart browser

### YOLO Model Not Loading
- Verify `yolov8n.pt` exists in dashboard directory
- Check internet connection (model downloads on first run)

### Tesseract OCR Not Working
- Install Tesseract from official repository
- Add to system PATH
- Restart application

### Port Already in Use
- Backend default: 8000
- Frontend default: 3000
- Change ports in respective configuration files

## License

MIT License - See LICENSE file for details