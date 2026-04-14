import React, { useState, useEffect } from 'react';

const AdvancedFeatures = ({ metrics }) => {
  const [advancedMetrics, setAdvancedMetrics] = useState({
    trafficStabilityIndex: 85,
    speedComplianceScore: 92,
    riskIndicator: 'Low',
    efficiencyScore: 78,
    anomalyCount: 2,
    congestionCause: 'Normal Flow'
  });

  const [filters, setFilters] = useState({
    timeRange: '1h',
    roadType: 'all'
  });

  useEffect(() => {
    if (metrics) {
      setAdvancedMetrics(prev => ({
        ...prev,
        trafficStabilityIndex: metrics.trafficStabilityIndex || prev.trafficStabilityIndex,
        speedComplianceScore: metrics.speedCompliance || prev.speedComplianceScore,
        riskIndicator: metrics.riskIndicator || prev.riskIndicator
      }));
    }
  }, [metrics]);

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Low': return 'text-green-400';
      case 'Medium': return 'text-yellow-400';
      case 'High': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <section className="card p-6 animate-slide-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold neon mb-2">Advanced Features</h2>
        <p className="text-blue-300 text-sm">Enhanced analytics and intelligent monitoring</p>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 flex gap-4">
        <select
          value={filters.timeRange}
          onChange={(e) => setFilters(prev => ({ ...prev, timeRange: e.target.value }))}
          className="px-3 py-2 text-sm bg-blue-900/30 border border-blue-500/30 rounded-lg text-blue-200 focus:outline-none focus:border-blue-400"
        >
          <option value="1h">Last Hour</option>
          <option value="6h">Last 6 Hours</option>
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last Week</option>
        </select>
        <select
          value={filters.roadType}
          onChange={(e) => setFilters(prev => ({ ...prev, roadType: e.target.value }))}
          className="px-3 py-2 text-sm bg-blue-900/30 border border-blue-500/30 rounded-lg text-blue-200 focus:outline-none focus:border-blue-400"
        >
          <option value="all">All Roads</option>
          <option value="highway">Highways</option>
          <option value="urban">Urban Roads</option>
          <option value="residential">Residential</option>
        </select>
      </div>

      {/* Advanced Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="chart-container">
          <h4 className="text-sm font-medium text-blue-300 mb-2">Traffic Stability Index</h4>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${getScoreColor(advancedMetrics.trafficStabilityIndex)}`}>
              {advancedMetrics.trafficStabilityIndex}%
            </span>
            <div className="text-xs text-blue-400">
              Flow variance analysis
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${advancedMetrics.trafficStabilityIndex >= 90 ? 'bg-green-400' :
                  advancedMetrics.trafficStabilityIndex >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              style={{ width: `${advancedMetrics.trafficStabilityIndex}%` }}
            ></div>
          </div>
        </div>

        <div className="chart-container">
          <h4 className="text-sm font-medium text-blue-300 mb-2">Speed Compliance Score</h4>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${getScoreColor(advancedMetrics.speedComplianceScore)}`}>
              {advancedMetrics.speedComplianceScore}%
            </span>
            <div className="text-xs text-blue-400">
              Speed limit adherence
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${advancedMetrics.speedComplianceScore >= 90 ? 'bg-green-400' :
                  advancedMetrics.speedComplianceScore >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              style={{ width: `${advancedMetrics.speedComplianceScore}%` }}
            ></div>
          </div>
        </div>

        <div className="chart-container">
          <h4 className="text-sm font-medium text-blue-300 mb-2">Risk Indicator</h4>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-bold ${getRiskColor(advancedMetrics.riskIndicator)}`}>
              {advancedMetrics.riskIndicator}
            </span>
            <div className="text-2xl">
              {advancedMetrics.riskIndicator === 'Low' ? '🟢' :
                advancedMetrics.riskIndicator === 'Medium' ? '🟡' : '🔴'}
            </div>
          </div>
          <div className="text-xs text-blue-400 mt-1">
            Unsafe road conditions
          </div>
        </div>

        <div className="chart-container">
          <h4 className="text-sm font-medium text-blue-300 mb-2">Efficiency Score</h4>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${getScoreColor(advancedMetrics.efficiencyScore)}`}>
              {advancedMetrics.efficiencyScore}%
            </span>
            <div className="text-xs text-blue-400">
              Flow smoothness
            </div>
          </div>
          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${advancedMetrics.efficiencyScore >= 90 ? 'bg-green-400' :
                  advancedMetrics.efficiencyScore >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                }`}
              style={{ width: `${advancedMetrics.efficiencyScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Anomaly Detection */}
      <div className="chart-container mb-4">
        <h4 className="text-sm font-medium text-blue-300 mb-3">Anomaly Detection</h4>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${advancedMetrics.anomalyCount === 0 ? 'bg-green-400' :
                advancedMetrics.anomalyCount <= 2 ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
            <span className="text-blue-200">
              {advancedMetrics.anomalyCount} anomalies detected
            </span>
          </div>
          <span className="text-xs text-blue-400">Last {filters.timeRange}</span>
        </div>
      </div>

      {/* Congestion Analysis */}
      <div className="chart-container">
        <h4 className="text-sm font-medium text-blue-300 mb-3">Congestion Cause Analysis</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-blue-200">Primary Cause:</span>
            <span className="text-cyan-400 font-medium">{advancedMetrics.congestionCause}</span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs">
            <div className="text-center">
              <div className="text-green-400 font-bold">65%</div>
              <div className="text-blue-400">Normal</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold">20%</div>
              <div className="text-blue-400">Rush Hour</div>
            </div>
            <div className="text-center">
              <div className="text-orange-400 font-bold">10%</div>
              <div className="text-blue-400">Construction</div>
            </div>
            <div className="text-center">
              <div className="text-red-400 font-bold">5%</div>
              <div className="text-blue-400">Incident</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvancedFeatures;