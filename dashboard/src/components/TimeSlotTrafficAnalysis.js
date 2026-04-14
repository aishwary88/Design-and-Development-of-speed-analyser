import React, { useState } from 'react';

const TimeSlotTrafficAnalysis = () => {
  const [timeSlotData] = useState([
    {
      slot: 'Morning',
      time: '6:00 - 10:00',
      avgSpeed: 45,
      density: 78,
      status: 'High',
      icon: '🌅'
    },
    {
      slot: 'Afternoon',
      time: '10:00 - 16:00',
      avgSpeed: 62,
      density: 45,
      status: 'Medium',
      icon: '☀️'
    },
    {
      slot: 'Evening',
      time: '16:00 - 20:00',
      avgSpeed: 38,
      density: 85,
      status: 'High',
      icon: '🌆'
    },
    {
      slot: 'Night',
      time: '20:00 - 6:00',
      avgSpeed: 68,
      density: 20,
      status: 'Low',
      icon: '🌙'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'High': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getCurrentTimeSlot = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 10) return 'Morning';
    if (hour >= 10 && hour < 16) return 'Afternoon';
    if (hour >= 16 && hour < 20) return 'Evening';
    return 'Night';
  };

  return (
    <section className="card p-6 animate-slide-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold neon mb-2">Time Slot Analysis</h2>
        <p className="text-blue-300 text-sm">Traffic patterns throughout the day</p>
      </div>

      {/* Current Time Slot Highlight */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30">
        <div className="flex items-center gap-3">
          <div className="text-2xl">⏰</div>
          <div>
            <h3 className="font-medium text-cyan-300">Current Time Slot</h3>
            <p className="text-blue-200">{getCurrentTimeSlot()} - Active monitoring</p>
          </div>
        </div>
      </div>

      {/* Time Slot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {timeSlotData.map((slot, index) => (
          <div
            key={index}
            className={`
              p-4 rounded-lg border transition-all duration-300 hover:scale-105
              ${getCurrentTimeSlot() === slot.slot
                ? 'bg-cyan-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                : 'bg-blue-900/20 border-blue-500/20 hover:border-blue-500/40'
              }
            `}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{slot.icon}</span>
                <div>
                  <h4 className="font-medium text-blue-200">{slot.slot}</h4>
                  <p className="text-xs text-blue-400">{slot.time}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(slot.status)}`}>
                {slot.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-bold text-cyan-400">{slot.avgSpeed} km/h</div>
                <div className="text-xs text-blue-400">Avg Speed</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-300">{slot.density}%</div>
                <div className="text-xs text-blue-400">Traffic Density</div>
              </div>
            </div>

            {/* Mini Progress Bar */}
            <div className="mt-3 w-full bg-blue-900/50 rounded-full h-1">
              <div
                className={`h-1 rounded-full transition-all duration-1000 ${slot.status === 'High' ? 'bg-red-400' :
                  slot.status === 'Medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`}
                style={{ width: `${slot.density}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
          <div className="text-lg font-bold text-green-400">52 km/h</div>
          <div className="text-xs text-blue-400">Daily Average</div>
        </div>
        <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
          <div className="text-lg font-bold text-red-400">Evening</div>
          <div className="text-xs text-blue-400">Peak Hours</div>
        </div>
        <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
          <div className="text-lg font-bold text-cyan-400">82%</div>
          <div className="text-xs text-blue-400">Efficiency</div>
        </div>
      </div>
    </section>
  );
};

export default TimeSlotTrafficAnalysis;