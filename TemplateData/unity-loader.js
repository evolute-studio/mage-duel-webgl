var container = document.querySelector("#unity-container");
var canvas = document.querySelector("#unity-canvas");
var loadingBar = document.querySelector("#unity-loading-bar");
var progressBarFull = document.querySelector("#unity-progress-bar-full");
var fullscreenButton = document.querySelector("#unity-fullscreen-button");
var warningBanner = document.querySelector("#unity-warning");

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
var loaderUrl = buildUrl + "/mageduel-webgl-1.1.58.loader.js";
var config = {
    dataUrl: buildUrl + "/mageduel-webgl-1.1.58.data",
    frameworkUrl: buildUrl + "/mageduel-webgl-1.1.58.framework.js",
    codeUrl: buildUrl + "/mageduel-webgl-1.1.58.wasm",
    streamingAssetsUrl: "StreamingAssets",
    companyName: "EvoluteStudio",
    productName: "Evolute Kingdom: Mage Duel",
    productVersion: "1.1.57",
    showBanner: unityShowBanner,
};

if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
    document.getElementsByTagName('head')[0].appendChild(meta);
    container.className = "unity-mobile";
    canvas.className = "unity-mobile";

} else {
    canvas.style.width = "1880px";
    canvas.style.height = "930px";
}

loadingBar.style.display = "block";

// Initialize Unity
window.initializeUnity = function() {
    var gameInstance = null;
    window.stopUnityLoading = false;

    checkOrientation();

    if (!window.stopUnityLoading) {
        var script = document.createElement("script");
        script.src = loaderUrl;
        script.onload = () => {
            if (!window.stopUnityLoading) {
                createUnityInstance(canvas, config, (progress) => {
                    progressBarFull.style.width = 100 * progress + "%";
                }).then((unityInstance) => {
                    gameInstance = unityInstance;
                    window.gameInstance = unityInstance;
                    loadingBar.style.display = "none";
                    checkOrientation();
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
}; 
