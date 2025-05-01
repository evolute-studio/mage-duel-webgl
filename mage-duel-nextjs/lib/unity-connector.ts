'use client'

import { UnityWindow } from "../components/UnityPlayer";
import { ControllerWindow } from "../components/WalletConnector";
import { change_username } from "./transactions";
import { Transaction } from "./transactions";
const unityReciver = "WrapperTester";

export default class UnityConnector {

    // !!!---- Transactions ----!!!
    public ExecuteTransaction = async (tx: Transaction) => {
        const win = window as ControllerWindow;
        const account = win.account;
        if (!account) {
            throw new Error('Account not initialized');
        }
        const tx_hash = await account.execute(tx);
        console.log(tx_hash);
        return tx_hash;
    }

    // -- Player profile actions --
    public ChangeUsername = async (newUsername: string) => {
        const tx = change_username(newUsername);
        return this.ExecuteTransaction(tx);
    }

    // !!!---- Unity Calls ----!!!

    public GetUsername = (): string => {
        const win = window as ControllerWindow;
        const controllerInstance = win.controllerInstance;
        if (!controllerInstance) {
            throw new Error('Controller not initialized');
        }
        this.OnUsernameReceived(win.username);
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
        //this.OnUsernameReceived(win.username);
    }

    // !!!---- Unity events ----!!!

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



  