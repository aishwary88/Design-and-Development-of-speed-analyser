# 🚗 Traffic Speed Analyser

**Advanced AI-Powered Traffic Analytics Platform**

A cutting-edge traffic monitoring system that combines real-time vehicle detection, speed analysis, and license plate recognition using state-of-the-art computer vision and neural network technologies.

![Traffic Speed Analyser](https://img.shields.io/badge/AI-Powered-blue?style=for-the-badge)
![Real-time](https://img.shields.io/badge/Real--time-Analytics-green?style=for-the-badge)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Neural%20Network-orange?style=for-the-badge)

## ✨ Features

### 🎥 **Real-Time Camera Processing**
- Live video feed analysis with 30 FPS processing
- Instant vehicle detection and tracking
- Real-time speed calculations with pixel-to-meter calibration

### ⚡ **Advanced Speed Detection**
- Accurate velocity measurements using computer vision
- Configurable speed thresholds and alerts
- Multi-vehicle tracking with unique ID assignment

### 📍 **License Plate Recognition**
- Advanced OCR technology with Tesseract integration
- High-accuracy text extraction from license plates
- Support for various plate formats and orientations

### 📊 **Modern Analytics Dashboard**
- Futuristic dark theme with glassmorphism design
- Real-time statistics and live data visualization
- Interactive charts and congestion analysis

### 🗂️ **Batch Processing**
- Multiple file upload and processing
- Dataset analysis for large-scale projects
- ZIP archive support for bulk operations

### 🤖 **AI-Powered Insights**
- YOLOv8 neural network for object detection
- Machine learning algorithms for pattern recognition
- Intelligent traffic flow analysis

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Webcam or video files
- Tesseract OCR

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-repo/traffic-speed-analyser.git
   cd traffic-speed-analyser
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Install Tesseract OCR:**
   - Windows: Download from [UB-Mannheim](https://github.com/UB-Mannheim/tesseract/wiki)
   - macOS: `brew install tesseract`
   - Linux: `sudo apt-get install tesseract-ocr`

4. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your Tesseract path and settings
   ```

### Usage

#### 🖥️ **Web Dashboard (Recommended)**
```bash
python app.py
```
Then open http://localhost:5000 in your browser for the modern web interface.

#### 🖱️ **Command Line Interface**
```bash
python main.py [optional_video_path]
```

#### 📱 **Landing Page**
Visit http://localhost:5000/landing for the professional landing page.

## ⚙️ Configuration

### Environment Variables (.env)
```env
TESSERACT_PATH=C:\Program Files\Tesseract-OCR\tesseract.exe
YOLO_MODEL_PATH=yolov8n.pt
PIXELS_PER_METER=50
FPS=30
```

### Speed Calibration
For accurate speed measurements, calibrate the PIXELS_PER_METER value:

```python
from main import calibrate_pixels_per_meter
ppm = calibrate_pixels_per_meter('reference_image.jpg', known_distance_meters)
```

## 🏗️ Architecture

### Technology Stack
- **Backend:** Flask (Python)
- **AI/ML:** YOLOv8, OpenCV, Ultralytics
- **OCR:** Tesseract
- **Frontend:** Modern HTML5, CSS3, JavaScript
- **Design:** Glassmorphism, Dark Theme, Responsive

### Project Structure
```
traffic-speed-analyser/
├── app.py                 # Flask web application
├── main.py               # CLI interface
├── requirements.txt      # Python dependencies
├── templates/           # HTML templates
│   ├── index.html      # Main dashboard
│   └── landing.html    # Landing page
├── static/             # Static assets
│   ├── style.css      # Dashboard styles
│   ├── landing.css    # Landing page styles
│   └── script.js      # Interactive features
├── uploads/           # File upload directory
├── results/          # Processed output files
└── .env             # Environment configuration
```

## 📊 API Endpoints

### Camera Operations
- `POST /api/camera/start` - Initialize camera feed
- `POST /api/camera/stop` - Terminate camera feed
- `GET /api/camera/stream` - Live video stream

### File Processing
- `POST /api/upload` - Single file analysis
- `POST /api/upload-dataset` - Batch file processing
- `GET /api/download/<filename>` - Download results

## 🎨 UI Features

### Modern Design Elements
- **Glassmorphism Effects:** Translucent cards with backdrop blur
- **Neon Accents:** Cyan and blue glow effects
- **Smooth Animations:** Hover effects and transitions
- **Responsive Layout:** Mobile-friendly design
- **Dark Theme:** Professional analytics appearance

### Interactive Components
- Real-time metric counters with animations
- Live detection feed with status indicators
- Drag-and-drop file upload areas
- Progress indicators and notifications
- Sound effects for user interactions

## 🔧 Advanced Configuration

### Custom YOLO Models
Replace `yolov8n.pt` with custom trained models for specific use cases.

### Camera Settings
Adjust resolution, FPS, and detection parameters in the configuration.

### Speed Thresholds
Configure speed limits and alert thresholds for different road types.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **YOLOv8** by Ultralytics for object detection
- **OpenCV** for computer vision processing
- **Tesseract** for OCR capabilities
- **Flask** for web framework

## 📞 Support

For support and questions:
- 📧 Email: support@trafficanalyser.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 📖 Documentation: [Wiki](https://github.com/your-repo/wiki)

---

**Built with ❤️ for intelligent traffic monitoring and analysis**