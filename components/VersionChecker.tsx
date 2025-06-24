'use client';

import { useEffect } from 'react';
import { GameVersion } from './UnityPlayer';

export const NEED_TO_LOGOUT_KEY = 'NEED_TO_LOGOUT';

export default function VersionChecker() {

    const clearData = (newVersion: string) => {
        console.log("[VersionChecker] clearing data");
        localStorage.clear();
        localStorage.setItem(NEED_TO_LOGOUT_KEY, 'true');
        localStorage.setItem('GAME_VERSION', newVersion);
        window.location.reload();
    }

    useEffect(() => {
        const currentSlotDataVersion = process.env.NEXT_PUBLIC_SLOT_DATA_VERSION;
        const currentGameVersion = GameVersion + '.' + currentSlotDataVersion;
        const storedGameVersion = localStorage.getItem('GAME_VERSION');

        console.log("[VersionChecker] currentVersion", currentGameVersion, "storedVersion", storedGameVersion);


        console.log("[VersionChecker] storedVersion !== currentVersion", storedGameVersion !== currentGameVersion);
        if( storedGameVersion !== currentGameVersion || storedGameVersion === null) {
            clearData(currentGameVersion || '');
        }
        
    }, []);

  // Компонент не рендерить нічого видимого
  return null;
}
