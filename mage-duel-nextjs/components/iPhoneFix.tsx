'use client';

import { useEffect } from 'react';

export default function IPhoneFix() {
  useEffect(() => {
    // Only run on iOS devices
    if (!/iPhone/.test(navigator.userAgent)) {
      return;
    }

    // Create and inject style directly
    const style = document.createElement('style');
    style.textContent = `
      body, html {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
        overflow: hidden !important;
        position: fixed !important;
        background-color: #000000 !important;
      }
      
      #unity-container {
        position: fixed !important;
        width: 100vw !important;
        height: 100vh !important;
        left: 0 !important;
        top: 0 !important;
        padding: 0 !important;
        margin: 0 !important;
        background-color: #000000 !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        overflow: hidden !important;
      }

      /* Force the canvas to fit the viewport while preserving aspect ratio */
      #unity-canvas {
        position: fixed !important;
        width: auto !important;
        height: 100vh !important;
        min-width: 100vw !important;
        top: 0 !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        margin: 0 !important;
        padding: 0 !important;
        object-fit: cover !important;
      }
    `;
    document.head.appendChild(style);

    // Add viewport meta tag with necessary properties
    function updateViewport() {
      // Remove existing viewport tags to avoid conflicts
      const existingMetas = document.querySelectorAll('meta[name="viewport"]');
      existingMetas.forEach(meta => meta.remove());

      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';
      document.head.appendChild(viewport);
    }

    // Apply fix on load and orientation change
    updateViewport();
    
    // Clean up safe area insets
    document.documentElement.style.setProperty('--safe-area-inset-left', '0px');
    document.documentElement.style.setProperty('--safe-area-inset-right', '0px');

    // Handle direct canvas resizing/positioning
    function fixCanvasPosition() {
      const canvas = document.getElementById('unity-canvas');
      if (canvas) {
        // Calculate and maintain proper aspect ratio
        const gameAspectRatio = 16 / 9; // Typical game aspect ratio
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const screenAspectRatio = screenWidth / screenHeight;
        
        if (screenAspectRatio > gameAspectRatio) {
          // Screen is wider than game aspect ratio
          canvas.style.width = 'auto';
          canvas.style.height = '100vh';
          canvas.style.minWidth = '100vw';
        } else {
          // Screen is taller than game aspect ratio
          canvas.style.width = '100vw';
          canvas.style.height = 'auto';
          canvas.style.minHeight = '100vh';
        }
        
        canvas.style.position = 'fixed';
        canvas.style.left = '50%';
        canvas.style.top = '50%';
        canvas.style.transform = 'translate(-50%, -50%)';
        canvas.style.objectFit = 'cover';
        
        // Force canvas to redraw at proper size
        const width = canvas.width;
        canvas.width = width + 1;
        setTimeout(() => {
          canvas.width = width;
        }, 0);
      }
    }

    // Apply fixes on load, resize and orientation change
    fixCanvasPosition();
    window.addEventListener('resize', fixCanvasPosition);
    window.addEventListener('orientationchange', () => {
      setTimeout(fixCanvasPosition, 300);
    });

    return () => {
      window.removeEventListener('resize', fixCanvasPosition);
      window.removeEventListener('orientationchange', fixCanvasPosition);
    };
  }, []);

  return null;
}