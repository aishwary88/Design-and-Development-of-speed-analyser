# Setup and Run Guide - Traffic Speed Analyser

This guide will help you set up and run the Traffic Speed Analyser dashboard with real-time vehicle detection.

## Prerequisites

### Required Software

1. **Python 3.8+**
   - Download: https://www.python.org/downloads/
   - Verify: `python --version`

2. **Node.js 16+**
   - Download: https://nodejs.org/
   - Verify: `node --version`

3. **Tesseract OCR**
   - Windows: https://github.com/UB-Mannheim/tesseract/wiki
   - Linux: `sudo apt install tesseract-ocr`
   - Mac: `brew install tesseract`

4. **Git**
   - Download: https://git-scm.com/

## Installation Steps

### Step 1: Clone or Navigate to Project

```bash
# If you have the project files, navigate to the dashboard folder
cd dashboard
```

### Step 2: Backend Setup

```bash
# Create virtual environment (optional but recommended)
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# Install Python dependencies
pip install -r requirements.txt

# Verify installation
python -c "import cv2; import ultralytics; print('All packages installed successfully!')"
```

### Step 3: Frontend Setup

```bash
# Install Node dependencies
npm install

# Verify installation
npm --version
```

## Running the Application

### Method 1: Start Backend and Frontend Separately

**Terminal 1 - Start Backend:**
```bash
cd dashboard
python backend.py
```

You should see:
```
✅ YOLO model loaded successfully!
INFO:     Started server process [12345]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 - Start Frontend:**
```bash
cd dashboard
npm start
```

You should see:
```
Compiled successfully!

You can now view traffic-dashboard in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.X:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

### Method 2: Using Quick Start Scripts

**Windows:**
```bash
start_dashboard.bat
```

**Linux/Mac:**
```bash
chmod +x start_dashboard.sh
./start_dashboard.sh
```

## First Time Setup

### 1. Verify YOLO Model

The first time you run the application, YOLOv8 will download the model:
```
Downloading https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt
```

This may take a few minutes depending on your internet connection.

### 2. Test Camera Access

1. Open browser to http://localhost:3000
2. Click "Start Camera" in the Live Detection Panel
3. Allow camera access when prompted
4. You should see your camera feed with vehicle detection

### 3. Test File Upload

1. Click "Upload Video" or use the Data Collection Panel
2. Select a video file (MP4, AVI, etc.)
3. Wait for processing to complete
4. View results in the dashboard

## Common Issues and Solutions

### Issue 1: Camera Access Denied

**Solution:**
- Check browser permissions (Settings > Privacy > Camera)
- Try a different browser
- Restart browser after granting permissions

### Issue 2: YOLO Model Not Loading

**Solution:**
```bash
# Verify model file exists
ls yolov8n.pt

# If missing, download manually
# Windows PowerShell:
Invoke-WebRequest -Uri "https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt" -OutFile "yolov8n.pt"
```

### Issue 3: Tesseract OCR Not Found

**Solution:**
- Verify Tesseract is installed
- Add to system PATH
- Restart terminal/IDE

**Windows:**
```bash
# Check if tesseract is in PATH
where tesseract

# If not, add manually:
# System Properties > Environment Variables > Path > Edit
# Add: C:\Program Files\Tesseract-OCR
```

### Issue 4: Port Already in Use

**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process
taskkill /PID <PID> /F

# Or change port in backend.py
# uvicorn.run(app, host="0.0.0.0", port=8001)
```

### Issue 5: Frontend Can't Connect to Backend

**Solution:**
- Ensure backend is running on port 8000
- Check CORS settings in backend.py
- Verify API_BASE_URL in dashboard/src/hooks/useApi.js

## Testing the System

### Test 1: Live Camera Detection

1. Start both backend and frontend
2. Open http://localhost:3000
3. Click "Start Camera"
4. Show a vehicle (or drive by with a car)
5. Verify detection boxes appear
6. Check metrics update in real-time

### Test 2: Video Processing

1. Prepare a test video with vehicles
2. Click "Upload Video" button
3. Select your test video
4. Wait for processing (may take 1-2 minutes)
5. Verify processed video with detection overlay
6. Check analytics update

### Test 3: Analytics Verification

1. Check all metric cards show real data
2. Verify analytics charts update
3. Check insights panel shows relevant information
4. Verify database is being populated

## Database Verification

The system creates a SQLite database at `sentryspeed.db`:

```bash
# Check database exists
ls sentryspeed.db

# View database contents (using sqlite3)
sqlite3 sentryspeed.db
sqlite> SELECT * FROM all_vehicles_log LIMIT 10;
sqlite> SELECT * FROM overspeeding_violations LIMIT 10;
sqlite> .quit
```

## Production Deployment

### Docker Deployment

```bash
# Build Docker image
docker build -t sentryspeed .

# Run container
docker run -p 8000:8000 -p 3000:3000 sentryspeed
```

### Cloud Deployment

See `Dockerfile` and `docker-compose.yml` for cloud deployment options.

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

3. **Integrate with Other Systems**
   - Connect to traffic management systems
   - Integrate with alerting services
   - Add additional data sources

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API documentation in `API_DOC.md`
3. Check the project overview in `PROJECT_OVERVIEW.md`

## Success Indicators

✅ Backend starts without errors  
✅ YOLO model loads successfully  
✅ Frontend compiles without errors  
✅ Camera feed displays with detection  
✅ Metrics update in real-time  
✅ Database records are created  
✅ Analytics charts show data  
✅ File uploads process successfully  
✅ Insights panel shows relevant information  

If all these indicators are present, your system is running correctly!