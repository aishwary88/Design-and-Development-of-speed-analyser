import React, { useState, useEffect } from 'react';
import SpeedVarianceChart from './widgets/SpeedVarianceChart';
import ChartCard from './widgets/ChartCard';
import { useRecords } from '../hooks/useApi';

const SpeedVarianceAnalysis = () => {
  const { data: recordsData } = useRecords();
  const [varianceData, setVarianceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Calculate variance from actual vehicle speeds
    if (recordsData && recordsData.vehicles && recordsData.vehicles.length > 0) {
      const speeds = recordsData.vehicles.map(v => v.speed || 0);
      const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
      const variance = speeds.reduce((a, b) => a + Math.pow(b - avgSpeed, 2), 0) / speeds.length;

      setVarianceData({
        variance: variance.toFixed(2),
        avgSpeed: avgSpeed.toFixed(1),
        totalVehicles: recordsData.vehicles.length
      });
      setIsLoading(false);
    }
  }, [recordsData]);

  return (
    <section className="card p-6 glow animate-fade-in">
      <h2 className="text-xl font-bold neon mb-4">Speed Variance Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SpeedVarianceChart varianceData={varianceData} isLoading={isLoading} />
        <ChartCard type="bar" title="Speed Stability Index" />
      </div>
      <div className="mt-6">
        <ChartCard type="bar" title="Risk Score for Unsafe Roads" />
      </div>
    </section>
  );
};

export default SpeedVarianceAnalysis;