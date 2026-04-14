import React, { useState, useEffect } from 'react';

const Header = ({ dashboardData }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [systemStatus, setSystemStatus] = useState('online');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Determine system status based on data
  useEffect(() => {
    if (dashboardData?.metrics?.riskIndicator === 'High') {
      setSystemStatus('warning');
    } else if (dashboardData?.isLive) {
      setSystemStatus('online');
    } else {
      setSystemStatus('offline');
    }
  }, [dashboardData]);

  return (
    <header className="card mx-6 mt-6 p-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* Left Section - Title & Status */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold neon tracking-wide">
              Traffic Speed Analyser
            </h1>
            <p className="text-blue-300 mt-1 text-sm lg:text-base">
              YOLOv8 + OCR Based Smart Traffic Monitoring
            </p>
          </div>

          {/* System Status Indicator */}
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${systemStatus === 'online' ? 'status-online' :
                systemStatus === 'warning' ? 'status-warning' : 'status-error'
              }`}></div>
            <span className="text-sm font-medium text-blue-200">
              {systemStatus === 'online' ? 'Active' :
                systemStatus === 'warning' ? 'Warning' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Right Section - Time & Stats */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">

          {/* Live Time Display */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/20">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-blue-200">
              {currentTime.toLocaleTimeString()}
            </span>
            <span className="text-xs text-blue-400">
              {currentTime.toLocaleDateString()}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">Vehicles:</span>
              <span className="text-green-400 font-bold">
                {dashboardData?.metrics?.totalVehicles || 0}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">Avg Speed:</span>
              <span className="text-cyan-400 font-bold">
                {dashboardData?.metrics?.avgSpeed || 0} km/h
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden lg:block">
            <ul className="flex gap-4 text-sm font-medium">
              <li className="px-3 py-2 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 cursor-pointer hover:bg-blue-500/30 transition-all">
                Live
              </li>
              <li className="px-3 py-2 rounded-lg text-blue-400 cursor-pointer hover:bg-blue-500/20 hover:text-blue-300 transition-all">
                Analytics
              </li>
              <li className="px-3 py-2 rounded-lg text-blue-400 cursor-pointer hover:bg-blue-500/20 hover:text-blue-300 transition-all">
                Reports
              </li>
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2 rounded-lg border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
