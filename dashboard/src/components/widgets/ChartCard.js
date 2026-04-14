import React, { useState, useEffect } from 'react';

const ChartCard = ({ type = 'line', title = 'Chart', data = null }) => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const mockData = generateMockData(type);
      setChartData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [type]);

  const generateMockData = (chartType) => {
    switch (chartType) {
      case 'line':
        return Array.from({ length: 12 }, (_, i) => ({
          x: i,
          y: Math.floor(Math.random() * 50) + 20,
          label: `${i + 1}:00`
        }));
      case 'bar':
        return [
          { label: '6-9 AM', value: 85, color: 'bg-red-400' },
          { label: '9-12 PM', value: 45, color: 'bg-green-400' },
          { label: '12-3 PM', value: 60, color: 'bg-yellow-400' },
          { label: '3-6 PM', value: 90, color: 'bg-red-400' },
          { label: '6-9 PM', value: 75, color: 'bg-orange-400' },
          { label: '9-12 AM', value: 25, color: 'bg-green-400' }
        ];
      default:
        return [];
    }
  };

  const renderLineChart = () => (
    <div className="relative h-32">
      <svg className="w-full h-full" viewBox="0 0 300 100">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00bfff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0055ff" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {[20, 40, 60, 80].map(y => (
          <line key={y} x1="0" y1={y} x2="300" y2={y} stroke="rgba(0,191,255,0.1)" strokeWidth="1" />
        ))}

        {/* Data line */}
        <polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          points={chartData.map((point, i) => `${(i / (chartData.length - 1)) * 300},${100 - point.y}`).join(' ')}
        />

        {/* Data points */}
        {chartData.map((point, i) => (
          <circle
            key={i}
            cx={(i / (chartData.length - 1)) * 300}
            cy={100 - point.y}
            r="3"
            fill="#00bfff"
            className="animate-pulse"
          />
        ))}
      </svg>
    </div>
  );

  const renderBarChart = () => (
    <div className="space-y-3">
      {chartData.map((bar, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="w-16 text-xs text-blue-400">{bar.label}</div>
          <div className="flex-1 bg-blue-900/50 rounded-full h-4 overflow-hidden">
            <div
              className={`h-full ${bar.color} transition-all duration-1000`}
              style={{ width: `${bar.value}%` }}
            ></div>
          </div>
          <div className="w-8 text-xs text-blue-300">{bar.value}%</div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold neon">{title}</h3>
        <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      ) : (
        <>
          {type === 'line' && renderLineChart()}
          {type === 'bar' && renderBarChart()}
        </>
      )}
    </div>
  );
};

export default ChartCard;