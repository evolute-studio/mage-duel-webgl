// Version Manager for handling Service Worker and cache updates

// Current application version
const currentAppVersion = "EvoluteStudio-Evolute Kingdom: Mage Duel-1.1.46";

// Key for storing version in localStorage
const VERSION_STORAGE_KEY = 'app_version';

/**
 * Checks and updates application version
 */
function checkAndUpdateVersion() {
    console.log('[Version Manager] Starting version check...');
    
    // Спочатку перевіряємо, чи є очікуючий Service Worker
    checkAndActivateWaitingServiceWorker().then(activated => {
        if (activated) {
            console.log('[Version Manager] Waiting Service Worker activated, skipping version check');
            return;
        }
        
        // Забезпечуємо наявність мета-тегу
        ensureVersionMetaTag();
        
        // Перевіряємо примусове оновлення
        if (forceVersionUpdate()) {
            console.log('[Version Manager] Force update initiated, skipping normal version check');
            return;
        }
        
        // Отримуємо збережену версію
        const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);
        
        // Додаємо додаткову перевірку для виявлення проблем з версією
        if (!storedVersion) {
            console.log('[Version Manager] No stored version found, setting current version');
            localStorage.setItem(VERSION_STORAGE_KEY, currentAppVersion);
        } else if (storedVersion !== currentAppVersion) {
            console.log(`[Version Manager] Version mismatch: stored=${storedVersion}, current=${currentAppVersion}`);
            
            // Додаємо перевірку на актуальність версії
            const versionParts = storedVersion.split('-');
            const currentParts = currentAppVersion.split('-');
            
            if (versionParts.length >= 3 && currentParts.length >= 3) {
                const storedSemVer = versionParts[2];
                const currentSemVer = currentParts[2];
                
                console.log(`[Version Manager] Comparing versions: stored=${storedSemVer}, current=${currentSemVer}`);
                
                // Порівнюємо версії
                if (compareVersions(storedSemVer, currentSemVer) < 0) {
                    console.log('[Version Manager] Stored version is older, updating...');
                    // Продовжуємо з оновленням
                } else {
                    console.log('[Version Manager] Stored version is newer or equal, keeping it');
                    return;
                }
            }
            
            // Продовжуємо з оновленням як раніше
            console.log('[Version Manager] Starting update process...');
            
            // Update Service Worker
            console.log('[Version Manager] Step 1/3: Updating Service Worker...');
            updateServiceWorker()
                .then(() => {
                    console.log('[Version Manager] Step 1/3 completed: Service Worker updated');
                    
                    // Clear cache
                    console.log('[Version Manager] Step 2/3: Clearing cache...');
                    return clearCache();
                })
                .then(() => {
                    console.log('[Version Manager] Step 2/3 completed: Cache cleared');
                    
                    // Save new version
                    console.log('[Version Manager] Step 3/3: Saving new version...');
                    localStorage.setItem(VERSION_STORAGE_KEY, currentAppVersion);
                    console.log('[Version Manager] Step 3/3 completed: New version saved');
                    
                    console.log('[Version Manager] Update process completed successfully!');
                    console.log(`[Version Manager] Application updated to version: ${currentAppVersion}`);
                })
                .catch(error => {
                    console.error('[Version Manager] Error during update process:', error);
                    console.log('[Version Manager] Attempting to save new version despite errors...');
                    localStorage.setItem(VERSION_STORAGE_KEY, currentAppVersion);
                });
        } else {
            console.log('[Version Manager] Version is up to date, no update needed');
            console.log('[Version Manager] Proceeding with normal application startup');
        }
    });
}

/**
 * Updates Service Worker
 */
