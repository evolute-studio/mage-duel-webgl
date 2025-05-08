// Service Worker Registration Script
(function() {
    'use strict';
    
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            // Register the service worker
            navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            }).then(function(registration) {
                console.log('Service Worker registered successfully with scope: ', registration.scope);
                
                // Check for updates every 30 seconds
                setInterval(function() {
                    registration.update().then(function() {
                        console.log('Service Worker update check completed');
                    }).catch(function(err) {
                        console.error('Service Worker update check failed: ', err);
                    });
                }, 30000);
                
                // Handle new service worker installation
                registration.addEventListener('updatefound', function() {
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', function() {
                        console.log('Service Worker state changed to: ', newWorker.state);
                        
                        // When a new service worker is installed and ready
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // Send skip waiting message to activate it immediately
                            newWorker.postMessage({ type: 'SKIP_WAITING' });
                        }
                    });
                });
                
            }).catch(function(error) {
                console.error('Service Worker registration failed: ', error);
            });
            
            // Listen for controller change (new service worker taking over)
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', function() {
                if (!refreshing) {
                    refreshing = true;
                    console.log('New Service Worker controller, refreshing page...');
                    window.location.reload();
                }
            });
            
            // Listen for messages from the service worker
            navigator.serviceWorker.addEventListener('message', function(event) {
                console.log('Message from Service Worker: ', event.data);
                
                if (event.data && event.data.type === 'RELOAD_PAGE') {
                    console.log('Reloading page by Service Worker command');
                    window.location.reload();
                }
            });
            
            // Send message to current service worker to skipWaiting if it exists
            if (navigator.serviceWorker.controller) {
                console.log('Existing Service Worker found, sending skipWaiting message');
                navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
            }
        });
    } else {
        console.warn('Service Workers are not supported in this browser');
    }
})();