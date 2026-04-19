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
import CsvDataMonitor from './components/CsvDataMonitor';
import { useMetrics, useAnalytics, useInsights, useRecords, useCameraStatus, useCsvSummary, useSpeedVariance, useCongestion } from './hooks/useApi';

function App() {
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

  // Fetch real data from backend
  const { data: metricsData, loading: metricsLoading, error: metricsError } = useMetrics();
  const { data: analyticsData, loading: analyticsLoading, error: analyticsError } = useAnalytics();
  const { data: insightsData, loading: insightsLoading, error: insightsError } = useInsights();
  const { data: recordsData, loading: recordsLoading, error: recordsError } = useRecords();
  const { data: cameraStatus, loading: cameraLoading, error: cameraError } = useCameraStatus();
  const { data: csvSummary, loading: csvLoading, error: csvError } = useCsvSummary();
  const { data: speedVariance, loading: varianceLoading, error: varianceError } = useSpeedVariance();
  const { data: congestionData, loading: congestionLoading, error: congestionError } = useCongestion();

  // Update dashboard data from API
  useEffect(() => {
    if (metricsData && insightsData) {
      setDashboardData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          totalVehicles: metricsData.total_vehicles || 0,
          avgSpeed: metricsData.avg_speed || 0,
          overspeedViolations: metricsData.violations_count || 0,
          speedCompliance: parseInt(metricsData.speed_compliance?.replace('%', '') || 0),
          trafficStabilityIndex: 85,
          riskIndicator: insightsData?.risk_level || 'Low'
        }
      }));
    }
  }, [metricsData, insightsData]);

  // Update from CSV summary
  useEffect(() => {
    if (csvSummary && csvSummary.total_vehicles > 0) {
      setDashboardData(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          totalVehicles: csvSummary.total_vehicles,
          avgSpeed: csvSummary.avg_speed,
          overspeedViolations: csvSummary.violations
        }
      }));
    }
  }, [csvSummary]);

  // Real-time updates from camera status
  useEffect(() => {
    if (cameraStatus) {
      setDashboardData(prev => ({
        ...prev,
        isLive: cameraStatus.is_processing || false,
        vehicles: recordsData?.vehicles || []
      }));
    }
  }, [cameraStatus, recordsData]);

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
            <CsvDataMonitor />
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
