"use client";

import { useEffect, useState } from "react";

export default function ServiceWorker() {
  // Handle Service Worker registration directly
  useEffect(() => {
    console.log("danil4");
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
    let refreshing = false;
    const controllerChangeHandler = () => {
      if (!refreshing) {
        refreshing = true;
        console.log("New Service Worker controller, refreshing page...");
        window.location.reload();
      }
    };

    // Setup message handler to clear localStorage and indexedDB
    const messageHandler = (event: MessageEvent) => {
      console.log("danil2");
      if (event.data && event.data.type === "CLEAR_STORAGE") {
        console.log("Received message to clear storage:", event.data.message);

        // Clear localStorage
        try {
          console.log("Clearing localStorage...");
          localStorage.clear();
          console.log("localStorage cleared successfully");

          // Set a flag to indicate we've processed storage clearing
          // This ensures we still reload if IndexedDB clearing doesn't execute
          localStorage.setItem("storage_cleared", "true");

          // Set a timeout to ensure page reloads even if IndexedDB operations fail
          setTimeout(() => {
            if (localStorage.getItem("storage_cleared") === "true") {
              console.log(
                "Fallback reload: IndexedDB operations may have stalled",
              );
              window.location.reload();
            }
          }, 3000); // 3 second timeout
        } catch (error) {
          console.error("Error clearing localStorage:", error);

          // Reload even if there was an error
          console.log("Reloading page despite localStorage clearing error...");
          setTimeout(() => window.location.reload(), 500);
        }

        // Clear all IndexedDB databases
        try {
          console.log("Clearing IndexedDB databases...");
          const clearIndexedDB = async () => {
            const databases = await window.indexedDB.databases();

            for (const db of databases) {
              if (db.name) {
                console.log(`Deleting IndexedDB database: ${db.name}`);
                await new Promise<void>((resolve, reject) => {
                  const request = window.indexedDB.deleteDatabase(db.name!);
                  request.onsuccess = () => {
                    console.log(
                      `Successfully deleted IndexedDB database: ${db.name}`,
                    );
                    resolve();
                  };
                  request.onerror = () => {
                    console.error(
                      `Error deleting IndexedDB database: ${db.name}`,
                    );
                    reject();
                  };
                });
              }
            }
            console.log("All IndexedDB databases cleared successfully");

            // Reload the page after clearing storage to ensure a clean state
            console.log("Reloading page to ensure clean state...");
            window.location.reload();
          };

          clearIndexedDB().catch((error) => {
            console.error("Error clearing IndexedDB databases:", error);
            // Still reload even if there was an error
            console.log("Reloading page despite IndexedDB clearing error...");
            window.location.reload();
          });
        } catch (error) {
          console.error("Error accessing IndexedDB:", error);
          // Reload even if there was an error accessing IndexedDB
          console.log("Reloading page despite IndexedDB access error...");
          window.location.reload();
        }
      }
    };

    console.log("danil");
    console.log(navigator.serviceWorker);

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      controllerChangeHandler,
    );
    navigator.serviceWorker.addEventListener("message", messageHandler);

    // Start the process
    checkExistingServiceWorker();

    // Cleanup
    return () => {
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        controllerChangeHandler,
      );
      navigator.serviceWorker.removeEventListener("message", messageHandler);
    };
  }, []);

  // Return null since this component doesn't render any UI
  return null;
}
