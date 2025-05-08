'use client';

import { useState, useEffect } from 'react';

export default function OfflineNotification() {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine);

    // Add event listeners for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Clean up
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="offline-notification">
      <div className="offline-content">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
        <p>You are currently offline. Some features may be unavailable.</p>
      </div>
      
      <style jsx>{`
        .offline-notification {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background-color: #ff5252;
          color: white;
          text-align: center;
          padding: 8px 16px;
          z-index: 9999;
          display: flex;
          justify-content: center;
        }
        
        .offline-content {
          display: flex;
          align-items: center;
          gap: 10px;
          max-width: 600px;
        }
        
        p {
          margin: 0;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
}