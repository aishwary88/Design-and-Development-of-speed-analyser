# Car Speed and License Plate Detection

This project uses computer vision to detect cars in real-time, estimate their speed, and read license plate numbers.

## Requirements

- Python 3.x
- Webcam or video file
- Tesseract OCR installed (for license plate reading)

## Installation

1. Install Python dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Install Tesseract OCR from https://github.com/UB-Mannheim/tesseract/wiki

3. Download YOLOv8 model (automatically done by ultralytics)

## Usage

Run the script:
```
python main.py
```

Use webcam (default) or change to video file path in code.

Press 'q' to quit.

## Notes

- Speed calculation is approximate and requires calibration for accurate results.
- License plate detection is basic; may need improvement for better accuracy.