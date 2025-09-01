import { UnityWindow } from "../components/UnityPlayer";
import { ControllerWindow } from "../components/WalletConnector";
import { onchainTransactionEvent } from "./events";
import { setInSession } from "./gameState";
import { enlist_duelist, enter_tournament, evlt_token_balance_of, Period, type Transaction } from "./transactions";
import playerData from "../query-results.json";
import { IsNewVersion } from "./version-checker";
import { CairoOption, CairoOptionVariant, RpcProvider, shortString } from "starknet";
import { getSlotChain } from "@/utils/slot";
import { ChainProviderFactory } from "@starknet-react/core";
const unityReciver = "WrapperTester";

interface StarknetProviderContext {
  provider: ChainProviderFactory<RpcProvider>;
}

const slotChain = getSlotChain(
  shortString.encodeShortString(process.env.NEXT_PUBLIC_SLOT_PROJECT || ""),
);

let provider: RpcProvider;

export default class UnityConnector {
  private starknetContext?: StarknetProviderContext;

  constructor(starknetContext?: StarknetProviderContext) {
    this.starknetContext = starknetContext;
  }

  setStarknetContext(context: StarknetProviderContext) {
    this.starknetContext = context;
  }
  // !!!---- Transactions ----!!!
  public ExecuteTransaction = async (tx: Transaction | string) => {
    const transaction =
      typeof tx === "string" ? (JSON.parse(tx) as Transaction) : tx;
    console.log('Executing transaction:', transaction);
    const win = window as ControllerWindow;
    const account = win.account;
    if (!account) {
      throw new Error("Account not initialized");
    }
    
    const tx_hash = await account.execute(transaction);
    console.log("Transaction hash:", tx_hash);
    onchainTransactionEvent(transaction);
    this.checkTransaction(transaction);
    return tx_hash;
  };

  public CallContract = async (tx: Transaction | string) => {
    const transaction =
      typeof tx === "string" ? (JSON.parse(tx) as Transaction) : tx;
    console.log('Calling contract:', transaction);

    const win = window as ControllerWindow;
    const providerFunc = win.provider;
    if (!provider) {
      const newProvider = providerFunc(slotChain);
      if (!newProvider) {
        throw new Error("Provider could not be initialized");
      }
      provider = newProvider;
    }
    console.log("Provider:", provider);
    console.log("Chain ID:", provider.getChainId());

    const response = await provider.callContract(transaction);
    console.log("Contract call response:", response);
    return response;
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
      tutorialAddress: process.env.NEXT_PUBLIC_TUTORIAL_ADDRESS,
      accountMigrationAddress: process.env.NEXT_PUBLIC_ACCOUNT_MIGRATION_ADDRESS,
      matchmakingAddress: process.env.NEXT_PUBLIC_MATCHMAKING_ADDRESS,
      worldAddress: process.env.NEXT_PUBLIC_WORLD_ADDRESS,
      slotDataVersion: process.env.NEXT_PUBLIC_SLOT_DATA_VERSION,
      feedbackWebhookUrl: process.env.NEXT_PUBLIC_FEEDBACK_WEBHOOK,
      bugsWebhookUrl: process.env.NEXT_PUBLIC_BUGS_WEBHOOK,
      possibleProblemsWebhookUrl: process.env.NEXT_PUBLIC_POSSIBLE_PROBLEMS_WEBHOOK,
      criticalIssueWebhookUrl: process.env.NEXT_PUBLIC_CRITICAL_ISSUES_WEBHOOK,
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

  public EnrollToCurrentTournament = async () => {
    const tournamentId = "0x3";
    await this.EnterTournament(tournamentId);
  };

  public EnterTournament = async (tournamentId: string) =>{
    const playerName = this.GetUsername();
    const playerAddress = this.GetAddress();
    const qualification = new CairoOption<Period>(CairoOptionVariant.None)

    const tx = enter_tournament(tournamentId, playerName, playerAddress, qualification);
    const response = await this.CallContract(tx);
    const txHash = await this.ExecuteTransaction(tx);
    console.log("Enter tournament response:", response);
    console.log("Enter tournament txHash:", txHash);
    const passId = response[0];
    console.log("Pass ID:", passId);
    this.EnlistDuelist(passId);
  }

  public EnlistDuelist = async (passId: string) => {

    const tx = enlist_duelist(passId);
    const response = await this.ExecuteTransaction(tx);
    console.log("Enlist duelist response:", response);
    this.SendEventToUnity("OnDuelistEnlisted");
  }

  public GetUsername = (): string => {
    const win = window as ControllerWindow;
    const controllerInstance = win.controllerInstance;
    if (!controllerInstance) {
      throw new Error("Controller not initialized");
    }

    return win.username;
  };

  public GetAddress = (): string => {    
    const win = window as ControllerWindow;
    const controllerInstance = win.controllerInstance;
    if (!controllerInstance) {
      throw new Error("Controller not initialized");
    }

    return win.account.address;
  }

  // ulong
  public GetEvltBalance = async (playerAddress: string): Promise<bigint> => {
    const tx = evlt_token_balance_of(playerAddress);
    const response = await this.CallContract(tx);
    const result = BigInt(response[0]);
    return result;
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
      this.OnControllerLogin(win.username, win.account.address);
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

  public GetControllerUsername = () => {
    const winСontroller = window as ControllerWindow;
    const winUnity = window as UnityWindow;
    const gameInstance = winUnity.gameInstance;
    console.log("Controller username:", winСontroller.username);
    gameInstance.SendMessage(unityReciver, "OnControllerUsername", winСontroller.username);
  }

  // !!!---- Unity events ----!!!

  public OnControllerLogin = (username: string, address: string) => {
    const winUnity = window as UnityWindow;
    const gameInstance = winUnity.gameInstance;

    // if username or address null or empty
    if (!username || !address) {
      console.error("Controller login failed: missing" + (!username ? " username" : "") + (!address ? " address" : ""));
      return;
    }

    const data = JSON.stringify({
      username: username,
      address: address,
    });
    console.log("Controller login successful:", data);
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

  public HideLoadingOverlay = () => {
    const overlay = document.getElementById("game-loading-overlay");
    if (overlay) {
      overlay.style.display = "none";
    }
    console.log("Loading overlay hidden by Unity");
  };

  public SendEventToUnity(eventName: string) {
    const winUnity = window as UnityWindow;
    const gameInstance = winUnity.gameInstance;
    gameInstance.SendMessage(unityReciver, "OnWebEvent", JSON.stringify({ event: eventName }));
  }
}
