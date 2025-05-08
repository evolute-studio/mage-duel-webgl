'use client';

import { useState, useEffect } from 'react';
import styles from '../app/globals.css';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true) {
      setIsInstalled(true);
    }
    
    // Check if device is iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // For non-iOS devices, listen for install prompt
    if (!ios) {
      const handler = (e: BeforeInstallPromptEvent) => {
        e.preventDefault();
        setInstallPrompt(e);
      };
      
      window.addEventListener('beforeinstallprompt', handler as any);
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handler as any);
      };
    }
  }, []);

  // Function to show install prompt
  const handleInstallClick = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    } else if (isIOS) {
      setShowIOSInstructions(true);
    }
  };

  if (isInstalled) {
    return null; // Don't show anything if already installed
  }

  return (
    <div className="pwa-install-container">
      {isIOS ? (
        <div className="ios-install-container">
          <button onClick={() => setShowIOSInstructions(!showIOSInstructions)} className="install-button">
            Install App
          </button>
          
          {showIOSInstructions && (
            <div className="ios-instructions">
              <p>To install this app on your iOS device:</p>
              <ol>
                <li>Tap the Share button <span>⎋</span> in Safari</li>
                <li>Scroll down and tap "Add to Home Screen" <span>➕</span></li>
                <li>Tap "Add" in the top right</li>
              </ol>
              <button onClick={() => setShowIOSInstructions(false)}>Close</button>
            </div>
          )}
        </div>
      ) : installPrompt ? (
        <button onClick={handleInstallClick} className="install-button">
          Install App
        </button>
      ) : null}
      
      <style jsx>{`
        .pwa-install-container {
          position: fixed;
          bottom: 16px;
          right: 16px;
          z-index: 1000;
        }
        
        .install-button {
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 10px 20px;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .install-button:hover {
          background-color: #0060df;
          transform: translateY(-2px);
        }
        
        .ios-instructions {
          position: absolute;
          bottom: 50px;
          right: 0;
          width: 280px;
          background-color: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .ios-instructions p {
          margin-top: 0;
          font-weight: bold;
        }
        
        .ios-instructions ol {
          padding-left: 20px;
          margin-bottom: 12px;
        }
        
        .ios-instructions button {
          background-color: #f0f0f0;
          border: none;
          border-radius: 4px;
          padding: 6px 10px;
          cursor: pointer;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}