async function updateServiceWorker() {
    console.log('[Version Manager] Service Worker update started');
    
    if ('serviceWorker' in navigator) {
        try {
            console.log('[Version Manager] Checking for existing Service Worker registrations...');
            
            // Get all Service Worker registrations
            const registrations = await navigator.serviceWorker.getRegistrations();
            console.log(`[Version Manager] Found ${registrations.length} Service Worker registrations`);
            
            // Unregister all existing Service Workers
            if (registrations.length > 0) {
                console.log('[Version Manager] Unregistering existing Service Workers...');
                
                for (let registration of registrations) {
                    console.log(`[Version Manager] Unregistering Service Worker for scope: ${registration.scope}`);
                    await registration.unregister();
                    console.log('[Version Manager] Service Worker unregistered successfully');
                }
            } else {
                console.log('[Version Manager] No existing Service Workers found');
            }
            
            // Register new Service Worker
            console.log('[Version Manager] Registering new Service Worker...');
            const newRegistration = await navigator.serviceWorker.register('ServiceWorker.js');
            console.log(`[Version Manager] New Service Worker registered with scope: ${newRegistration.scope}`);
            
            console.log('[Version Manager] Service Worker update completed successfully');
            return true;
        } catch (error) {
            console.error('[Version Manager] Error updating Service Worker:', error);
            console.error('[Version Manager] Service Worker update failed');
            throw error;
        }
    } else {
        console.log('[Version Manager] Service Worker API not available in this browser');
        return false;
    }
}

/**
 * Clears browser cache
 */
async function clearCache() {
    console.log('[Version Manager] Cache clearing process started');
    
    if ('caches' in window) {
        try {
            console.log('[Version Manager] Retrieving list of all caches...');
            
            // Get list of all caches
            const cacheNames = await caches.keys();
            console.log(`[Version Manager] Found ${cacheNames.length} caches to clear`);
            
            if (cacheNames.length > 0) {
                // Delete all caches
                console.log('[Version Manager] Deleting all caches...');
                
                // Use sequential deletion for better reliability
                for (const cacheName of cacheNames) {
                    console.log(`[Version Manager] Deleting cache: ${cacheName}`);
                    try {
                        const success = await caches.delete(cacheName);
                        if (success) {
                            console.log(`[Version Manager] Cache '${cacheName}' deleted successfully`);
                        } else {
                            console.warn(`[Version Manager] Failed to delete cache '${cacheName}', retrying...`);
                            // Retry deletion
                            const retrySuccess = await caches.delete(cacheName);
                            console.log(`[Version Manager] Retry ${retrySuccess ? 'succeeded' : 'failed'}`);
                        }
                    } catch (cacheError) {
                        console.error(`[Version Manager] Error deleting cache '${cacheName}':`, cacheError);
                    }
                }
                
                // Check if all caches are deleted
                const remainingCaches = await caches.keys();
                if (remainingCaches.length > 0) {
                    console.warn(`[Version Manager] ${remainingCaches.length} caches still remain after deletion`);
                    console.warn('[Version Manager] Remaining caches:', remainingCaches);
                } else {
                    console.log('[Version Manager] All caches successfully removed');
                }
            } else {
                console.log('[Version Manager] No caches found to clear');
            }
            
            console.log('[Version Manager] Cache clearing process completed');
            return true;
        } catch (error) {
            console.error('[Version Manager] Error clearing caches:', error);
            console.error('[Version Manager] Cache clearing process failed');
            throw error;
        }
    } else {
        console.log('[Version Manager] Cache API not available in this browser');
        return false;
    }
}

// Run version check when page loads
console.log('[Version Manager] Initializing Version Manager...');
window.addEventListener('load', function() {
    console.log('[Version Manager] Page loaded, starting version check');
    checkAndUpdateVersion();
});

// Додаємо функцію для ініціалізації, яка буде викликатися перед усіма іншими
(function initVersionManager() {
    console.log('[Version Manager] Initializing Version Manager (priority)...');
    
    // Перевіряємо, чи є параметр force-update в URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('force-update')) {
        console.log('[Version Manager] Force update parameter detected, handling immediately...');
        
        // Видаляємо всі дані про версію
        localStorage.removeItem(VERSION_STORAGE_KEY);
        
        // Видаляємо параметр з URL
        urlParams.delete('force-update');
        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, document.title, newUrl);
        
        // Примусово видаляємо всі Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    registration.unregister();
                    console.log('[Version Manager] Unregistered Service Worker during initialization');
                }
                
                // Очищуємо кеш
                if ('caches' in window) {
                    caches.keys().then(cacheNames => {
                        for (const cacheName of cacheNames) {
                            caches.delete(cacheName);
                            console.log(`[Version Manager] Deleted cache: ${cacheName} during initialization`);
                        }
                        
                        // Перезавантажуємо сторінку
                        console.log('[Version Manager] Reloading page after force cleanup...');
                        window.location.reload();
                    });
                } else {
                    // Перезавантажуємо сторінку, якщо API кешу недоступний
                    window.location.reload();
                }
            });
        }
    }
    
    // Перевіряємо, чи є очікуючий Service Worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.waiting) {
                console.log('[Version Manager] Found waiting Service Worker during initialization, activating it...');
                
                // Встановлюємо обробник для події controllerchange
                let refreshing = false;
                navigator.serviceWorker.addEventListener('controllerchange', () => {
                    if (!refreshing) {
                        refreshing = true;
                        console.log('[Version Manager] Service Worker controller changed during initialization, reloading page...');
                        window.location.reload();
                    }
                });
                
                // Відправляємо повідомлення для активації
                registration.waiting.postMessage({ action: 'skipWaiting' });
            }
        });
    }
})();

