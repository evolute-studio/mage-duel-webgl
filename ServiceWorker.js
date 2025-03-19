// ServiceWorker.js - з примусовою активацією
console.log('ServiceWorker завантажено');
console.log('Test service worker update 5'); // Змініть число для відстеження оновлень

// Примусово пропускаємо чергу очікування під час встановлення
self.addEventListener('install', event => {
    console.log('ServiceWorker: встановлення нової версії');
    // Форсуємо встановлення без очікування
    event.waitUntil(self.skipWaiting());
});

// При активації примусово захоплюємо контроль
self.addEventListener('activate', event => {
    console.log('ServiceWorker: активація нової версії');

    // Примусово захоплюємо контроль над клієнтами
    event.waitUntil(
        clients.claim().then(() => {
            // Перезавантажуємо всі вікна безпосередньо
            return self.clients.matchAll().then(clients => {
                clients.forEach(client => {
                    // Перезавантажуємо сторінку прямо з Service Worker
                    client.navigate(client.url);
                });
            });
        })
    );
});

// Мінімальний обробник fetch
self.addEventListener('fetch', event => {
    // Нічого не робимо з запитами - просто пропускаємо їх
    // Повертаємо запит як є, без кешування
    return;
});

// Обробник повідомлень для додаткового контролю
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('ServiceWorker отримав команду SKIP_WAITING');
        self.skipWaiting();
    }
});
