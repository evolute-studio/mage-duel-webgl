'use client';

import { useEffect } from 'react';

export default function DirectOrientationFix() {
  useEffect(() => {
    // Add iOS specific viewport meta tag
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
      // Create viewport meta tag specifically for iOS
      const viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(viewportMeta);
      
      // Add iOS specific CSS
      const iosCss = document.createElement('style');
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
    const portraitOverlay = document.getElementById('portrait-blocker');
    const gameContainer = document.getElementById('unity-container');
    const loadingOverlay = document.getElementById('game-loading-overlay');
    
    if (!portraitOverlay || !gameContainer) {
      console.error("Required DOM elements not found");
      return;
    }
    
    // Create loading overlay if it doesn't exist
    let loadingElement = loadingOverlay;
    if (!loadingElement) {
      loadingElement = document.createElement('div');
      loadingElement.id = 'game-loading-overlay';
      loadingElement.style.position = 'fixed';
      loadingElement.style.top = '0';
      loadingElement.style.left = '0';
      loadingElement.style.width = '100%';
      loadingElement.style.height = '100%';
      loadingElement.style.backgroundColor = 'rgba(0,0,0,0.9)';
      loadingElement.style.zIndex = '5000';
      loadingElement.style.display = 'flex';
      loadingElement.style.flexDirection = 'column';
      loadingElement.style.justifyContent = 'center';
      loadingElement.style.alignItems = 'center';
      loadingElement.style.color = 'white';
      
      // Add loader gif - twice as large
      const loaderImg = document.createElement('img');
      loaderImg.src = '/loader.gif';
      loaderImg.alt = 'Loading';
      loaderImg.style.width = '200px';
      loaderImg.style.height = '200px';
      loaderImg.style.position = 'absolute';
      loaderImg.style.top = '50%';
      loaderImg.style.left = '50%';
      loaderImg.style.transform = 'translate(-50%, -50%)';
      loaderImg.style.display = 'block';
      
      // Append only the loader image
      loadingElement.appendChild(loaderImg);
      document.body.appendChild(loadingElement);
    }
    
    // Direct function to check orientation and update UI
    function updateOrientation() {
      const isLandscape = window.innerWidth > window.innerHeight;
      const gameLoaded = typeof window !== 'undefined' && window.gameInstance !== undefined;
      
      console.log(`Orientation check: landscape=${isLandscape}, gameLoaded=${gameLoaded}, 
                 screenW=${window.innerWidth}, screenH=${window.innerHeight}`);
      
      if (isLandscape) {
        // In landscape mode
        portraitOverlay.style.display = 'none';
        gameContainer.style.display = 'block';
        
        // Make sure the container fills the entire screen
        gameContainer.style.width = '100vw';
        gameContainer.style.height = '100vh';
        gameContainer.style.position = 'fixed';
        gameContainer.style.top = '0';
        gameContainer.style.left = '0';
        gameContainer.style.padding = '0';
        gameContainer.style.margin = '0';
        gameContainer.style.backgroundColor = '#000000';
        gameContainer.style.display = 'block'; // Must set this directly as it's controlled by JS
        
        // Fix canvas size and positioning
        const canvas = document.getElementById('unity-canvas');
        if (canvas) {
          canvas.style.width = '100vw';
          canvas.style.height = '100vh';
          canvas.style.position = 'fixed';
          canvas.style.top = '0';
          canvas.style.left = '0';
          canvas.style.padding = '0';
          canvas.style.margin = '0';
          canvas.style.display = 'block';
        }
        
        if (gameLoaded) {
          // Game is loaded
          loadingElement.style.display = 'none';
        } else {
          // Game is still loading
          loadingElement.style.display = 'flex';
        }
      } else {
        // In portrait mode
        portraitOverlay.style.display = 'flex';
        gameContainer.style.display = 'none';
        loadingElement.style.display = 'none';
      }
    }
    
    // Check for game loading periodically
    const checkForGameLoad = () => {
      if (typeof window !== 'undefined' && window.gameInstance !== undefined) {
        updateOrientation();
      }
    };
    
    // Initial check
    updateOrientation();
    
    // Set up listeners
    window.addEventListener('resize', updateOrientation);
    window.addEventListener('orientationchange', () => {
      // Check multiple times to catch any delay
      setTimeout(updateOrientation, 100);
      setTimeout(updateOrientation, 500);
    });
    
    // Set up periodic checks
    const loadInterval = setInterval(checkForGameLoad, 500);
    const orientationInterval = setInterval(updateOrientation, 2000);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', updateOrientation);
      window.removeEventListener('orientationchange', updateOrientation);
      clearInterval(loadInterval);
      clearInterval(orientationInterval);
    };
  }, []);

  return null;
}