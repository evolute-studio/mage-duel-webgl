"use client";

import { useEffect } from "react";

export default function ServiceWorker() {
  // Handle Service Worker registration directly
  useEffect(() => {
    console.log(navigator.serviceWorker);
    if (!("serviceWorker" in navigator)) {
      return;
    }

    // Check if service worker is already registered and active
    const checkExistingServiceWorker = async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();

        if (registrations.length > 0) {
          const existingRegistration = registrations.find(
            (reg) => reg.active && reg.active.scriptURL.includes("/sw.js"),
          );

          if (existingRegistration) {
            const registrations =
              await navigator.serviceWorker.getRegistrations(); // array of ServiceWorkerRegistration
            await Promise.all(
              registrations.map((reg) => reg.unregister()), // returns Boolean for each registration
            );

            if ("caches" in window) {
              const cacheNames = await caches.keys(); // array of cache-name strings
              await Promise.all(
                cacheNames.map((name) => caches.delete(name)), // Boolean for each deletion
              );
            }
          }
        }
      } catch (error) {
        console.error("Error checking service worker registration:", error);
      }
    };

    checkExistingServiceWorker();

    return () => {};
  }, []);

  // Return null since this component doesn't render any UI
  return null;
}
