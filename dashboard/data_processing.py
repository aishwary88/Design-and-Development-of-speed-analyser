// traffic_data.csv loader and cleaning logic
import pandas as pd
import numpy as np

def load_and_clean_traffic_data(csv_path):
    df = pd.read_csv(csv_path)
    # Remove invalid speeds
    df = df[(df['speed'] >= 0) & (df['speed'] <= 150)]
    # Handle missing timestamps
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.dropna(subset=['timestamp'])
    # Normalize speed values
    df['speed_norm'] = (df['speed'] - df['speed'].min()) / (df['speed'].max() - df['speed'].min())
    return df

# Example usage
if __name__ == '__main__':
    df = load_and_clean_traffic_data('traffic_data.csv')
    print(df.head())
