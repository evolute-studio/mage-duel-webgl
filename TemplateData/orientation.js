// Функція для перевірки орієнтації пристрою
function checkOrientation() {
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        const aspectRatio = window.innerWidth / window.innerHeight;
        const portraitOverlay = document.getElementById('portrait-overlay');
        const unityContainer = document.getElementById('unity-container');
        const loadingBar = document.getElementById('unity-loading-bar');

        // Перевіряємо, чи пристрій у портретній орієнтації або співвідношення сторін менше 1.46
        if (window.innerHeight > window.innerWidth || aspectRatio < 1.46) {
            portraitOverlay.style.display = 'flex';
            // Приховуємо контейнер Unity та індикатор завантаження
            unityContainer.style.display = 'none';
            loadingBar.style.display = 'none';

            // Якщо екземпляр гри існує, призупиняємо гру
            if (window.gameInstance) {
                try {
                    window.gameInstance.SendMessage('GameManager', 'PauseGame');
                } catch (e) {
                    console.log('Could not pause game');
                }
            }

            // Зупиняємо завантаження Unity, якщо ми в портретному режимі
            if (!window.gameInstance && window.stopUnityLoading) {
                window.stopUnityLoading = true;
            }
        } else {
            portraitOverlay.style.display = 'none';
            // Показуємо контейнер Unity
            unityContainer.style.display = 'block';

            // Якщо завантаження гри було зупинено і у нас все ще немає екземпляра гри, перезавантажуємо сторінку
            if (window.stopUnityLoading && !window.gameInstance) {
                window.location.reload();
                return;
            }

            // Якщо екземпляр гри існує, відновлюємо гру
            if (window.gameInstance) {
                try {
                    window.gameInstance.SendMessage('GameManager', 'ResumeGame');
                } catch (e) {
                    console.log('Could not resume game');
                }
            }
        }
    }
}

// Перевіряємо орієнтацію при завантаженні сторінки та при зміні розміру вікна
window.addEventListener('load', checkOrientation);
window.addEventListener('resize', checkOrientation);

// Перезавантажуємо сторінку при зміні орієнтації
window.addEventListener('orientationchange', function() {
    // Невелика затримка, щоб орієнтація повністю змінилася перед перезавантаженням
    setTimeout(function() {
        window.location.reload();
    }, 100);
}); 
