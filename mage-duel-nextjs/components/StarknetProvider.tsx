'use client';

import React from 'react';
import { sepolia, mainnet, Chain } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  starkscan,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { toSessionPolicies } from "@cartridge/controller";

// ETH contract address
const ETH_TOKEN_ADDRESS =
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'

// Define session policies
const policies = toSessionPolicies({
  contracts: {
    [ETH_TOKEN_ADDRESS]: {
      methods: [
        {
          name: "approve",
          entrypoint: "approve",
          description: "Approve token spending",
        },
        { name: "transfer", entrypoint: "transfer" },
      ],
    },
  },
})

// Initialize connector
const connector = new ControllerConnector({
  policies,
  defaultChainId: '0x534e5f5345504f4c4941', // SN_SEPOLIA in hex format
  chains: [
    { ...mainnet, rpcUrl: 'https://api.cartridge.gg/x/starknet/mainnet' },
    { ...sepolia, rpcUrl: 'https://api.cartridge.gg/x/starknet/sepolia' }
  ]
})

// Configure RPC provider
const provider = jsonRpcProvider({
  rpc: (chain: Chain) => {
    switch (chain) {
      case mainnet:
        return { nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet' }
      case sepolia:
      default:
        return { nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia' }
    }
  },
})

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      autoConnect
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={[connector]}
      explorer={starkscan}
    >
      {children}
    </StarknetConfig>
  )
} 