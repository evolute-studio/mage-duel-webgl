'use client';

import { useEffect } from 'react';

export const NEED_TO_LOGOUT_KEY = 'NEED_TO_LOGOUT';

export default function VersionChecker() {

    const clearData = (newVersion: string) => {
        console.log("[VersionChecker] clearing data");
        localStorage.clear();
        localStorage.setItem(NEED_TO_LOGOUT_KEY, 'true');
        localStorage.setItem('SLOT_DATA_VERSION', newVersion);
        window.location.reload();
    }

    useEffect(() => {
        const currentVersion = process.env.NEXT_PUBLIC_SLOT_DATA_VERSION;
        let storedVersion = localStorage.getItem('SLOT_DATA_VERSION');

        console.log("[VersionChecker] currentVersion", currentVersion, "storedVersion", storedVersion);


        console.log("[VersionChecker] storedVersion !== currentVersion", storedVersion !== currentVersion);
        if( storedVersion !== currentVersion || storedVersion === null) {
            clearData(currentVersion || '');
        }
        
    }, []);

  // Компонент не рендерить нічого видимого
  return null;
}
