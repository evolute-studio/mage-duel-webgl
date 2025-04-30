'use client';

import React from 'react';
import { Chain } from "@starknet-react/chains";
import { getSlotChain } from "@/utils/slot";
import {
  StarknetConfig,
  jsonRpcProvider,
  starkscan,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { SessionPolicies } from "@cartridge/presets";
import { shortString, num } from 'starknet';

// ETH contract address
const EVOLUTE_DUEL_GAME_ADDRESS =
  '0x039344460b0d9917c58185b47ce77848a6b9d5f0b26639f9faad2cdcb9451239'
const EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS =
  '0x0693f1a1bba2704e2694b2402dbc5de4e4dcaf03aabbf4d2bad3e47c6a3de4dd'

// Define session policies
const policies: SessionPolicies = {
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
      }
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
      
      ]
    }
  }
}

const slotChain = getSlotChain(shortString.encodeShortString("WP_EVOLUTE_DUEL"));

const connector = new ControllerConnector({
  policies,
  defaultChainId: num.toHex(slotChain.id),
  chains: [
    { ...slotChain, rpcUrl: 'https://api.cartridge.gg/x/evolute-duel/katana'},
  ]
})

// Configure RPC provider
const provider = jsonRpcProvider({
  rpc: (chain: Chain) => {
    switch (chain) {
      case slotChain:
        return { nodeUrl: 'https://api.cartridge.gg/x/evolute-duel/katana' }
      default:
        return { nodeUrl: 'https://api.cartridge.gg/x/evolute-duel/katana' }
    }
  },
})

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
  )
} 