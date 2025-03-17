// Screen Orientation Manager
class OrientationManager {
    static init() {
        console.log('[OrientationManager] Initializing orientation manager...');
        
        // Check orientation when page loads and whenever window is resized
        console.log('[OrientationManager] Adding event listeners');
        window.addEventListener('load', () => {
            console.log('[OrientationManager] Window load event triggered');
            this.checkOrientation();
        });
        
        window.addEventListener('resize', () => {
            console.log('[OrientationManager] Window resize event triggered');
            this.checkOrientation();
        });

        // Reload the page when orientation changes
        window.addEventListener('orientationchange', function() {
            console.log('[OrientationManager] Orientation change detected');
            // Small delay to allow orientation to fully change before reloading
            setTimeout(function() {
                console.log('[OrientationManager] Reloading page after orientation change');
                window.location.reload();
            }, 100);
        });
        
        console.log('[OrientationManager] Orientation manager initialized');
    }

    // Function to check if the device is in portrait mode and if aspect ratio is below minimum
    static checkOrientation() {
        console.log('[OrientationManager] Checking device orientation...');
        
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            console.log('[OrientationManager] Mobile device detected');
            
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspectRatio = width / height;
            
            console.log(`[OrientationManager] Screen dimensions: ${width}x${height}, aspect ratio: ${aspectRatio.toFixed(2)}`);
            
            const portraitOverlay = document.getElementById('portrait-overlay');
            const unityContainer = document.getElementById('unity-container');
            const loadingBar = document.getElementById('unity-loading-bar');

            // Check if device is in portrait orientation or aspect ratio is less than 1.46
            if (height > width || aspectRatio < 1.46) {
                console.log('[OrientationManager] Portrait mode or insufficient aspect ratio detected');
                
                portraitOverlay.style.display = 'flex';
                // Hide the Unity container and loading bar to prevent game from loading behind overlay
                unityContainer.style.display = 'none';
                loadingBar.style.display = 'none';

                // If game instance exists, pause the game
                if (window.gameInstance) {
                    console.log('[OrientationManager] Pausing game due to portrait mode');
                    try {
                        window.gameInstance.SendMessage('GameManager', 'PauseGame');
                        console.log('[OrientationManager] Game paused successfully');
                    } catch (e) {
                        console.error('[OrientationManager] Could not pause game:', e);
                    }
                }

                // Stop loading the Unity instance if we're in portrait mode
                if (!window.gameInstance && !window.stopUnityLoading) {
                    console.log('[OrientationManager] Setting flag to stop Unity loading');
                    window.stopUnityLoading = true;
                }
            } else {
                console.log('[OrientationManager] Landscape mode detected');
                
                portraitOverlay.style.display = 'none';
                // Show the Unity container
                unityContainer.style.display = 'block';
                
                if (!window.gameInstance) {
                    loadingBar.style.display = 'block';
                }

                // If game loading was stopped and we still don't have a game instance, reload the page
                if (window.stopUnityLoading && !window.gameInstance) {
                    console.log('[OrientationManager] Reloading page to restart Unity loading');
                    window.location.reload();
                    return;
                }

                // If game instance exists, resume the game
                if (window.gameInstance) {
                    console.log('[OrientationManager] Resuming game in landscape mode');
                    try {
                        window.gameInstance.SendMessage('GameManager', 'ResumeGame');
                        console.log('[OrientationManager] Game resumed successfully');
                    } catch (e) {
                        console.error('[OrientationManager] Could not resume game:', e);
                    }
                }
            }
        } else {
            console.log('[OrientationManager] Desktop device detected, no orientation check needed');
        }
    }
} 
