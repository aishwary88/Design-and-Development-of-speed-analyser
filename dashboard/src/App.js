import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CentralVisualization from './components/CentralVisualization';
import MetricCards from './components/MetricCards';
import DataCollectionPanel from './components/DataCollectionPanel';
import TrafficSpeedAnalytics from './components/TrafficSpeedAnalytics';
import CongestionAnalysis from './components/CongestionAnalysis';
import TimeSlotTrafficAnalysis from './components/TimeSlotTrafficAnalysis';
import SpeedVarianceAnalysis from './components/SpeedVarianceAnalysis';
import PredictiveTrafficModule from './components/PredictiveTrafficModule';
import SmartInsightsPanel from './components/SmartInsightsPanel';
import AdvancedFeatures from './components/AdvancedFeatures';
import FutureReadyModules from './components/FutureReadyModules';
import HeatmapPanel from './components/widgets/HeatmapPanel';
import { useMetrics, useAnalytics } from './hooks/useApi';

function App() {
  const { data: metricsData, loading: metricsLoading } = useMetrics();
  const { data: analyticsData, loading: analyticsLoading } = useAnalytics();

  const [dashboardData, setDashboardData] = useState({
    vehicles: [],
    metrics: {
      totalVehicles: 0,
      avgSpeed: 0,
      overspeedViolations: 0,
      speedCompliance: 0,
      trafficStabilityIndex: 85,
      riskIndicator: 'Low'
    },
    isLive: false,
    lastUpdate: new Date()
  });

  // Update dashboard data when API data loads
  useEffect(() => {
    if (metricsData && !metricsLoading) {
      setDashboardData(prev => ({
        ...prev,
        metrics: {
          totalVehicles: metricsData.total_vehicles || prev.metrics.totalVehicles,
          avgSpeed: metricsData.avg_speed || prev.metrics.avgSpeed,
          overspeedViolations: prev.metrics.overspeedViolations,
          speedCompliance: parseInt(metricsData.speed_compliance?.replace('%', '') || prev.metrics.speedCompliance),
          trafficStabilityIndex: prev.metrics.trafficStabilityIndex,
          riskIndicator: prev.metrics.riskIndicator
        }
      }));
    }
  }, [metricsData, metricsLoading]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(prev => ({
        ...prev,
        lastUpdate: new Date(),
        metrics: {
          ...prev.metrics,
          totalVehicles: Math.floor(Math.random() * 50) + 20,
          avgSpeed: Math.floor(Math.random() * 30) + 45,
          overspeedViolations: Math.floor(Math.random() * 8),
          speedCompliance: Math.floor(Math.random() * 20) + 80,
          trafficStabilityIndex: Math.floor(Math.random() * 20) + 75,
          riskIndicator: Math.random() > 0.7 ? 'Medium' : 'Low'
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0f1c] to-[#1a2332] text-blue-100">
      <Header dashboardData={dashboardData} />

      {/* Main Dashboard Grid Layout */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* Top Row - Metric Cards */}
        <section className="w-full">
          <MetricCards metrics={dashboardData.metrics} />
        </section>

        {/* Live Detection & Main Analytics Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <CentralVisualization vehicles={dashboardData.vehicles} />
            <TrafficSpeedAnalytics analyticsData={analyticsData} analyticsLoading={analyticsLoading} />
          </div>
          <div className="space-y-8">
            <DataCollectionPanel />
            <SmartInsightsPanel metrics={dashboardData.metrics} />
          </div>
        </div>

        {/* Analytics Panels Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CongestionAnalysis />
          <TimeSlotTrafficAnalysis />
        </div>

        {/* Advanced Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <SpeedVarianceAnalysis />
          <HeatmapPanel />
        </div>

        {/* Predictive & Future Features Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PredictiveTrafficModule />
          <AdvancedFeatures metrics={dashboardData.metrics} />
        </div>

        {/* Future Ready Modules */}
        <div className="w-full">
          <FutureReadyModules />
        </div>

      </main>
    </div>
  );
}

export default App;
