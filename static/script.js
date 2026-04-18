let isCameraActive = false;
let cameraInterval = null;
let statsData = {
    vehicles: 0,
    avgSpeed: 0,
    plates: 0
};

// Advanced animation and sound effects
class FuturisticUI {
    constructor() {
        this.initializeAnimations();
        this.initializeParticles();
        this.initializeAudioContext();
    }

    initializeAnimations() {
        // Add entrance animations to elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                    entry.target.classList.add('animate-in');
                }
            });
        });

        document.querySelectorAll('.stat-card, .glass-card').forEach(el => {
            observer.observe(el);
        });
    }

    initializeParticles() {
        // Create floating particles in background
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(particleContainer);

        for (let i = 0; i < 20; i++) {
            this.createParticle(particleContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 191, 255, 0.6);
            border-radius: 50%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            box-shadow: 0 0 6px rgba(0, 191, 255, 0.8);
        `;
        container.appendChild(particle);

        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.createParticle(container);
            }
        }, (5 + Math.random() * 10) * 1000);
    }

    initializeAudioContext() {
        // Create subtle UI sound effects
        this.audioContext = null;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    playUISound(frequency = 800, duration = 100) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }
}

// Initialize futuristic UI
const futuristicUI = new FuturisticUI();

// Advanced animation and sound effects
class FuturisticUI {
    constructor() {
        this.initializeAnimations();
        this.initializeParticles();
        this.initializeAudioContext();
    }

    initializeAnimations() {
        // Add entrance animations to elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = Math.random() * 0.5 + 's';
                    entry.target.classList.add('animate-in');
                }
            });
        });

        document.querySelectorAll('.stat-card, .glass-card').forEach(el => {
            observer.observe(el);
        });
    }

    initializeParticles() {
        // Create floating particles in background
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particle-container';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        document.body.appendChild(particleContainer);

        for (let i = 0; i < 20; i++) {
            this.createParticle(particleContainer);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(0, 191, 255, 0.6);
            border-radius: 50%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
     0}%;
            box-shadow: 0 0 6px rgba(0, 191, 255, 0.8);
        `;
        container.appendChild(particle);

        // Remove and recreate particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
                this.createParticle(container);
            }
        }, (5 + Math.random() * 10) * 1000);
    }

    initializeAudioContext() {
        // Create subtle UI sound effects

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Audio context not supported');
        }
    }

    playUISound(frequency = 800, duration = 100) {
        if (!this.audioContext) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContextestination);

        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }
}

// Initialize futuristic UI
const futuristicUI = new FuturisticUI();

Enhanced stats update with animations
function updateStats(vehicles = 0, speed = 0, plates = 0) {
    animateCounter('statsVehicles', statsData.vehicles, vehicles);
    animateCounter('statsSpeed', statsData.avgSpeed, speed, ' km/h');
    animateCounter('statsPlates', statsData.plates, plates);

    statsData = { vehicles, avgSpeed: speed, plates };
}

function animateCounter(elementId, fromValue, toValue, suffix = '') {
    const element = document.getElementById(elementId);
    const duration = 1000;
    const startTime = performance.now();

    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentValue = fromValue + (toValue - fromValue) * easeOutCubic;

        if (suffix === ' km/h') {
            element.textContent = currentValue.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(currentValue) + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }

    requestAnimationFrame(animate);
}

// Enhanced tab switching with sound and animation
function switchTab(tabName) {
    futuristicUI.playUISound(600, 150);

    // Hide all tabs with fade out
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.opacity = '0';
        tab.style.transform = 'ateY(20px)';
        setTimeout(() => {
            tab.classList.remove('active');
        }, 150);
    });

    // Remove active state from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab with fade in
    setTimeout(() => {
        const targetTab = document.getElementById(tabName + '-tab');
        targetTab.classList.add('active');
        targetTab.style.opacity = '1';
        Y(0)';

        // Find and activate the clicked button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.onclick && btn.onclick.toString().includes(tabName)) {
                btn.classList.add('active');
            }
        });
    }, 150);
}

