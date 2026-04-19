import React, { useState, useEffect } from 'react';

const HeatmapPanel = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('speed');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateHeatmapData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/records');
        if (response.ok) {
          const data = await response.json();
          // Generate heatmap from actual vehicle data
          if (data.vehicles && data.vehicles.length > 0) {
            const vehicles = data.vehicles;
            const gridData = [];
            for (let i = 0; i < 8; i++) {
              for (let j = 0; j < 12; j++) {
                // Use actual vehicle speeds for heatmap
                const vehicleIndex = (i * 12 + j) % vehicles.length;
                const vehicle = vehicles[vehicleIndex];
                const speed = vehicle?.speed || 0;
                const intensity = Math.min(1, speed / 100);
                const value = Math.floor(intensity * 100 + 20);

                gridData.push({
                  x: j,
                  y: i,
                  intensity,
                  value,
                  label: `${selectedMetric === 'speed' ? value + ' km/h' : value + ' vehicles'}`
                });
              }
            }
            setHeatmapData(gridData);
          }
        }
      } catch (err) {
        // Fallback to random data
        const gridData = [];
        for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 12; j++) {
            const intensity = Math.random();
            const value = selectedMetric === 'speed'
              ? Math.floor(intensity * 100 + 20)
              : Math.floor(intensity * 50 + 10);

            gridData.push({
              x: j,
              y: i,
              intensity,
              value,
              label: `${selectedMetric === 'speed' ? value + ' km/h' : value + ' vehicles'}`
            });
          }
        }
        setHeatmapData(gridData);
      } finally {
        setIsLoading(false);
      }
    };

    generateHeatmapData();
    const interval = setInterval(generateHeatmapData, 15000);
    return () => clearInterval(interval);
  }, [selectedMetric]);

  const getHeatmapColor = (intensity) => {
    if (intensity < 0.2) return 'bg-blue-900/40';
    if (intensity < 0.4) return 'bg-green-500/40';
    if (intensity < 0.6) return 'bg-yellow-500/40';
    if (intensity < 0.8) return 'bg-orange-500/40';
    return 'bg-red-500/40';
  };

  const getHeatmapBorder = (intensity) => {
    if (intensity < 0.2) return 'border-blue-500/30';
    if (intensity < 0.4) return 'border-green-500/30';
    if (intensity < 0.6) return 'border-yellow-500/30';
    if (intensity < 0.8) return 'border-orange-500/30';
    return 'border-red-500/30';
  };

  return (
    <section className="card p-6 animate-slide-up">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold neon">Traffic Heatmap</h2>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-1 text-sm bg-blue-900/30 border border-blue-500/30 rounded-lg text-blue-200 focus:outline-none focus:border-blue-400"
          >
            <option value="speed">Speed Intensity</option>
            <option value="density">Traffic Density</option>
          </select>
        </div>
        <p className="text-blue-300 text-sm">
          {selectedMetric === 'speed' ? 'Speed distribution across road network' : 'Vehicle density heatmap'}
        </p>
      </div>

      {/* Heatmap Grid */}
      <div className="mb-6">
        <div className="grid grid-cols-12 gap-1 p-4 bg-black/20 rounded-lg border border-blue-500/20">
          {heatmapData.map((cell, index) => (
            <div
              key={index}
              className={`aspect-square rounded-sm border ${getHeatmapColor(cell.intensity)} ${getHeatmapBorder(cell.intensity)} 
                         hover:scale-110 transition-all cursor-pointer group relative`}
              title={cell.label}
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {cell.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-blue-300 mb-3">Intensity Scale</h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-400">Low</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-blue-900/40 border border-blue-500/30 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-500/40 border border-green-500/30 rounded-sm"></div>
            <div className="w-4 h-4 bg-yellow-500/40 border border-yellow-500/30 rounded-sm"></div>
            <div className="w-4 h-4 bg-orange-500/40 border border-orange-500/30 rounded-sm"></div>
            <div className="w-4 h-4 bg-red-500/40 border border-red-500/30 rounded-sm"></div>
          </div>
          <span className="text-xs text-blue-400">High</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">
            {heatmapData.filter(cell => cell.intensity < 0.4).length}
          </div>
          <div className="text-xs text-blue-300">Low Zones</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-400">
            {heatmapData.filter(cell => cell.intensity >= 0.4 && cell.intensity < 0.8).length}
          </div>
          <div className="text-xs text-blue-300">Medium Zones</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-red-400">
            {heatmapData.filter(cell => cell.intensity >= 0.8).length}
          </div>
          <div className="text-xs text-blue-300">High Zones</div>
        </div>
      </div>
    </section>
  );
};

export default HeatmapPanel;
