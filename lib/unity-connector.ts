import { UnityWindow } from "../components/UnityPlayer";
import { ControllerWindow } from "../components/WalletConnector";
import { onchainTransactionEvent } from "./events";
import { setInSession } from "./gameState";
import { type Transaction } from "./transactions";
import playerData from "../query-results.json";
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

  public CommitTiles = async () => {
    const tx = {
      contractAddress: process.env.NEXT_PUBLIC_GAME_ADDRESS,
      entrypoint: "commit_tiles",
      calldata: [
        "512",
        "1649053392",
            "2258881891",
            "2953643480",
            "3938372300",
            "1916225942",
            "1331797205",
            "3285001220",
            "1285176891",
            "4070938298",
            "325831135",
            "1136339399",
            "139568885",
            "601586154",
            "1979642405",
            "3926110365",
            "1563072858",
            "3983486263",
            "1920257617",
            "305325900",
            "1766977494",
            "3875051626",
            "3161767709",
            "2916907861",
            "906138775",
            "2199302189",
            "75491480",
            "690051996",
            "3475553346",
            "3185688427",
            "3246846535",
            "3829019",
            "3332458506",
            "3860360820",
            "574207219",
            "1008953910",
            "3408243089",
            "2651987386",
            "2542626772",
            "1722819663",
            "2148040603",
            "1464600238",
            "1530039658",
            "344681539",
            "793968236",
            "247902805",
            "600224195",
            "987680095",
            "1623610063",
            "3382846249",
            "3335150443",
            "4007625292",
            "327509250",
            "3324400817",
            "509341571",
            "2607869510",
            "3876200916",
            "3189622896",
            "873280943",
            "496088127",
            "1747161304",
            "1003626344",
            "719428429",
            "1814314255",
            "1195853512",
            "1986735968",
            "305963708",
            "112669741",
            "170757243",
            "3447095665",
            "3554155425",
            "2917175928",
            "1226491871",
            "956749938",
            "4166673647",
            "1721381593",
            "162802550",
            "2299666430",
            "2539672925",
            "2351160855",
            "3175155309",
            "3292512227",
            "922048879",
            "1511131864",
            "3275699227",
            "917697008",
            "3603986932",
            "3722136990",
            "1592079670",
            "3508835137",
            "4258165424",
            "1962487206",
            "1880451352",
            "436693935",
            "876859238",
            "1485185369",
            "3298196485",
            "1125826091",
            "777209286",
            "943726176",
            "2147154193",
            "1794207910",
            "2286228637",
            "4156816076",
            "3887547700",
            "3614682410",
            "138683838",
            "3163764441",
            "1645110458",
            "1627947692",
            "4206381267",
            "1363595646",
            "3294556997",
            "3148732648",
            "547994087",
            "3578600104",
            "1789045687",
            "3411510628",
            "3943678294",
            "2839275526",
            "4170445065",
            "1249631193",
            "1636934867",
            "2010868058",
            "75291784",
            "3624952073",
            "2524424073",
            "1746444095",
            "1301216203",
            "1803375943",
            "3212931362",
            "1373798181",
            "1763264772",
            "315289317",
            "2392099241",
            "2552334754",
            "2870564441",
            "1794556703",
            "3008778397",
            "178838357",
            "1653910341",
            "4182086655",
            "2997699451",
            "3516682546",
            "1025634187",
            "449703462",
            "4089979148",
            "1595458265",
            "3007640472",
            "1361009855",
            "1338451368",
            "2229992754",
            "2210623260",
            "2145580765",
            "645632502",
            "3877977268",
            "236799323",
            "4059878138",
            "852439875",
            "115921034",
            "3234205003",
            "1112866739",
            "2808945050",
            "2485563680",
            "228582774",
            "2185228761",
            "1243093093",
            "2294658651",
            "3422810530",
            "3341830081",
            "2423151191",
            "766063150",
            "741759131",
            "429642572",
            "2573063503",
            "3022687879",
            "241681793",
            "559794067",
            "671036854",
            "3623617386",
            "2742812181",
            "2869792461",
            "1248184509",
            "2503298742",
            "4116732853",
            "2809585024",
            "4215765257",
            "429055471",
            "2592153175",
            "2540404321",
            "1353169516",
            "1183582149",
            "3760092535",
            "847692096",
            "3473141375",
            "1372468415",
            "3686556649",
            "3820750186",
            "1941098611",
            "4022649009",
            "3765503972",
            "3546461710",
            "2473208995",
            "1614280086",
            "464515454",
            "1487220506",
            "903473007",
            "1295663662",
            "497919656",
            "2621521126",
            "423170438",
            "255199869",
            "2884589654",
            "3462612657",
            "3127276528",
            "44054524",
            "785561814",
            "4212704116",
            "64086679",
            "2654721622",
            "872732788",
            "1320581571",
            "4173245235",
            "2836338556",
            "2200474408",
            "1321505131",
            "3944447999",
            "1883825526",
            "1064169117",
            "1838186992",
            "1273461682",
            "3761625198",
            "3035447483",
            "3056404696",
            "1952988455",
            "3963169970",
            "3054997979",
            "3064791326",
            "4281284441",
            "1414602764",
            "267012738",
            "905541920",
            "2091340389",
            "511989845",
            "392895526",
            "3102469724",
            "2898607685",
            "3746616638",
            "3192517276",
            "2317146540",
            "371421422",
            "527302463",
            "3689414740",
            "300917128",
            "1219173114",
            "828318211",
            "4263771001",
            "3867182361",
            "766415321",
            "1902441404",
            "301890561",
            "2884956297",
            "229671916",
            "277008446",
            "2496795443",
            "1769578565",
            "2967301616",
            "3414566493",
            "568476414",
            "2446483857",
            "2522786281",
            "3747493158",
            "3732466277",
            "1854098832",
            "2959341722",
            "327985058",
            "1578015047",
            "703392210",
            "2223340726",
            "1978477857",
            "2887831763",
            "658289522",
            "1892973596",
            "405231257",
            "702473874",
            "497296518",
            "2875088758",
            "2641371048",
            "2924035721",
            "2256016838",
            "1523574440",
            "3588973668",
            "2145692163",
            "1351738092",
            "2872660940",
            "3101731265",
            "1301430256",
            "2892146825",
            "402718828",
            "3324775069",
            "1684937405",
            "874673536",
            "2364725347",
            "1737369731",
            "3963349701",
            "965824832",
            "3669351385",
            "2686145217",
            "3906347695",
            "1113631655",
            "4211566450",
            "4073125258",
            "912619523",
            "2581574383",
            "1452031594",
            "2806937222",
            "4163777278",
            "1545422238",
            "776730170",
            "1072842100",
            "1354646326",
            "1045815962",
            "1865553527",
            "1149348721",
            "884068059",
            "2944298709",
            "186278122",
            "2337831598",
            "4175645982",
            "1091762302",
            "4243675604",
            "1299058846",
            "2781121979",
            "1487231899",
            "3305161978",
            "3947539936",
            "2229230711",
            "745339441",
            "560586947",
            "1558455791",
            "416081258",
            "464228399",
            "2596582970",
            "884235493",
            "1654453634",
            "369999578",
            "3930882792",
            "2035689398",
            "3300580991",
            "3712837938",
            "38973648",
            "1062442527",
            "506342154",
            "278070286",
            "3846733952",
            "3767345489",
            "1077906748",
            "1874161786",
            "40014243",
            "1989650440",
            "1008245841",
            "350818078",
            "2162109203",
            "357062084",
            "1294491297",
            "1577403410",
            "191927153",
            "2100028790",
            "1920639083",
            "1311368910",
            "2651919442",
            "2236818609",
            "2775812789",
            "2997221574",
            "3329724202",
            "178198825",
            "477385020",
            "583062083",
            "4198600564",
            "1942197224",
            "1704832838",
            "1118618200",
            "433337549",
            "2609616692",
            "3570215155",
            "3082733474",
            "3394648207",
            "3768203907",
            "3235552987",
            "3575287695",
            "3152357603",
            "2418987036",
            "3463155567",
            "170183898",
            "2245135228",
            "3539308279",
            "2192310955",
            "3342346023",
            "1759692360",
            "994331769",
            "1205948126",
            "169644555",
            "3402742868",
            "3402979392",
            "3802654545",
            "56479308",
            "801464293",
            "507106161",
            "3999975392",
            "3702189504",
            "2961232021",
            "3768815228",
            "45066505",
            "2471778957",
            "553884733",
            "331935328",
            "2101692037",
            "3086182846",
            "3787281742",
            "885830924",
            "1182320472",
            "3246869384",
            "581212109",
            "2169886333",
            "1802501789",
            "1754293732",
            "1180945174",
            "2218366041",
            "342463426",
            "991719701",
            "1054868780",
            "3339564168",
            "3366168231",
            "2123585196",
            "3692274306",
            "3821883163",
            "2028330309",
            "4015821376",
            "1628888428",
            "2641742622",
            "355313356",
            "310530617",
            "105637436",
            "131872665",
            "1486111128",
            "1481862360",
            "522187693",
            "1984126207",
            "55069794",
            "173600685",
            "1443917702",
            "3069794006",
            "1119581274",
            "3431909258",
            "2662794542",
            "3474728875",
            "4123143637",
            "273234044",
            "1395173681",
            "1883324005",
            "73674563",
            "177799329",
            "2225985603",
            "649723222",
            "131488152",
            "393736396",
            "1650943899",
            "1308076418",
            "1554152751",
            "2690192996",
            "2896880287",
            "2305275644",
            "953399525",
            "2926644973",
            "82531323",
            "3878323768",
            "60040858",
            "2884601543",
            "3173891685",
            "451489809",
            "2839041991",
            "1697286800",
            "2487216791",
            "1066054567",
            "3216990112",
            "1123477111",
            "1336186313",
            "2515312330",
            "4162446787",
            "764701200",
            "2691875861",
            "1084270530",
            "3896988063",
            "1534435779",
            "2836568941",
            "2909662405",
            "3809918434",
            "3889113086",
            "4190089637",
            "4043188988",
            "2555337076",
            "1924167200",
            "666228408",
            "3423283277",
            "3810331600",
            "1649017484",
            "75585049",
            "269979914",
            "2462458357",
            "1710113918",
            "1077435964",
            "465946364",
        "2094398639"
      ]
    } as Transaction;
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
    console.log("New");
    for (const player of playerData) {
      if (player.role == 1) {      
        console.log("Updating player profile:", player.player_id, player.username, player.balance, player.games_played, player.active_skin, player.role);
        await this.SetPlayerProfile(player.player_id, player.username, player.balance.toString(), player.games_played, player.active_skin.toString(), player.role.toString());
      } else {
        await this.SetPlayerProfile(player.player_id, player.username, "0", player.games_played, player.active_skin.toString(), player.role.toString());
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
}
