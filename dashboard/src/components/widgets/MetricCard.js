import React, { useState, useEffect } from 'react';

const MetricCard = ({ title, value, icon, color, animated, subtitle }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [isLoading, setIsLoading] = useState(true);

  const colorMap = {
    blue: {
      text: 'text-blue-400',
      border: 'border-blue-500/30',
      glow: 'hover:shadow-blue-500/20',
      bg: 'from-blue-900/20 to-blue-800/10'
    },
    cyan: {
      text: 'text-cyan-300',
      border: 'border-cyan-400/30',
      glow: 'hover:shadow-cyan-400/20',
      bg: 'from-cyan-900/20 to-cyan-800/10'
    },
    red: {
      text: 'text-red-400',
      border: 'border-red-500/30',
      glow: 'hover:shadow-red-500/20',
      bg: 'from-red-900/20 to-red-800/10'
    },
    purple: {
      text: 'text-purple-400',
      border: 'border-purple-500/30',
      glow: 'hover:shadow-purple-500/20',
      bg: 'from-purple-900/20 to-purple-800/10'
    },
    green: {
      text: 'text-green-400',
      border: 'border-green-500/30',
      glow: 'hover:shadow-green-500/20',
      bg: 'from-green-900/20 to-green-800/10'
    }
  };

  const currentColor = colorMap[color] || colorMap.blue;

  useEffect(() => {
    if (value && value !== '...' && value !== '0') {
      setIsLoading(false);
      // Animate number counting for numeric values
      const numericValue = parseFloat(value.toString().replace(/[^\d.]/g, ''));
      if (!isNaN(numericValue) && animated) {
        let start = 0;
        const duration = 1500;
        const increment = numericValue / (duration / 16);

        const timer = setInterval(() => {
          start += increment;
          if (start >= numericValue) {
            setDisplayValue(value);
            clearInterval(timer);
          } else {
            const currentNum = Math.floor(start);
            setDisplayValue(value.toString().replace(/\d+/, currentNum.toString()));
          }
        }, 16);

        return () => clearInterval(timer);
      } else {
        setDisplayValue(value);
      }
    } else if (value === '0' || value === 0) {
      setIsLoading(false);
      setDisplayValue(value);
    }
  }, [value, animated]);

  return (
    <div className={`
      metric-card p-6 rounded-xl border transition-all duration-300 
      ${currentColor.border} ${currentColor.glow}
      bg-gradient-to-br ${currentColor.bg}
      hover:scale-105 hover:shadow-2xl
      animate-fade-in group relative overflow-hidden
    `}>

      {/* Icon Section */}
      <div className="flex items-center justify-between mb-4">
        <div className={`
          text-3xl p-3 rounded-lg bg-gradient-to-br ${currentColor.bg} 
          border ${currentColor.border} group-hover:scale-110 transition-transform duration-300
        `}>
          {icon}
        </div>

        {/* Status Indicator */}
        <div className={`
          w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}
        `}></div>
      </div>

      {/* Content Section */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-blue-200 uppercase tracking-wide">
          {title}
        </h3>

        <div className={`
          text-2xl font-bold ${currentColor.text} 
          ${animated && isLoading ? 'animate-pulse' : 'animate-counter'}
          font-mono tracking-tight
        `}>
          {isLoading ? (
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          ) : (
            displayValue
          )}
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div className="text-xs text-blue-400 opacity-75">
            {subtitle}
          </div>
        )}
      </div>

      {/* Subtle Bottom Glow */}
      <div className={`
        absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${currentColor.bg} 
        opacity-50 rounded-b-xl
      `}></div>
    </div>
  );
};

export default MetricCard;
