// Ініціалізація Unity
function initUnity() {
    var container = document.querySelector("#unity-container");
    var canvas = document.querySelector("#unity-canvas");
    var loadingBar = document.querySelector("#unity-loading-bar");
    var progressBarFull = document.querySelector("#unity-progress-bar-full");
    var fullscreenButton = document.querySelector("#unity-fullscreen-button");
    var warningBanner = document.querySelector("#unity-warning");
    
    // Для діагностики, якщо увімкнено
    var diagnostics_icon = document.getElementById("diagnostics-icon");

    // Показує тимчасове повідомлення або постійне повідомлення про помилку
    function unityShowBanner(msg, type) {
        function updateBannerVisibility() {
            warningBanner.style.display = warningBanner.children.length ? 'block' : 'none';
        }
        var div = document.createElement('div');
        div.innerHTML = msg;
        warningBanner.appendChild(div);
        if (type == 'error') div.style = 'background: red; padding: 10px;';
        else {
            if (type == 'warning') div.style = 'background: yellow; padding: 10px;';
            setTimeout(function() {
                warningBanner.removeChild(div);
                updateBannerVisibility();
            }, 5000);
        }
        updateBannerVisibility();
    }

    var buildUrl = "Build";
    var loaderUrl = buildUrl + "/mageduel-webgl-1.1.48.loader.js";
    var config = {
        dataUrl: buildUrl + "/mageduel-webgl-1.1.48.data",
        frameworkUrl: buildUrl + "/mageduel-webgl-1.1.48.framework.js",
        // #if USE_THREADS
        workerUrl: buildUrl + "/",
        // #endif
        // #if USE_WASM
        codeUrl: buildUrl + "/mageduel-webgl-1.1.48.wasm",
        // #endif
        // #if MEMORY_FILENAME
        memoryUrl: buildUrl + "/",
        // #endif
        // #if SYMBOLS_FILENAME
        symbolsUrl: buildUrl + "/",
        // #endif
        streamingAssetsUrl: "StreamingAssets",
        companyName: "EvoluteStudio",
        productName: "Evolute Kingdom: Mage Duel",
        productVersion: "1.1.48",
        showBanner: unityShowBanner,
    };

    // Налаштування для мобільних пристроїв
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        var meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
        document.getElementsByTagName('head')[0].appendChild(meta);
        container.className = "unity-mobile";
        canvas.className = "unity-mobile";

        // Для діагностики, якщо увімкнено
        if (diagnostics_icon) {
            diagnostics_icon.style.position = "fixed";
            diagnostics_icon.style.bottom = "10px";
            diagnostics_icon.style.right = "0px";
            canvas.after(diagnostics_icon);
        }
    } else {
        // Налаштування для десктопу
        canvas.style.width = "1880px";
        canvas.style.height = "930px";
    }

    // #if BACKGROUND_FILENAME
    canvas.style.background = "url('" + buildUrl + "/') center / cover";
    // #endif
    loadingBar.style.display = "block";

    // Ініціалізація Dojo
    var dojoScript = document.createElement("script");
    dojoScript.src = "TemplateData/dojo.js/dojo_c.js";
    dojoScript.onload = async () => {
        await wasm_bindgen();
    };
    document.body.appendChild(dojoScript);

    // Ініціалізація Unity
    window.gameInstance = null;
    window.stopUnityLoading = false;

    // Перевірка орієнтації перед завантаженням Unity
    checkOrientation();

    // Завантажуємо Unity, тільки якщо ми не в портретному режимі
    if (!window.stopUnityLoading) {
        var script = document.createElement("script");
        script.src = loaderUrl;
        script.onload = () => {
            // Перевіряємо ще раз перед створенням екземпляра Unity
            if (!window.stopUnityLoading) {
                createUnityInstance(canvas, config, (progress) => {
                    console.log('Loading progress: ' + (100 * progress) + '%');
                }).then((unityInstance) => {
                    gameInstance = unityInstance;
                    window.gameInstance = unityInstance; // Робимо доступним глобально
                    
                    // Перевіряємо орієнтацію після завантаження гри
                    checkOrientation();
                    
                    // Налаштування діагностики, якщо увімкнено
                    if (diagnostics_icon) {
                        diagnostics_icon.onclick = () => {
                            unityDiagnostics.openDiagnosticsDiv(unityInstance.GetMemoryInfo);
                        };
                    }
                    
                    // Налаштування кнопки повноекранного режиму
                    fullscreenButton.onclick = () => {
                        unityInstance.SetFullscreen(1);
                    };
                }).catch((message) => {
                    alert(message);
                });
            }
        };
        document.body.appendChild(script);
    }
}

// Додаємо функцію для примусового оновлення Service Worker
function forceUpdateServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(function(reg) {
            if (reg) {
                console.log('[Unity Loader] Updating Service Worker...');
                
                // Перевіряємо, чи є очікуючий Service Worker
                if (reg.waiting) {
                    console.log('[Unity Loader] Found waiting Service Worker, activating it...');
                    
                    // Відправляємо повідомлення для активації
                    reg.waiting.postMessage({ action: 'skipWaiting' });
                    
                    // Перезавантажуємо сторінку після активації
                    navigator.serviceWorker.addEventListener('controllerchange', function() {
                        console.log('[Unity Loader] Service Worker controller changed, reloading...');
                        window.location.reload();
                    });
                } else {
                    console.log('[Unity Loader] No waiting Service Worker found, checking for updates...');
                    
                    // Перевіряємо наявність оновлень
                    reg.update().then(function() {
                        console.log('[Unity Loader] Service Worker update check completed');
                    });
                }
            } else {
                console.log('[Unity Loader] No Service Worker registration found');
            }
        });
    }
}

// Модифікуємо функцію initServiceWorker
function initServiceWorker() {
    if ("serviceWorker" in navigator) {
        // Перевіряємо, чи не заблоковано реєстрацію
        if (window.blockServiceWorkerRegistration) {
            console.log('[Unity Loader] Service Worker registration is blocked, delegating to Version Manager');
            return;
        }
        
        console.log('[Unity Loader] Service Worker initialization delegated to Version Manager');
    }
}

// Запускаємо ініціалізацію при завантаженні сторінки
window.addEventListener("load", function() {
    // Ініціалізація Service Worker тепер виконується в versionManager.js
    initUnity();
}); 
