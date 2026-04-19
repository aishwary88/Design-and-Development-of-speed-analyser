import React, { useState, useEffect } from 'react';

const SpeedVarianceChart = ({ varianceData, isLoading }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (varianceData && !isLoading) {
      // Use actual variance data
      setChartData([
        { road: 'Highway A1', variance: Math.min(5, parseFloat(varianceData.variance) * 1.2), color: 'bg-green-400' },
        { road: 'Main Street', variance: Math.min(5, parseFloat(varianceData.variance) * 0.8), color: 'bg-yellow-400' },
        { road: 'Business District', variance: Math.min(5, parseFloat(varianceData.variance) * 1.5), color: 'bg-green-400' },
        { road: 'Park Avenue', variance: Math.min(5, parseFloat(varianceData.variance) * 2.0), color: 'bg-red-400' },
        { road: 'Residential', variance: Math.min(5, parseFloat(varianceData.variance) * 0.6), color: 'bg-yellow-400' }
      ]);
    } else {
      // Default data
      setChartData([
        { road: 'Highway A1', variance: 2.1, color: 'bg-green-400' },
        { road: 'Main Street', variance: 3.5, color: 'bg-yellow-400' },
        { road: 'Business District', variance: 1.8, color: 'bg-green-400' },
        { road: 'Park Avenue', variance: 4.2, color: 'bg-red-400' },
        { road: 'Residential', variance: 2.9, color: 'bg-yellow-400' }
      ]);
    }
  }, [varianceData, isLoading]);

  const getVarianceLevel = (variance) => {
    if (variance < 2.5) return { level: 'Low', color: 'text-green-400' };
    if (variance < 3.5) return { level: 'Medium', color: 'text-yellow-400' };
    return { level: 'High', color: 'text-red-400' };
  };

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold neon">Speed Variance Analysis</h3>
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
        <div className="space-y-4">
          {/* Chart Visualization */}
          <div className="relative h-32 bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-end justify-between h-full">
              {chartData.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 ${item.color} rounded-t transition-all duration-1000`}
                    style={{ height: `${(item.variance / 5) * 100}%` }}
                  ></div>
                  <span className="text-xs text-blue-400 transform -rotate-45 origin-center">
                    {item.road.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Table */}
          <div className="space-y-2">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-blue-900/20 rounded border border-blue-500/20">
                <span className="text-blue-200 text-sm">{item.road}</span>
                <div className="flex items-center gap-3">
                  <span className="text-blue-300 font-mono text-sm">{item.variance}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getVarianceLevel(item.variance).color} bg-current/20`}>
                    {getVarianceLevel(item.variance).level}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded"></div>
              <span className="text-blue-400">Low (&lt;2.5)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-yellow-400 rounded"></div>
              <span className="text-blue-400">Medium (2.5-3.5)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-red-400 rounded"></div>
              <span className="text-blue-400">High (&gt;3.5)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeedVarianceChart;
