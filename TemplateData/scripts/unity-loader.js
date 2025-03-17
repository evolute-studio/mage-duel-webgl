// Unity Loader
class UnityLoader {
    static init(buildUrl, loaderUrl, config) {
        console.log('[UnityLoader] Initializing Unity loader...');
        
        this.buildUrl = buildUrl;
        this.loaderUrl = loaderUrl;
        this.config = config;
        this.canvas = document.querySelector("#unity-canvas");
        this.loadingBar = document.querySelector("#unity-loading-bar");
        this.fullscreenButton = document.querySelector("#unity-fullscreen-button");
        
        // Initialize flag to potentially stop Unity loading
        window.stopUnityLoading = false;
        window.gameInstance = null;
        
        console.log('[UnityLoader] Checking orientation before Unity loading');
        // Check orientation before loading Unity
        OrientationManager.checkOrientation();
        
        console.log('[UnityLoader] Unity loader initialized');
        return this;
    }
    
    static setupMobileDevice() {
        console.log('[UnityLoader] Setting up for device type...');
        
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            console.log('[UnityLoader] Mobile device detected, applying mobile settings');
            // Mobile device style: fill the whole browser client area with the game canvas
            const container = document.querySelector("#unity-container");
            
            var meta = document.createElement('meta');
            meta.name = 'viewport';
            meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
            document.getElementsByTagName('head')[0].appendChild(meta);
            container.className = "unity-mobile";
            this.canvas.className = "unity-mobile";

            // To lower canvas resolution on mobile devices to gain some
            // performance, uncomment the following line:
            // this.config.devicePixelRatio = 1;

        } else {
            console.log('[UnityLoader] Desktop device detected, applying desktop settings');
            // Desktop style: Render the game canvas in a window that can be maximized to fullscreen
            this.canvas.style.width = "1880px";
            this.canvas.style.height = "930px";
        }

        
        console.log('[UnityLoader] Showing loading bar');
        this.loadingBar.style.display = "block";
        
        console.log('[UnityLoader] Device setup complete');
    }
    
    static async loadUnity() {
        console.log('[UnityLoader] Starting Unity loading process...');
        
        try {
            // First load WASM module
            console.log('[UnityLoader] Loading WASM module...');
            await WasmLoader.loadDojoWasm();
            console.log('[UnityLoader] WASM module loaded successfully');
            
            // Then load Unity
            console.log('[UnityLoader] Starting Unity instance creation...');
            return new Promise((resolve, reject) => {
                // Only load Unity if we're not in portrait mode/incorrect aspect ratio
                if (window.stopUnityLoading) {
                    console.warn('[UnityLoader] Unity loading stopped due to portrait orientation');
                    reject("Unity loading stopped due to portrait orientation");
                    return;
                }
                
                console.log('[UnityLoader] Creating script element for Unity loader');
                const script = document.createElement("script");
                script.src = this.loaderUrl;
                
                const startTime = performance.now();
                
                script.onload = () => {
                    const loadTime = (performance.now() - startTime).toFixed(2);
                    console.log(`[UnityLoader] Unity loader script loaded in ${loadTime}ms`);
                    
                    // Check one more time before creating Unity instance
                    if (!window.stopUnityLoading) {
                        console.log('[UnityLoader] Creating Unity instance...');
                        const instanceStartTime = performance.now();
                        
                        createUnityInstance(this.canvas, this.config, (progress) => {
                            // Progress is still tracked but not visually displayed
                            console.log(`[UnityLoader] Loading progress: ${(100 * progress).toFixed(2)}%`);
                        }).then((unityInstance) => {
                            const instanceLoadTime = (performance.now() - instanceStartTime).toFixed(2);
                            console.log(`[UnityLoader] Unity instance created successfully in ${instanceLoadTime}ms`);
                            
                            window.gameInstance = unityInstance; // Make it accessible globally
                            console.log('[UnityLoader] Game instance stored globally');
                            
                            // Check orientation once the game is loaded
                            console.log('[UnityLoader] Checking orientation after game load');
                            OrientationManager.checkOrientation();
                            
                            
                            console.log('[UnityLoader] Setting up fullscreen button');
                            this.fullscreenButton.onclick = () => {
                                unityInstance.SetFullscreen(1);
                            };
                            
                            const totalLoadTime = (performance.now() - startTime).toFixed(2);
                            console.log(`[UnityLoader] Total Unity loading time: ${totalLoadTime}ms`);
                            
                            resolve(unityInstance);
                        }).catch((message) => {
                            console.error('[UnityLoader] Error creating Unity instance:', message);
                            alert(message);
                            reject(message);
                        });
                    } else {
                        console.warn('[UnityLoader] Unity loading stopped due to portrait orientation');
                        reject("Unity loading stopped due to portrait orientation");
                    }
                };
                
                script.onerror = (error) => {
                    console.error('[UnityLoader] Failed to load Unity script:', error);
                    reject("Failed to load Unity script: " + error);
                };
                
                console.log('[UnityLoader] Appending Unity loader script to document');
                document.body.appendChild(script);
            });
        } catch (error) {
            console.error('[UnityLoader] Error loading Unity:', error);
            throw error;
        }
    }
} 
