/**
 * KACIREBONAN AR - MAIN JAVASCRIPT
 * Augmented Reality Web Application
 * Author: Your Name
 * Version: 1.0.0
 */

// ========================================
// GLOBAL VARIABLES & CONFIGURATION
// ========================================

let currentScale = 2;           // Current scale of 3D model in viewer
let arScale = 1;                // Current scale of 3D model in AR mode
let videoStream = null;         // Camera stream reference
let isDragging = false;         // Track drag state
let previousMouseX = 0;         // Previous mouse X position
let previousTouchX = 0;         // Previous touch X position

// Model configuration
const MODEL_CONFIG = {
    minScale: 0.5,
    maxScale: 5,
    defaultScale: 2,
    arMinScale: 0.3,
    arMaxScale: 3,
    arDefaultScale: 1,
    zoomStep: 0.3,
    arZoomStep: 0.2
};

// DOM Elements
const elements = {
    scene: document.querySelector('#scene'),
    model: document.querySelector('#model'),
    loading: document.getElementById('loading'),
    sceneContainer: document.getElementById('scene-container'),
    arMode: document.getElementById('ar-mode'),
    arVideo: document.getElementById('ar-video'),
    arModel: document.getElementById('ar-model'),
    arScene: document.getElementById('ar-scene')
};

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize application when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Kacirebonan AR initialized');
    initSceneLoader();
    initDragControls();
    initTouchControls();
    checkBrowserSupport();
});

/**
 * Hide loading indicator when 3D scene is ready
 */
function initSceneLoader() {
    if (elements.scene) {
        elements.scene.addEventListener('loaded', () => {
            console.log('✅ 3D Scene loaded successfully');
            hideLoading();
        });
    }
}

/**
 * Hide loading spinner
 */
function hideLoading() {
    if (elements.loading) {
        elements.loading.style.opacity = '0';
        setTimeout(() => {
            elements.loading.style.display = 'none';
        }, 300);
    }
}

/**
 * Check browser support for required features
 */
function checkBrowserSupport() {
    const hasWebGL = (() => {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    })();

    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);

    if (!hasWebGL) {
        console.warn('⚠️ WebGL not supported');
    }

    if (!hasGetUserMedia) {
        console.warn('⚠️ Camera access not supported');
    }

    console.log(`📊 Browser Support - WebGL: ${hasWebGL}, Camera: ${hasGetUserMedia}`);
}

// ========================================
// 3D VIEWER CONTROLS
// ========================================

/**
 * Reset 3D model to default position and scale
 */
function resetView() {
    if (!elements.model) return;

    currentScale = MODEL_CONFIG.defaultScale;
    elements.model.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
    elements.model.setAttribute('rotation', '0 0 0');
    elements.model.setAttribute('position', '0 0 -3');
    
    // Restart rotation animation
    elements.model.setAttribute('animation', 
        'property: rotation; to: 0 360 0; loop: true; dur: 20000; easing: linear');
    
    console.log('🔄 View reset');
}

/**
 * Zoom in on 3D model
 */
function zoomIn() {
    if (!elements.model) return;

    currentScale += MODEL_CONFIG.zoomStep;
    if (currentScale > MODEL_CONFIG.maxScale) {
        currentScale = MODEL_CONFIG.maxScale;
    }
    
    elements.model.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
    console.log(`🔍 Zoom in: ${currentScale.toFixed(2)}`);
}

/**
 * Zoom out on 3D model
 */
function zoomOut() {
    if (!elements.model) return;

    currentScale -= MODEL_CONFIG.zoomStep;
    if (currentScale < MODEL_CONFIG.minScale) {
        currentScale = MODEL_CONFIG.minScale;
    }
    
    elements.model.setAttribute('scale', `${currentScale} ${currentScale} ${currentScale}`);
    console.log(`🔎 Zoom out: ${currentScale.toFixed(2)}`);
}

// ========================================
// DRAG TO ROTATE CONTROLS
// ========================================

/**
 * Initialize mouse drag controls for desktop
 */
