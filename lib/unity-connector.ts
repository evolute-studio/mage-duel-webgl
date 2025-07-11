import { UnityWindow } from "../components/UnityPlayer";
import { ControllerWindow } from "../components/WalletConnector";
import { onchainTransactionEvent } from "./events";
import { setInSession } from "./gameState";
import { type Transaction } from "./transactions";
import playerData from "../query-results.json";
import { IsNewVersion } from "./version-checker";
const unityReciver = "WrapperTester";

export default class UnityConnector {
  // !!!---- Transactions ----!!!
  public ExecuteTransaction = async (tx: Transaction | string) => {
    //console.log('Executing transaction:', tx.toString());
    const transaction =
      typeof tx === "string" ? (JSON.parse(tx) as Transaction) : tx;
    console.log('Executing transaction:', transaction);
    const win = window as ControllerWindow;
    const account = win.account;
    if (!account) {
      throw new Error("Account not initialized");
    }
    //console.log('Tx:', transaction.contractAddress, transaction.entrypoint, transaction.calldata);
    const tx_hash = await account.execute(transaction);
    console.log("Transaction hash:", tx_hash);
    onchainTransactionEvent(transaction);
    this.checkTransaction(transaction);
    return tx_hash;
  };

  private checkTransaction = (tx: Transaction) => {
    // make_move, skip_move, join_game
    if (tx.entrypoint === "make_move" || tx.entrypoint === "skip_move" || tx.entrypoint === "join_game") {
      setInSession(true);
    }
    else {
      setInSession(false);
    }
  }

  public SendEvent = (event: string, data: string) => {
    const win = window as UnityWindow;
    const gameInstance = win.gameInstance;
    gameInstance.SendMessage(unityReciver, event, data);
  };

  public GetConnectionData = () => {
    return {
      rpcUrl: process.env.NEXT_PUBLIC_RPC,
      toriiUrl: process.env.NEXT_PUBLIC_TORII,
      gameAddress: process.env.NEXT_PUBLIC_GAME_ADDRESS,
      playerProfileActionsAddress:
        process.env.NEXT_PUBLIC_PLAYER_PROFILE_ADDRESS,
      worldAddress: process.env.NEXT_PUBLIC_WORLD_ADDRESS,
      slotDataVersion: process.env.NEXT_PUBLIC_SLOT_DATA_VERSION,
    };
  };
  public BecomeController = async () => {
    //console.log("Becoming controller" + become_controller);
    const tx = {
      contractAddress: process.env.NEXT_PUBLIC_PLAYER_PROFILE_ADDRESS,
      entrypoint: "become_controller",
      calldata: [],
    } as Transaction;
    //console.log("Tx:", tx);
    await this.ExecuteTransaction(tx);
  }

  public SetPlayerProfile = async (player_id: string, username: string, balance: string, games_played: string, active_skin: string, role: string) => {
    //console.log("Becoming controller" + become_controller);
    const tx = {
      contractAddress: process.env.NEXT_PUBLIC_PLAYER_PROFILE_ADDRESS,
      entrypoint: "set_player",
      calldata: [player_id, username, balance, games_played, active_skin, role],
    } as Transaction;
    //console.log('Executing transaction:', transaction);
    const win = window as ControllerWindow;
    const account = win.account;
    if (!account) {
      throw new Error("Account not initialized");
    }
    //console.log('Tx:', transaction.contractAddress, transaction.entrypoint, transaction.calldata);
    const tx_hash = await account.execute(tx);
    console.log("Transaction hash:", tx_hash);
    return tx_hash;
  }

  public UpdateLeaderboard = async () => {
    console.log("New1");
    for (const player of playerData) {
      if (player.role == 1) {      
        console.log("Updating player profile:", player.player_id, player.username, player.balance, player.games_played, player.active_skin, player.role);
        await this.SetPlayerProfile(player.player_id, player.username, player.balance.toString(), player.games_played, player.active_skin.toString(), player.role.toString());
      } else {
        continue;
        // await this.SetPlayerProfile(player.player_id, player.username, "0", player.games_played, player.active_skin.toString(), player.role.toString());
      }
      // sleep for 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }  
  // !!!---- Unity Calls ----!!!

  public GetUsername = (): string => {
    const win = window as ControllerWindow;
    const controllerInstance = win.controllerInstance;
    if (!controllerInstance) {
      throw new Error("Controller not initialized");
    }

    return win.username;
  };

  //controller login
  public ControllerLogin = async () => {
    const win = window as ControllerWindow;
    const handleConnect = win.handleConnect;
    if (!handleConnect) {
      throw new Error("Handle connect not initialized");
    }
    await handleConnect();
    if (this.IsControllerLoggedIn()) {
      this.OnControllerLogin();
    }
  };

  public IsControllerLoggedIn = (): boolean => {
    const win = window as ControllerWindow;
    const account = win.account;
    if (!account) {
      return false;
    }
    return true;
  };

  public CheckControllerLoggedIn = () => {
    const win = window as ControllerWindow;
    const controllerInstance = win.controllerInstance;
    if (!controllerInstance) {
      this.OnControllerNotLoggedIn();
      throw new Error("Controller not initialized");
    }
    console.log("Controller logged in");
    this.OnControllerLogin();
    //this.OnUsernameReceived(win.username);
  };

  public GetControllerUsername = () => {
    const winСontroller = window as ControllerWindow;
    const winUnity = window as UnityWindow;
    const gameInstance = winUnity.gameInstance;
    console.log("Controller username:", winСontroller.username);
    gameInstance.SendMessage(unityReciver, "OnControllerUsername", winСontroller.username);
  }

  // !!!---- Unity events ----!!!

  public OnControllerLogin = () => {
    const winСontroller = window as ControllerWindow;
    const winUnity = window as UnityWindow;
    const gameInstance = winUnity.gameInstance;
    console.log("Controller logged in");
    const data = JSON.stringify({
      username: winСontroller.username,
      address: winСontroller.account.address,
    });
    gameInstance.SendMessage(unityReciver, "OnControllerLogin", data);
  };

  public OnGuestLogin = () => {
    if(IsNewVersion()) {
      return;
    }
    const winUnity = window as UnityWindow;
    const gameInstance = winUnity.gameInstance;
    console.log("Guest logged in");
    const data = JSON.stringify({});
    gameInstance.SendMessage(unityReciver, "OnGuestLogin", data);
  };

  public OnControllerNotLoggedIn = () => {
    console.log("Controller not logged in");
    this.SendEvent("OnControllerNotLoggedIn", "");
  };

  public OnPossibleProblems = (message: string) => {
    const winUnity = window as UnityWindow;
    const gameInstance = winUnity.gameInstance;
    gameInstance.SendMessage(unityReciver, "OnPossibleProblems", message);
  }
}
