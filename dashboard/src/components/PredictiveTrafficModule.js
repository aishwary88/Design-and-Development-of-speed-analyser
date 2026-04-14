import React from 'react';
import ChartCard from './widgets/ChartCard';

const PredictiveTrafficModule = () => (
  <section className="card p-6 glow animate-fade-in">
    <h2 className="text-xl font-bold neon mb-4">Predictive Traffic Module</h2>
    <ChartCard type="line" title="Traffic Speed Prediction (Next 30 min)" />
    <div className="mt-4 text-blue-300">Trend-based prediction using historical data</div>
  </section>
);

export default PredictiveTrafficModule;
