interface GameState {
    inSession: boolean;
    lastUpdateTime: string;
    playerId: string;
}

let currentGameState: GameState = {
    inSession: false,
    lastUpdateTime: new Date().toISOString(),
    playerId: '',
};

export const getGameState = (): GameState => {
    return { ...currentGameState };
};

export const updateGameState = (updates: Partial<GameState>): void => {
    currentGameState = {
        ...currentGameState,
        ...updates,
        lastUpdateTime: new Date().toISOString(),
    };
};

export const setInSession = (inSession: boolean): void => {
    updateGameState({ inSession });
};

export const resetGameState = (): void => {
    currentGameState = {
        inSession: false,
        lastUpdateTime: new Date().toISOString(),
        playerId: '',
    };
}; 