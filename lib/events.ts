import { getPlayerId } from '@/utils/player_data';
import { logEvent } from '../lib/axiom';
import { ControllerWindow } from '@/components/WalletConnector';


export const GameLoaded = () => {
    logEvent('game_loaded', {
        player_id: getPlayerId(),
        player_id_timestamp: localStorage.getItem('player_id_timestamp'),
    });
};

export const controllerLoginEvent = () => {
  const win = window as ControllerWindow;
  logEvent('controller_login', {
    player_id: getPlayerId(),
    timestamp: new Date().toISOString(),
    player_id_timestamp: localStorage.getItem('player_id_timestamp'),
    controller_username: win.username,
    controller_address: win.account.address,
    url: window.location.href,
  });
}

const SCREEN_TIME_INTERVAL = 15000; 

let screenTimeInterval: NodeJS.Timeout | null = null;

const sendScreenTimeEvent = () => {
  let event_type = 'screen_time';
  const data = {
    player_id: getPlayerId(),
    timestamp: new Date().toISOString(),
    url: window.location.href,
    controller_username: '',
    controller_address: '',
  }
  const win = window as ControllerWindow
  if(win.controllerInstance !== undefined && win.controllerInstance.controller !== undefined) {
    event_type += '_controller';
    data.controller_username = win.username;
    data.controller_address = win.account.address;
  }
  logEvent(event_type, data);
};


export const initScreenTimeTracking = () => {
  if (typeof window === 'undefined') return;

  
  screenTimeInterval = setInterval(sendScreenTimeEvent, SCREEN_TIME_INTERVAL);


  window.addEventListener('beforeunload', () => {
    if (screenTimeInterval) {
      clearInterval(screenTimeInterval);
    }
  });
};

export const stopScreenTimeTracking = () => {
  if (screenTimeInterval) {
    clearInterval(screenTimeInterval);
    screenTimeInterval = null;
  }
};

