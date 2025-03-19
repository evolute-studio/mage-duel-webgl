// ServiceWorker.js - спрощений сервіс-воркер з автооновленням
console.log('ServiceWorker завантажено');
console.log('Test service worker update 3'); // Для відстеження оновлень

// Глобальна змінна для відстеження стану активації
let isRefreshing = false;

// Прослуховувач повідомлень
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('ServiceWorker отримав команду SKIP_WAITING');
    self.skipWaiting();
  }
});

// Під час встановлення
self.addEventListener('install', event => {
  console.log('ServiceWorker: встановлення нової версії');
  // Форсуємо встановлення без очікування
  event.waitUntil(self.skipWaiting());
});

// Під час активації
self.addEventListener('activate', event => {
  console.log('ServiceWorker: активація нової версії');
  // Негайно захоплюємо контроль над всіма відкритими вкладками
  event.waitUntil(
      clients.claim().then(() => {
        // Після захоплення контролю надсилаємо повідомлення всім клієнтам
        return self.clients.matchAll().then(clients => {
          return Promise.all(
              clients.map(client => {
                // Відправляємо повідомлення для перезавантаження сторінки
                return client.postMessage({
                  type: 'NEW_VERSION_ACTIVATED',
                  reload: true
                });
              })
          );
        });
      })
  );
});

// Мінімальний обробник fetch (потрібен для роботи ServiceWorker)
self.addEventListener('fetch', event => {
  // Просто пропускаємо запити без будь-яких дій
  // НЕ намагаємося нічого кешувати
});
