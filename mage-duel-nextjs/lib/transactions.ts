const EVOLUTE_DUEL_GAME_ADDRESS =
  '0x039344460b0d9917c58185b47ce77848a6b9d5f0b26639f9faad2cdcb9451239'
const EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS =
  '0x0693f1a1bba2704e2694b2402dbc5de4e4dcaf03aabbf4d2bad3e47c6a3de4dd'

export interface Transaction {
    contractAddress: string;
    entrypoint: string;
    calldata: string[];
}

export const change_username = (newUsername: string) => {
    return {
        contractAddress: EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS,
        entrypoint: "change_username",
        calldata: [newUsername],
    } as Transaction;
}