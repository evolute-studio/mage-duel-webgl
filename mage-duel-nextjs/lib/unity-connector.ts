'use client'

import { UnityWindow } from "../components/UnityPlayer";
import { ControllerWindow } from "../components/WalletConnector";

const unityReciver = "WrapperTester";

export default class UnityConnector {

    public GetUsername = (): string => {
        const controllerInstance = (window as ControllerWindow).controllerInstance;
        if (!controllerInstance) {
            throw new Error('Controller not initialized');
        }
        return (window as ControllerWindow).username;
    }

    public OnUsernameReceived = (username: string) => {
        const gameInstance = (window as UnityWindow).gameInstance;

        if (!gameInstance) {
            console.warn('Unity game instance is not initialized yet');
            return;
        }
        
        gameInstance.SendMessage(unityReciver, "OnUsernameReceived", username);
    }
}



  