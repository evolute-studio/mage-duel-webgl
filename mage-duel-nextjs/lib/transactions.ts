import { BigNumberish } from "starknet";

import { CairoOption } from "starknet";

const EVOLUTE_DUEL_GAME_ADDRESS = process.env.NEXT_PUBLIC_GAME_ADDRESS || '';
const EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS = process.env.NEXT_PUBLIC_PLAYER_PROFILE_ADDRESS || '';

export interface Transaction {
    contractAddress: string;
    entrypoint: string;
    calldata: string[];
}

export const create_game = () => {
    return {
        contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
        entrypoint: "create_game",
        calldata: [],
    } as Transaction;
}

export const create_game_from_snapshot = (snapshotId: string) => {
  return {
      contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
      entrypoint: "create_game_from_snapshot",
      calldata: [snapshotId],
  } as Transaction;
}

export const create_snapshot = (boardId: string, moveNumber: string) => {
  return {
      contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
      entrypoint: "create_snapshot",
      calldata: [boardId, moveNumber],
  } as Transaction;
}

export const finish_game = (boardId: string) => {
  return {
      contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
      entrypoint: "finish_game",
      calldata: [boardId],
  } as Transaction;
}

export const join_game = (hostPlayer: string) => {
  return {
      contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
      entrypoint: "join_game",
      calldata: [hostPlayer],
  } as Transaction;
}

export const make_move = (jokerTile: CairoOption<string>, rotation: string, col: string, row: string) => {
  return {
      contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
      entrypoint: "make_move",
      calldata: [jokerTile, rotation, col, row],
  } as Transaction;
}

export const skip_move = () => {
  return {
      contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
      entrypoint: "skip_move",
      calldata: [],
  } as Transaction;
}

export const cancel_game = () => {
  return {
      contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
      entrypoint: "cancel_game",
      calldata: [],
  } as Transaction;
}


export const active_skin = () => {
  return {
      contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
      entrypoint: "active_skin",
      calldata: [],
  } as Transaction;
}


export const balance = () => {
  return {
      contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
      entrypoint: "balance",
      calldata: [],
  } as Transaction;
}

export const become_bot = () => {
  return {
      contractAddress: EVOLUTE_DUEL_GAME_ADDRESS,
      entrypoint: "become_bot",
      calldata: [],
  } as Transaction;
}

export const change_skin = (skinId: string) => {
  return {
      contractAddress: EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS,
      entrypoint: "change_skin",
      calldata: [skinId],
  } as Transaction;
}

export const change_username = (newUsername: string) => {
    return {
        contractAddress: EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS,
        entrypoint: "change_username",
        calldata: [newUsername],
    } as Transaction;
}

export const username = () => {
  return {
      contractAddress: EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS,
      entrypoint: "username",
      calldata: [],
  } as Transaction;
}
