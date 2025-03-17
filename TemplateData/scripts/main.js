// Main initialization script
document.addEventListener("DOMContentLoaded", async function() {
    try {
        // Initialize orientation manager
        OrientationManager.init();
        
        // Show loading bar
        const loadingBar = document.querySelector("#unity-loading-bar");
        loadingBar.style.display = "block";
        
        // First initialize and wait for Service Worker activation
        console.log('Initializing Service Worker...');
        await ServiceWorkerManager.init();
        
        // Preload resources
        console.log('Preloading resources...');
        await ServiceWorkerManager.preloadResources();
        
        // Configure Unity Loader
        const buildUrl = "Build";
        const loaderUrl = buildUrl + "/mageduel-webgl-1.1.32.loader.js";
        const config = {
            dataUrl: buildUrl + "/mageduel-webgl-1.1.32.data",
            frameworkUrl: buildUrl + "/mageduel-webgl-1.1.32.framework.js",
            codeUrl: buildUrl + "/mageduel-webgl-1.1.32.wasm",
            streamingAssetsUrl: "StreamingAssets",
            companyName: "EvoluteStudio",
            productName: "Evolute Kingdom: Mage Duel",
            productVersion: "1.1.32",
            showBanner: function unityShowBanner(msg, type) {
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
        console.log('Initializing Unity Loader...');
        const unityLoader = UnityLoader.init(buildUrl, loaderUrl, config);
        
        // Setup for mobile devices
        unityLoader.setupMobileDevice();
        
        // Load Unity
        console.log('Loading Unity...');
        await unityLoader.loadUnity()
            .then(instance => {
                console.log("Unity loaded successfully");
            })
            .catch(error => {
                console.error("Failed to load Unity:", error);
            });
    } catch (error) {
        console.error("Critical error during initialization:", error);
    }
}); 
