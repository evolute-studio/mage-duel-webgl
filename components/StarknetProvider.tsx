"use client";

import React from "react";
import { Chain } from "@starknet-react/chains";
import { getSlotChain } from "@/utils/slot";
import {
  StarknetConfig,
  jsonRpcProvider,
  starkscan,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { shortString, num } from "starknet";

const EVOLUTE_DUEL_GAME_ADDRESS = process.env.NEXT_PUBLIC_GAME_ADDRESS || ''
const EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS = process.env.NEXT_PUBLIC_PLAYER_PROFILE_ADDRESS || ''

// Define session policiesAdd commentMore actions
const policies = {
  contracts: {
    [EVOLUTE_DUEL_GAME_ADDRESS]: {
      methods: [
      {
        name: "create_game",
        entrypoint: "create_game",
        description: "create_game",
      },
      { 
          name: "create_snapshot", 
          entrypoint: "create_snapshot", 
          description: "create_snapshot" 
      },
      { 
          name: "create_game_from_snapshot", 
          entrypoint: "create_game_from_snapshot", 
          description: "create_game_from_snapshot" 
      },
      { 
          name: "cancel_game", 
          entrypoint: "cancel_game", 
          description: "cancel_game" 
      },
      { 
          name: "join_game", 
          entrypoint: "join_game", 
          description: "join_game" 
      },
      { 
          name: "make_move", 
          entrypoint: "make_move", 
          description: "make_move" 
      },
      { 
          name: "skip_move", 
          entrypoint: "skip_move", 
          description: "skip_move" 
      },
      { 
          name: "finish_game", 
          entrypoint: "finish_game", 
          description: "finish_game"
      },
      {
        name: "commit_tiles",
        entrypoint: "commit_tiles",
        description: "Commits initial tile hashes from the deck"
      },
      {
        name: "reveal_tile",
        entrypoint: "reveal_tile",
        description: "Reveal tile for everyone"
      },
      {
        name: "request_next_tile",
        entrypoint: "request_next_tile",
        description: "Request next tile"
      },
    ],
  },
  [EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS]: {
      methods: [
        {
          name: "balance",
          entrypoint: "balance",
          description: "balance"
        },
        {
          name: "username",
          entrypoint: "username",
          description: "username"
        },
        {
          name: "change_username",
          entrypoint: "change_username",
          description: "avchange_usernameatar"
        },
        {
          name: "active_skin",
          entrypoint: "active_skin",
          description: "active_skin"
        },
        {
          name: "change_skin",
          entrypoint: "change_skin",
          description: "change_skin"
        },
        {
          name: "become_bot",
          entrypoint: "become_bot",
          description: "become_bot"
        },
        {
          name: "become_controller",
          entrypoint: "become_controller",
          description: "become_controller"
        },
        {
          name: "set_player",
          entrypoint: "set_player",
          description: "set_player"
        }
      ]
    }
  }
}

const slotChain = getSlotChain(
  shortString.encodeShortString(process.env.NEXT_PUBLIC_SLOT_PROJECT || ""),
);

const connector = new ControllerConnector({
  namespace: "evolute_duel",
  slot: "evolute-duel",
  policies,
  defaultChainId: num.toHex(slotChain.id),
  chains: [{ ...slotChain, rpcUrl: process.env.NEXT_PUBLIC_RPC || "" }],
  preset: "mage-duel",
});

// Configure RPC provider
const provider = jsonRpcProvider({
  rpc: (chain: Chain) => {
    switch (chain) {
      case slotChain:
        return { nodeUrl: process.env.NEXT_PUBLIC_RPC || "" };
      default:
        return { nodeUrl: process.env.NEXT_PUBLIC_RPC || "" };
    }
  },
});

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      autoConnect
      chains={[slotChain]}
      provider={provider}
      connectors={[connector]}
      explorer={starkscan}
    >
      {children}
    </StarknetConfig>
  );
}
