// #if USE_DATA_CACHING
const cacheName = "EvoluteStudio-Evolute Kingdom: Mage Duel-1.1.46";
const contentToCache = [
    "./",
    "index.html",
    "manifest.json",
    "Build/mageduel-webgl-1.1.46.loader.js",
    "Build/mageduel-webgl-1.1.46.framework.js",
// #if USE_THREADS
    "Build/",
// #endif
    "Build/mageduel-webgl-1.1.46.data",
    "Build/mageduel-webgl-1.1.46.wasm",
    "TemplateData/style.css",
    "TemplateData/icons/icon-144x144.png",
    "offline.html"
];

const OFFLINE_URL = 'offline.html';
// #endif

self.addEventListener('install', function (e) {
    console.log('[Service Worker] Install');
    
// #if USE_DATA_CACHING
    e.waitUntil((async function () {
      const cache = await caches.open(cacheName);
      console.log('[Service Worker] Caching all: app shell and content');
      await cache.addAll(contentToCache);
      
      // Примусово активуємо Service Worker після встановлення
      console.log('[Service Worker] Forcing activation after install');
      self.skipWaiting();
    })());
// #endif
});

// #if USE_DATA_CACHING
self.addEventListener('fetch', function (e) {
    // Перевіряємо, чи URL використовує підтримувану схему
    if (!e.request.url.startsWith('http')) {
        return;
    }

    e.respondWith((async function () {
        try {
            const normalizedUrl = new URL(e.request.url);
            // Перевіряємо, чи запит на manifest.webmanifest
            if (normalizedUrl.pathname.endsWith('manifest.webmanifest')) {
                const manifestResponse = await caches.match('manifest.json');
                if (manifestResponse) {
                    return manifestResponse;
                }
            }

            let response = await caches.match(e.request);
            console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
            
            if (response) {
                return response;
            }

            try {
                response = await fetch(e.request);
                
                // Перевіряємо, чи відповідь валідна
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

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
// #endif

// Додаємо обробник повідомлень для примусового оновлення
self.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'skipWaiting') {
        console.log('[Service Worker] Received skipWaiting message, activating immediately');
        self.skipWaiting();
    }
});

// Модифікуємо обробник activate
self.addEventListener('activate', function(event) {
    console.log('[Service Worker] Activate event');
    
    event.waitUntil(
        caches.keys().then(function(keyList) {
            console.log('[Service Worker] Checking caches to clean up:', keyList);
            
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key).then(function(success) {
                        console.log(`[Service Worker] Cache '${key}' ${success ? 'deleted' : 'deletion failed'}`);
                        return success;
                    });
                }
            }));
        }).then(function() {
            console.log('[Service Worker] Claiming clients');
            return self.clients.claim();
        })
    );
});
