let isCameraActive = false;
let cameraInterval = null;

// Tab switching
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Find matching button
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase().includes(tabName.toLowerCase())) {
            btn.classList.add('active');
        }
    });
}

// Camera functions
function startCamera() {
    console.log("🎥 Starting camera...");
    
    isCameraActive = true;
    document.getElementById('startCameraBtn').style.display = 'none';
    document.getElementById('stopCameraBtn').style.display = 'inline-flex';
    document.getElementById('cameraPlaceholder').style.display = 'none';
    
    const cameraStreamImg = document.getElementById('cameraStreamImg');
    const cameraStream = document.getElementById('cameraStream');
    
    // Hide iframe if it was shown
    cameraStream.style.display = 'none';
    
    // Send start signal to backend
    fetch('/api/camera/start', { method: 'POST' })
        .then(resp => resp.json())
        .then(data => {
            console.log("✅ Camera init started:", data);
            
            // Poll /api/camera/ready until hardware is open, then load stream
            let pollAttempts = 0;
            const maxAttempts = 30; // 6 seconds max wait
            
            function pollReady() {
                pollAttempts++;
                if (pollAttempts > maxAttempts) {
                    showError("Camera failed to initialize. Make sure it isn't blocked or in use by another application.");
                    stopCamera();
                    return;
                }
                
                fetch('/api/camera/ready')
                    .then(r => r.json())
                    .then(status => {
                        if (status.ready) {
                            console.log("✅ Camera hardware ready, loading stream...");
                            cameraStreamImg.style.display = 'block';
                            cameraStreamImg.src = '/api/camera/stream?' + new Date().getTime();
                            cameraStreamImg.onerror = function() {
                                console.error("❌ Stream disconnected");
                            };
                        } else {
                            // Not ready yet, poll again in 200ms
                            setTimeout(pollReady, 200);
                        }
                    })
                    .catch(() => setTimeout(pollReady, 200));
            }
            
            // Start polling after a short moment for backend to kick off
            setTimeout(pollReady, 200);
        })
        .catch(err => {
            console.error("❌ Failed to start camera:", err);
            showError("Failed to start camera: " + err.message);
            stopCamera();
        });
    
    // Clear initial empty state in detections list
    const detectionsList = document.getElementById('detectionsList');
    detectionsList.innerHTML = '';
    
    // Start fetching stats every 2 seconds
    if (cameraInterval) clearInterval(cameraInterval);
    cameraInterval = setInterval(fetchCameraStats, 2000);
}

function stopCamera() {
    console.log("🛑 Stopping camera...");
    isCameraActive = false;
    document.getElementById('startCameraBtn').style.display = 'inline-flex';
    document.getElementById('stopCameraBtn').style.display = 'none';
    document.getElementById('cameraPlaceholder').style.display = 'flex';
    
    const cameraStream = document.getElementById('cameraStream');
    const cameraStreamImg = document.getElementById('cameraStreamImg');
    
    cameraStream.style.display = 'none';
    cameraStreamImg.style.display = 'none';
    cameraStream.src = '';
    cameraStreamImg.src = '';
    
    // Send stop signal to backend
    fetch('/api/camera/stop', { method: 'POST' })
        .then(resp => resp.json())
        .then(data => console.log("✅ Camera stopped:", data))
        .catch(err => console.error("Error stopping camera:", err));
    
    if (cameraInterval) {
        clearInterval(cameraInterval);
        cameraInterval = null;
    }
}

function fetchCameraStats() {
    if (!isCameraActive) return;
    
    fetch('/api/status')
        .then(resp => resp.json())
        .then(data => {
            console.log("Camera status:", data);
            
            if (data.camera_running) {
                // Update UI with status
                let detectionsList = document.getElementById('detectionsList');
                if (detectionsList) {
                    detectionsList.innerHTML = `
                        <div style="padding: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                            <p><strong>📊 Live Status:</strong></p>
                            <p>Vehicles Tracked: <strong>${data.vehicles_tracked}</strong></p>
                            <p>Frames Processed: <strong>${data.frame_count}</strong></p>
                            <p style="color: #4ade80; font-size: 0.85rem; margin-top: 0.5rem;">✓ Stream Active</p>
                        </div>
                    `;
                }
            }
        })
        .catch(err => console.error("Error fetching stats:", err));
}

// Upload functions
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
    }
});

function handleFileUpload(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    document.getElementById('uploadStatus').classList.remove('hidden');
    document.getElementById('uploadResults').classList.add('hidden');
    document.getElementById('uploadArea').classList.add('hidden');
    
    fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('uploadStatus').classList.add('hidden');
        
        if (data.success) {
            displayUploadResults(data);
        } else {
            showError(data.error || 'Upload failed');
            resetUpload();
        }
    })
    .catch(err => {
        document.getElementById('uploadStatus').classList.add('hidden');
        showError('Network error: ' + err.message);
        resetUpload();
    });
}