// Enhanced camera functions with status indicators
function startCamera() {
    futuristicUI.playUISound(800, 200);

    isCameraActive = true;
    document.getElementById('startCameraBtn').style.display = 'none';
    document.getElementById('stopCameraBtn').style.display = 'inline-flex';
    document.getElementById('cameraPlaceholder').style.display = 'none';
    document.getElementById('cameraStream').style.display = 'block';
    document.getElementById('liveDetections').classList.remove('hidden');

    // Add loading animation
    const cameraStream = document.getElementById('cameraStream');
    cameraStream.style.filter = 'blur(5px)';

    // Start camera API call
    fetch('/api/camera/start', { method: 'POST' })
        .then(response => response.json())
        .then(data => {
            cameraStream.src = '/api/camera/stream?' + new Date().getTime();

            // Remove blur when stream loads
            cameraStream.onload = () => {
                cameraStream.style.filter = 'none';
            };

            fetchCameraStats();
            showNotification('🎥 Neural network camera initialized', 'success');
        })
        .catch(err => {
            showNotification('❌ Camera initialization failed: ' + err.message, 'error');
            stopCamera();
        });
}

function stopCamera() {
    futuristicUI.playUISound(400, 200);

    isCameraActive = false;
    document.getElementById('startCameraBtn').style.display = 'inline-flex';
    document.getElementById('stopCameraBtn').style.display = 'none';
    document.getElementById('cameraPlaceholder').style.display = 'flex';
    document.getElementById('cameraStream').style.display = 'none';
    document.getlassList.add('hidden');
    document.getElementById('cameraStream').src = '';

    fetch('/api/camera/stop', { method: 'POST' });

    if (cameraInterval) {
        clearInterval(cameraInterval);
    }

    showNotification('⏹️ Camera feed terminated', 'info');
}

function fetchCameraStats() {
    if (!isCameraActive) return;

    cameraInterval = setInterval(() => {
        if (isCameraActive) {
            // Simulate real-time stats updates
            con 1;
            const speed = Math.random() * 80 + 20;
            const plates = Math.floor(Math.random() * vehicles) + 1;

            updateStats(vehicles, speed, plates);
            updateLiveDetections();
        }
    }, 2000);
}

function updateLiveDetections() {
    const detectionsList = document.getElementById('liveDetectionsList');
    const mockDetections = [
        { id: Math.floor(Math.random() * 1000), speed: (Math.random() * 80 + 20).toFixed(1), plate: generateRandomPlate() },
        { id: Math.floor(Math.random() * 1000), speed: (Math.random() * 80 + 20).toFixed(1), plate: generateRandomPlate() }
    ];

    let html = '';
    mockDetections.forEach(detection => {
        const speedColor = detection.speed < 60 ? '#00ff88' : detection.speed < 90 ? '#ff9800' : '#ff4757';
        html += `
            <div class="detection-item" style="animation: slideInRight 0.5s ease-out;">
                <div>
                    <strong>🚙 Vehicle ${detection.id}</strong><br/>
                    <span style="color: ${speedColor};">⚡ ${detection.speed} km/h</span> | 📍 ${detection.plate}
                </div>
                <div style="color: ${speedColor}; font-size: 1.2em;">●</div>
            </div>
        `;
    });

    detectionsList.innerHTML = html;
}

function generateRandomPlate() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    return letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        numbers.charAt(Math.floor(Math.random() * numbers.length)) +
        numbers.charAt(Math.floor(Math.random() * numbers.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length)) +
        letters.charAt(Math.floor(Math.random() * letters.length));
}

// Enhanced upload functions with progress and animations
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');

