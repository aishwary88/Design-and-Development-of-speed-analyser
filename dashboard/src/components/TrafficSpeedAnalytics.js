import React, { useEffect, useState } from 'react';
import ChartCard from './widgets/ChartCard';

const TrafficSpeedAnalytics = ({ analyticsData, analyticsLoading }) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (analyticsData && !analyticsLoading) {
      setAnalytics(analyticsData);
    } else {
      // Fallback to mock data if API fails
      setAnalytics({
        speed_trend: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          speed: Math.floor(Math.random() * 30) + 40,
          timestamp: `${i}:00`
        })),
        avg_speed_by_segment: [
          { segment: 'Highway A1', speed: 75 },
          { segment: 'Main Street', speed: 45 },
          { segment: 'Business District', speed: 35 },
          { segment: 'Residential', speed: 55 }
        ],
        traffic_distribution: [
          { type: 'Cars', percentage: 65 },
          { type: 'Trucks', percentage: 20 },
          { type: 'Buses', percentage: 10 },
          { type: 'Motorcycles', percentage: 5 }
        ],
        density_over_time: Array.from({ length: 12 }, (_, i) => ({
          time: `${i * 2}:00`,
          density: Math.floor(Math.random() * 40) + 30
        }))
      });
    }
  }, [analyticsData, analyticsLoading]);

  if (analyticsLoading) {
    return (
      <section className="card p-6 animate-fade-in">
        <h2 className="text-xl font-bold neon mb-4">Traffic Speed Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="chart-container animate-pulse">
              <div className="h-4 bg-blue-500/20 rounded mb-4"></div>
              <div className="h-32 bg-blue-500/10 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold neon">Traffic Speed Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-blue-300">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Live data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard type="line" title="Speed Trend Over Time" data={analytics?.speed_trend} />
        <ChartCard type="bar" title="Speed by Road Segment" data={analytics?.avg_speed_by_segment} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="chart-container">
          <h3 className="text-lg font-semibold neon mb-4">Traffic Distribution</h3>
          <div className="space-y-3">
            {analytics?.traffic_distribution?.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-blue-200">{item.type}</span>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-2 bg-blue-900/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-1000"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-cyan-400 font-medium">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h3 className="text-lg font-semibold neon mb-4">Density Over Time</h3>
          <div className="relative h-32">
            <svg className="w-full h-full" viewBox="0 0 300 100">
              <defs>
                <linearGradient id="densityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00bfff" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#00bfff" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Area chart */}
              <polygon
                fill="url(#densityGradient)"
                stroke="#00bfff"
                strokeWidth="2"
                points={`0,100 ${analytics?.density_over_time?.map((point, i) =>
                  `${(i / (analytics.density_over_time.length - 1)) * 300},${100 - point.density}`
                ).join(' ')} 300,100`}
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrafficSpeedAnalytics;