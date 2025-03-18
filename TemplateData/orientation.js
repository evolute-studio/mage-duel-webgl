// Function to check if the device is in portrait mode and if aspect ratio is below minimum
function checkOrientation() {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        const aspectRatio = window.innerWidth / window.innerHeight;
        const portraitOverlay = document.getElementById('portrait-overlay');
        const unityContainer = document.getElementById('unity-container');
        const loadingBar = document.getElementById('unity-loading-bar');

        // Check if device is in portrait orientation or aspect ratio is less than 1.46
        if (window.innerHeight > window.innerWidth || aspectRatio < 1.46) {
            portraitOverlay.style.display = 'flex';
            unityContainer.style.display = 'none';
            loadingBar.style.display = 'none';

            if (window.gameInstance) {
                try {
                    window.gameInstance.SendMessage('GameManager', 'PauseGame');
                } catch (e) {
                    console.log('Could not pause game');
                }
            }

            if (!window.gameInstance && window.stopUnityLoading) {
                window.stopUnityLoading = true;
            }
        } else {
            portraitOverlay.style.display = 'none';
            unityContainer.style.display = 'block';

            if (window.stopUnityLoading && !window.gameInstance) {
                window.location.reload();
                return;
            }

            if (window.gameInstance) {
                try {
                    window.gameInstance.SendMessage('GameManager', 'ResumeGame');
                } catch (e) {
                    console.log('Could not resume game');
                }
            }
        }
    }
}

// Check orientation when page loads and whenever window is resized
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);

// Reload the page when orientation changes
window.addEventListener('orientationchange', function() {
    // Small delay to allow orientation to fully change before reloading
    setTimeout(function() {
        window.location.reload();
    }, 100);
}); 
