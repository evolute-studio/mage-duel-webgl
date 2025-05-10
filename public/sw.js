// This is the service worker with the Cache-first network strategy.

const CACHE = "mage-duel-pwa-cache-v7";
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
  // Skip cross-origin requests and non-GET requests
  if (
    !event.request.url.startsWith(self.location.origin) ||
    event.request.method !== "GET"
  ) {
    return;
  }

  // Handle the request
  event.respondWith(
    // Try the cache
    caches
      .match(event.request)
      .then((cachedResponse) => {
        // Return the cached response if we have it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise try the network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if response is not valid
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }

            // Clone the response to cache it and return the original
            const responseToCache = response.clone();
            caches
              .open(CACHE)
              .then((cache) => {
                cache
                  .put(event.request, responseToCache)
                  .catch((err) => console.error("Cache put error:", err));
              })
              .catch((err) => console.error("Cache open error:", err));

            return response;
          })
          .catch((error) => {
            console.error("Fetch error:", error);

            // Return the offline page for navigation requests
            if (event.request.mode === "navigate") {
              return caches.match("/offline.html").catch(() => {
                // If offline page is not cached, return a simple message
                return new Response(
                  "You are offline. Please check your internet connection.",
                  {
                    status: 503,
                    statusText: "Service Unavailable",
                    headers: new Headers({ "Content-Type": "text/html" }),
                  },
                );
              });
            }

            // Return a standard error message for other requests
            return new Response(
              "You are offline. Please check your internet connection.",
              {
                status: 503,
                statusText: "Service Unavailable",
                headers: new Headers({ "Content-Type": "text/plain" }),
              },
            );
          });
      })
      .catch((error) => {
        console.error("Cache match error:", error);
        return fetch(event.request).catch(() => {
          // If all else fails, return a simple offline message
          return new Response("Service worker error. Please reload the page.", {
            status: 500,
            headers: new Headers({ "Content-Type": "text/plain" }),
          });
        });
      }),
  );
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
