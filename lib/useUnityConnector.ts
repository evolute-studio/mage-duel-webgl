"use client";

import { useEffect, useRef } from "react";
import { useAccount, useConnect } from "@starknet-react/core";
import { useStarknetProvider } from "../components/StarknetProvider";
import UnityConnector from "./unity-connector";

export function useUnityConnector() {
  const connectorRef = useRef<UnityConnector | null>(null);
  const { account } = useAccount();
  const { connect } = useConnect();
  const starknetProvider = useStarknetProvider();

  useEffect(() => {
    if (!connectorRef.current) {
      connectorRef.current = new UnityConnector();
    }

    if (account) {
      connectorRef.current.setStarknetContext({
        provider: starknetProvider.provider,
      });
    }
  }, [account, connect, starknetProvider]);

  return connectorRef.current;
}