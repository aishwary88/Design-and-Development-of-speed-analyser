import React from 'react';
import SpeedVarianceChart from './widgets/SpeedVarianceChart';
import ChartCard from './widgets/ChartCard';

const SpeedVarianceAnalysis = () => (
  <section className="card p-6 glow animate-fade-in">
    <h2 className="text-xl font-bold neon mb-4">Speed Variance Analysis</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <SpeedVarianceChart />
      <ChartCard type="bar" title="Speed Stability Index" />
    </div>
    <div className="mt-6">
      <ChartCard type="bar" title="Risk Score for Unsafe Roads" />
    </div>
  </section>
);

export default SpeedVarianceAnalysis;
