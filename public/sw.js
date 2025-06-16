// This is the service worker with the Cache-first network strategy.

const CACHE = "mage-duel-pwa-cache-v1410v1";

const precacheResources = [
  "/",
  "/favicon.ico",
  "/icon-72.png",
  "/icon-128.png",
  "/icon-144.png",
  "/icon-192.png",
  "/icon-512.png",
  "/offline.html",
  "/manifest.webmanifest",
  "/TemplateData/style.css",
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener("install", (event) => {
  console.log("Service worker installing...");
  self.skipWaiting();

  event.waitUntil(
    Promise.all([
      // Cache resources
      caches.open(CACHE).then((cache) => {
        // Use individual cache.add calls instead of cache.addAll to prevent a single failure from aborting all caches
        const cachePromises = precacheResources.map((resource) => {
          return cache.add(resource).catch((error) => {
            console.error("Failed to cache resource:", resource, error);
            // Continue with the installation even if some resources fail to cache
            return Promise.resolve();
          });
        });

        return Promise.all(cachePromises);
      }),
    ]),
  );
});

// The activate handler takes care of cleaning up old caches and unregistering itself
self.addEventListener("activate", (event) => {
  console.log("Service worker activating and unregistering...");

  event.waitUntil(
    Promise.all([
      // Delete all caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName);
          }),
        );
      }),
      // Unregister this service worker
      self.registration.unregister(),
    ]),
  );
});

// The fetch handler serves responses from the network only
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
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
