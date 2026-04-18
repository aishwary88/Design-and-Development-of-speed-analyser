import React, { useState, useEffect } from 'react';

const DataCollectionPanel = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [dragActive, setDragActive] = useState(false);
  const [recentUploads, setRecentUploads] = useState([]);

  useEffect(() => {
    // Fetch recent uploads from API
    const fetchUploads = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/uploads');
        if (response.ok) {
          const data = await response.json();
          setRecentUploads(data.uploads || []);
        }
      } catch (err) {
        console.log('API not available, using simulated data');
      }
    };

    fetchUploads();
    const interval = setInterval(fetchUploads, 30000);
    return () => clearInterval(interval);
  }, []);

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

  const handleFiles = async (files) => {
    setUploadStatus('uploading');

    try {
      const formData = new FormData();
      formData.append('file', files[0]);

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus('success');
        // Add to recent uploads
        setRecentUploads(prev => [{
          name: files[0].name,
          timestamp: new Date().toLocaleString(),
          status: 'Processed'
        }, ...prev]);
      } else {
        setUploadStatus('error');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadStatus('error');
    }

    setTimeout(() => setUploadStatus('idle'), 2000);
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

        {uploadStatus === 'error' && (
          <>
            <div className="text-4xl mb-4">❌</div>
            <h3 className="text-lg font-medium text-red-400 mb-2">
              Upload failed
            </h3>
            <p className="text-blue-400 text-sm">
              Please try again or check your connection
            </p>
          </>
        )}
      </div>

      {/* Recent Uploads */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-blue-300 mb-3">Recent Uploads</h4>
        <div className="space-y-2">
          {recentUploads.length > 0 ? (
            recentUploads.map((upload, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3">
                  <div className="text-lg">{upload.name.endsWith('mp4') ? '🎥' : '📷'}</div>
                  <div>
                    <div className="text-sm font-medium text-blue-200">{upload.name}</div>
                    <div className="text-xs text-blue-400">{upload.timestamp}</div>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${upload.status === 'Processed' ? 'text-green-400 bg-green-500/20' :
                  upload.status === 'Processing' ? 'text-yellow-400 bg-yellow-500/20' :
                    'text-blue-400 bg-blue-500/20'
                  }`}>
                  {upload.status}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-blue-400 text-sm">No uploads yet</div>
          )}
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