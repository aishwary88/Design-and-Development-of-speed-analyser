# Troubleshooting Guide - Traffic Speed Analyser

## Common Issues and Solutions

### Issue 1: Backend Won't Start

**Error Messages:**
- `ModuleNotFoundError: No module named 'fastapi'`
- `ModuleNotFoundError: No module named 'uvicorn'`
- `ModuleNotFoundError: No module named 'ultralytics'`

**Solutions:**
```bash
# Install all Python dependencies
cd dashboard
pip install -r requirements.txt

# Verify installation
python -c "import fastapi; import uvicorn; import ultralytics; print('All packages installed!')"
```

---

### Issue 2: YOLO Model Not Loading

**Error Messages:**
- `FileNotFoundError: [Errno 2] No such file or directory: 'yolov8n.pt'`
- `Failed to download model`

**Solutions:**
```bash
# Check if model file exists
ls yolov8n.pt

# If missing, download manually
# Windows PowerShell:
Invoke-WebRequest -Uri "https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt" -OutFile "yolov8n.pt"

# Or using curl (Linux/Mac):
curl -L https://github.com/ultralytics/assets/releases/download/v0.0.0/yolov8n.pt -o yolov8n.pt
```

---

### Issue 3: Tesseract OCR Not Found

**Error Messages:**
- `pytesseract.pytesseract.TesseractNotFoundError: tesseract is not installed`
- `Tesseract not found in PATH`

**Solutions:**

**Windows:**
1. Download Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
2. Install to `C:\Program Files\Tesseract-OCR`
3. Add to PATH:
   - System Properties > Environment Variables
   - Edit PATH variable
   - Add: `C:\Program Files\Tesseract-OCR`
4. Restart terminal/IDE

**Linux:**
```bash
sudo apt update
sudo apt install tesseract-ocr
```

**Mac:**
```bash
brew install tesseract
```

---

### Issue 4: Camera Access Denied

**Error Messages:**
- `NotAllowedError: Permission denied`
- `Camera access denied`

**Solutions:**
1. **Browser Permissions:**
   - Chrome: Settings > Privacy > Security > Camera
   - Firefox: Preferences > Privacy & Security > Permissions > Camera
   - Edge: Settings > Cookies and site permissions > Camera

2. **Check Camera:**
   - Try camera in other applications
   - Restart browser
   - Try different camera if available

3. **HTTPS Requirement:**
   - Camera API requires HTTPS or localhost
   - Use `http://localhost:3000` (not IP address)

---

### Issue 5: Frontend Can't Connect to Backend

**Error Messages:**
- `Failed to fetch`
- `NetworkError when attempting to fetch resource`
- `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solutions:**
1. **Check Backend is Running:**
   ```bash
   # Backend should be running on port 8000
   curl http://localhost:8000/metrics
   ```

2. **Check CORS Settings:**
   - Backend already has CORS middleware enabled
   - Verify `allow_origins=["*"]` in backend.py

3. **Check API_BASE_URL:**
   - Verify in `dashboard/src/hooks/useApi.js`
   - Should be: `http://localhost:8000`

4. **Proxy Configuration:**
   - Frontend should have proxy in `package.json`
   - `"proxy": "http://localhost:8000"`

---

### Issue 6: Port Already in Use

**Error Messages:**
- `EADDRINUSE: address already in use :::8000`
- `EADDRINUSE: address already in use :::3000`

**Solutions:**

**Find Process Using Port:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :8000
kill -9 <PID>
```

**Change Port:**

**Backend (backend.py):**
```python
# Change from:
uvicorn.run(app, host="0.0.0.0", port=8000)

# To:
uvicorn.run(app, host="0.0.0.0", port=8001)
```

**Frontend (package.json):**
```json
{
  "proxy": "http://localhost:8001"
}
```

---

### Issue 7: Database Errors

**Error Messages:**
- `sqlite3.OperationalError: unable to open database file`
- `Database is locked`

**Solutions:**
```bash
# Check database file permissions
ls -la sentryspeed.db

# If missing, restart backend to create
# Backend will auto-create database on startup

