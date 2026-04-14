from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"] ,
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