// Додаємо функцію для забезпечення наявності мета-тегу
function ensureVersionMetaTag() {
    console.log('[Version Manager] Ensuring version meta tag exists...');
    
    // Перевіряємо, чи існує мета-тег
    let metaTag = document.querySelector('meta[name="app-version"]');
    
    if (!metaTag) {
        console.log('[Version Manager] Version meta tag not found, creating it...');
        
        // Створюємо новий мета-тег
        metaTag = document.createElement('meta');
        metaTag.name = 'app-version';
        metaTag.content = currentAppVersion;
        
        // Додаємо його до head
        document.head.appendChild(metaTag);
        
        console.log(`[Version Manager] Created version meta tag with content: ${metaTag.content}`);
    } else {
        console.log(`[Version Manager] Found existing version meta tag with content: ${metaTag.content}`);
    }
    
    return metaTag.content;
}

// Покращена функція для перевірки та активації очікуючого Service Worker
async function checkAndActivateWaitingServiceWorker() {
    console.log('[Version Manager] Checking for waiting Service Worker...');
    
    if ('serviceWorker' in navigator) {
        try {
            // Отримуємо поточну реєстрацію
            const registration = await navigator.serviceWorker.getRegistration();
            
            if (registration) {
                console.log('[Version Manager] Service Worker registration found');
                
                // Перевіряємо стан Service Worker
                if (registration.installing) {
                    console.log('[Version Manager] Service Worker is installing');
                }
                
                if (registration.waiting) {
                    console.log('[Version Manager] Found waiting Service Worker, activating it...');
                    
                    // Встановлюємо обробник для події controllerchange
                    let refreshing = false;
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        if (!refreshing) {
                            refreshing = true;
                            console.log('[Version Manager] Service Worker controller changed, reloading page...');
                            window.location.reload();
                        }
                    });
                    
                    // Відправляємо повідомлення для активації
                    registration.waiting.postMessage({ action: 'skipWaiting' });
                    
                    // Додаємо таймаут для перезавантаження, якщо controllerchange не спрацював
                    setTimeout(() => {
                        if (!refreshing) {
                            console.log('[Version Manager] Timeout reached, forcing reload...');
                            window.location.reload();
                        }
                    }, 3000);
                    
                    return true;
                }
                
                if (registration.active) {
                    console.log('[Version Manager] Service Worker is active');
                    
                    // Примусово оновлюємо реєстрацію
                    console.log('[Version Manager] Forcing Service Worker update check...');
                    try {
                        await registration.update();
                        console.log('[Version Manager] Service Worker update check completed');
                        
                        // Перевіряємо, чи з'явився очікуючий SW після оновлення
                        if (registration.waiting) {
                            console.log('[Version Manager] New waiting Service Worker found after update, activating it...');
                            
                            // Встановлюємо обробник для події controllerchange
                            let refreshing = false;
                            navigator.serviceWorker.addEventListener('controllerchange', () => {
                                if (!refreshing) {
                                    refreshing = true;
                                    console.log('[Version Manager] Service Worker controller changed, reloading page...');
                                    window.location.reload();
                                }
                            });
                            
                            // Відправляємо повідомлення для активації
                            registration.waiting.postMessage({ action: 'skipWaiting' });
                            return true;
                        }
                    } catch (updateError) {
                        console.error('[Version Manager] Error updating Service Worker:', updateError);
                    }
                }
            } else {
                console.log('[Version Manager] No Service Worker registration found');
            }
        } catch (error) {
            console.error('[Version Manager] Error checking for waiting Service Worker:', error);
        }
    }
    
    return false;
}

