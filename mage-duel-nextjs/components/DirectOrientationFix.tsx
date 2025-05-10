"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

const IOSViewportScript = () => (
  <Script id="ios-viewport-fix" strategy="afterInteractive">
    {`
      if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
        // Add viewport meta tag
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        document.head.appendChild(meta);
        
        // Add iOS specific CSS
        const style = document.createElement('style');
        style.textContent = \`
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
        \`;
        document.head.appendChild(style);
      }
    `}
  </Script>
);

const LoadingOverlay = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;
  
  return (
    <div 
      id="game-loading-overlay"
      className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-black/90 text-white"
    >
      <div className="flex h-full w-full items-center justify-center">
        <img 
          src="/loader.gif" 
          alt="Loading" 
          className="absolute left-1/2 top-1/2 block h-[35vh] w-auto -translate-x-1/2 -translate-y-1/2"
        />
      </div>
    </div>
  );
};

export default function DirectOrientationFix() {
  const [isIOS, setIsIOS] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    // Detect iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
    
    // Initial orientation check
    setIsLandscape(window.innerWidth > window.innerHeight);

    // Check if game is already loaded
    if (typeof window !== "undefined" && window.gameInstance !== undefined) {
      setGameLoaded(true);
    }

    // Function to check orientation
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    // Function to handle orientation change with multiple checks
    const handleOrientationChange = () => {
      setTimeout(checkOrientation, 100);
      setTimeout(checkOrientation, 500);
    };

    // Check for game loading periodically
    const loadInterval = setInterval(() => {
      if (typeof window !== "undefined" && window.gameInstance !== undefined) {
        setGameLoaded(true);
      }
    }, 500);

    // Set up orientation listeners
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", handleOrientationChange);
      clearInterval(loadInterval);
    };
  }, []);

  // Update UI elements when state changes
  useEffect(() => {
    const portraitOverlay = document.getElementById("portrait-blocker");
    const gameContainer = document.getElementById("unity-container");
    
    if (!portraitOverlay || !gameContainer) {
      console.error("Required DOM elements not found");
      return;
    }

    if (isLandscape) {
      // Landscape mode - show game, hide overlay
      portraitOverlay.style.display = "none";
      gameContainer.style.display = "block";

      const canvas = document.getElementById("unity-canvas");
      if (canvas) {
        canvas.style.display = "block";
      }

      // Check if game is loaded to hide loading overlay
      const loadingOverlay = document.getElementById("game-loading-overlay");
      if (loadingOverlay && gameLoaded) {
        loadingOverlay.style.display = "none";
      }
    } else {
      // Portrait mode - show overlay, hide game
      portraitOverlay.style.display = "flex";
      gameContainer.style.display = "none";
      
      // Hide loading overlay in portrait mode
      const loadingOverlay = document.getElementById("game-loading-overlay");
      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
      }
    }
  }, [isLandscape, gameLoaded]);

  return (
    <>
      {isIOS && <IOSViewportScript />}
      <LoadingOverlay isVisible={isLandscape && !gameLoaded} />
    </>
  );
}
