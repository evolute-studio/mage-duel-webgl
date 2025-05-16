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
            console.log("Using existing Service Worker registration");
            // Store registration for future reference
            console.log("Registration stored for future use");

            // Setup update checking for the existing service worker
            const checkForUpdates = async () => {
              try {
                await existingRegistration.update();
                console.log("Service Worker update check completed");
              } catch (err) {
                console.error("Service Worker update check failed:", err);
              }
            };

            // Check for updates immediately and then every 60 seconds
            checkForUpdates();
            const updateInterval = setInterval(checkForUpdates, 60000);

            return () => clearInterval(updateInterval);
          }
        }

        // No active service worker found, register a new one
        registerServiceWorker();
      } catch (error) {
        console.error("Error checking service worker registration:", error);
        registerServiceWorker(); // Fallback to registering a new one
      }
    };

    // Register a new service worker
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });

        console.log(
          "Service Worker registered successfully with scope:",
          registration.scope,
        );
        console.log("Registration ready for use");

        // Handle new service worker installation
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            console.log("Service Worker state changed to:", newWorker.state);

            // When a new service worker is installed and ready
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              // Skip waiting to activate it immediately
              newWorker.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    // Setup controller change handler (for page refresh)

    function clearAllStorages() {
      // Clear localStorage
      try {
        console.log("Clearing localStorage...");
        localStorage.clear();
        console.log("localStorage cleared successfully");
      } catch (error) {
        console.error("Error clearing localStorage:", error);

        // Reload even if there was an error
        console.log("Reloading page despite localStorage clearing error...");
        setTimeout(() => window.location.reload(), 500);
      }

      // Clear all IndexedDB databases
      console.log("Clearing IndexedDB databases...");

      window.indexedDB
        .databases()
        .then((r) => {
          for (let i = 0; i < r.length; i++)
            window.indexedDB.deleteDatabase(r[i].name!);
        })
        .then(() => {
          console.log("All data cleared. RELOADING PAGE...");
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error clearing IndexedDB:", error);
          window.location.reload();
        });
    }

    let refreshing = false;
    const controllerChangeHandler = () => {
      if (!refreshing) {
        refreshing = true;
        console.log(
          "New Service Worker controller, clear storage and refreshing page...",
        );

        clearAllStorages();
      }
    };

    // navigator.serviceWorker.addEventListener(
    //   "controllerchange",
    //   controllerChangeHandler,
    // );

    // Start the process
    checkExistingServiceWorker();

    // Cleanup
    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        controllerChangeHandler,
      );
    };
  }, []);

  // Return null since this component doesn't render any UI
  return null;
}
