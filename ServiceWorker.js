const cacheName = "EvoluteStudio-Evolute Kingdom: Mage Duel-1.1.13";
const contentToCache = [
    "./",
    "index.html",
    "manifest.json",
    "Build/mageduel-webgl-1.1.13.loader.js",
    "Build/mageduel-webgl-1.1.13.framework.js",
    "Build/mageduel-webgl-1.1.13.data",
    "Build/mageduel-webgl-1.1.13.wasm",
    "TemplateData/style.css",
    "TemplateData/icons/icon-144x144.png",
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

self.addEventListener('activate', function(e) {
    console.log('[Service Worker] Activate');
    
    e.waitUntil((async function() {
        // Видаляємо всі старі кеші
        const keyList = await caches.keys();
        return Promise.all(keyList.map(function(key) {
            if (key !== cacheName) {
                console.log('[Service Worker] Removing old cache', key);
                return caches.delete(key);
            }
        }));
    })());
});

self.addEventListener('fetch', function (e) {
    // Перевіряємо, чи URL використовує підтримувану схему
    if (!e.request.url.startsWith('http')) {
        return;
    }

    e.respondWith((async function () {
        try {
            const normalizedUrl = new URL(e.request.url);
            
            // Завжди отримуємо свіжу версію основних файлів
            if (e.request.url.includes('Build/') || 
                e.request.url.endsWith('index.html') ||
                e.request.url.endsWith('manifest.json')) {
                try {
                    const response = await fetch(e.request);
                    const cache = await caches.open(cacheName);
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

            // Для інших ресурсів спочатку перевіряємо кеш
            let response = await caches.match(e.request);
            if (response) {
                return response;
            }

            // Якщо ресурс не знайдено в кеші, завантажуємо його
            response = await fetch(e.request);
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            const cache = await caches.open(cacheName);
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