function getSpeedClass(speed) {
    if (speed < 60) return 'speed-normal';
    if (speed < 90) return 'speed-high';
    return 'speed-danger';
}

function createDetectionCard(data) {
    const card = document.createElement('div');
    card.className = 'detection-card';
    
    const speedClass = getSpeedClass(data.speed);
    const speedLabel = data.speed < 60 ? 'Normal' : data.speed < 90 ? 'Warning' : 'Danger';
    
    card.innerHTML = `
        <div class="detection-meta">
            <span style="font-weight: 700; color: var(--text-primary);">Vehicle ID: ${data.id || 'N/A'}</span>
            <span class="speed-badge ${speedClass}">${speedLabel}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
            <span style="color: var(--text-secondary);">Velocity:</span>
            <span style="color: var(--accent-cyan); font-weight: 600;">${data.speed} km/h</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
            <span style="color: var(--text-secondary);">License Plate:</span>
            <span style="color: #fff; font-family: monospace; letter-spacing: 1px;">${data.plate || 'Scanning...'}</span>
        </div>
    `;
    return card;
}

function displayUploadResults(data) {
    const resultImage = document.getElementById('resultImage');
    const resultVideo = document.getElementById('resultVideo');
    const detectionsList = document.getElementById('detectionsList');
    const downloadBtn = document.getElementById('downloadBtn');
    
    resultImage.innerHTML = '';
    resultVideo.innerHTML = '';
    detectionsList.innerHTML = '';
    
    if (data.image) {
        resultImage.innerHTML = `<img src="${data.image}" alt="Processed Result" style="width: 100%; border-radius: 8px;">`;
    } else if (data.download_url) {
        resultVideo.innerHTML = `<video width="100%" controls style="border-radius: 8px;"><source src="${data.download_url}" type="video/mp4"></video>`;
    }
    
    if (data.download_url) {
        downloadBtn.style.display = 'inline-flex';
        downloadBtn.onclick = () => window.location.href = data.download_url;
    } else {
        downloadBtn.style.display = 'none';
    }
    
    // Database Excel format download button
    let dbBtn = document.getElementById('dbDownloadBtn');
    if (!dbBtn) {
        dbBtn = document.createElement('button');
        dbBtn.id = 'dbDownloadBtn';
        dbBtn.className = 'btn btn-secondary';
        dbBtn.style = 'margin-left: 10px; padding: 0.75rem 1.5rem; background: rgba(59, 130, 246, 0.1); color: var(--accent-blue); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 8px; font-weight: 600; cursor: pointer; display: inline-flex; align-items: center; gap: 0.5rem; transition: all 0.2s ease;';
        dbBtn.innerHTML = '<i class="fas fa-file-excel"></i> Download Excel DB';
        
        // Add hover styles
        dbBtn.onmouseover = () => { dbBtn.style.background = 'rgba(59, 130, 246, 0.2)'; };
        dbBtn.onmouseout = () => { dbBtn.style.background = 'rgba(59, 130, 246, 0.1)'; };
        
        downloadBtn.parentNode.insertBefore(dbBtn, downloadBtn.nextSibling);
    }
    
    if (data.database_url) {
        dbBtn.style.display = 'inline-flex';
        dbBtn.onclick = () => window.location.href = data.database_url;
    } else {
        dbBtn.style.display = 'none';
    }
    
    if (data.detections && data.detections.length > 0) {
        if (Array.isArray(data.detections[0])) {
            // Video stats logic
            const uniqueVehicles = {};
            data.detections.forEach(frameData => {
                if (frameData.vehicles) {
                    frameData.vehicles.forEach(v => {
                        const key = v.plate || `ID-${v.id}`;
                        if (!uniqueVehicles[key]) uniqueVehicles[key] = [];
                        uniqueVehicles[key].push(v.speed);
                    });
                }
            });
            
            Object.entries(uniqueVehicles).forEach(([id, speeds]) => {
                const avgSpeed = (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(1);
                detectionsList.appendChild(createDetectionCard({
                    id: id,
                    speed: avgSpeed,
                    plate: id.includes('ID-') ? 'N/A' : id
                }));
            });
        } else {
            // Single image detections
            data.detections.forEach(vehicle => {
                detectionsList.appendChild(createDetectionCard(vehicle));
            });
        }
    } else {
        detectionsList.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No vehicles detected in analysis.</p>';
    }
    
    document.getElementById('uploadResults').classList.remove('hidden');
}

function resetUpload() {
    document.getElementById('uploadArea').classList.remove('hidden');
    document.getElementById('uploadResults').classList.add('hidden');
    document.getElementById('uploadStatus').classList.add('hidden');
    fileInput.value = '';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

// Initial state
document.addEventListener('DOMContentLoaded', () => {
    // Reveal animation for cards
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
});
