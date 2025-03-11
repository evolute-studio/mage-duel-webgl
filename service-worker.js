const CACHE_NAME = 'com.evolute.mageduel-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './TemplateData/style.css',
  './TemplateData/favicon.ico',
  './Build/mageduel-webgl-1.1.2.data',
  './Build/mageduel-webgl-1.1.2.framework.js',
  './Build/mageduel-webgl-1.1.2.wasm',
  './Build/mageduel-webgl-1.1.2.loader.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 
