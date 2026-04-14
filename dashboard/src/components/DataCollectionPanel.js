import React, { useState } from 'react';

const DataCollectionPanel = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [dragActive, setDragActive] = useState(false);

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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFiles = (files) => {
    setUploadStatus('uploading');
    // Simulate upload
    setTimeout(() => {
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 2000);
    }, 1500);
  };

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
            <button className="px-6 py-2 bg-blue-500/20 text-blue-300 rounded-lg border border-blue-500/30 hover:bg-blue-500/30 transition-all">
              Choose Files
            </button>
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
      </div>

      {/* Recent Uploads */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-blue-300 mb-3">Recent Uploads</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="text-lg">🎥</div>
              <div>
                <div className="text-sm font-medium text-blue-200">traffic_video_01.mp4</div>
                <div className="text-xs text-blue-400">2 minutes ago</div>
              </div>
            </div>
            <span className="text-xs text-green-400">✓ Processed</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-3">
              <div className="text-lg">📷</div>
              <div>
                <div className="text-sm font-medium text-blue-200">intersection_photo.jpg</div>
                <div className="text-xs text-blue-400">5 minutes ago</div>
              </div>
            </div>
            <span className="text-xs text-yellow-400">⏳ Processing</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-bold text-cyan-400">24</div>
          <div className="text-xs text-blue-400">Files Today</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-400">156</div>
          <div className="text-xs text-blue-400">Total Processed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-400">2.1GB</div>
          <div className="text-xs text-blue-400">Storage Used</div>
        </div>
      </div>
    </section>
  );
};

export default DataCollectionPanel;