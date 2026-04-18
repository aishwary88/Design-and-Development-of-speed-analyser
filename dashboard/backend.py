from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import pandas as pd
import numpy as np
import os
from datetime import datetime

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-csv")
def upload_csv(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    df = df[(df['speed'] >= 0) & (df['speed'] <= 150)]
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.dropna(subset=['timestamp'])
    df['speed_norm'] = (df['speed'] - df['speed'].min()) / (df['speed'].max() - df['speed'].min())
    return {"rows": len(df), "columns": list(df.columns), "preview": df.head(10).to_dict('records')}

@app.get("/metrics")
def get_metrics():
    # Placeholder metrics
    return {
        "total_vehicles": 12456,
        "avg_speed": 54.2,
        "congested_segments": 7,
        "data_volume": "2.3 GB",
        "speed_compliance": "92%"
    }

@app.get("/analytics")
def get_analytics():
    # Placeholder analytics
    return {
        "speed_trend": [12, 19, 3, 5, 2],
        "avg_speed_by_segment": [54, 48, 60, 52, 47],
        "traffic_distribution": [40, 30, 20, 10],
        "density_over_time": [0.68, 0.72, 0.65, 0.70, 0.69]
    }

@app.get("/api/insights")
def get_insights():
    # Generate insights based on current metrics
    return {
        "insights": [
            {
                "type": "success",
                "icon": "✅",
                "title": "Excellent Compliance",
                "message": "Speed compliance rates are performing well",
                "priority": "low"
            },
            {
                "type": "info",
                "icon": "🌅",
                "title": "Morning Rush Hour",
                "message": "Peak traffic period - monitor congestion levels",
                "priority": "low"
            }
        ],
        "risk_level": "Low"
    }

@app.get("/api/uploads")
def get_uploads():
    # Return recent uploads
    return {
        "uploads": [
            {"name": "traffic_video_01.mp4", "timestamp": "2 minutes ago", "status": "Processed"},
            {"name": "intersection_photo.jpg", "timestamp": "5 minutes ago", "status": "Processing"}
        ]
    }

@app.get("/api/camera/status")
def get_camera_status():
    # Return camera status
    return {
        "is_processing": True,
        "vehicle_count": 15,
        "fps": 30,
        "status": "active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
