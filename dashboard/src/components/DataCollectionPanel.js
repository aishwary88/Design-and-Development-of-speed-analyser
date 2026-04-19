import React, { useState } from 'react';
import { useUploadFile, useRecords } from '../hooks/useApi';

const DataCollectionPanel = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [dragActive, setDragActive] = useState(false);
  const { upload, loading, error } = useUploadFile();
  const { data: recordsData } = useRecords();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleFiles = async (file) => {
    setUploadStatus('uploading');
    try {
      const result = await upload(file);
      if (result.success) {
        setUploadStatus('success');
        setTimeout(() => setUploadStatus('idle'), 3000);
      }
    } catch (err) {
      setUploadStatus('error');
      console.error('Upload error:', err);
    }
  };

  // Get recent uploads from records
  const recentUploads = recordsData?.vehicles?.slice(0, 5) || [];

  return (
    <section className="card p-6 animate-slide-up">
      <div className="mb-6">
        <h2 className="text-xl font-bold neon mb-2">Data Collection</h2>
        <p className="text-blue-300 text-sm">Upload videos and images for analysis</p>
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${dragActive
            ? 'border-cyan-400 bg-cyan-500/10'
            : 'border-blue-500/30 hover:border-blue-500/50'
          }
          ${uploadStatus === 'uploading' ? 'animate-pulse' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {uploadStatus === 'idle' && (
          <>
            <div className="text-4xl mb-4">📁</div>
            <h3 className="text-lg font-medium text-blue-200 mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-blue-400 text-sm mb-4">
              Supports MP4, AVI, JPG, PNG files
            </p>
            <label className="px-6 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all cursor-pointer inline-block">
              Choose Files
              <input
                type="file"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files[0])}
              />
            </label>
          </>
        )}

        {uploadStatus === 'uploading' && (
          <>
            <div className="text-4xl mb-4">⏳</div>
            <h3 className="text-lg font-medium text-blue-200 mb-2">
              Processing files...
            </h3>
            <div className="w-full bg-blue-900/50 rounded-full h-2 mb-4">
              <div className="bg-cyan-400 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </>
        )}

        {uploadStatus === 'success' && (
          <>
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-green-400 mb-2">
              Upload successful!
            </h3>
            <p className="text-blue-400 text-sm">
              Files are being processed for analysis
            </p>
          </>
        )}

        {uploadStatus === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-red-400 mb-2">
              Upload failed
            </h3>
            <p className="text-red-400 text-sm">
              {error || 'Please try again'}
            </p>
          </>
        )}
      </div>

      {/* Recent Uploads */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-blue-300 mb-3">Recent Uploads</h4>
        <div className="space-y-2">
          {recentUploads.length > 0 ? (
            recentUploads.map((vehicle, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="text-lg">🚗</div>
                  <div>
                    <div className="text-sm font-medium text-blue-200">Vehicle #{vehicle.id}</div>
                    <div className="text-xs text-blue-400">{vehicle.plate || 'N/A'} - {vehicle.speed} km/h</div>
                  </div>
                </div>
                <span className="text-xs text-green-400">✓ Processed</span>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-blue-400 text-sm">No uploads yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-cyan-400">{recordsData?.total_vehicles || 0}</div>
          <div className="text-xs text-blue-400">Total Vehicles</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">{recordsData?.total_violations || 0}</div>
          <div className="text-xs text-blue-400">Violations</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">{recordsData?.vehicles?.length || 0}</div>
          <div className="text-xs text-blue-400">Current Session</div>
        </div>
      </div>
    </section>
  );
};

export default DataCollectionPanel;