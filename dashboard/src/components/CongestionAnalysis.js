import React, { useState } from 'react';

const CongestionAnalysis = () => {
  const [congestionData] = useState([
    { road: 'Highway A1', level: 'High', percentage: 85, color: 'red' },
    { road: 'Main Street', level: 'Medium', percentage: 60, color: 'yellow' },
    { road: 'Park Avenue', level: 'Low', percentage: 25, color: 'green' },
    { road: 'Business District', level: 'High', percentage: 78, color: 'red' },
    { road: 'Residential Zone', level: 'Low', percentage: 15, color: 'green' }
  ]);

  const getLevelColor = (level) => {
    switch (level) {
      case 'High': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  return (
    <section className="card p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold neon">Congestion Analysis</h2>
        <div className="flex items-center gap-2 text-sm text-blue-300">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Real-time monitoring</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Congestion Statistics */}
        <div className="space-y-4">
          {/* Top Congested Roads */}
          <div className="chart-container">
            <h4 className="text-lg font-semibold neon mb-4">Top Congested Roads</h4>
            <div className="space-y-3">
              {congestionData.map((road, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-900/20 to-transparent border border-blue-500/20 hover:border-blue-500/40 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium text-blue-200">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-blue-100">{road.road}</div>
                      <div className="text-xs text-blue-400">Traffic congestion level</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Progress Bar */}
                    <div className="w-20 h-2 bg-blue-900/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-1000 ${road.level === 'High' ? 'bg-red-400' :
                          road.level === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                          }`}
                        style={{ width: `${road.percentage}%` }}
                      ></div>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getLevelColor(road.level)}`}>
                      {road.level}
                    </span>

                    {/* Percentage */}
                    <span className="text-sm font-bold text-blue-200 min-w-[3rem] text-right">
                      {road.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Congestion Legend */}
        <div className="chart-container">
          <h4 className="text-sm font-medium text-blue-300 mb-3">Congestion Levels</h4>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span className="text-xs text-blue-200">Low (0-30%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span className="text-xs text-blue-200">Medium (31-70%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span className="text-xs text-blue-200">High (71-100%)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CongestionAnalysis;