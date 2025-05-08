'use client';

import { useEffect } from 'react';

export default function FixUnityDisplay() {
  useEffect(() => {
    // Simple fix to make canvas fill the viewport on iOS
    const applySimpleFix = () => {
      const canvas = document.getElementById('unity-canvas');
      const container = document.getElementById('unity-container');
      
      if (!canvas || !container) return;
      
      // Simple, straightforward approach for maximum viewport usage
      const style = document.createElement('style');
      style.textContent = `
        body, html {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          position: fixed;
          background-color: #000;
        }
        
        #unity-container {
          position: fixed !important;
          width: 100% !important;
          height: 100% !important;
          left: 0 !important;
          top: 0 !important;
          background-color: #000;
        }
        
        #unity-canvas {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          display: block !important;
        }
      `;
      
      // Remove any existing style
      const existingStyle = document.getElementById('unity-display-fix');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      style.id = 'unity-display-fix';
      document.head.appendChild(style);
      
      // Apply direct styles
      if (container) {
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.position = 'fixed';
        container.style.left = '0';
        container.style.top = '0';
      }
      
      if (canvas) {
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.position = 'fixed';
        canvas.style.left = '0';
        canvas.style.top = '0';
      }
    };
    
    // Wait for DOM to be ready
    setTimeout(applySimpleFix, 100);
    
    // Update on orientation change with longer delay
    const handleOrientationChange = () => {
      // Apply fixes multiple times after orientation change to ensure they stick
      setTimeout(applySimpleFix, 100);
      setTimeout(applySimpleFix, 500);
      setTimeout(applySimpleFix, 1000);
      setTimeout(applySimpleFix, 1500);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', applySimpleFix);
    
    // Also run when game instance is initialized
    window.addEventListener('gameLoaded', applySimpleFix);
    
    // Game loads async, need to check periodically
    const checkInterval = setInterval(() => {
      const canvas = document.getElementById('unity-canvas');
      if (canvas) {
        applySimpleFix();
      }
    }, 1000);
    
    // Clear after 10 seconds since game should be loaded by then
    setTimeout(() => {
      clearInterval(checkInterval);
    }, 10000);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', applySimpleFix);
      clearInterval(checkInterval);
    };
  }, []);
  
  return null;
}