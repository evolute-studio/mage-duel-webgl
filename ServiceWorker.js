// ServiceWorker.js - спрощений сервіс-воркер з автооновленням
console.log('ServiceWorker завантажено');
console.log('Test service worker update 2');

// Коли сервіс-воркер отримує повідомлення про пропуск очікування
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('ServiceWorker отримав команду SKIP_WAITING');
    self.skipWaiting();
  }
});

// Під час встановлення
self.addEventListener('install', event => {
  console.log('ServiceWorker: встановлення');
  // Не робимо нічого додаткового, тільки логування
});

// Під час активації
self.addEventListener('activate', event => {
  console.log('ServiceWorker: активація');
  // Відразу захоплюємо контроль над всіма відкритими вкладками
  event.waitUntil(clients.claim());
});

// Мінімальний обробник fetch (потрібен для роботи ServiceWorker)
self.addEventListener('fetch', event => {
  // Просто пропускаємо запити без змін
  // Не кешуємо нічого
});
