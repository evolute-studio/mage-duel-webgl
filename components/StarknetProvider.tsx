"use client";

import React, { createContext, useContext } from "react";
import { Chain } from "@starknet-react/chains";
import { getSlotChain } from "@/utils/slot";
import {
  ChainProviderFactory,
  StarknetConfig,
  jsonRpcProvider,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { shortString, num, RpcProvider } from "starknet";

const EVOLUTE_DUEL_GAME_ADDRESS = process.env.NEXT_PUBLIC_GAME_ADDRESS || "";
const EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS = process.env.NEXT_PUBLIC_PLAYER_PROFILE_ADDRESS || "";
const EVOLUTE_DUEL_ACCOUNT_MIGRATION_ADDRESS = process.env.NEXT_PUBLIC_ACCOUNT_MIGRATION_ADDRESS || "";
const EVOLUTE_DUEL_TUTORIAL_ADDRESS = process.env.NEXT_PUBLIC_TUTORIAL_ADDRESS || "";
const EVOLUTE_DUEL_EVOLUTE_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_EVOLUTE_TOKEN_ADDRESS || "";
const EVOLUTE_DUEL_TOURNAMENT_ADDRESS = process.env.NEXT_PUBLIC_TOURNAMENT_ADDRESS || "";
const EVOLUTE_DUEL_TOURNAMENT_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOURNAMENT_TOKEN_ADDRESS || "";
const EVOLUTE_DUEL_MATCHMAKING_ADDRESS = process.env.NEXT_PUBLIC_MATCHMAKING_ADDRESS || "";
const EVOLUTE_DUEL_WORLD_ADDRESS = process.env.NEXT_PUBLIC_WORLD_ADDRESS || "";


// Define session policiesAdd commentMore actions
const policies = {
  contracts: {
    [EVOLUTE_DUEL_ACCOUNT_MIGRATION_ADDRESS]: {
      methods: [
        {
          name: "confirm_migration",
          entrypoint: "confirm_migration",
          description: "confirm_migration",
        },
      ],
    },
    [EVOLUTE_DUEL_EVOLUTE_TOKEN_ADDRESS]: {
      methods: [
        {
          name: "approve",
          entrypoint: "approve",
          description: "approve",
        },
      ],
    },
    [EVOLUTE_DUEL_GAME_ADDRESS]: {
      methods: [
        {
          name: "commit_tiles",
          entrypoint: "commit_tiles",
          description: "Commits initial tile hashes from the deck",
        },
        {
          name: "finish_game",
          entrypoint: "finish_game",
          description: "finish_game",
        },
        {
          name: "make_move",
          entrypoint: "make_move",
          description: "make_move",
        },
        {
          name: "request_next_tile",
          entrypoint: "request_next_tile",
          description: "Request next tile",
        },
        {
          name: "reveal_tile",
          entrypoint: "reveal_tile",
          description: "Reveal tile for everyone",
        },
        {
          name: "skip_move",
          entrypoint: "skip_move",
          description: "skip_move",
        },
      ],
    },
    [EVOLUTE_DUEL_MATCHMAKING_ADDRESS]: {
      methods: [
        {
          name: "auto_match",
          entrypoint: "auto_match",
          description: "auto_match",
        },
        {
          name: "cancel_game",
          entrypoint: "cancel_game",
          description: "cancel_game",
        },
        {
          name: "create_game",
          entrypoint: "create_game",
          description: "create_game",
        },
        {
          name: "join_game",
          entrypoint: "join_game",
          description: "join_game",
        },
      ],
      
    },

    [EVOLUTE_DUEL_PLAYER_PROFILE_ACTIONS_ADDRESS]: {
      methods: [
        {
          name: "balance",
          entrypoint: "balance",
          description: "balance",
        },
        {
          name: "username",
          entrypoint: "username",
          description: "username",
        },
        {
          name: "change_username",
          entrypoint: "change_username",
          description: "avchange_usernameatar",
        },
        {
          name: "active_skin",
          entrypoint: "active_skin",
          description: "active_skin",
        },
        {
          name: "change_skin",
          entrypoint: "change_skin",
          description: "change_skin",
        },
        {
          name: "become_bot",
          entrypoint: "become_bot",
          description: "become_bot",
        },
        {
          name: "become_controller",
          entrypoint: "become_controller",
          description: "become_controller",
        },
        {
          name: "set_player",
          entrypoint: "set_player",
          description: "set_player",
        },
      ],
    },
    [EVOLUTE_DUEL_TOURNAMENT_ADDRESS]: {
      methods: [
        {
          name: "enter_tournament",
          entrypoint: "enter_tournament",
          description: "enter_tournament",
        },
        {
          name: "submit_score",
          entrypoint: "submit_score",
          description: "submit_score",
        },
      ],
      
    },
    [EVOLUTE_DUEL_TOURNAMENT_TOKEN_ADDRESS]: {
      methods: [
        {
          name: "enlist_duelist",
          entrypoint: "enlist_duelist",
          description: "enlist_duelist",
        },
        {
          name: "join_duel",
          entrypoint: "join_duel",
          description: "join_duel",
        },
      ],
    },
    [EVOLUTE_DUEL_TUTORIAL_ADDRESS]: {
      methods: [
        {
          name: "make_move",
          entrypoint: "make_move",
          description: "make_move",
        },
        {
          name: "skip_move",
          entrypoint: "skip_move",
          description: "skip_move",
        },
      ],
    },
    
  },
};

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

interface StarknetContextType {
  connector: ControllerConnector;
  slotChain: Chain;
  provider: ChainProviderFactory<RpcProvider>
  policies: typeof policies;
}

const StarknetContext = createContext<StarknetContextType | undefined>(undefined);

export function useStarknetProvider() {
  const context = useContext(StarknetContext);
  if (!context) {
    throw new Error("useStarknetProvider must be used within a StarknetProvider");
  }
  return context;
}

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  const contextValue: StarknetContextType = {
    connector,
    slotChain,
    provider,
    policies,
  };

  return (
    <StarknetContext.Provider value={contextValue}>
    <StarknetConfig
      autoConnect
      chains={[slotChain]}
      provider={provider}
      connectors={[connector]}
    >
      {children}
    </StarknetConfig>
    </StarknetContext.Provider>
  );
}
