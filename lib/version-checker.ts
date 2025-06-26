export const NEED_TO_LOGOUT_KEY = 'NEED_TO_LOGOUT';

export const GameVersion = "1.4.40";

export function IsNewVersion(): boolean {
    const gameVersion = GameVersion + '.' + process.env.NEXT_PUBLIC_SLOT_DATA_VERSION;

    const clearData = () => {
        console.log("[VersionChecker] clearing data");
        localStorage.clear();
        localStorage.setItem(NEED_TO_LOGOUT_KEY, 'true');
        localStorage.setItem('GAME_VERSION', gameVersion);
        window.location.reload();
    }

    const currentGameVersion = gameVersion;
    const storedGameVersion = localStorage.getItem('GAME_VERSION');

    console.log("[VersionChecker] currentVersion", currentGameVersion, "storedVersion", storedGameVersion);

    console.log("[VersionChecker] storedVersion !== currentVersion", storedGameVersion !== currentGameVersion);
    if (storedGameVersion !== currentGameVersion || storedGameVersion === null) {
        clearData();
        return true;
    }
    return false;
}