# Or manually create:
python -c "import sqlite3; conn = sqlite3.connect('sentryspeed.db'); conn.close()"
```

---

### Issue 8: Video Upload Fails

**Error Messages:**
- `Cannot open video`
- `File too large`
- `Unsupported file format`

**Solutions:**

1. **Check File Size:**
   - Backend limit: 500MB
   - Check `app.py`: `MAX_CONTENT_LENGTH = 500 * 1024 * 1024`

2. **Check File Format:**
   - Supported: MP4, AVI, MOV, MKV, JPG, PNG
   - Check `ALLOWED_EXTENSIONS` in app.py

3. **Check File Path:**
   - Uploads saved to: `uploads/` directory
   - Results saved to: `results/` directory

---

### Issue 9: Slow Performance

**Symptoms:**
- Detection is slow
- UI lags
- High CPU usage

**Solutions:**

1. **Use GPU:**
   ```python
   # Check if CUDA is available
   python -c "import torch; print(torch.cuda.is_available())"
   
   # If true, YOLO will use GPU automatically
   ```

2. **Reduce Resolution:**
   ```python
   # In backend.py, process_frame function
   frame = cv2.resize(frame, (640, 480))
   ```

3. **Skip Frames:**
   ```python
   # Process every Nth frame
   if frame_count % 5 == 0:
       # Process frame
   ```

4. **Close Other Applications:**
   - Free up system resources
   - Close browser tabs
   - Stop other heavy processes

---

### Issue 10: License Plate Not Detected

**Symptoms:**
- Vehicles detected but no plates
- OCR returns empty/incorrect text

**Solutions:**

1. **Check Image Quality:**
   - Ensure vehicles are close to camera
   - Good lighting conditions
   - Clear view of license plate

2. **Adjust OCR Settings:**
   ```python
   # In detect_license_plate function
   config='--psm 8 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
   ```

3. **Improve Detection:**
   - Use higher resolution video
   - Better camera positioning
   - Adjust YOLO confidence threshold

---

### Issue 11: Database Records Not Updating

**Symptoms:**
- Dashboard shows 0 vehicles
- Database is empty
- No new records created

**Solutions:**

1. **Check Backend Logs:**
   ```bash
   # Look for database insert messages
   python backend.py
   ```

2. **Verify Detection is Working:**
   - Check camera feed
   - Look for bounding boxes
   - Verify vehicle_tracker is populated

3. **Check Database Path:**
   ```python
   # In backend.py
   DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'sentryspeed.db')
   ```

---

### Issue 12: Frontend Compilation Errors

**Error Messages:**
- `Module not found: Error: Can't resolve 'react'`
- `Failed to compile`

**Solutions:**
```bash
# Reinstall Node dependencies
cd dashboard
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## Diagnostic Commands

### Check Backend Status
```bash
# Test API endpoints
curl http://localhost:8000/metrics
curl http://localhost:8000/api/camera/status
curl http://localhost:8000/api/records
```

### Check Frontend Status
```bash
# Check if frontend is running
curl http://localhost:3000
```

### Check Database
```bash
# View database contents
sqlite3 sentryspeed.db "SELECT * FROM all_vehicles_log LIMIT 10;"
sqlite3 sentryspeed.db "SELECT * FROM overspeeding_violations LIMIT 10;"
```

### Check CSV Logs
```bash
# View CSV file
cat dashboard/results/traffic_data.csv
```

---

## Getting Help

### Check Documentation
- `README.md` - Main documentation
- `SETUP_GUIDE.md` - Setup instructions
- `API_DOC.md` - API reference
- `PROJECT_OVERVIEW.md` - Project architecture

### Verify Installation
```bash
# Python packages
pip list | grep -E "fastapi|uvicorn|opencv|ultralytics|pytesseract"

# Node packages
npm list | grep -E "react|tailwind"

# System tools
python --version
node --version
tesseract --version
```

### Enable Debug Mode
```python
# In backend.py
import logging
logging.basicConfig(level=logging.DEBUG)
```

```bash
# In frontend
npm run start -- --verbose
```

---

## Success Indicators

✅ Backend starts without errors  
✅ YOLO model loads successfully  
✅ Camera feed displays with detection  
✅ Metrics update in real-time  
✅ Database records are created  
✅ Analytics charts show data  
✅ File uploads process successfully  
✅ Insights panel shows relevant information  

If all these indicators are present, your system is running correctly!