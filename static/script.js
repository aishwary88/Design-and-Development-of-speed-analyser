let isCameraActive = false;
let cameraInterval = null;

// Tab switching
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
        let detectionsHtml = '<div style="margin-top: 20px;">';
        
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
                    });
                }
            });
            
            Object.entries(uniqueVehicles).forEach(([plate, speeds]) => {
                const avgSpeed = (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(2);
                const maxSpeed = Math.max(...speeds).toFixed(2);
                detectionsHtml += `
                    <div class="detection-item-summary">
                        <div>
                            <strong>Plate:</strong> ${plate} | 
                            <strong>Avg Speed:</strong> ${avgSpeed} km/h | 
                            <strong>Max Speed:</strong> ${maxSpeed} km/h
                        </div>
                    </div>
                `;
            });
        } else {
            // Single image
            data.detections.forEach(vehicle => {
                detectionsHtml += `
                    <div class="detection-item-summary">
                        <div>
                            <strong>Vehicle ID:</strong> ${vehicle.id} | 
                            <strong>Speed:</strong> ${vehicle.speed} km/h | 
                            <strong>Plate:</strong> ${vehicle.plate} | 
                            <strong>Confidence:</strong> ${vehicle.confidence}
                        </div>
                    </div>
                `;
            });
        }
        
        detectionsHtml += '</div>';
        detectionsSummary.innerHTML = detectionsHtml;
    } else {
        detectionsSummary.innerHTML = '<p style="color: #999;">No vehicles detected</p>';
    }
    
    // Show download button
    if (data.download_url) {
        detectionsSummary.innerHTML += `
            <a href="${data.download_url}" class="btn btn-primary" style="margin-top: 20px; text-decoration: none;">
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

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}
