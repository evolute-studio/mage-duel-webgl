// Реєстрація та автооновлення ServiceWorker з примусовою активацією
(function() {
    // Перевіряємо підтримку Service Worker
    if ('serviceWorker' in navigator) {
        // Прослуховуємо повідомлення від Service Worker
        navigator.serviceWorker.addEventListener('message', function(event) {
            console.log('Отримано повідомлення від ServiceWorker:', event.data);
            // Якщо отримано команду перезавантаження
            if (event.data && event.data.type === 'RELOAD_PAGE') {
                console.log('Перезавантажуємо сторінку за командою ServiceWorker');
                window.location.reload();
            }
        });

        // Змінна для відстеження процесу оновлення
        let refreshing = false;

        // Прослуховуємо зміну контролера
        navigator.serviceWorker.addEventListener('controllerchange', function() {
            console.log('Контролер ServiceWorker змінився');
            if (!refreshing) {
                refreshing = true;
                console.log('Перезавантажуємо сторінку після зміни контролера');
                window.location.reload();
            }
        });

        // Функція для реєстрації та примусового оновлення
        function registerAndUpdate() {
            console.log('Початок реєстрації ServiceWorker');

            // Реєструємо Service Worker, вимикаючи кешування
            navigator.serviceWorker.register('/ServiceWorker.js', {
                updateViaCache: 'none',
                scope: '/'
            }).then(function(registration) {
                console.log('ServiceWorker зареєстровано:', registration.scope);

                // Перевіряємо наявність оновлень
                registration.update().then(function() {
                    console.log('Перевірка оновлень завершена');
                }).catch(function(error) {
                    console.error('Помилка перевірки оновлень:', error);
                });

                // Відстежуємо оновлення
                registration.addEventListener('updatefound', function() {
                    console.log('Знайдено нову версію ServiceWorker');
                    const newWorker = registration.installing;

                    newWorker.addEventListener('statechange', function() {
                        console.log('Стан нового ServiceWorker:', newWorker.state);

                        // Якщо новий воркер встановлений, але ще не активований
                        if (newWorker.state === 'installed') {
                            console.log('Новий ServiceWorker встановлено, намагаємося активувати');

                            // Перевіряємо, чи є активний контролер
                            if (navigator.serviceWorker.controller) {
                                // Примусова активація
                                newWorker.postMessage({ type: 'SKIP_WAITING' });
                            }
                        }
                    });
                });

                // Встановлюємо регулярну перевірку оновлень (кожні 30 секунд)
                setInterval(function() {
                    registration.update().then(function() {
                        console.log('Регулярна перевірка оновлень завершена');
                    });
                }, 30000);

            }).catch(function(error) {
                console.error('Помилка реєстрації ServiceWorker:', error);
            });
        }

        // Викликаємо реєстрацію негайно
        registerAndUpdate();

        // Також намагаємося оновити існуючий Service Worker, якщо він є
        if (navigator.serviceWorker.controller) {
            console.log('Існуючий ServiceWorker знайдено, намагаємося оновити');
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
    }
})();
