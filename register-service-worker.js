// Реєстрація та автооновлення ServiceWorker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      // Реєструємо ServiceWorker
      navigator.serviceWorker.register('/ServiceWorker.js')
        .then(registration => {
          console.log('ServiceWorker зареєстровано успішно:', registration.scope);
          
          // Перевіряємо наявність оновлень при кожному завантаженні сторінки
          registration.update();
          
          // Відстежуємо появу нової версії
          registration.addEventListener('updatefound', () => {
            // Отримуємо новий сервіс-воркер
            const newWorker = registration.installing;
            
            console.log('Виявлено оновлення ServiceWorker');
            
            // Відстежуємо стан нового сервіс-воркера
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('Новий ServiceWorker встановлено, активуємо негайно');
                // Відправляємо команду на негайну активацію
                newWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          });
        })
        .catch(error => {
          console.error('Помилка реєстрації ServiceWorker:', error);
        });
      
      // Відстежуємо зміну контролюючого сервіс-воркера
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          console.log('Новий ServiceWorker прийняв контроль, оновлюємо сторінку');
          refreshing = true;
          window.location.reload();
        }
      });
    }
  }
  
  // Запускаємо реєстрацію
  registerServiceWorker();
