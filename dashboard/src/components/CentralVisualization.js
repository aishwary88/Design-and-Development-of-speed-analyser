import React, { useState, useEffect } from 'react';

const CentralVisualization = ({ vehicles = [] }) => {
  const [activeNodes, setActiveNodes] = useState([]);
  const [trafficFlow, setTrafficFlow] = useState(0);
  const [liveDetection, setLiveDetection] = useState({
    vehicleCount: 0,
    detectedPlates: [],
    isProcessing: false
  });

  useEffect(() => {
    // Simulate active traffic nodes
    const interval = setInterval(() => {
      setActiveNodes(prev => {
        const newNodes = [...prev];
        const randomNode = Math.floor(Math.random() * 8);
        if (newNodes.includes(randomNode)) {
          return newNodes.filter(n => n !== randomNode);
        } else {
          return [...newNodes, randomNode].slice(-4); // Keep max 4 active
        }
      });
      setTrafficFlow(prev => (prev + 1) % 360);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Simulate live detection updates
  useEffect(() => {
    const detectionInterval = setInterval(() => {
      setLiveDetection({
        vehicleCount: Math.floor(Math.random() * 12) + 3,
        detectedPlates: [
          'ABC-123',
          'XYZ-789',
          'DEF-456',
          'GHI-012'
        ].slice(0, Math.floor(Math.random() * 4) + 1),
        isProcessing: Math.random() > 0.7
      });
    }, 2000);

    return () => clearInterval(detectionInterval);
  }, []);

  const nodePositions = [
    { x: 60, y: 60, label: 'Junction A' },
    { x: 160, y: 60, label: 'Junction B' },
    { x: 210, y: 110, label: 'Junction C' },
    { x: 160, y: 160, label: 'Junction D' },
    { x: 60, y: 160, label: 'Junction E' },
    { x: 10, y: 110, label: 'Junction F' },
    { x: 110, y: 30, label: 'Junction G' },
    { x: 110, y: 190, label: 'Junction H' }
  ];

  return (
    <section className="card p-8 animate-slide-up">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold neon mb-2">Live Detection Panel</h2>
        <p className="text-blue-300 text-sm">Real-time vehicle detection and traffic monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Live Detection Feed */}
        <div className="space-y-6">
          {/* Video Feed Placeholder */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-lg border border-blue-500/30 aspect-video flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent"></div>

            {/* Simulated Detection Overlay */}
            <div className="relative w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-blue-300 text-sm">Live Camera Feed</p>
                <p className="text-blue-400 text-xs">YOLOv8 Processing Active</p>
              </div>

              {/* Detection Boxes Simulation */}
              <div className="absolute top-4 left-4 w-20 h-12 border-2 border-green-400 rounded">
                <div className="absolute -top-6 left-0 text-xs text-green-400 bg-black/50 px-1 rounded">
                  Car: 95%
                </div>
              </div>
              <div className="absolute top-16 right-8 w-16 h-10 border-2 border-cyan-400 rounded">
                <div className="absolute -top-6 left-0 text-xs text-cyan-400 bg-black/50 px-1 rounded">
                  Bus: 87%
                </div>
              </div>
            </div>

            {/* Live Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white text-xs font-medium">LIVE</span>
            </div>
          </div>

          {/* Detection Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="chart-container">
              <h4 className="text-sm font-medium text-blue-300 mb-2">Vehicle Count</h4>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold neon">{liveDetection.vehicleCount}</span>
                <span className="text-blue-400 text-sm">detected</span>
              </div>
            </div>
            <div className="chart-container">
              <h4 className="text-sm font-medium text-blue-300 mb-2">Processing</h4>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${liveDetection.isProcessing ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                <span className="text-sm text-blue-200">
                  {liveDetection.isProcessing ? 'Active' : 'Idle'}
                </span>
              </div>
            </div>
          </div>

          {/* OCR Results Panel */}
          <div className="chart-container">
            <h4 className="text-sm font-medium text-blue-300 mb-3">Detected Number Plates</h4>
            <div className="space-y-2">
              {liveDetection.detectedPlates.map((plate, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-blue-900/20 rounded border border-blue-500/20">
                  <span className="font-mono text-cyan-400">{plate}</span>
                  <span className="text-xs text-green-400">✓ Verified</span>
                </div>
              ))}
              {liveDetection.detectedPlates.length === 0 && (
                <p className="text-blue-400 text-sm text-center py-4">No plates detected</p>
              )}
            </div>
          </div>
        </div>

        {/* Traffic Network Visualization */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-2xl">

                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(0,191,255,0.1)" strokeWidth="0.5" />
                  </pattern>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <rect width="240" height="240" fill="url(#grid)" opacity="0.3" />

                {/* Outer Ring */}
                <circle
                  cx="120" cy="120" r="110"
                  fill="none"
                  stroke="rgba(0,191,255,0.3)"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  transform={`rotate(${trafficFlow} 120 120)`}
                />

                {/* Middle Ring */}
                <circle
                  cx="120" cy="120" r="80"
                  fill="none"
                  stroke="rgba(0,85,255,0.4)"
                  strokeWidth="2"
                />

                {/* Inner Ring */}
                <circle
                  cx="120" cy="120" r="50"
                  fill="none"
                  stroke="rgba(0,191,255,0.6)"
                  strokeWidth="3"
                  filter="url(#glow)"
                />

                {/* Road Network Lines */}
                {nodePositions.map((node, i) => (
                  <g key={`road-${i}`}>
                    {nodePositions.slice(i + 1).map((targetNode, j) => {
                      const distance = Math.sqrt(
                        Math.pow(targetNode.x - node.x, 2) + Math.pow(targetNode.y - node.y, 2)
                      );
                      if (distance < 120) {
                        return (
                          <line
                            key={`line-${i}-${j}`}
                            x1={node.x + 20} y1={node.y + 20}
                            x2={targetNode.x + 20} y2={targetNode.y + 20}
                            stroke="rgba(0,191,255,0.3)"
                            strokeWidth="2"
                            strokeDasharray="3,3"
                          />
                        );
                      }
                      return null;
                    })}
                  </g>
                ))}

                {/* Traffic Nodes */}
                {nodePositions.map((node, i) => (
                  <g key={`node-${i}`}>
                    <circle
                      cx={node.x + 20} cy={node.y + 20}
                      r={activeNodes.includes(i) ? "12" : "8"}
                      fill={activeNodes.includes(i) ? "#00ff88" : "#00bfff"}
                      filter="url(#glow)"
                      className={activeNodes.includes(i) ? "animate-pulse" : ""}
                    />
                    <text
                      x={node.x + 20} y={node.y + 40}
                      textAnchor="middle"
                      className="text-xs fill-blue-300 font-medium"
                    >
                      {node.label}
                    </text>
                  </g>
                ))}

                {/* Central Hub */}
                <circle
                  cx="120" cy="120" r="15"
                  fill="url(#centralGradient)"
                  filter="url(#glow)"
                  className="animate-glow-pulse"
                />

                <defs>
                  <radialGradient id="centralGradient">
                    <stop offset="0%" stopColor="#00bfff" />
                    <stop offset="100%" stopColor="#0055ff" />
                  </radialGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Network Status */}
          <div className="chart-container">
            <h3 className="text-lg font-semibold neon mb-4">Network Status</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-300">Active Junctions</span>
                <span className="text-green-400 font-bold">{activeNodes.length}/8</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-300">Network Health</span>
                <span className="text-green-400 font-bold">98.5%</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-blue-300">Data Flow</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-bold">Live</span>
                </div>
              </div>
            </div>

            {/* Mini Activity Feed */}
            <div className="mt-6 pt-4 border-t border-blue-500/20">
              <h4 className="text-sm font-medium text-blue-300 mb-3">Recent Activity</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-blue-200">Junction A: Speed normalized</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full"></div>
                  <span className="text-blue-200">Junction C: Minor congestion</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span className="text-blue-200">Junction E: Traffic cleared</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CentralVisualization;
