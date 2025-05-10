'use client';

import { useEffect, useState } from 'react';

export default function ServiceWorker() {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    // Handle Service Worker registration directly
    useEffect(() => {
        if (scriptLoaded || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        // Check if service worker is already registered and active
        const checkExistingServiceWorker = async () => {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                
                if (registrations.length > 0) {
                    const existingRegistration = registrations.find(reg => 
                        reg.active && reg.active.scriptURL.includes('/sw.js')
                    );
                    
                    if (existingRegistration) {
                        console.log('Using existing Service Worker registration');
                        // Store registration for future reference
                        console.log('Registration stored for future use');
                        
                        // Setup update checking for the existing service worker
                        const checkForUpdates = async () => {
                            try {
                                await existingRegistration.update();
                                console.log('Service Worker update check completed');
                            } catch (err) {
                                console.error('Service Worker update check failed:', err);
                            }
                        };
                        
                        // Check for updates immediately and then every 60 seconds
                        checkForUpdates();
                        const updateInterval = setInterval(checkForUpdates, 60000);
                        
                        return () => clearInterval(updateInterval);
                    }
                }
                
                // No active service worker found, register a new one
                registerServiceWorker();
            } catch (error) {
                console.error('Error checking service worker registration:', error);
                registerServiceWorker(); // Fallback to registering a new one
            }
        };
        
        // Register a new service worker
        const registerServiceWorker = async () => {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                
                console.log('Service Worker registered successfully with scope:', registration.scope);
                console.log('Registration ready for use');
                
                // Handle new service worker installation
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;
                    
                    newWorker.addEventListener('statechange', () => {
                        console.log('Service Worker state changed to:', newWorker.state);
                        
                        // When a new service worker is installed and ready
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Skip waiting to activate it immediately
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        };
        
        // Setup controller change handler (for page refresh)
        let refreshing = false;
        const controllerChangeHandler = () => {
            if (!refreshing) {
                refreshing = true;
                console.log('New Service Worker controller, refreshing page...');
                window.location.reload();
            }
        };
        
        navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);
        
        // Start the process
        checkExistingServiceWorker();
        setScriptLoaded(true);
        
        // Cleanup
        return () => {
            navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler);
        };
    }, [scriptLoaded]);

    // Return null since this component doesn't render any UI
    return null;
}
