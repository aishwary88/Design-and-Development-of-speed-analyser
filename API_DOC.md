# API Documentation

## Endpoints

### /metrics
- Method: GET
- Description: Returns traffic metrics for dashboard cards.
- Response:
  - total_vehicles: int
  - avg_speed: float
  - congested_segments: int
  - data_volume: string
  - speed_compliance: string

### /analytics
- Method: GET
- Description: Returns analytics data for charts.
- Response:
  - speed_trend: array
  - avg_speed_by_segment: array
  - traffic_distribution: array
  - density_over_time: array

## Usage
- Base URL is set via REACT_APP_API_URL in dashboard/.env
- Example: `curl http://localhost:8000/metrics`
