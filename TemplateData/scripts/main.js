// Main initialization script
document.addEventListener("DOMContentLoaded", async function() {
    console.log('[Main] DOM content loaded, starting initialization...');
    
    const startTime = performance.now();
    
    try {
        // Initialize orientation manager
        console.log('[Main] Initializing orientation manager...');
        OrientationManager.init();
        
        // Show loading bar
        console.log('[Main] Showing loading bar...');
        const loadingBar = document.querySelector("#unity-loading-bar");
        loadingBar.style.display = "block";
        
        // First initialize and wait for Service Worker activation
        console.log('[Main] Starting Service Worker initialization...');
        const swStartTime = performance.now();
        
        try {
            await ServiceWorkerManager.init();
            const swTime = (performance.now() - swStartTime).toFixed(2);
            console.log(`[Main] Service Worker initialization completed in ${swTime}ms`);
        } catch (error) {
            console.error('[Main] Service Worker initialization failed, continuing anyway:', error);
        }
        
        // Preload resources
        console.log('[Main] Starting resource preloading...');
        const preloadStartTime = performance.now();
        let preloadResult;
        
        try {
            preloadResult = await ServiceWorkerManager.preloadResources();
            const preloadTime = (performance.now() - preloadStartTime).toFixed(2);
            console.log(`[Main] Resource preloading completed in ${preloadTime}ms. Success: ${preloadResult.successCount}, Failed: ${preloadResult.failCount}`);
        } catch (error) {
            console.error('[Main] Resource preloading failed, continuing anyway:', error);
            preloadResult = { successCount: 0, failCount: 0 };
        }
        
        // Configure Unity Loader
        console.log('[Main] Configuring Unity Loader...');
        const buildUrl = "Build";
        const loaderUrl = buildUrl + "/mageduel-webgl-1.1.35.loader.js";
        console.log(`[Main] Unity loader URL: ${loaderUrl}`);
        
        const config = {
            dataUrl: buildUrl + "/mageduel-webgl-1.1.35.data",
            frameworkUrl: buildUrl + "/mageduel-webgl-1.1.35.framework.js",
            codeUrl: buildUrl + "/mageduel-webgl-1.1.35.wasm",
            streamingAssetsUrl: "StreamingAssets",
            companyName: "EvoluteStudio",
            productName: "Evolute Kingdom: Mage Duel",
            productVersion: "1.1.35",
            showBanner: function unityShowBanner(msg, type) {
                console.log(`[Main] Unity banner message: ${type} - ${msg}`);
                const warningBanner = document.querySelector("#unity-warning");
                
                function updateBannerVisibility() {
                    warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
                }
                
                var div = document.createElement('div');
                div.innerHTML = msg;
                warningBanner.appendChild(div);
                
                if (type == 'error') div.style = 'background: red; padding: 10px;';
                else {
                    if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
                    setTimeout(function() {
                        warningBanner.removeChild(div);
                        updateBannerVisibility();
                    }, 5000);
                }
                
                updateBannerVisibility();
            }
        };
        
        // Initialize Unity Loader
        console.log('[Main] Initializing Unity Loader...');
        const unityLoader = UnityLoader.init(buildUrl, loaderUrl, config);
        
        // Setup for mobile devices
        console.log('[Main] Setting up for mobile devices...');
        unityLoader.setupMobileDevice();
        
        // Load Unity
        console.log('[Main] Starting Unity loading...');
        const unityStartTime = performance.now();
        
        try {
            const instance = await unityLoader.loadUnity();
            const unityLoadTime = (performance.now() - unityStartTime).toFixed(2);
            console.log(`[Main] Unity loaded successfully in ${unityLoadTime}ms`);
            
            const totalTime = (performance.now() - startTime).toFixed(2);
            console.log(`[Main] Total initialization time: ${totalTime}ms`);
        } catch (error) {
            console.error('[Main] Failed to load Unity:', error);
            
            // Check if this was due to orientation
            if (error.includes && error.includes('portrait orientation')) {
                console.log('[Main] Unity loading was stopped due to device orientation');
            } else {
                // Show error to user
                const warningBanner = document.querySelector("#unity-warning");
                var div = document.createElement('div');
                div.innerHTML = `Failed to load game: ${error}`;
                div.style = 'background: red; padding: 10px;';
                warningBanner.appendChild(div);
                warningBanner.style.display = 'block';
            }
        }
    } catch (error) {
        console.error('[Main] Critical error during initialization:', error);
        
        // Show critical error to user
        const warningBanner = document.querySelector("#unity-warning");
        var div = document.createElement('div');
        div.innerHTML = `Critical error: ${error}`;
        div.style = 'background: red; padding: 10px;';
        warningBanner.appendChild(div);
        warningBanner.style.display = 'block';
    }
}); 
