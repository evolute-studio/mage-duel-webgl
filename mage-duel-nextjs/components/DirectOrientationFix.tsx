"use client";

import { useEffect } from "react";

export default function DirectOrientationFix() {
  useEffect(() => {
    // Add iOS specific viewport meta tag
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

    if (isIOS) {
      // Create viewport meta tag specifically for iOS
      const viewportMeta = document.createElement("meta");
      viewportMeta.name = "viewport";
      viewportMeta.content =
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover";
      document.head.appendChild(viewportMeta);

      // Add iOS specific CSS
      const iosCss = document.createElement("style");
      iosCss.textContent = `
        @supports (-webkit-touch-callout: none) {
          body, html {
            height: 100vh !important;
            width: 100vw !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: hidden !important;
            position: fixed !important;
          }
          
          #unity-container {
            width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
          }
          
          #unity-canvas {
            width: 100vw !important;
            height: 100vh !important;
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            object-fit: cover !important;
          }
        }
      `;
      document.head.appendChild(iosCss);
    }

    // Get DOM elements
    const portraitOverlay = document.getElementById("portrait-blocker");
    const gameContainer = document.getElementById("unity-container");
    const loadingOverlay = document.getElementById("game-loading-overlay");

    if (!portraitOverlay || !gameContainer) {
      console.error("Required DOM elements not found");
      return;
    }

    // Create loading overlay if it doesn't exist
    let loadingElement = loadingOverlay;
    if (!loadingElement) {
      loadingElement = document.createElement("div");
      loadingElement.id = "game-loading-overlay";
      loadingElement.className =
        "fixed top-0 left-0 w-full h-full z-[5000] flex flex-col justify-center items-center";
      loadingElement.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
      loadingElement.style.color = "white";
      loadingElement.style.display = "flex"; // Keep this for dynamic control

      // Add loader gif - twice as large
      const loaderImg = document.createElement("img");
      loaderImg.src = "/loader.gif";
      loaderImg.alt = "Loading";
      loaderImg.className =
        "w-[200px] h-[200px] absolute top-1/2 left-1/2 block";
      loaderImg.style.transform = "translate(-50%, -50%)";
      loaderImg.style.display = "block";

      // Create a styled wrapper for the loader
      const loaderWrapper = document.createElement("div");
      loaderWrapper.className =
        "flex justify-center items-center w-full h-full";

      // Append the loader to the wrapper then the wrapper to the loading element
      loaderWrapper.appendChild(loaderImg);
      loadingElement.appendChild(loaderWrapper);
      document.body.appendChild(loadingElement);
    }

    // Direct function to check orientation and update UI
    function updateOrientation() {
      const isLandscape = window.innerWidth > window.innerHeight;
      const gameLoaded =
        typeof window !== "undefined" && window.gameInstance !== undefined;

      if (isLandscape) {
        // In landscape mode
        portraitOverlay!.style.display = "none";
        gameContainer!.style.display = "block";

        // Make sure the container fills the entire screen
        gameContainer!.className =
          "fixed top-0 left-0 w-screen h-screen p-0 m-0 bg-black";
        gameContainer!.style.display = "block"; // Must set this directly as it's controlled by JS

        // Fix canvas size and positioning
        const canvas = document.getElementById("unity-canvas");
        if (canvas) {
          canvas.className = "fixed top-0 left-0 w-screen h-screen p-0 m-0";
          canvas.style.display = "block";
        }

        if (gameLoaded) {
          // Game is loaded
          loadingElement!.style.display = "none";
        } else {
          // Game is still loading
          loadingElement!.style.display = "flex";
        }
      } else {
        // In portrait mode
        portraitOverlay!.style.display = "flex";
        gameContainer!.style.display = "none";
        loadingElement!.style.display = "none";
      }
    }

    // Check for game loading periodically
    const checkForGameLoad = () => {
      if (typeof window !== "undefined" && window.gameInstance !== undefined) {
        updateOrientation();
      }
    };

    // Initial check
    updateOrientation();

    // Set up listeners
    window.addEventListener("resize", updateOrientation);
    window.addEventListener("orientationchange", () => {
      // Check multiple times to catch any delay
      setTimeout(updateOrientation, 100);
      setTimeout(updateOrientation, 500);
    });

    // Set up periodic checks
    const loadInterval = setInterval(checkForGameLoad, 500);
    const orientationInterval = setInterval(updateOrientation, 2000);

    // Clean up
    return () => {
      window.removeEventListener("resize", updateOrientation);
      window.removeEventListener("orientationchange", updateOrientation);
      clearInterval(loadInterval);
      clearInterval(orientationInterval);
    };
  }, []);

  return null;
}
