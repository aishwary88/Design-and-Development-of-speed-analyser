import React, { useState, useEffect } from 'react';
import { useInsights, useRecords } from '../hooks/useApi';

const SmartInsightsPanel = ({ metrics }) => {
  const { data: insightsData, loading } = useInsights();
  const { data: recordsData } = useRecords();
  const [insights, setInsights] = useState([]);
  const [riskLevel, setRiskLevel] = useState('Low');

  useEffect(() => {
    if (insightsData) {
      setInsights(insightsData.insights || []);
      setRiskLevel(insightsData.risk_level || 'Low');
    }
  }, [insightsData]);

  // Generate insights based on actual violation data
  useEffect(() => {
    if (recordsData && recordsData.violations && recordsData.violations.length > 0) {
      const violations = recordsData.violations;
      const highSpeedViolations = violations.filter(v => v.speed > 90);

      if (highSpeedViolations.length > 0) {
        setInsights(prev => [
          {
            type: 'danger',
            icon: '🚨',
            title: 'Critical Speed Violation',
            message: `${highSpeedViolations.length} vehicles exceeded 90 km/h`,
            priority: 'critical'
          },
          ...prev
        ]);
      }

      if (violations.length > 5) {
        setInsights(prev => [
          {
            type: 'warning',
            icon: '⚠️',
            title: 'High Violation Rate',
            message: `${violations.length} total overspeeding violations`,
            priority: 'high'
          },
          ...prev
        ]);
      }
    }
  }, [recordsData]);

  const getRiskColor = (level) => {
    switch (level) {
      case 'Critical': return 'text-red-400';
      case 'High': return 'text-orange-400';
      case 'Medium': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'danger': return 'border-red-500/50 bg-red-900/20';
      case 'warning': return 'border-yellow-500/50 bg-yellow-900/20';
      case 'success': return 'border-green-500/50 bg-green-900/20';
      default: return 'border-blue-500/50 bg-blue-900/20';
    }
  };

  return (
    <section className="card p-6 animate-slide-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold neon mb-2">Smart Insights</h2>
        <p className="text-blue-300 text-sm">AI-powered traffic analysis and recommendations</p>
      </div>

      {/* Risk Indicator */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-blue-300">Risk Level</h3>
            <span className={`text-lg font-bold ${getRiskColor(riskLevel)}`}>
              {riskLevel}
            </span>
          </div>
          <div className="text-2xl">
            {riskLevel === 'Critical' ? '🔴' :
              riskLevel === 'High' ? '🟠' :
                riskLevel === 'Medium' ? '🟡' : '🟢'}
          </div>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-3">
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg border ${getInsightColor(insight.type)} transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">{insight.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-200 text-sm">
                    {insight.title}
                  </h4>
                  <p className="text-blue-300 text-xs mt-1">
                    {insight.message}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${insight.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                  insight.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                    insight.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                  }`}>
                  {insight.priority}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🎯</div>
            <p className="text-blue-300 text-sm">All systems operating normally</p>
            <p className="text-blue-400 text-xs">No critical insights at this time</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 pt-4 border-t border-blue-500/20">
        <h4 className="text-sm font-medium text-blue-300 mb-3">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="px-3 py-2 text-xs bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all">
            Generate Report
          </button>
          <button className="px-3 py-2 text-xs bg-green-500/20 text-green-300 rounded-lg border border-green-500/30 hover:bg-green-500/30 transition-all">
            Export Data
          </button>
        </div>
      </div>
    </section>
  );
};

export default SmartInsightsPanel;