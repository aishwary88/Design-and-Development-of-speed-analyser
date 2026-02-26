let isCameraActive = false;
let cameraInterval = null;
let statsData = {
    vehicles: 0,
    avgSpeed: 0,
    plates: 0
};

// Update stats display
function updateStats(vehicles = 0, speed = 0, plates = 0) {
    document.getElementById('statsVehicles').textContent = vehicles;
    document.getElementById('statsSpeed').textContent = speed.toFixed(1) + ' km/h';
    document.getElementById('statsPlates').textContent = plates;
}

// Tab switching with smooth animation
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active state from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');
    event.target.classList.add('active');
}

// Camera functions
function startCamera() {
    isCameraActive = true;
    document.getElementById('startCameraBtn').style.display = 'none';
    document.getElementById('stopCameraBtn').style.display = 'inline-block';
    document.getElementById('cameraPlaceholder').style.display = 'none';
    document.getElementById('cameraStream').style.display = 'block';
    document.getElementById('liveDetections').classList.remove('hidden');

    // Start fetching camera frames
    const cameraStream = document.getElementById('cameraStream');
    cameraStream.src = '/api/camera/stream?' + new Date().getTime();

    // Fetch stats periodically
    fetchCameraStats();
}

function stopCamera() {
    isCameraActive = false;
    document.getElementById('startCameraBtn').style.display = 'inline-block';
    document.getElementById('stopCameraBtn').style.display = 'none';
    document.getElementById('cameraPlaceholder').style.display = 'flex';
    document.getElementById('cameraStream').style.display = 'none';
    document.getElementById('liveDetections').classList.add('hidden');
    document.getElementById('cameraStream').src = '';

    fetch('/api/camera/stop', { method: 'POST' });

    if (cameraInterval) {
        clearInterval(cameraInterval);
    }
}

function fetchCameraStats() {
    if (!isCameraActive) return;

    cameraInterval = setInterval(() => {
        if (isCameraActive) {
            // Stats are shown in the stream overlay
        }
    }, 1000);
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

// Dataset upload elements
const datasetArea = document.getElementById('datasetArea');
const datasetFileInput = document.getElementById('datasetFileInput');

datasetArea.addEventListener('click', () => datasetFileInput.click());

datasetArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    datasetArea.classList.add('dragover');
});

datasetArea.addEventListener('dragleave', () => {
    datasetArea.classList.remove('dragover');
});

datasetArea.addEventListener('drop', (e) => {
    e.preventDefault();
    datasetArea.classList.remove('dragover');
    if (e.dataTransfer.files.length > 0) {
        handleDatasetUpload(e.dataTransfer.files);
    }
});

datasetFileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleDatasetUpload(e.target.files);
    }
});

function handleFileUpload(file) {
    const formData = new FormData();
    formData.append('file', file);

    // Show loading state
    document.getElementById('uploadStatus').classList.remove('hidden');
    document.getElementById('uploadResults').classList.add('hidden');
    document.getElementById('uploadArea').style.display = 'none';

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
            }
        })
        .catch(err => {
            document.getElementById('uploadStatus').classList.add('hidden');
            showError('Network error: ' + err.message);
        });
}