uploadArea.addEventListener('click', () => {
    futuristicUI.playUISound(700, 100);
    fileInput.click();
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
    uploadArea.style.transform = 'scale(1.02)';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
    uploadArea.style.transform = 'scale(1)';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    uploadArea.style.transform = 'scale(1)';
    futuristicUI.playUISound(900, 150);

    if (e.dataTransfer.files.length > 0) {
        handleFileUpload(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
    }
});

// Dataset upload elements with enhanced interactions
const datasetArea = document.getElementById('datasetArea');
const datasetFileInput = document.getElementById('datasetFileInput');

datasetArea.addEventListener('click', () => {
    futuristicUI.playUISound(700, 100);
    datasetFileInput.click();
});

datasetArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    datasetArea.classList.add('dragover');
});

datasetArea.addEventListener('dragleave', () => {
    datasetArea.classList.remove('dragover');
});

datasetArea.addEventListener('drop', (e) => {
    e.preventDefault();
) => {
    futuristicUI.playUISound(700, 50);
});
    });
}); opacity: 1; }
    }

@keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
}
    
    .animate -in {
    animation: slideUp 0.8s ease- out;
    }
`;
document.head.appendChild(style);

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    showNotification('🚀 Traffic Speed Analyser initialized', 'success');
    
    // Add hover sound effects to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mouseenter', (

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
@keyframes slideInRight {
        from { transform: translateX(100 %); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
}

@keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100 %); opacity: 0; }
}

@keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to {
        transform: translateY(0);ideOutRight 0.5s ease - out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

function showError(message) {
    showNotification('❌ ' + message, 'error');

    const errorDiv = document.getElementById('errorMessage');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');

    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
} background: ${ color.bg };
border: 1px solid ${ color.border };
color: ${ color.text };
padding: 15px 20px;
border - radius: 12px;
backdrop - filter: blur(10px);
z - index: 10000;
animation: slideInRight 0.5s ease - out;
max - width: 400px;
box - shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slent.createElement('div');
    const colors = {
        success: { bg: 'rgba(0, 255, 136, 0.2)', border: 'rgba(0, 255, 136, 0.5)', text: '#00ff88' },
        error: { bg: 'rgba(255, 71, 87, 0.2)', border: 'rgba(255, 71, 87, 0.5)', text: '#ff4757' },
        info: { bg: 'rgba(0, 191, 255, 0.2)', border: 'rgba(0, 191, 255, 0.5)', text: '#00bfff' }
    };
    
    const color = colors[type] || colors.info;
    
    notification.style.cssText = `
position: fixed;
top: 20px;
right: 20px;
     }
document.getElementById('datasetResults').classList.remove('hidden');
}

