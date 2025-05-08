'use client';

import { useEffect, useState } from 'react';

export default function AspectRatioFix() {
  // Store aspect ratio information
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    ratio: 0
  });

  useEffect(() => {
    // Function to detect the actual game aspect ratio from the canvas
    const detectGameAspectRatio = () => {
      const canvas = document.getElementById('unity-canvas') as HTMLCanvasElement;
      if (!canvas) return false;
      
      // Try to get the natural dimensions if available
      if (canvas.naturalWidth && canvas.naturalHeight) {
        return canvas.naturalWidth / canvas.naturalHeight;
      }
      
      // Otherwise use a default 16:9 ratio
      return 16 / 9;
    };

    // Function to apply the appropriate scaling
    const applyScaling = () => {
      const canvas = document.getElementById('unity-canvas') as HTMLCanvasElement;
      const container = document.getElementById('unity-container');
      if (!canvas || !container) return;
      
      // Get the screen dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const viewportRatio = viewportWidth / viewportHeight;
      
      // Attempt to detect the game's aspect ratio
      const gameAspectRatio = detectGameAspectRatio() || 16/9;
      
      // Update state
      setDimensions({
        width: viewportWidth,
        height: viewportHeight,
        ratio: viewportRatio
      });
      
      // Apply the appropriate scaling approach
      if (viewportRatio >= gameAspectRatio) {
        // Viewport is wider than game - use height as constraint
        const scaledWidth = viewportHeight * gameAspectRatio;
        
        // Apply CSS for center scaling
        canvas.style.position = 'absolute';
        canvas.style.width = `${scaledWidth}px`;
        canvas.style.height = '100vh';
        canvas.style.left = `${(viewportWidth - scaledWidth) / 2}px`;
        canvas.style.top = '0';
        canvas.style.transform = 'none';
        
        // If on iPhone, make sure we're at least filling the width
        if (/iPhone/.test(navigator.userAgent)) {
          // Check if the game would have black bars on the sides
          if (scaledWidth < viewportWidth) {
            // Instead, make it slightly oversized and centered
            canvas.style.width = `${viewportWidth}px`;
            canvas.style.height = `${viewportWidth / gameAspectRatio}px`;
            canvas.style.left = '0';
            canvas.style.top = `${(viewportHeight - (viewportWidth / gameAspectRatio)) / 2}px`;
          }
        }
      } else {
        // Viewport is taller than game - use width as constraint
        const scaledHeight = viewportWidth / gameAspectRatio;
        
        canvas.style.position = 'absolute';
        canvas.style.width = '100vw';
        canvas.style.height = `${scaledHeight}px`;
        canvas.style.left = '0';
        canvas.style.top = `${(viewportHeight - scaledHeight) / 2}px`;
        canvas.style.transform = 'none';
      }
      
      // Make sure container is properly sized and positioned
      container.style.width = '100vw';
      container.style.height = '100vh';
      container.style.overflow = 'hidden';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.padding = '0';
      container.style.margin = '0';
    };
    
    // Apply on load and any resize/orientation change
    const handleResize = () => {
      setTimeout(applyScaling, 100);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', () => {
      setTimeout(handleResize, 300);
    });
    
    // Initial application
    setTimeout(applyScaling, 500);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return null;
}