function displayUploadResults(data) {
    const resultImage = document.getElementById('resultImage');
    const resultVideo = document.getElementById('resultVideo');
    const detectionsSummary = document.getElementById('detectionsSummary');

    resultImage.innerHTML = '';
    resultVideo.innerHTML = '';
    detectionsSummary.innerHTML = '';

    // Check if it's an image or video result
    if (data.image) {
        resultImage.innerHTML = `<img src="${data.image}" alt="Processed Result">`;
    } else if (data.download_url) {
        // It's a video
        resultVideo.innerHTML = `<video width="100%" controls><source src="${data.download_url}" type="video/mp4"></video>`;
    }

    // Display detections
    if (data.detections && data.detections.length > 0) {
        let detectionsHtml = '';
        let totalVehicles = 0;
        let totalSpeed = 0;
        let speedCount = 0;

        if (Array.isArray(data.detections[0])) {
            // Video with multiple frames
            const uniqueVehicles = {};
            data.detections.forEach(frameData => {
                if (frameData.vehicles) {
                    frameData.vehicles.forEach(vehicle => {
                        const key = vehicle.plate;
                        if (!uniqueVehicles[key]) {
                            uniqueVehicles[key] = [];
                        }
                        uniqueVehicles[key].push(vehicle.speed);
                        totalSpeed += vehicle.speed;
                        speedCount++;
                    });
                }
            });

            totalVehicles = Object.keys(uniqueVehicles).length;

            Object.entries(uniqueVehicles).forEach(([plate, speeds]) => {
                const avgSpeed = (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(2);
                const maxSpeed = Math.max(...speeds).toFixed(2);
                const minSpeed = Math.min(...speeds).toFixed(2);
                detectionsHtml += `
                    <div class="detection-item-summary">
                        <div>
                            <strong>📍 Plate:</strong> ${plate}<br/>
                            <strong>⚡ Avg:</strong> ${avgSpeed} km/h | 
                            <strong>🔺 Max:</strong> ${maxSpeed} km/h | 
                            <strong>🔻 Min:</strong> ${minSpeed} km/h
                        </div>
                    </div>
                `;
            });
        } else {
            // Single image
            data.detections.forEach(vehicle => {
                totalVehicles++;
                totalSpeed += vehicle.speed;
                speedCount++;

                const speedColor = vehicle.speed < 60 ? '#4caf50' : vehicle.speed < 90 ? '#ff9800' : '#f44336';
                detectionsHtml += `
                    <div class="detection-item-summary" style="border-left-color: ${speedColor};">
                        <div>
                            <strong>🚙 ID:</strong> ${vehicle.id} | 
                            <strong>⚡ Speed:</strong> <span style="color: ${speedColor}; font-weight: bold;">${vehicle.speed} km/h</span><br/>
                            <strong>📍 Plate:</strong> ${vehicle.plate} | 
                            <strong>🎯 Confidence:</strong> ${(vehicle.confidence * 100).toFixed(1)}%
                        </div>
                    </div>
                `;
            });
        }

        // Update stats
        const avgSpeed = speedCount > 0 ? totalSpeed / speedCount : 0;
        updateStats(totalVehicles, avgSpeed, data.detections.length);

        detectionsSummary.innerHTML = detectionsHtml;
    } else {
        detectionsSummary.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">ℹ️ No vehicles detected in this file</p>';
    }

    // Show download button
    if (data.download_url) {
        detectionsSummary.innerHTML += `
            <a href="${data.download_url}" class="btn btn-secondary" style="margin-top: 20px; text-decoration: none;">
                ⬇️ Download Result
            </a>
        `;
    }

    document.getElementById('uploadResults').classList.remove('hidden');
}

function resetUpload() {
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('uploadResults').classList.add('hidden');
    document.getElementById('uploadStatus').classList.add('hidden');
    fileInput.value = '';
}

// Dataset upload handlers
function handleDatasetUpload(fileList) {
    const files = Array.from(fileList);
    const formData = new FormData();
    files.forEach(f => formData.append('files', f));

    document.getElementById('datasetStatus').classList.remove('hidden');
    document.getElementById('datasetResults').classList.add('hidden');
    document.getElementById('datasetArea').style.display = 'none';

    fetch('/api/upload-dataset', { method: 'POST', body: formData })
        .then(res => res.json())
        .then(data => {
            document.getElementById('datasetStatus').classList.add('hidden');
            if (data.success) {
                const list = document.getElementById('datasetFileList');
                list.innerHTML = '';

                if (data.files && data.files.length > 0) {
                    const fileCount = data.files.length;
                    let html = `<div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 5px solid #4caf50;">
                                    <strong style="color: #2e7d32;">✅ Successfully uploaded ${fileCount} file(s)</strong>
                                </div>`;

                    data.files.forEach((f, idx) => {
                        const fileExt = f.split('.').pop().toUpperCase();
                        const icon = ['PNG', 'JPG', 'JPEG', 'GIF'].includes(fileExt) ? '🖼️' :
                            ['MP4', 'AVI', 'MOV', 'MKV'].includes(fileExt) ? '🎬' : '📄';
                        html += `
                            <div class="detection-item-summary">
                                <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
                                    <span style="font-size: 1.5em;">${icon}</span>
                                    <div style="flex: 1;">
                                        <strong>${f}</strong><br/>
                                        <small style="color: #666;">Type: ${fileExt}</small>
                                    </div>
                                </div>
                            </div>
                        `;
                    });
                    list.innerHTML = html;
                } else {
                    list.innerHTML = '<p style="color:#999; text-align: center;">ℹ️ No files were saved</p>';
                }
                document.getElementById('datasetResults').classList.remove('hidden');
            } else {
                showError(data.error || 'Dataset upload failed');
            }
        })
        .catch(err => {
            document.getElementById('datasetStatus').classList.add('hidden');
            showError('Network error: ' + err.message);
        });
}

function resetDatasetUpload() {
    document.getElementById('datasetArea').style.display = 'block';
    document.getElementById('datasetResults').classList.add('hidden');
    document.getElementById('datasetStatus').classList.add('hidden');
    datasetFileInput.value = '';
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');

    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}
