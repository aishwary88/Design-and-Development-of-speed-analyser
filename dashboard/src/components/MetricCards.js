
import React, { useEffect, useState } from 'react';
import MetricCard from './widgets/MetricCard';

const MetricCards = ({ metrics }) => {
  const [displayMetrics, setDisplayMetrics] = useState([
    { title: 'Total Vehicles', value: '0', icon: '🚗', color: 'blue', animated: true },
    { title: 'Average Speed', value: '0 km/h', icon: '⚡', color: 'cyan', animated: true },
    { title: 'Overspeed Violations', value: '0', icon: '⚠️', color: 'red', animated: true },
    { title: 'Speed Compliance', value: '0%', icon: '✅', color: 'green', animated: true },
    { title: 'Traffic Stability', value: '0%', icon: '📊', color: 'purple', animated: true },
  ]);

  useEffect(() => {
    if (metrics) {
      setDisplayMetrics([
        {
          title: 'Total Vehicles',
          value: metrics.totalVehicles?.toString() || '0',
          icon: '🚗',
          color: 'blue',
          animated: true,
          subtitle: 'Detected'
        },
        {
          title: 'Average Speed',
          value: `${metrics.avgSpeed || 0} km/h`,
          icon: '⚡',
          color: 'cyan',
          animated: true,
          subtitle: 'Current'
        },
        {
          title: 'Overspeed Violations',
          value: metrics.overspeedViolations?.toString() || '0',
          icon: '⚠️',
          color: 'red',
          animated: true,
          subtitle: 'Active'
        },
        {
          title: 'Speed Compliance',
          value: `${metrics.speedCompliance || 0}%`,
          icon: '✅',
          color: 'green',
          animated: true,
          subtitle: 'Rate'
        },
        {
          title: 'Traffic Stability',
          value: `${metrics.trafficStabilityIndex || 0}%`,
          icon: '📊',
          color: 'purple',
          animated: true,
          subtitle: 'Index'
        },
      ]);
    }
  }, [metrics]);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {displayMetrics.map((metric, i) => (
        <MetricCard key={i} {...metric} />
      ))}
    </section>
  );
};

export default MetricCards;