// Додаємо функцію для примусового видалення та перереєстрації Service Worker
async function forceReregisterServiceWorker() {
    console.log('[Version Manager] Force re-registering Service Worker...');
    
    if ('serviceWorker' in navigator) {
        try {
            // Отримуємо всі реєстрації
            const registrations = await navigator.serviceWorker.getRegistrations();
            
            // Видаляємо всі реєстрації
            for (const registration of registrations) {
                console.log(`[Version Manager] Unregistering Service Worker for scope: ${registration.scope}`);
                await registration.unregister();
                console.log('[Version Manager] Service Worker unregistered successfully');
            }
            
            // Очищуємо кеш
            if ('caches' in window) {
                const cacheNames = await caches.keys();
                for (const cacheName of cacheNames) {
                    console.log(`[Version Manager] Deleting cache: ${cacheName}`);
                    await caches.delete(cacheName);
                }
            }
            
            // Додаємо кеш-бастер до URL Service Worker
            const cacheBuster = Date.now();
            const swUrl = `ServiceWorker.js?v=${cacheBuster}`;
            
            // Реєструємо новий Service Worker
            console.log(`[Version Manager] Registering new Service Worker with cache buster: ${swUrl}`);
            const newRegistration = await navigator.serviceWorker.register(swUrl);
            console.log(`[Version Manager] New Service Worker registered with scope: ${newRegistration.scope}`);
            
            // Примусово активуємо новий Service Worker
            if (newRegistration.installing) {
                console.log('[Version Manager] Waiting for new Service Worker to install...');
                
                // Чекаємо, поки Service Worker встановиться
                await new Promise(resolve => {
                    const timeout = setTimeout(() => {
                        console.log('[Version Manager] Installation timeout reached, continuing anyway');
                        resolve();
                    }, 5000); // 5 секунд таймаут
                    
                    newRegistration.installing.addEventListener('statechange', function() {
                        if (this.state === 'installed' || this.state === 'activated') {
                            clearTimeout(timeout);
                            console.log(`[Version Manager] New Service Worker state: ${this.state}`);
                            resolve();
                        }
                    });
                });
                
                // Примусово активуємо
                if (newRegistration.waiting) {
                    console.log('[Version Manager] Activating new Service Worker...');
                    newRegistration.waiting.postMessage({ action: 'skipWaiting' });
                }
            }
            
            return true;
        } catch (error) {
            console.error('[Version Manager] Error during force re-registration:', error);
            return false;
        }
    }
    
    return false;
}

// Модифікуємо функцію forceVersionUpdate
function forceVersionUpdate() {
    console.log('[Version Manager] Forcing version update check...');
    
    // Перевіряємо параметр force-update в URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('force-update')) {
        console.log('[Version Manager] Force update parameter detected in URL');
        
        // Видаляємо всі дані про версію
        localStorage.removeItem(VERSION_STORAGE_KEY);
        
        // Видаляємо параметр з URL
        urlParams.delete('force-update');
        const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
        window.history.replaceState({}, document.title, newUrl);
        
        // Примусово перереєструємо Service Worker
        forceReregisterServiceWorker().then(success => {
            if (success) {
                console.log('[Version Manager] Service Worker successfully re-registered, reloading...');
                // Перезавантажуємо сторінку
                window.location.reload();
            } else {
                console.log('[Version Manager] Failed to re-register Service Worker, continuing...');
            }
        });
        
        return true;
    }
    
    // Перевіряємо, чи потрібно оновити версію з мета-тегу
    const metaVersion = ensureVersionMetaTag();
    
    if (metaVersion && metaVersion !== currentAppVersion) {
        console.log(`[Version Manager] Version mismatch: meta=${metaVersion}, current=${currentAppVersion}`);
        
        // Оновлюємо версію в localStorage
        localStorage.setItem(VERSION_STORAGE_KEY, metaVersion);
        
        // Перезавантажуємо сторінку
        console.log('[Version Manager] Reloading page to apply version update...');
        window.location.reload();
        return true;
    }
    
    return false;
}

// Функція для порівняння семантичних версій
function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const part1 = i < parts1.length ? parts1[i] : 0;
        const part2 = i < parts2.length ? parts2[i] : 0;
        
        if (part1 < part2) return -1;
        if (part1 > part2) return 1;
    }
    
    return 0;
} 
