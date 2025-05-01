'use client'

import { UnityWindow } from "../components/UnityPlayer";
import { ControllerWindow } from "../components/WalletConnector";

const unityReciver = "WrapperTester";

export default class UnityConnector {

    public GetUsername = (): string => {
        const win = window as ControllerWindow;
        const controllerInstance = win.controllerInstance;
        if (!controllerInstance) {
            throw new Error('Controller not initialized');
        }
        return win.username;
    }

    //controller login
    public ControllerLogin = async () => {
        const win = window as ControllerWindow;
        const handleConnect = win.handleConnect;
        if (!handleConnect) {
            throw new Error('Handle connect not initialized');
        }
        await handleConnect();
        this.OnControllerLogin();
    }

    public CheckControllerLoggedIn = () => {
        const win = window as ControllerWindow;
        const controllerInstance = win.controllerInstance;
        if (!controllerInstance) {
            this.OnControllerNotLoggedIn();
            throw new Error('Controller not initialized');
        }
        console.log("Controller logged in");
        this.OnControllerLogin();
        this.OnUsernameReceived(win.username);
    }

    public OnUsernameReceived = (username: string) => {
        const win = window as UnityWindow;
        const gameInstance = win.gameInstance;

        if (!gameInstance) {
            console.warn('Unity game instance is not initialized yet');
            return;
        }
        
        gameInstance.SendMessage(unityReciver, "OnUsernameReceived", username);
    }

    public OnControllerLogin = () => {
        const win = window as UnityWindow;
        const gameInstance = win.gameInstance;
        gameInstance.SendMessage(unityReciver, "OnControllerLogin", "");
    }

    public OnControllerNotLoggedIn = () => {
        const win = window as UnityWindow;
        const gameInstance = win.gameInstance;
        gameInstance.SendMessage(unityReciver, "OnControllerNotLoggedIn", "");
    }
}



  