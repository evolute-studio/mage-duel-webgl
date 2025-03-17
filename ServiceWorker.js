const cacheName = "EvoluteStudio-Evolute Kingdom: Mage Duel-1.1.32";
// Add version to cache name for better control
const cacheVersion = '1.0.0';
const fullCacheName = `${cacheName}-${cacheVersion}`;

const contentToCache = [
    "./",
    "index.html",
    "manifest.json",
    "Build/mageduel-webgl-1.1.32.loader.js",
    "Build/mageduel-webgl-1.1.32.framework.js",
    "Build/mageduel-webgl-1.1.32.data",
    "Build/mageduel-webgl-1.1.32.wasm",
    "TemplateData/style.css",
    "TemplateData/icons/icon-144x144.png",
    "offline.html"
];

const OFFLINE_URL = 'offline.html';

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    // Force activate new Service Worker
    self.skipWaiting();
    
    e.waitUntil((async function () {
      const cache = await caches.open(fullCacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('activate', function(e) {
    console.log('[Service Worker] Activate');
    
    // Force take control of all clients
    e.waitUntil(
        Promise.all([
            self.clients.claim(),
            // Remove all old caches
            caches.keys().then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    if (key !== fullCacheName) {
                        console.log('[Service Worker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
        ])
    );
});

self.addEventListener('fetch', function (e) {
    // Check if URL uses supported scheme
    if (!e.request.url.startsWith('http')) {
        return;
    }

    e.respondWith((async function () {
        try {
            const normalizedUrl = new URL(e.request.url);
            
            // Always get fresh version of core files
            if (e.request.url.includes('Build/') || 
                e.request.url.endsWith('index.html') ||
                e.request.url.endsWith('manifest.json')) {
                try {
                    const response = await fetch(e.request);
                    const cache = await caches.open(fullCacheName);
                    console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
                    cache.put(e.request, response.clone());
                    return response;
                } catch (error) {
                    const cachedResponse = await caches.match(e.request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    throw error;
                }
            }

            // For other resources, check cache first
            let response = await caches.match(e.request);
            if (response) {
                return response;
            }

            // If resource not found in cache, fetch it
            response = await fetch(e.request);
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            const cache = await caches.open(fullCacheName);
            console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            cache.put(e.request, response.clone());
            return response;

        } catch (error) {
            console.log('[Service Worker] Error:', error);
            if (e.request.mode === 'navigate') {
                const offlineResponse = await caches.match(OFFLINE_URL);
                if (offlineResponse) {
                    return offlineResponse;
                }
            }
            return new Response('Offline page not found', {
                status: 404,
                statusText: 'Not Found'
            });
        }
    })());
});

// Add message handler for forced activation
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
