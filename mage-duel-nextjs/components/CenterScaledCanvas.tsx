'use client';

import { useEffect } from 'react';

// This component helps properly center and scale the Unity canvas
// specifically addressing iPhone notch/dynamic island issues
export default function CenterScaledCanvas() {
  useEffect(() => {
    const centerCanvas = () => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (!isIOS) return; // Only run on iOS devices
      
      const container = document.getElementById('unity-container');
      const canvas = document.getElementById('unity-canvas');
      if (!container || !canvas) return;
      
      // Check if in landscape mode
      const isLandscape = window.matchMedia('(orientation: landscape)').matches;
      if (!isLandscape) return;
      
      // Check if we have a notch
      const leftInset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--safe-area-inset-left') || '0');
      const rightInset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--safe-area-inset-right') || '0');
      
      // We're in landscape on iOS with a notch
      if (leftInset > 0 || rightInset > 0) {
        // Create and append position correction styles
        const style = document.createElement('style');
        style.id = 'center-canvas-fix';
        style.textContent = `
          #unity-container {
            position: fixed !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100vw !important;
            height: 100vh !important;
            padding: 0 !important;
            background-color: #000 !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
            margin: 0 !important;
          }
          
          #unity-canvas {
            position: absolute !important;
            /* For iPhones in landscape, we want to maintain aspect ratio but fill height */
            height: 100% !important;
            width: auto !important;
            min-width: 100% !important;
            display: block !important;
            /* Scale up slightly to avoid black edges */
            transform: scale(1.05) !important;
            left: 50% !important;
            top: 50% !important;
            transform-origin: center center !important;
            transform: translate(-50%, -50%) scale(1.05) !important;
          }
        `;
        
        // Remove any existing fix
        const existingStyle = document.getElementById('center-canvas-fix');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        document.head.appendChild(style);
      }
    };
    
    // Initial run
    centerCanvas();
    
    // Run on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(centerCanvas, 300);
    });
    
    // Run on resize
    window.addEventListener('resize', centerCanvas);
    
    return () => {
      window.removeEventListener('orientationchange', centerCanvas);
      window.removeEventListener('resize', centerCanvas);
    };
  }, []);
  
  return null;
}