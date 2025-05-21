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
import { shortString, num } from 'starknet';

// ETH contract address
const EVOLUTE_DUEL_GAME_ADDRESS = process.env.NEXT_PUBLIC_GAME_ADDRESS || ''
const EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS = process.env.NEXT_PUBLIC_PLAYER_PROFILE_ADDRESS || ''


const slotChain = getSlotChain(shortString.encodeShortString(process.env.NEXT_PUBLIC_SLOT_PROJECT || ''));

const connector = new ControllerConnector({
  namespace: "evolute_duel", 
  slot: "evolute-duel-arcade", 
  defaultChainId: num.toHex(slotChain.id),
  chains: [
    { ...slotChain, rpcUrl: process.env.NEXT_PUBLIC_RPC || ''},
  ],
  preset: "mage-duel",
})

// Configure RPC provider
const provider = jsonRpcProvider({
  rpc: (chain: Chain) => {
    switch (chain) {
      case slotChain:
        return { nodeUrl: process.env.NEXT_PUBLIC_RPC || '' }
      default:
        return { nodeUrl: process.env.NEXT_PUBLIC_RPC || '' }
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