function initDragControls() {
    if (!elements.sceneContainer) return;

    elements.sceneContainer.addEventListener('mousedown', handleDragStart);
    elements.sceneContainer.addEventListener('mousemove', handleDragMove);
    elements.sceneContainer.addEventListener('mouseup', handleDragEnd);
    elements.sceneContainer.addEventListener('mouseleave', handleDragEnd);
}

/**
 * Handle drag start
 */
function handleDragStart(e) {
    isDragging = true;
    previousMouseX = e.clientX;
    elements.sceneContainer.style.cursor = 'grabbing';
}

/**
 * Handle drag move
 */
function handleDragMove(e) {
    if (!isDragging || !elements.model) return;

    const deltaX = e.clientX - previousMouseX;
    const currentRotation = elements.model.getAttribute('rotation');
    const newY = currentRotation.y + deltaX * 0.5;
    
    elements.model.setAttribute('rotation', `${currentRotation.x} ${newY} ${currentRotation.z}`);
    elements.model.removeAttribute('animation'); // Stop auto-rotation
    
    previousMouseX = e.clientX;
}

/**
 * Handle drag end
 */
function handleDragEnd() {
    isDragging = false;
    if (elements.sceneContainer) {
        elements.sceneContainer.style.cursor = 'grab';
    }
}

// ========================================
// TOUCH CONTROLS FOR MOBILE
// ========================================

/**
 * Initialize touch controls for mobile devices
 */
function initTouchControls() {
    if (!elements.sceneContainer) return;

    elements.sceneContainer.addEventListener('touchstart', handleTouchStart, { passive: false });
    elements.sceneContainer.addEventListener('touchmove', handleTouchMove, { passive: false });
    elements.sceneContainer.addEventListener('touchend', handleTouchEnd);
}

/**
 * Handle touch start
 */
function handleTouchStart(e) {
    isDragging = true;
    previousTouchX = e.touches[0].clientX;
}

/**
 * Handle touch move
 */
function handleTouchMove(e) {
    if (!isDragging || !elements.model) return;
    
    e.preventDefault(); // Prevent scrolling
    
    const deltaX = e.touches[0].clientX - previousTouchX;
    const currentRotation = elements.model.getAttribute('rotation');
    const newY = currentRotation.y + deltaX * 0.5;
    
    elements.model.setAttribute('rotation', `${currentRotation.x} ${newY} ${currentRotation.z}`);
    elements.model.removeAttribute('animation'); // Stop auto-rotation
    
    previousTouchX = e.touches[0].clientX;
}

/**
 * Handle touch end
 */
function handleTouchEnd() {
    isDragging = false;
}

// ========================================
// AR MODE FUNCTIONS
// ========================================

/**
 * Enter AR mode and activate camera
 */
async function enterAR() {
    console.log('📸 Entering AR mode...');

    try {
        // Check if HTTPS or localhost
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            showError('AR memerlukan HTTPS. Silakan akses melalui HTTPS atau localhost.');
            return;
        }

        // Request camera permission with environment-facing camera
        videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });

        // Set video source
        elements.arVideo.srcObject = videoStream;
        await elements.arVideo.play();

        // Show AR mode
        elements.arMode.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling

        console.log('✅ AR mode activated');

        // Show success message
        setTimeout(() => {
            updateAROverlay('✅ Kamera aktif! Objek 3D ditampilkan di tengah layar');
        }, 1000);

    } catch (error) {
        console.error('❌ AR Error:', error);
        handleARError(error);
    }
}

/**
 * Exit AR mode and stop camera
 */
function exitAR() {
    console.log('🚪 Exiting AR mode...');

    // Remove active class
    if (elements.arMode) {
        elements.arMode.classList.remove('active');
    }

    // Stop camera stream
    if (videoStream) {
        videoStream.getTracks().forEach(track => {
            track.stop();
            console.log('📷 Camera stopped');
        });
        videoStream = null;
    }

    // Clear video source
    if (elements.arVideo) {
        elements.arVideo.srcObject = null;
    }

    // Restore scrolling
    document.body.style.overflow = '';

    console.log('✅ AR mode closed');
}

/**
 * Handle AR errors with user-friendly messages
 */
