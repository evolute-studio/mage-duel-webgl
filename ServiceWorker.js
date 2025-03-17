const cacheName = "EvoluteStudio-Evolute Kingdom: Mage Duel-1.1.35";
// Add version to cache name for better control
const cacheVersion = '1.0.0';
const fullCacheName = `${cacheName}-${cacheVersion}`;

const contentToCache = [
    "./",
    "index.html",
    "manifest.json",
    "Build/mageduel-webgl-1.1.35.loader.js",
    "Build/mageduel-webgl-1.1.35.framework.js",
    "Build/mageduel-webgl-1.1.35.data",
    "Build/mageduel-webgl-1.1.35.wasm",
    "TemplateData/style.css",
    "TemplateData/icons/icon-144x144.png",
    "offline.html"
];

const OFFLINE_URL = 'offline.html';

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    // Force activate new Service Worker
    console.log('[Service Worker] Skipping waiting phase');
    self.skipWaiting();
    
    e.waitUntil((async function () {
      console.log('[Service Worker] Opening cache:', fullCacheName);
      const cache = await caches.open(fullCacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      try {
          await cache.addAll(contentToCache);
          console.log('[Service Worker] All content cached successfully');
      } catch (error) {
          console.error('[Service Worker] Error caching content:', error);
      }
    })());
});

self.addEventListener('activate', function(e) {
    console.log('[Service Worker] Activate');
    
    // Force take control of all clients
    console.log('[Service Worker] Taking control of all clients and cleaning old caches');
    e.waitUntil(
        Promise.all([
            self.clients.claim().then(() => {
                console.log('[Service Worker] Claimed all clients');
            }),
            // Remove all old caches
            caches.keys().then(function(keyList) {
                console.log('[Service Worker] Found caches:', keyList);
                return Promise.all(keyList.map(function(key) {
                    if (key !== fullCacheName) {
                        console.log('[Service Worker] Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            }).then(() => {
                console.log('[Service Worker] Old caches removed');
            })
        ])
    );
});

self.addEventListener('fetch', function (e) {
    // Check if URL uses supported scheme
    if (!e.request.url.startsWith('http')) {
        console.log(`[Service Worker] Ignoring non-HTTP request: ${e.request.url}`);
        return;
    }

    e.respondWith((async function () {
        try {
            const normalizedUrl = new URL(e.request.url);
            console.log(`[Service Worker] Fetch request for: ${normalizedUrl.pathname}`);
            
            // Always get fresh version of core files
            if (e.request.url.includes('Build/') || 
                e.request.url.endsWith('index.html') ||
                e.request.url.endsWith('manifest.json')) {
                console.log(`[Service Worker] Critical resource detected: ${e.request.url}`);
                try {
                    // Add cache-busting parameter to ensure we get a fresh version
                    const cacheBustUrl = new URL(e.request.url);
                    cacheBustUrl.searchParams.set('v', Date.now());
                    console.log(`[Service Worker] Using cache-busting URL: ${cacheBustUrl.href}`);
                    
                    console.log(`[Service Worker] Fetching fresh version of: ${normalizedUrl.pathname}`);
                    const fetchRequest = new Request(cacheBustUrl.href, {
                        cache: 'no-cache',
                        headers: e.request.headers,
                        mode: e.request.mode,
                        credentials: e.request.credentials,
                        redirect: e.request.redirect
                    });
                    
                    const response = await fetch(fetchRequest);
                    console.log(`[Service Worker] Fresh fetch response status: ${response.status} for ${e.request.url}`);
                    
                    if (response.ok) {
                        console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
                        const cache = await caches.open(fullCacheName);
                        cache.put(e.request, response.clone());
                    }
                    
                    return response;
                } catch (error) {
                    console.error(`[Service Worker] Fresh fetch failed: ${error}, trying cache`);
                    const cachedResponse = await caches.match(e.request);
                    if (cachedResponse) {
                        console.log(`[Service Worker] Returning cached version of: ${normalizedUrl.pathname}`);
                        return cachedResponse;
                    }
                    console.error(`[Service Worker] No cached version available for: ${normalizedUrl.pathname}`);
                    throw error;
                }
            }

            // For other resources, check cache first
            console.log(`[Service Worker] Checking cache for: ${e.request.url}`);
            let response = await caches.match(e.request);
            if (response) {
                console.log(`[Service Worker] Cache hit for: ${e.request.url}`);
                return response;
            }

            // If resource not found in cache, fetch it
            console.log(`[Service Worker] Cache miss for: ${normalizedUrl.pathname}, fetching`);
            response = await fetch(e.request);
            
            if (!response || response.status !== 200 || response.type !== 'basic') {
                console.log(`[Service Worker] Non-cacheable response for: ${normalizedUrl.pathname}, status: ${response ? response.status : 'no response'}`);
                return response;
            }

            console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
            const cache = await caches.open(fullCacheName);
            cache.put(e.request, response.clone());
            return response;

        } catch (error) {
            console.error(`[Service Worker] Error handling fetch: ${error}`);
            if (e.request.mode === 'navigate') {
                console.log(`[Service Worker] Navigation request failed, showing offline page`);
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
        console.log('[Service Worker] Received skip waiting message, activating immediately');
        self.skipWaiting();
    }
});
