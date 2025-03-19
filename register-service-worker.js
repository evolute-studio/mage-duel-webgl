// Реєстрація та автооновлення ServiceWorker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        // Прослуховуємо повідомлення від сервіс-воркера
        navigator.serviceWorker.addEventListener('message', event => {
            console.log('Отримано повідомлення від ServiceWorker:', event.data);
            if (event.data && event.data.type === 'NEW_VERSION_ACTIVATED' && event.data.reload) {
                console.log('Перезавантажуємо сторінку для застосування нової версії ServiceWorker');
                window.location.reload();
            }
        });

        // Прослуховуємо зміну контролюючого сервіс-воркера
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!refreshing) {
                console.log('Новий ServiceWorker прийняв контроль, оновлюємо сторінку');
                refreshing = true;
                window.location.reload();
            }
        });

        // Реєструємо сервіс-воркер з опцією негайного оновлення
        navigator.serviceWorker.register('/ServiceWorker.js', {
            updateViaCache: 'none' // Завжди перевіряти наявність оновлення
        })
            .then(registration => {
                console.log('ServiceWorker зареєстровано успішно:', registration.scope);

                // Періодичне оновлення сервіс-воркера
                setInterval(() => {
                    registration.update().then(() => {
                        console.log('Перевірка оновлень ServiceWorker виконана');
                    });
                }, 60000); // Перевіряємо оновлення щохвилини

                // Негайна перевірка оновлень
                registration.update();

                // Відстежуємо появу нової версії
                registration.addEventListener('updatefound', () => {
                    // Отримуємо новий сервіс-воркер
                    const newWorker = registration.installing;

                    console.log('Виявлено оновлення ServiceWorker');

                    // Відстежуємо стан нового сервіс-воркера
                    newWorker.addEventListener('statechange', () => {
                        console.log('Стан нового ServiceWorker змінився на:', newWorker.state);

                        if (newWorker.state === 'installed') {
                            if (navigator.serviceWorker.controller) {
                                console.log('Новий ServiceWorker встановлено, активуємо негайно');
                                // Відправляємо команду на негайну активацію
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                            }
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Помилка реєстрації ServiceWorker:', error);
            });
    }
}

// Запускаємо реєстрацію при повному завантаженні сторінки
window.addEventListener('load', () => {
    registerServiceWorker();
});

// Також запускаємо реєстрацію відразу
registerServiceWorker();