function resetDatasetUpload() {
    futuristicUI.playUISound(600, 100);
    document.getElementById('datasetArea').style.display = 'block';
    document.getElementById('datasetResults').classList.add('hidden');
    document.getElementById('datasetStatus').classList.add('hidden');
    datasetFileInput.value = '';
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    const notification = documtatus: Processed</small>
                        </div >
        <div style="color: #00ff88; font-size: 1.2em;">●</div>
                    </div >
                </div >
        `;
        });
        list.innerHTML = html;
    } else {
        list.innerHTML = `
        < div style = "text-align: center; padding: 40px; color: #a0b4d8;" >
                <div style="font-size: 3em; margin-bottom: 15px;">ℹ️</div>
                <p>No files were processed</p>
            </div >
        `;
        <div class="detection-item-summary" style="animation: slideInRight ${0.1 * idx}s ease-out;">
                    <div style="display: flex; align-items: center; gap: 15px; width: 100%;">
                        <span style="font-size: 2em; filter: drop-shadow(0 0 5px currentColor);">${icon}</span>
                        <div style="flex: 1;">
                            <strong style="color: #00bfff;">${f}</strong><br/>
                            <small style="color: #a0b4d8;">Format: ${fileExt} • Sng Complete</strong><br/>
                        <span style="color: #a0b4d8;">Successfully processed ${fileCount} file(s)</span>
                    </div>
                </div>
            </div>
        `;

    data.files.forEach((f, idx) => {
        const fileExt = f.split('.').pop().toUpperCase();
        const icon = ['PNG', 'JPG', 'JPEG', 'GIF'].includes(fileExt) ? '🖼️' :
            ['MP4', 'AVI', 'MOV', 'MKV'].includes(fileExt) ? '🎬' : '📄';

        html += `
        ckground: linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 255, 136, 0.1)); 
                        padding: 20px; border-radius: 12px; margin-bottom: 25px; 
                        border: 1px solid rgba(0, 255, 136, 0.3); animation: slideUp 0.6s ease-out;">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="font-size: 2em;">✅</div>
                    <div>
                        <strong style="color: #00ff88; font-size: 1.2em;">Batch Processid');
            }
        })
        .catch(err => {
            document.getElementById('datasetStatus').classList.add('hidden');
            futuristicUI.playUISound(300, 500);
            showError('Network error: ' + err.message);
        });
}

function displayDatasetResults(data) {
    const list = document.getElementById('datasetFileList');
    list.innerHTML = '';

    if (data.files && data.files.length > 0) {
        const fileCount = data.files.length;
        let html = `
            < div style = "ba, { method: 'POST', body: formData })
                .then(res => res.json())
                .then(data => {
                    document.getElementById('datasetStatus').classList.add('hidden');
                    if (data.success) {
                        futuristicUI.playUISound(1000, 300);
                        showNotification('✅ Dataset processing complete!', 'success');
                        displayDatasetResults(data);
                    } else {
                        futuristicUI.playUISound(300, 500);
                        showError(data.error || 'Dataset upload faileileList) {
    const files = Array.from(fileList);
                        const formData = new FormData();
                        files.forEach(f => formData.append('files', f));

                        showNotification(`🗂️ Processing ${files.length} files in batch mode...`, 'info');
                        document.getElementById('datasetStatus').classList.remove('hidden');
                        document.getElementById('datasetResults').classList.add('hidden');
                        document.getElementById('datasetArea').style.display = 'none';

                        simulateProgress('datasetStatus');

                        fetch('/api/upload-dataset'0, 150); ">
                ⬇️ Download Processed File
            </a >
                            `;
    }

    document.getElementById('uploadResults').classList.remove('hidden');
}

function resetUpload() {
    futuristicUI.playUISound(600, 100);
    document.getElementById('uploadArea').style.display = 'block';
    document.getElementById('uploadResults').classList.add('hidden');
    document.getElementById('uploadStatus').classList.add('hidden');
    fileInput.value = '';
}

// Enhanced dataset upload
function handleDatasetUpload(f    <p>No vehicles detected in neural network analysis</p>
                <p style="font-size: 0.9em; opacity: 0.7;">Try uploading a different image or video</p>
            </div>
        `;
                    }

                    // Enhanced download button
                    if (data.download_url) {
                        detectionsSummary.innerHTML += `
            <a href="${data.download_url}" class="btn btn-secondary" 
               style="margin-top: 25px; text-decoration: none; animation: slideUp 0.8s ease-out;"
               onclick="futuristicUI.playUISound(80detectionsHtml += '</div>';

        // Update stats with animation
        const avgSpeed = speedCount > 0 ? totalSpeed / speedCount : 0;
        updateStats(totalVehicles, avgSpeed, data.detections.length);

        detectionsSummary.innerHTML = detectionsHtml;
    } else {
        detectionsSummary.innerHTML = `
                            < div style = "text-align: center; padding: 40px; color: #a0b4d8; animation: fadeIn 0.8s ease-out;" >
                <div style="font-size: 3em; margin-bottom: 15px;">🔍</div>
             <span style="color: ${speedColor};">⚡ ${vehicle.speed} km/h</span> |
                                <span style="color: #00ffff;">📍 ${vehicle.plate}</span> |
                                <span style="color: #a0b4d8;">🎯 ${(vehicle.confidence * 100).toFixed(1)}%</span>
                            </div >
                            <div style="color: ${speedColor}; font-size: 1.5em;">●</div>
                        </div >
                    </div >
                            `;
            });
        }

        le.speed < 60 ? '#00ff88' : vehicle.speed < 90 ? '#ff9800' : '#ff4757';
                detectionsHtml += `
                            < div class="detection-item-summary" style = "animation-delay: ${index * 0.1}s; border-left-color: ${speedColor};" >
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #00bfff;">🚙 Vehicle ${vehicle.id}</strong><br/>
                               : #ff9800;">🔻 Min: ${minSpeed}</span>
                            </div>
                            <div style="color: ${speedColor}; font-size: 1.5em;">●</div>
                        </div >
                    </div >
                            `;
            });
        } else {
            // Image processing
            data.detections.forEach((vehicle, index) => {
                totalVehicles++;
                totalSpeed += vehicle.speed;
                speedCount++;

                const speedColor = vehic.1}s; border-left-color: ${speedColor};">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #00bfff;">📍 ${plate}</strong><br/>
                                <span style="color: ${speedColor};">⚡ Avg: ${avgSpeed} km/h</span> | 
                                <span style="color: #00ff88;">🔺 Max: ${maxSpeed}</span> | 
                                <span style="colores).forEach(([plate, speeds], index) => {
                const avgSpeed = (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(2);
                const maxSpeed = Math.max(...speeds).toFixed(2);
                const minSpeed = Math.min(...speeds).toFixed(2);
                const speedColor = avgSpeed < 60 ? '#00ff88' : avgSpeed < 90 ? '#ff9800' : '#ff4757';
                
                detectionsHtml += `
                            < div class="detection-item-summary" style = "animation-delay: ${index * 0ehicle => {
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

Object.entries(uniqueVehicl  // Enhanced detections display
    if (data.detections && data.detections.length > 0) {
    let detectionsHtml = '<div style="animation: slideUp 0.6s ease-out;">';
    let totalVehicles = 0;
    let totalSpeed = 0;
    let speedCount = 0;

    if (Array.isArray(data.detections[0])) {
        // Video processing
        const uniqueVehicles = {};
        data.detections.forEach(frameData => {
            if (frameData.vehicles) {
                frameData.vehicles.forEach(v < img src = "${data.image}" alt = "AI Processed Result" 
                 style = "animation: fadeIn 0.8s ease-out; border: 2px solid rgba(0, 191, 255, 0.3); box-shadow: 0 0 20px rgba(0, 191, 255, 0.2);" >
                    `;
    } else if (data.download_url) {
        resultVideo.innerHTML = `
                    < video width = "100%" controls style = "animation: fadeIn 0.8s ease-out; border: 2px solid rgba(0, 191, 255, 0.3);" >
                    <source src="${data.download_url}" type="video/mp4">
                    </video>
        `;
    }

        clearInterval(interval);
        }
    }, 200);
}

function displayUploadResults(data) {
    const resultImage = document.getElementById('resultImage');
    const resultVideo = document.getElementById('resultVideo');
    const detectionsSummary = document.getElementById('detectionsSummary');

    resultImage.innerHTML = '';
    resultVideo.innerHTML = '';
    detectionsSummary.innerHTML = '';

    // Enhanced result display with animations
    if (data.image) {
        resultImage.innerHTML = `
         gradient(90deg, #00bfff, #00ffff);
                border - radius: 2px;
                width: 0 %;
                transition: width 0.3s ease;
                box - shadow: 0 0 10px rgba(0, 191, 255, 0.5);
                `;
    
    progressBar.appendChild(progressFill);
    container.appendChild(progressBar);
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        progressFill.style.width = progress + '%';
        
        if (progress >= 90) {
       });
}

function simulateProgress(containerId) {
    const container = document.getElementById(containerId);
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
                width: 100 %;
                height: 4px;
                background: rgba(0, 191, 255, 0.2);
                border - radius: 2px;
                margin - top: 20px;
                overflow: hidden;
                `;
    
    const progressFill = document.createElement('div');
    progressFill.style.cssText = `
                height: 100 %;
                background: linear - cUI.playUISound(1000, 300);
                showNotification('✅ AI analysis complete!', 'success');
                displayUploadResults(data);
            } else {
                futuristicUI.playUISound(300, 500);
                showError(data.error || 'Upload failed');
            }
        })
            .catch(err => {
                document.getElementById('uploadStatus').classList.add('hidden');
                futuristicUI.playUISound(300, 500);
                showError('Network error: ' + err.message);
                List.remove('hidden');
                document.getElementById('uploadResults').classList.add('hidden');
                document.getElementById('uploadArea').style.display = 'none';

                // Add progress simulation
                simulateProgress('uploadStatus');

                fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('uploadStatus').classList.add('hidden');

                        if (data.success) {
                            futuristidataTransfer.files.length > 0) {
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

            // Show enhanced loading state
            showNotification(`🔄 Processing ${file.name} with AI neural network...`, 'info');
            document.getElementById('uploadStatus').class    datasetArea.classList.remove('dragover');
            futuristicUI.playUISound(900, 150);

            if (e.

// Enhanced notification system
function showNotification(message, type = 'info') {
                    const notification = document.createElement('div');
                    const colors = {
                        success: { bg: 'rgba(0, 255, 136, 0.2)', border: 'rgba(0, 255, 136, 0.5)', text: '#00ff88' },
                        error: { bg: 'rgba(255, 71, 87, 0.2)', border: 'rgba(255, 71, 87, 0.5)', text: '#ff4757' },
                        info: { bg: 'rgba(0, 191, 255, 0.2)', border: 'rgba(0, 191, 255, 0.5)', text: '#00bfff' }
                    };

                    const color = colors[type] || colors.info;

                    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color.bg};
        border: 1px solid ${color.border};
        color: ${color.text};
        padding: 15px 20px;
        border-radius: 12px;
        backdrop-filter: blur(10px);
        z-index: 10000;
        animation: slideInRight 0.5s ease-out;
        max-width: 400px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        font-weight: 600;
    `;

                    notification.textContent = message;
                    document.body.appendChild(notification);

                    setTimeout(() => {
                        notification.style.animation = 'slideOutRight 0.5s ease-out';
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 500);
                    }, 4000);
                }

            // Enhanced tab switching with animations
            function switchTab(tabName) {
                futuristicUI.playUISound(600, 150);

                // Hide all tabs with fade out
                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.style.opacity = '0';
                    tab.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        tab.classList.remove('active');
                    }, 150);
                });

                // Remove active state from buttons
                document.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });

                // Show selected tab with fade in
                setTimeout(() => {
                    const targetTab = document.getElementById(tabName + '-tab');
                    targetTab.classList.add('active');
                    targetTab.style.opacity = '1';
                    targetTab.style.transform = 'translateY(0)';

                    // Find and activate the clicked button
                    document.querySelectorAll('.tab-btn').forEach(btn => {
                        if (btn.onclick && btn.onclick.toString().includes(tabName)) {
                            btn.classList.add('active');
                        }
                    });
                }, 150);
            }

            // Enhanced camera functions
            function startCamera() {
                futuristicUI.playUISound(800, 200);

                isCameraActive = true;
                document.getElementById('startCameraBtn').style.display = 'none';
                document.getElementById('stopCameraBtn').style.display = 'inline-flex';
                document.getElementById('cameraPlaceholder').style.display = 'none';
                document.getElementById('cameraStream').style.display = 'block';
                document.getElementById('liveDetections').classList.remove('hidden');

                // Add loading animation
                const cameraStream = document.getElementById('cameraStream');
                cameraStream.style.filter = 'blur(5px)';

                // Start camera API call
                fetch('/api/camera/start', { method: 'POST' })
                    .then(response => response.json())
                    .then(data => {
                        cameraStream.src = '/api/camera/stream?' + new Date().getTime();

                        // Remove blur when stream loads
                        cameraStream.onload = () => {
                            cameraStream.style.filter = 'none';
                        };

                        fetchCameraStats();
                        showNotification('🎥 Neural network camera initialized', 'success');
                    })
                    .catch(err => {
                        showNotification('❌ Camera initialization failed: ' + err.message, 'error');
                        stopCamera();
                    });
            }

            function stopCamera() {
                futuristicUI.playUISound(400, 200);

                isCameraActive = false;
                document.getElementById('startCameraBtn').style.display = 'inline-flex';
                document.getElementById('stopCameraBtn').style.display = 'none';
                document.getElementById('cameraPlaceholder').style.display = 'flex';
                document.getElementById('cameraStream').style.display = 'none';
                document.getElementById('liveDetections').classList.add('hidden');
                document.getElementById('cameraStream').src = '';

                fetch('/api/camera/stop', { method: 'POST' });

                if (cameraInterval) {
                    clearInterval(cameraInterval);
                }

                showNotification('⏹️ Camera feed terminated', 'info');
            }

            // Add CSS animations
            const style = document.createElement('style');
            style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(30px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        25% { transform: translateY(-10px) rotate(1deg); }
        50% { transform: translateY(-5px) rotate(-1deg); }
        75% { transform: translateY(-15px) rotate(0.5deg); }
    }
    
    .animate-in {
        animation: slideUp 0.8s ease-out;
    }
    
    .particle-container div {
        animation: float 8s linear infinite;
    }
`;
            document.head.appendChild(style);

            // Initialize on page load
            document.addEventListener('DOMContentLoaded', () => {
                showNotification('🚀 Traffic Speed Analyser initialized', 'success');

                // Add hover sound effects to buttons
                document.querySelectorAll('.btn').forEach(btn => {
                    btn.addEventListener('mouseenter', () => {
                        futuristicUI.playUISound(700, 50);
                    });
                });

                // Enhanced upload interactions
                const uploadArea = document.getElementById('uploadArea');
                const fileInput = document.getElementById('fileInput');

                if (uploadArea && fileInput) {
                    uploadArea.addEventListener('click', () => {
                        futuristicUI.playUISound(700, 100);
                        fileInput.click();
                    });

                    uploadArea.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        uploadArea.classList.add('dragover');
                        uploadArea.style.transform = 'scale(1.02)';
                    });

                    uploadArea.addEventListener('dragleave', () => {
                        uploadArea.classList.remove('dragover');
                        uploadArea.style.transform = 'scale(1)';
                    });

                    uploadArea.addEventListener('drop', (e) => {
                        e.preventDefault();
                        uploadArea.classList.remove('dragover');
                        uploadArea.style.transform = 'scale(1)';
                        futuristicUI.playUISound(900, 150);

                        if (e.dataTransfer.files.length > 0) {
                            handleFileUpload(e.dataTransfer.files[0]);
                        }
                    });

                    fileInput.addEventListener('change', (e) => {
                        if (e.target.files.length > 0) {
                            handleFileUpload(e.target.files[0]);
                        }
                    });
                }
            });

            // Enhanced file upload function
            function handleFileUpload(file) {
                const formData = new FormData();
                formData.append('file', file);

                // Show enhanced loading state
                showNotification(`🔄 Processing ${file.name} with AI neural network...`, 'info');
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
                            futuristicUI.playUISound(1000, 300);
                            showNotification('✅ AI analysis complete!', 'success');
                            displayUploadResults(data);
                        } else {
                            futuristicUI.playUISound(300, 500);
                            showError(data.error || 'Upload failed');
                        }
                    })
                    .catch(err => {
                        document.getElementById('uploadStatus').classList.add('hidden');
                        futuristicUI.playUISound(300, 500);
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

                // Enhanced result display with animations
                if (data.image) {
                    resultImage.innerHTML = `
            <img src="${data.image}" alt="AI Processed Result" 
                 style="animation: fadeIn 0.8s ease-out; border: 2px solid rgba(0, 191, 255, 0.3); box-shadow: 0 0 20px rgba(0, 191, 255, 0.2);">
        `;
                } else if (data.download_url) {
                    resultVideo.innerHTML = `
            <video width="100%" controls style="animation: fadeIn 0.8s ease-out; border: 2px solid rgba(0, 191, 255, 0.3);">
                <source src="${data.download_url}" type="video/mp4">
            </video>
        `;
                }

                // Enhanced detections display
                if (data.detections && data.detections.length > 0) {
                    let detectionsHtml = '<div style="animation: slideUp 0.6s ease-out;">';
                    let totalVehicles = 0;
                    let totalSpeed = 0;
                    let speedCount = 0;

                    if (Array.isArray(data.detections[0])) {
                        // Video processing
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

                        Object.entries(uniqueVehicles).forEach(([plate, speeds], index) => {
                            const avgSpeed = (speeds.reduce((a, b) => a + b, 0) / speeds.length).toFixed(2);
                            const maxSpeed = Math.max(...speeds).toFixed(2);
                            const minSpeed = Math.min(...speeds).toFixed(2);
                            const speedColor = avgSpeed < 60 ? '#00ff88' : avgSpeed < 90 ? '#ff9800' : '#ff4757';

                            detectionsHtml += `
                    <div class="detection-item-summary" style="animation-delay: ${index * 0.1}s; border-left-color: ${speedColor};">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #00bfff;">📍 ${plate}</strong><br/>
                                <span style="color: ${speedColor};">⚡ Avg: ${avgSpeed} km/h</span> | 
                                <span style="color: #00ff88;">🔺 Max: ${maxSpeed}</span> | 
                                <span style="color: #ff9800;">🔻 Min: ${minSpeed}</span>
                            </div>
                            <div style="color: ${speedColor}; font-size: 1.5em;">●</div>
                        </div>
                    </div>
                `;
                        });
                    } else {
                        // Image processing
                        data.detections.forEach((vehicle, index) => {
                            totalVehicles++;
                            totalSpeed += vehicle.speed;
                            speedCount++;

                            const speedColor = vehicle.speed < 60 ? '#00ff88' : vehicle.speed < 90 ? '#ff9800' : '#ff4757';
                            detectionsHtml += `
                    <div class="detection-item-summary" style="animation-delay: ${index * 0.1}s; border-left-color: ${speedColor};">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <strong style="color: #00bfff;">🚙 Vehicle ${vehicle.id}</strong><br/>
                                <span style="color: ${speedColor};">⚡ ${vehicle.speed} km/h</span> | 
                                <span style="color: #00ffff;">📍 ${vehicle.plate}</span> | 
                                <span style="color: #a0b4d8;">🎯 ${(vehicle.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div style="color: ${speedColor}; font-size: 1.5em;">●</div>
                        </div>
                    </div>
                `;
                        });
                    }

                    detectionsHtml += '</div>';
                    detectionsSummary.innerHTML = detectionsHtml;
                } else {
                    detectionsSummary.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #a0b4d8; animation: fadeIn 0.8s ease-out;">
                <div style="font-size: 3em; margin-bottom: 15px;">🔍</div>
                <p>No vehicles detected in neural network analysis</p>
                <p style="font-size: 0.9em; opacity: 0.7;">Try uploading a different image or video</p>
            </div>
        `;
                }

                // Enhanced download button
                if (data.download_url) {
                    detectionsSummary.innerHTML += `
            <a href="${data.download_url}" class="btn btn-secondary" 
               style="margin-top: 25px; text-decoration: none; animation: slideUp 0.8s ease-out;"
               onclick="futuristicUI.playUISound(800, 150);">
                ⬇️ Download Processed File
            </a>
        `;
                }

                document.getElementById('uploadResults').classList.remove('hidden');
            }

            function resetUpload() {
                futuristicUI.playUISound(600, 100);
                document.getElementById('uploadArea').style.display = 'block';
                document.getElementById('uploadResults').classList.add('hidden');
                document.getElementById('uploadStatus').classList.add('hidden');
                document.getElementById('fileInput').value = '';
            }

            function showError(message) {
                showNotification('❌ ' + message, 'error');

                const errorDiv = document.getElementById('errorMessage');
                if (errorDiv) {
                    errorDiv.textContent = message;
                    errorDiv.classList.remove('hidden');

                    setTimeout(() => {
                        errorDiv.classList.add('hidden');
                    }, 5000);
                }
            }