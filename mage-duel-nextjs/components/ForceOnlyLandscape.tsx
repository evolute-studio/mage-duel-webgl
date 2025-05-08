'use client';

import { useEffect, useState } from 'react';

export default function ForceOnlyLandscape() {
  const [isLandscape, setIsLandscape] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    // Function to check if game instance is loaded
    const checkGameLoaded = () => {
      return typeof window !== 'undefined' && 
             window.gameInstance !== undefined;
    };

    // Function to check if we're in landscape mode
    const checkOrientation = () => {
      // Use multiple methods to detect landscape mode more reliably
      const mediaQueryMatch = window.matchMedia("(orientation: landscape)").matches;
      const dimensionCheck = window.innerWidth > window.innerHeight;
      const orientationCheck = window.orientation === 90 || window.orientation === -90;
      
      // For most reliability, use dimension check as primary method
      const isLandscapeNow = dimensionCheck; // window.innerWidth > window.innerHeight
      
      console.log("Orientation check:", { 
        mediaQueryMatch, 
        dimensionCheck, 
        orientationCheck, 
        isLandscapeNow
      });
      
      setIsLandscape(isLandscapeNow);
      
      // Also check if game is loaded
      setGameLoaded(checkGameLoaded());
      
      // Get elements
      const portraitOverlay = document.getElementById('portrait-blocker');
      const gameContainer = document.getElementById('unity-container');
      const loadingOverlay = document.getElementById('game-loading-overlay');
      
      if (portraitOverlay && gameContainer && loadingOverlay) {
        if (isLandscapeNow) {
          // In landscape mode - always show the container
          portraitOverlay.style.display = 'none';
          gameContainer.style.display = 'block';
          
          // Game hasn't loaded yet, show the loading inside the container
          const isLoaded = checkGameLoaded();
          setGameLoaded(isLoaded);
          
          if (!isLoaded) {
            // Keep game container visible but show the loader on top
            loadingOverlay.style.display = 'flex';
            // Set the z-index high to show on top of the Unity canvas
            loadingOverlay.style.zIndex = '3000'; 
            // Force portrait overlay to be hidden
            portraitOverlay.style.display = 'none';
          } else {
            // Game loaded, hide both loaders
            loadingOverlay.style.display = 'none';
            portraitOverlay.style.display = 'none';
          }
        } else {
          // In portrait mode - hide game and loading, show portrait overlay
          portraitOverlay.style.display = 'flex';
          gameContainer.style.display = 'none';
          loadingOverlay.style.display = 'none';
        }
      }
    };
    
    // Check orientation initially
    checkOrientation();
    
    // Listen for orientation changes with multiple retries
    const handleOrientationChange = () => {
      // Check multiple times to ensure we catch the change
      setTimeout(checkOrientation, 50);
      setTimeout(checkOrientation, 250);
      setTimeout(checkOrientation, 500);
      setTimeout(checkOrientation, 1000);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    
    // Also recheck on resize with some delay to let the browser settle
    window.addEventListener('resize', () => {
      setTimeout(checkOrientation, 50);
    });
    
    // Force check on initial load
    checkOrientation();
    setTimeout(checkOrientation, 500);
    
    // Check for game loading periodically
    const gameLoadInterval = setInterval(() => {
      const isLoaded = checkGameLoaded();
      
      if (isLoaded) {
        setGameLoaded(true);
        // Always hide the loading overlay when game is loaded
        const loadingOverlay = document.getElementById('game-loading-overlay');
        const portraitOverlay = document.getElementById('portrait-blocker');
        
        if (loadingOverlay) {
          loadingOverlay.style.display = 'none';
        }
        
        // Force recheck to ensure correct display
        const isLandscapeNow = window.innerWidth > window.innerHeight;
        
        // If we're in landscape, make sure the portrait blocker is hidden
        if (isLandscapeNow && portraitOverlay) {
          portraitOverlay.style.display = 'none';
        }
        
        clearInterval(gameLoadInterval);
      }
    }, 500);
    
    // Clean up interval after 2 minutes (game should load by then)
    setTimeout(() => clearInterval(gameLoadInterval), 120000);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', () => setTimeout(checkOrientation, 50));
      clearInterval(gameLoadInterval);
    };
  }, [isLandscape]); // Re-run effect when landscape state changes

  return (
    <>
      {/* Portrait mode blocker */}
      <div 
        id="portrait-blocker" 
        style={{
          display: isLandscape ? 'none' : 'flex',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#000',
          zIndex: 1500,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          textAlign: 'center',
          padding: '20px'
        }}
      >
        <div style={{ marginBottom: '20px' }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <g transform="rotate(90, 50, 50)">
              <rect x="35" y="10" width="30" height="60" rx="5" fill="white" />
              <circle cx="50" cy="80" r="5" fill="white" />
              <path d="M25,50 L10,40 L10,60 L25,50" fill="white" />
            </g>
          </svg>
        </div>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Rotate Your Device</h2>
        <p style={{ margin: '0', fontSize: '16px' }}>
          This app only works in landscape mode. Please rotate your device.
        </p>
      </div>
      
      {/* Loading overlay */}
      <div 
        id="game-loading-overlay"
        style={{
          display: (isLandscape && !gameLoaded) ? 'flex' : 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          zIndex: 2000,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            border: '6px solid rgba(255,255,255,0.2)', 
            borderTop: '6px solid white', 
            animation: 'spin 1s linear infinite',
            marginBottom: '10px'
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @keyframes pulse {
              0% { opacity: 0.6; }
              50% { opacity: 1; }
              100% { opacity: 0.6; }
            }
          `}</style>
        </div>
        <h2 style={{ 
          margin: '0 0 15px 0', 
          fontSize: '28px',
          animation: 'pulse 2s infinite ease-in-out'
        }}>Loading Game</h2>
        <p style={{ 
          margin: '0', 
          fontSize: '18px',
          maxWidth: '80%',
          opacity: 0.8
        }}>
          Please wait while the game initializes...
        </p>
      </div>
    </>
  );
}