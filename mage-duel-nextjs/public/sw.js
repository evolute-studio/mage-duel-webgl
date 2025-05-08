// This is the service worker with the Cache-first network strategy.

const CACHE = "mage-duel-pwa-cache-v1";
const precacheResources = [
  "/",
  "/index.html",
  "/favicon.ico",
  "/icon-192x192.png",
  "/icon-512x512.png",
  "/offline.html",
  "/manifest.webmanifest",
  "/TemplateData/style.css",
  "/TemplateData/favicon.ico",
  "/TemplateData/fullscreen-button.png",
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", (event) => {
  console.log("Service worker installing...");
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(precacheResources)),
  );
});

// The activate handler takes care of cleaning up old caches.
self.addEventListener("activate", (event) => {
  console.log("Service worker activating...");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE;
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            }),
        );
      })
      .then(() => {
        return clients.claim();
      }),
  );
});

// The fetch handler serves responses from a cache.
// If no response is found, it fetches it from the network.
self.addEventListener("fetch", (event) => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((response) => {
            // Put a copy of the response in the cache if it's valid
            if (
              response &&
              response.status === 200 &&
              response.type === "basic"
            ) {
              const responseToCache = response.clone();
              caches.open(CACHE).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }

            return response;
          })
          .catch(() => {
            // Return the offline page if it's a navigation request
            if (event.request.mode === "navigate") {
              return caches.match("/offline.html");
            }

            // Otherwise return an error response
            return new Response(
              "You are offline. Please check your internet connection.",
              {
                status: 503,
                statusText: "Service Unavailable",
                headers: new Headers({
                  "Content-Type": "text/plain",
                }),
              },
            );
          });
      }),
    );
  }
});

// Message handler for additional control
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    console.log("Service worker received Skip_waiting command");
    self.skipWaiting();
  }
});

// Push notification handler
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/favicon.ico",
      badge: "/favicon.ico",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "1",
      },
    };

    event.waitUntil(
      self.registration.showNotification(data.title || "Mage Duel", options),
    );
  }
});

// Notification click handler
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        // If so, just focus it.
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    }),
  );
});
