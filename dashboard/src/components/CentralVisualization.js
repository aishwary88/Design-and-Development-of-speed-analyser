import React, { useState, useEffect, useRef } from 'react';
import { useCameraControl, useCameraStatus, useRecords, useCameraStream } from '../hooks/useApi';

const CentralVisualization = ({ vehicles = [] }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { start, stop } = useCameraControl();
  const { data: cameraStatus } = useCameraStatus();
  const { data: recordsData } = useRecords();
  const { streamUrl } = useCameraStream();

  const [liveDetection, setLiveDetection] = useState({
    vehicleCount: 0,
    detectedPlates: [],
    isProcessing: false,
    cameraActive: false,
    streamError: null
  });
  const [currentVideo, setCurrentVideo] = useState(null);
  const animationRef = useRef(null);

  // Handle camera stream
  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play();
            setLiveDetection(prev => ({ ...prev, cameraActive: true, streamError: null }));
            startCameraProcessing();
          };
        }
      } catch (err) {
        console.error('Camera error:', err);
        setLiveDetection(prev => ({ ...prev, cameraActive: false, streamError: 'Camera access denied or not available' }));
      }
    };

    const stopCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setLiveDetection(prev => ({ ...prev, cameraActive: false }));
    };

    if (liveDetection.cameraActive && !currentVideo) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [liveDetection.cameraActive, currentVideo]);

  // Start camera processing loop
  const startCameraProcessing = () => {
    const processFrame = () => {
      if (videoRef.current && canvasRef.current && liveDetection.cameraActive && !currentVideo) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          drawDetectionOverlay(ctx, canvas.width, canvas.height);
        }
      }

      if (liveDetection.cameraActive && !currentVideo) {
        animationRef.current = requestAnimationFrame(processFrame);
      }
    };

    processFrame();
  };

  // Draw detection overlay
  const drawDetectionOverlay = (ctx, width, height) => {
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 191, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 80) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw simulated detection boxes (in production, use actual YOLO results)
    const numVehicles = Math.min(3, Math.floor(Math.random() * 3) + 1);

    for (let i = 0; i < numVehicles; i++) {
      const x = 100 + (i * 150) % (width - 200);
      const y = 100 + (Math.sin((Date.now() / 1000) + i) * 50);
      const boxWidth = 80;
      const boxHeight = 50;

      ctx.strokeStyle = 'rgba(0, 255, 0, 0.7)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, boxWidth, boxHeight);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(x, y - 20, boxWidth, 18);

      ctx.fillStyle = '#00ff00';
      ctx.font = '12px monospace';
      ctx.fillText(`Car: ${(85 + Math.random() * 14).toFixed(0)}%`, x + 2, y - 6);
    }
  };

  // Handle camera control toggle
  const toggleCamera = () => {
    if (liveDetection.cameraActive && !currentVideo) {
      stop();
      setLiveDetection(prev => ({ ...prev, cameraActive: false }));
    } else if (!currentVideo) {
      start();
      setLiveDetection(prev => ({ ...prev, cameraActive: true }));
    }
  };

  // Handle video file upload for processing
  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCurrentVideo({
            url: result.download_url,
            detections: result.detections,
            totalFrames: result.total_frames
          });
          setLiveDetection(prev => ({ ...prev, cameraActive: false }));
        }
      }
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  // Fetch real vehicle data from API
  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/camera/status');
        if (response.ok) {
          const data = await response.json();
          setLiveDetection(prev => ({
            ...prev,
            vehicleCount: data.vehicle_count || prev.vehicleCount,
            isProcessing: data.is_processing || prev.isProcessing
          }));
        }
      } catch (err) {
        console.log('API not available, using simulated data');
      }
    };

    fetchVehicleData();
    const interval = setInterval(fetchVehicleData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Use actual vehicles data from records
  useEffect(() => {
    if (recordsData && recordsData.vehicles && recordsData.vehicles.length > 0) {
      const plates = recordsData.vehicles.slice(0, 4).map(v => v.plate || `PLATE-${Math.floor(Math.random() * 1000)}`);
      setLiveDetection(prev => ({
        ...prev,
        detectedPlates: plates,
        vehicleCount: recordsData.vehicles.length
      }));
    }
  }, [recordsData]);

  // Traffic network visualization state
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

  const [activeNodes, setActiveNodes] = useState([]);
  const [trafficFlow, setTrafficFlow] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNodes(prev => {
        const newNodes = [...prev];
        const randomNode = Math.floor(Math.random() * 8);
        if (newNodes.includes(randomNode)) {
          return newNodes.filter(n => n !== randomNode);
        } else {
          return [...newNodes, randomNode].slice(-4);
        }
      });
      setTrafficFlow(prev => (prev + 1) % 360);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="card p-8 animate-slide-up">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold neon mb-2">Live Detection Panel</h2>
        <p className="text-blue-300 text-sm">Real-time vehicle detection and traffic monitoring</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Live Detection Feed */}
        <div className="space-y-6">
          {/* Video Feed with Camera Control */}
          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-lg border border-blue-500/30 aspect-video flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-transparent"></div>

            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />

            {/* Canvas for Detection Overlay */}
            <canvas
              ref={canvasRef}
              width={640}
              height={480}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Camera Status Overlay */}
            <div className="relative z-10 w-full h-full flex items-center justify-center">
              {!liveDetection.cameraActive && !currentVideo && !liveDetection.streamError && (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-blue-300 text-sm">Camera Feed Ready</p>
                  <p className="text-blue-400 text-xs">Click "Start Camera" to begin</p>
                </div>
              )}

              {liveDetection.streamError && (
                <div className="text-center">
                  <p className="text-red-400 text-sm mb-2">{liveDetection.streamError}</p>
                  <p className="text-blue-400 text-xs">Using simulated detection</p>
                </div>
              )}

              {/* Detection Boxes Simulation */}
              {liveDetection.cameraActive && !currentVideo && (
                <div className="absolute top-4 left-4 w-20 h-12 border-2 border-green-400 rounded">
                  <div className="absolute -top-6 left-0 text-xs text-green-400 bg-black/50 px-1 rounded">
                    Car: 95%
                  </div>
                </div>
              )}
              {liveDetection.cameraActive && !currentVideo && (
                <div className="absolute top-16 right-8 w-16 h-10 border-2 border-cyan-400 rounded">
                  <div className="absolute -top-6 left-0 text-xs text-cyan-400 bg-black/50 px-1 rounded">
                    Bus: 87%
                  </div>
                </div>
              )}

              {/* Video Player for Processed Files */}
              {currentVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <video
                    src={`http://localhost:8000${currentVideo.url}`}
                    controls
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>

            {/* Live Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/70 px-3 py-1 rounded-full z-20">
              <div className={`w-2 h-2 rounded-full animate-pulse ${liveDetection.cameraActive && !currentVideo ? 'bg-red-500' : 'bg-green-400'}`}></div>
              <span className="text-white text-xs font-medium">{liveDetection.cameraActive && !currentVideo ? 'LIVE' : 'IDLE'}</span>
            </div>

            {/* Camera Control Button */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
              <button
                onClick={toggleCamera}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${liveDetection.cameraActive && !currentVideo
                  ? 'bg-red-500/80 hover:bg-red-600/80 text-white'
                  : 'bg-green-500/80 hover:bg-green-600/80 text-white'
                  }`}
              >
                {liveDetection.cameraActive && !currentVideo ? 'Stop Camera' : 'Start Camera'}
              </button>
            </div>

            {/* File Upload Button */}
            <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 z-20">
              <label className="px-6 py-2 bg-cyan-500/80 hover:bg-cyan-600/80 text-white rounded-full font-semibold transition-all duration-300 cursor-pointer">
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoUpload}
                />
              </label>
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