function handleARError(error) {
    let errorMessage = '❌ Tidak dapat mengakses kamera.\n\n';

    switch (error.name) {
        case 'NotAllowedError':
            errorMessage += 'Anda menolak akses kamera. Silakan izinkan akses kamera di pengaturan browser.';
            break;
        case 'NotFoundError':
            errorMessage += 'Kamera tidak ditemukan di perangkat Anda.';
            break;
        case 'NotSupportedError':
            errorMessage += 'Browser Anda tidak mendukung akses kamera atau gunakan HTTPS.';
            break;
        case 'NotReadableError':
            errorMessage += 'Kamera sedang digunakan oleh aplikasi lain.';
            break;
        case 'OverconstrainedError':
            errorMessage += 'Pengaturan kamera tidak didukung oleh perangkat Anda.';
            break;
        case 'SecurityError':
            errorMessage += 'Akses kamera diblokir karena alasan keamanan. Gunakan HTTPS.';
            break;
        default:
            errorMessage += `Error: ${error.message}`;
    }

    showError(errorMessage);
}

/**
 * Update AR overlay text
 */
function updateAROverlay(message) {
    const overlay = document.querySelector('.ar-mode .absolute.top-5 p:last-child');
    if (overlay) {
        overlay.textContent = message;
    }
}

/**
 * Show error alert
 */
function showError(message) {
    alert(message);
}

// ========================================
// AR MODEL CONTROLS
// ========================================

/**
 * Zoom in on AR model
 */
function arZoomIn() {
    if (!elements.arModel) return;

    arScale += MODEL_CONFIG.arZoomStep;
    if (arScale > MODEL_CONFIG.arMaxScale) {
        arScale = MODEL_CONFIG.arMaxScale;
    }
    
    elements.arModel.setAttribute('scale', `${arScale} ${arScale} ${arScale}`);
    console.log(`🔍 AR Zoom in: ${arScale.toFixed(2)}`);
}

/**
 * Zoom out on AR model
 */
function arZoomOut() {
    if (!elements.arModel) return;

    arScale -= MODEL_CONFIG.arZoomStep;
    if (arScale < MODEL_CONFIG.arMinScale) {
        arScale = MODEL_CONFIG.arMinScale;
    }
    
    elements.arModel.setAttribute('scale', `${arScale} ${arScale} ${arScale}`);
    console.log(`🔎 AR Zoom out: ${arScale.toFixed(2)}`);
}

/**
 * Reset AR model to default position and scale
 */
function arReset() {
    if (!elements.arModel) return;

    arScale = MODEL_CONFIG.arDefaultScale;
    elements.arModel.setAttribute('scale', '1 1 1');
    elements.arModel.setAttribute('position', '0 0 -2');
    
    // Restart rotation animation
    elements.arModel.setAttribute('animation',
        'property: rotation; to: 0 360 0; loop: true; dur: 15000; easing: linear');
    
    console.log('🔄 AR View reset');
}

// ========================================
// CLEANUP & EVENT HANDLERS
// ========================================

/**
 * Clean up resources when page is unloaded
 */
window.addEventListener('beforeunload', () => {
    console.log('🧹 Cleaning up resources...');
    
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop());
    }
});

/**
 * Handle visibility change (tab switch)
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden && elements.arMode.classList.contains('active')) {
        console.log('👁️ Tab hidden, pausing AR...');
        // Optionally pause AR when tab is not visible
    } else if (!document.hidden && elements.arMode.classList.contains('active')) {
        console.log('👁️ Tab visible, resuming AR...');
    }
});

/**
 * Handle window resize
 */
window.addEventListener('resize', debounce(() => {
    console.log('📐 Window resized');
    // Add any resize logic here if needed
}, 250));

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Check if device is mobile
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Log device information
 */
console.log(`📱 Device: ${isMobile() ? 'Mobile' : 'Desktop'}`);
console.log(`🌐 Browser: ${navigator.userAgent}`);
console.log(`🔒 Protocol: ${location.protocol}`);

// ========================================
// EXPORT FUNCTIONS (for module usage)
// ========================================

// If using as module, export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        resetView,
        zoomIn,
        zoomOut,
        enterAR,
        exitAR,
        arZoomIn,
        arZoomOut,
        arReset
    };
}