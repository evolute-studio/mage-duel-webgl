const cacheName = "EvoluteStudio-com.evolute.mageduel-1.1.3";
const contentToCache = [
    "Build/mageduel-webgl-1.1.3.loader.js",
    "Build/mageduel-webgl-1.1.3.framework.js",
    "Build/mageduel-webgl-1.1.3.data",
    "Build/mageduel-webgl-1.1.3.wasm",
    "TemplateData/style.css",
    "offline.html"
];

const OFFLINE_URL = 'offline.html';

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
    })());
});

self.addEventListener('fetch', function (e) {
    e.respondWith((async function () {
        try {
            let response = await caches.match(e.request);
            console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
            
            if (response) {
                return response;
            }

            try {
                response = await fetch(e.request);
                const cache = await caches.open(cacheName);
                console.log(`[Service Worker] Caching new resource: ${e.request.url}`);
                cache.put(e.request, response.clone());
                return response;
            } catch (error) {
                // Якщо запит не вдався (офлайн), показуємо офлайн сторінку для навігаційних запитів
                if (e.request.mode === 'navigate') {
                    const offlineResponse = await caches.match(OFFLINE_URL);
                    if (offlineResponse) {
                        return offlineResponse;
                    }
                }
                throw error;
            }
        } catch (error) {
            console.log('[Service Worker] Error:', error);
            return new Response('Offline page not found', {
                status: 404,
                statusText: 'Not Found'
            });
        }
    })());
});
