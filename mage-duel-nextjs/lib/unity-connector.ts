'use client'

import { UnityWindow } from "../components/UnityPlayer";
import { ControllerWindow } from "../components/WalletConnector";
import { active_skin, balance, become_bot, cancel_game, change_skin, change_username, create_game, create_game_from_snapshot, create_snapshot, finish_game, join_game, make_move, skip_move, username } from "./transactions";
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

    public SendEvent = (event: string) => {
        const win = window as UnityWindow;
        const gameInstance = win.gameInstance;
        gameInstance.SendMessage(unityReciver, event, "");
    }

    // -- Game actions --
    public CreateGame = async () => {
        const tx = create_game();
        return this.ExecuteTransaction(tx);
    }

    public CreateGameFromSnapshot = async (snapshotId: string) => {
        const tx = create_game_from_snapshot(snapshotId);
        return this.ExecuteTransaction(tx);
    }

    public CreateSnapshot = async (boardId: string, moveNumber: string) => {
        const tx = create_snapshot(boardId, moveNumber);
        return this.ExecuteTransaction(tx);
    }

    public FinishGame = async (boardId: string) => {
        const tx = finish_game(boardId);
        return this.ExecuteTransaction(tx);
    }

    public JoinGame = async (hostPlayer: string) => {
        const tx = join_game(hostPlayer);
        return this.ExecuteTransaction(tx);
    }

    public MakeMove = async (jokerTile: string, rotation: string, col: string, row: string) => {
        const tx = make_move(jokerTile, rotation, col, row);
        return this.ExecuteTransaction(tx);
    }
    
    public SkipMove = async () => {
        const tx = skip_move();
        return this.ExecuteTransaction(tx);
    }

    public CancelGame = async () => {
        const tx = cancel_game();
        return this.ExecuteTransaction(tx);
    }
    
    
    // -- Player profile actions --

    public ActiveSkin = async () => {
        const tx = active_skin();
        return this.ExecuteTransaction(tx);
    }

    public Balance = async () => {
        const tx = balance();
        return this.ExecuteTransaction(tx);
    }

    public BecomeBot = async () => {
        const tx = become_bot();
        return this.ExecuteTransaction(tx);
    }

    public ChangeSkin = async (skinId: string) => {
        const tx = change_skin(skinId);
        return this.ExecuteTransaction(tx);
    }

    public ChangeUsername = async (newUsername: string) => {
        const tx = change_username(newUsername);
        return this.ExecuteTransaction(tx);
    }

    public Username = async () => {
        const tx = username();
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



  