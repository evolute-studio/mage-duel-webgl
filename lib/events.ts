import { getPlayerId } from '@/utils/player_data';
import { logEvent } from '../lib/axiom';


export const GameLoaded = () => {
    logEvent('game_loaded', {
        player_id: getPlayerId(),
        player_id_timestamp: localStorage.getItem('player_id_timestamp'),
    });
};

const SCREEN_TIME_INTERVAL = 15000; // 15 секунд

let screenTimeInterval: NodeJS.Timeout | null = null;

// Функція для відправки івента ScreenTime
const sendScreenTimeEvent = () => {
  logEvent('ScreenTime', {
    player_id: getPlayerId(),
    timestamp: new Date().toISOString(),
    url: window.location.href,
  });
};

// Ініціалізація відстеження часу екрану
export const initScreenTimeTracking = () => {
  if (typeof window === 'undefined') return;

  // Запуск інтервалу для відправки івентів
  screenTimeInterval = setInterval(sendScreenTimeEvent, SCREEN_TIME_INTERVAL);

  // Очищення при виході зі сторінки
  window.addEventListener('beforeunload', () => {
    if (screenTimeInterval) {
      clearInterval(screenTimeInterval);
    }
  });
};

// Зупинка відстеження
export const stopScreenTimeTracking = () => {
  if (screenTimeInterval) {
    clearInterval(screenTimeInterval);
    screenTimeInterval = null;
  }
};

