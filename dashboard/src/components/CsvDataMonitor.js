import React, { useState, useEffect } from 'react';
import { useCsvData, useCsvSummary, useSpeedVariance, useCongestion } from '../hooks/useApi';

const CsvDataMonitor = () => {
    const { data: csvData, loading, error } = useCsvData(50);
    const { data: summary } = useCsvSummary();
    const { data: variance } = useSpeedVariance();
    const { data: congestion } = useCongestion();

    const [refreshCount, setRefreshCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshCount(prev => prev + 1);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
                <h3 className="text-blue-400 font-semibold mb-2">📊 CSV Data Monitor</h3>
                <p className="text-slate-400 text-sm">Loading traffic data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
                <h3 className="text-blue-400 font-semibold mb-2">📊 CSV Data Monitor</h3>
                <p className="text-red-400 text-sm">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-blue-400 font-semibold">📊 CSV Data Monitor</h3>
                <span className="text-xs text-slate-500">Auto-refresh</span>
            </div>

            {/* Summary Stats */}
            {summary && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-slate-900/50 p-2 rounded">
                        <p className="text-xs text-slate-400">Total Vehicles</p>
                        <p className="text-lg font-bold text-blue-300">{summary.total_vehicles || 0}</p>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded">
                        <p className="text-xs text-slate-400">Avg Speed</p>
                        <p className="text-lg font-bold text-green-300">{summary.avg_speed || 0} km/h</p>
                    </div>
                    <div className="bg-slate-900/50 p-2 rounded">
                        <p className="text-xs text-slate-400">Violations</p>
                        <p className="text-lg font-bold text-red-300">{summary.violations || 0}</p>
                    </div>
                </div>
            )}

            {/* Speed Variance */}
            {variance && (
                <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-1">Speed Range: {variance.min_speed || 0} - {variance.max_speed || 0} km/h</p>
                    <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div
                            className="bg-gradient-to-r from-green-500 to-red-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (variance.avg_speed || 0) / 1.5)}%` }}
                        ></div>
                    </div>
                </div>
            )}

            {/* Congestion Status */}
            {congestion && (
                <div className="mb-3">
                    <p className="text-xs text-slate-400 mb-1">Congestion: {congestion.status || 'unknown'}</p>
                    <div className="flex gap-1">
                        {['free', 'light', 'moderate', 'severe'].map(status => (
                            <div
                                key={status}
                                className={`h-1.5 flex-1 rounded-full ${congestion.status === status
                                        ? status === 'free' ? 'bg-green-500'
                                            : status === 'light' ? 'bg-yellow-500'
                                                : status === 'moderate' ? 'bg-orange-500'
                                                    : 'bg-red-500'
                                        : 'bg-slate-700'
                                    }`}
                            ></div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Data Table */}
            {csvData && csvData.length > 0 && (
                <div className="max-h-40 overflow-y-auto">
                    <table className="w-full text-xs">
                        <thead className="text-slate-400">
                            <tr>
                                <th className="text-left py-1">ID</th>
                                <th className="text-left py-1">Speed</th>
                                <th className="text-left py-1">Plate</th>
                            </tr>
                        </thead>
                        <tbody>
                            {csvData.slice(0, 5).map((row, idx) => (
                                <tr key={idx} className="border-b border-slate-700/50">
                                    <td className="py-1 text-blue-300">{row.vehicle_id}</td>
                                    <td className="py-1">
                                        <span className={row.speed_kmh > 60 ? 'text-red-400' : 'text-green-400'}>
                                            {row.speed_kmh.toFixed(1)} km/h
                                        </span>
                                    </td>
                                    <td className="py-1 text-slate-300">{row.plate_text}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {(!csvData || csvData.length === 0) && (
                <p className="text-slate-500 text-sm">No data yet. Start camera or upload video.</p>
            )}
        </div>
    );
};

export default CsvDataMonitor;
