// Service Worker Manager
class ServiceWorkerManager {
    static async init() {
        console.log('[ServiceWorkerManager] Starting initialization...');
        if ("serviceWorker" in navigator) {
            try {
                console.log('[ServiceWorkerManager] Browser supports Service Workers');
                
                // Function to unregister all Service Workers
                console.log('[ServiceWorkerManager] Unregistering old Service Workers...');
                const unregisteredCount = await this.unregisterOldWorkers();
                console.log(`[ServiceWorkerManager] Unregistered ${unregisteredCount} old Service Workers`);
                
                // Register new Service Worker and wait for activation
                console.log('[ServiceWorkerManager] Registering new Service Worker...');
                const registration = await navigator.serviceWorker.register("ServiceWorker.js", {
                    updateViaCache: 'none'
                });
                console.log('[ServiceWorkerManager] Service Worker registered successfully');
                
                // Force update and activation
                console.log('[ServiceWorkerManager] Forcing update check...');
                await registration.update();
                console.log('[ServiceWorkerManager] Update check completed');
                
                // Wait for Service Worker to activate
                if (registration.installing) {
                    console.log('[ServiceWorkerManager] Service Worker is installing...');
                    return new Promise((resolve) => {
                        registration.installing.addEventListener('statechange', (e) => {
                            console.log(`[ServiceWorkerManager] Service Worker state changed to: ${e.target.state}`);
                            if (e.target.state === 'activated') {
                                console.log('[ServiceWorkerManager] Service Worker activated');
                                resolve();
                            }
                        });
                    });
                } else if (registration.waiting) {
                    console.log('[ServiceWorkerManager] Service Worker waiting for activation');
                    // Force activate Service Worker
                    console.log('[ServiceWorkerManager] Sending SKIP_WAITING message');
                    registration.waiting.postMessage({type: 'SKIP_WAITING'});
                    
                    return new Promise((resolve) => {
                        // Set a timeout to ensure we don't wait forever
                        const timeoutId = setTimeout(() => {
                            console.warn('[ServiceWorkerManager] Activation timeout, continuing anyway');
                            resolve();
                        }, 3000);
                        
                        navigator.serviceWorker.addEventListener('controllerchange', () => {
                            clearTimeout(timeoutId);
                            console.log('[ServiceWorkerManager] Controller changed, Service Worker activated');
                            resolve();
                        }, {once: true});
                    });
                } else if (registration.active) {
                    console.log('[ServiceWorkerManager] Service Worker already active');
                    
                    // Check if it's controlling this page
                    if (navigator.serviceWorker.controller) {
                        console.log('[ServiceWorkerManager] Service Worker is controlling this page');
                    } else {
                        console.log('[ServiceWorkerManager] Service Worker is not controlling this page, forcing reload');
                        window.location.reload();
                        return new Promise((resolve) => {
                            // This will never resolve as we're reloading the page
                        });
                    }
                    
                    return Promise.resolve();
                }
                
                return Promise.resolve();
            } catch (error) {
                console.error('[ServiceWorkerManager] Service worker registration failed:', error);
                return Promise.resolve(); // Continue loading even on error
            }
        } else {
            console.warn('[ServiceWorkerManager] Browser does not support Service Workers');
        }
        return Promise.resolve(); // If Service Worker is not supported
    }
    
    static async unregisterOldWorkers() {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log(`[ServiceWorkerManager] Found ${registrations.length} existing Service Worker registrations`);
        
        let count = 0;
        await Promise.all(registrations.map(async registration => {
            try {
                const result = await registration.unregister();
                if (result) count++;
                console.log(`[ServiceWorkerManager] Unregistered Service Worker: ${result}`);
            } catch (e) {
                console.error('[ServiceWorkerManager] Error unregistering Service Worker:', e);
            }
        }));
        
        return count;
    }
    
    // Method for preloading resources
    static async preloadResources() {
        console.log('[ServiceWorkerManager] Starting resource preloading...');
        
        const resourcesToPreload = [
            "Build/mageduel-webgl-1.1.35.loader.js",
            "Build/mageduel-webgl-1.1.35.framework.js",
            "Build/mageduel-webgl-1.1.35.data",
            "Build/mageduel-webgl-1.1.35.wasm",
            "TemplateData/dojo.js/dojo_c.js",
            "TemplateData/dojo.js/dojo_c_bg.wasm"
        ];
        
        console.log(`[ServiceWorkerManager] Preloading ${resourcesToPreload.length} resources...`);
        
        let successCount = 0;
        let failCount = 0;
        
        const preloadPromises = resourcesToPreload.map(url => {
            console.log(`[ServiceWorkerManager] Starting preload of: ${url}`);
            return new Promise((resolve, reject) => {
                const startTime = performance.now();
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'blob'; // Use blob to ensure full download
                xhr.onload = () => {
                    const duration = (performance.now() - startTime).toFixed(2);
                    if (xhr.status >= 200 && xhr.status < 300) {
                        successCount++;
                        console.log(`[ServiceWorkerManager] Resource ${url} loaded successfully in ${duration}ms (size: ${xhr.response.size} bytes)`);
                        resolve();
                    } else {
                        failCount++;
                        console.warn(`[ServiceWorkerManager] Failed to load ${url}: ${xhr.status} in ${duration}ms`);
                        resolve(); // Continue even on error
                    }
                };
                xhr.onerror = () => {
                    failCount++;
                    const duration = (performance.now() - startTime).toFixed(2);
                    console.warn(`[ServiceWorkerManager] Error loading ${url} after ${duration}ms`);
                    resolve(); // Continue even on error
                };
                xhr.send();
            });
        });
        
        await Promise.all(preloadPromises);
        console.log(`[ServiceWorkerManager] Preloading complete. Success: ${successCount}, Failed: ${failCount}`);
        
        return { successCount, failCount };
    }
} 
