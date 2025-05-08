'use client';

import { useEffect } from 'react';

export default function FullscreenHelper() {
  useEffect(() => {
    // Function to handle iOS fullscreen
    const handleIOSFullscreen = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        // Center the unity container for iOS
        const style = document.createElement('style');
        style.textContent = `
          body {
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 0;
            overflow: hidden;
            position: fixed;
            background-color: #000000;
          }
          
          #unity-container {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            border: none !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            overflow: hidden !important;
            background-color: #000000 !important;
          }
          
          #unity-canvas {
            position: absolute !important;
            width: auto !important;
            height: 100% !important;
            min-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            object-fit: contain !important;
            background-color: #000000 !important;
          }
          
          /* iPhone landscape specific adjustments */
          @media screen and (orientation: landscape) {
            body {
              /* Adjust for notch on the left */
              padding-left: env(safe-area-inset-left);
              padding-right: env(safe-area-inset-right);
            }
            
            #unity-container {
              /* Fill area but respect safe zones */
              width: calc(100% - env(safe-area-inset-left) - env(safe-area-inset-right)) !important;
              left: env(safe-area-inset-left) !important;
            }
            
            /* Ensure the canvas itself stretches */
            #unity-canvas {
              transform: scale(1.05) !important; /* Slight overscaling to avoid black edges */
            }
          }
        `;
        document.head.appendChild(style);
        
        // Force viewport size recalculation and center the content
        const recalculateViewport = () => {
          window.scrollTo(0, 0);
          document.body.style.height = window.innerHeight + 'px';
          
          // Find unity container and canvas
          const container = document.getElementById('unity-container');
          const canvas = document.getElementById('unity-canvas');
          
          if (container && canvas) {
            // For landscape orientation on iPhone, ensure we center properly
            if (window.orientation === 90 || window.orientation === -90) {
              // Calculate any adjustments needed for the notch area
              const leftInset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-left') || '0');
              
              // Apply manual adjustments if needed
              if (leftInset > 0) {
                canvas.style.marginLeft = `${leftInset}px`;
              }
            }
          }
        };
        
        // Run initial calculation
        setTimeout(recalculateViewport, 100);
        
        // Rerun on orientation change
        window.addEventListener('orientationchange', () => {
          setTimeout(recalculateViewport, 200);
        });
        
        // Rerun on resize
        window.addEventListener('resize', recalculateViewport);
      }
    };

    // Set a timeout to ensure DOM is fully loaded 
    const timeoutId = setTimeout(handleIOSFullscreen, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  return null;
}