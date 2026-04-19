# Dashboard Setup and Run Instructions

This guide will help you set up and run the Traffic Speed Analyser dashboard with real-time vehicle detection.

## Quick Start (3 Steps)

### Step 1: Install Backend Dependencies
```bash
cd dashboard
pip install -r requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd dashboard
npm install
```

### Step 3: Start the Application
```bash
# Terminal 1 - Backend
python backend.py

# Terminal 2 - Frontend  
npm start
```

Then open: http://localhost:3000

---

## Detailed Setup Instructions

### Prerequisites

Before starting, ensure you have:
- **Python 3.8+** installed
- **Node.js 16+** installed
- **Tesseract OCR** installed (Windows/Linux/Mac)

### Backend Setup

```bash
# Navigate to dashboard directory
cd dashboard

# Create virtual environment (optional)
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Verify installation
python -c "import cv2; import ultralytics; import fastapi; print('Backend ready!')"
```

### Frontend Setup

```bash
# Navigate to dashboard directory
cd dashboard

# Install dependencies
npm install

# Verify installation
npm --version
```

### Tesseract OCR Installation

**Windows:**
1. Download: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to `C:\Program Files\Tesseract-OCR`
3. Add to PATH: `C:\Program Files\Tesseract-OCR`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install tesseract-ocr
```

**Mac:**
```bash
brew install tesseract
```

---

## Running the Application

### Method 1: Start Separately

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

### Method 2: Use Quick Start Script

**Windows:**
```bash
start_dashboard.bat
```

**Linux/Mac:**
```bash
chmod +x start_dashboard.sh
./start_dashboard.sh
```

---

## First Time Usage

### 1. Start Camera Detection

1. Open http://localhost:3000
2. Click "Start Camera" button
3. Allow camera access when prompted
4. You should see your camera feed with vehicle detection

### 2. Upload Video for Processing

1. Click "Upload Video" button
2. Select a video file (MP4, AVI, etc.)
3. Wait for processing to complete
4. View results with detection overlay

### 3. View Analytics

- Check real-time metrics on dashboard
- View analytics charts
- Monitor traffic patterns
- Review smart insights

---

## Troubleshooting

### Common Issues

**Camera not working:**
- Check browser permissions
- Try different browser
- Restart browser

**YOLO model not loading:**
- Verify `yolov8n.pt` exists in dashboard directory
- Check internet connection (model downloads on first run)

**Tesseract not found:**
- Install Tesseract OCR
- Add to system PATH
- Restart terminal

**Port already in use:**
- Backend: 8000
- Frontend: 3000
- Change ports or kill existing processes

See `TROUBLESHOOTING.md` for detailed solutions.

---

## Project Structure

```
dashboard/
├── src/
│   ├── components/        # React components
│   │   ├── CentralVisualization.js
│   │   ├── DataCollectionPanel.js
│   │   ├── SmartInsightsPanel.js
│   │   └── ...
│   ├── hooks/
│   │   └── useApi.js      # API hooks
│   ├── App.js             # Main app
│   └── index.js           # Entry point
├── backend.py             # FastAPI backend
├── integration_layer.py   # CSV integration
├── requirements.txt       # Python dependencies
├── package.json           # Node dependencies
└── README.md              # This file
```

---

## API Documentation

### Endpoints

- `GET /metrics` - Traffic metrics
- `GET /analytics` - Analytics data
- `GET /api/records` - Vehicle records
- `GET /api/insights` - Smart insights
- `POST /api/upload` - Upload files
- `POST /api/camera/start` - Start camera
- `POST /api/camera/stop` - Stop camera

See `API_DOC.md` for full API documentation.

---

## Database

The system uses SQLite to store:
- Vehicle detection logs
- Speed violation records
- License plate data

Database file: `sentryspeed.db`

---

## CSV Integration

Vehicle data is logged to CSV:
- Location: `dashboard/results/traffic_data.csv`
- Format: timestamp, vehicle_id, speed_kmh, plate_text, confidence, detection_class, frame_id

---

## Next Steps

After successful setup:

1. **Explore Dashboard Features**
   - Try different time slots
   - View various analytics
   - Test smart insights

2. **Customize Settings**
   - Adjust speed limits
   - Configure detection zones
   - Set up alerts

3. **Deploy to Production**
   - See `Dockerfile` for containerization
   - Deploy to cloud services
   - Set up monitoring

---

## Support

For issues or questions:
1. Check `TROUBLESHOOTING.md`
2. Review `API_DOC.md`
3. Check `PROJECT_OVERVIEW.md`

---

## Success Checklist

- [ ] Python 3.8+ installed
- [ ] Node.js 16+ installed
- [ ] Tesseract OCR installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Dashboard loads in browser
- [ ] Camera feed displays
- [ ] Vehicle detection works
- [ ] Analytics update in real-time

If all items are checked, your system is ready to use!