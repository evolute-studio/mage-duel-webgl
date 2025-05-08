'use client';

import { useEffect } from 'react';

export default function IOSSafeArea() {
  useEffect(() => {
    // Function to get CSS variable values from environment 
    const getCSSEnvironmentVariable = (variable: string) => {
      // Create a test element to measure the environment variable
      const testElement = document.createElement('div');
      testElement.style.padding = `env(${variable})`;
      document.body.appendChild(testElement);
      
      // Get the computed style and extract the value
      const computedStyle = getComputedStyle(testElement);
      const value = computedStyle.paddingTop;
      
      // Clean up
      document.body.removeChild(testElement);
      
      return value !== '0px' ? value : '0px';
    };

    // Extract safe area insets as CSS variables
    const updateSafeAreaVariables = () => {
      const safeAreaTop = getCSSEnvironmentVariable('safe-area-inset-top');
      const safeAreaRight = getCSSEnvironmentVariable('safe-area-inset-right');
      const safeAreaBottom = getCSSEnvironmentVariable('safe-area-inset-bottom');
      const safeAreaLeft = getCSSEnvironmentVariable('safe-area-inset-left');
      
      // Set CSS variables that can be used throughout the app
      document.documentElement.style.setProperty('--safe-area-inset-top', safeAreaTop);
      document.documentElement.style.setProperty('--safe-area-inset-right', safeAreaRight);
      document.documentElement.style.setProperty('--safe-area-inset-bottom', safeAreaBottom);
      document.documentElement.style.setProperty('--safe-area-inset-left', safeAreaLeft);
    };
    
    // Run once on mount
    updateSafeAreaVariables();
    
    // Update on orientation change
    window.addEventListener('orientationchange', () => {
      // Delay to ensure the browser has updated environment variables
      setTimeout(updateSafeAreaVariables, 300);
    });
    
    // Update on resize
    window.addEventListener('resize', updateSafeAreaVariables);
    
    return () => {
      window.removeEventListener('orientationchange', updateSafeAreaVariables);
      window.removeEventListener('resize', updateSafeAreaVariables);
    };
  }, []);
  
  return null;
}