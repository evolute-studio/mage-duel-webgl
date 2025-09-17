"use client";

import { ChainProviderFactory, useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useEffect, useState, useCallback } from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { UnityWindow } from "./UnityPlayer";
import { AccountInterface, RpcProvider } from "starknet";
import { controllerLoginEvent } from "@/lib/events";
import { IsNewVersion } from "@/lib/version-checker";
import { useStarknetProvider } from "./StarknetProvider";

export interface ControllerWindow extends Window {
  controllerInstance: ControllerConnector & {
    disconnect: () => void;
  };
  username: string;
  account: AccountInterface;
  provider: ChainProviderFactory<RpcProvider>;
  handleConnect: () => Promise<boolean>;
  handleDisconnect: () => void;
}

export function ConnectWallet() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, account } = useAccount();
  const starknetProvider = useStarknetProvider();
  const controller = connectors[0] as ControllerConnector;
  const [, setUsername] = useState<string>();
  const [isRetrying, setIsRetrying] = useState(false);

  console.log("[Wallet fix] Component render - connectors:", connectors.length, "controller:", controller?.name);

  // Monitor connector initialization
  useEffect(() => {
    console.log("[Wallet fix] Connectors changed:", {
      count: connectors.length,
      controllers: connectors.map(c => ({ id: c.id, name: c.name, available: c.available() }))
    });

    if (connectors.length === 0) {
      console.log("[Wallet fix] WARNING: No connectors available - this might prevent wallet connection");
    } else if (!controller) {
      console.log("[Wallet fix] WARNING: Controller not found in connectors array");
    } else {
      console.log("[Wallet fix] Controller found:", controller.name, "available:", controller.available());

      // Check if controller might already have a session
      if (controller.available()) {
        console.log("[Wallet fix] Controller is available, checking for existing session...");
        // Try to get controller state without connecting
        try {
          if (typeof controller.account === 'function') {
            const existingAccount = controller.account();
            console.log("[Wallet fix] Existing controller account:", existingAccount ? 'found' : 'none');
          }
        } catch (e) {
          console.log("[Wallet fix] Could not check existing controller account:", e);
        }
      }
    }
  }, [connectors, controller]);

  useEffect(() => {
    console.log("[Wallet fix] useEffect triggered with address:", address, "account:", account);
    console.log("[Wallet fix] Controller state:", {
      isConnected: controller?.available(),
      id: controller?.id,
      name: controller?.name
    });

    if (!address) {
      console.log("[Wallet fix] No address found, checking if controller is available for connection");
      if (controller?.available()) {
        console.log("[Wallet fix] Controller is available but no address - this might indicate a connection issue");
      } else {
        console.log("[Wallet fix] Controller is not available, skipping wallet initialization");
      }
      return;
    }

    console.log("[Wallet fix] Starting controller username retrieval");
    controller.username()?.then((n) => {
      console.log("[Wallet fix] Username retrieved:", n);
      setUsername(n);
      setControllerInstance(controller);
      (window as ControllerWindow).username = n;
      (window as ControllerWindow).provider = starknetProvider.provider;
      console.log("[Wallet fix] Set username and provider on window");

      if (account) {
        console.log("[Wallet fix] Account found, setting up Unity connection");
        (window as ControllerWindow).account = account;
        (window as UnityWindow).unityConnector.OnControllerLogin(n, address);
        (window as UnityWindow).unityConnector.BecomeController();
        controllerLoginEvent();
        console.log("[Wallet fix] Unity connection established and controller login event triggered");
      } else {
        console.log("[Wallet fix] No account found, skipping Unity connection");
      }
    }).catch((error) => {
      console.error("[Wallet fix] Error retrieving username:", error);
    });
  }, [address, account, controller, starknetProvider]);

  const handleConnect = useCallback(async () => {
    console.log("[Wallet fix] handleConnect called, current state - address:", address, "account:", account);

    if (address || account) {
      console.log("[Wallet fix] Controller already connected");
      if(IsNewVersion()) {
        console.log("[Wallet fix] New version found, clearing data and reloading");
        disconnect();
        window.location.reload();
        return false;
      }
      console.log("[Wallet fix] Using existing connection");
      return true;
    }

    console.log("[Wallet fix] Starting new wallet connection");
    try {
      console.log("[Wallet fix] Attempting to connect with controller");
      await connect({ connector: controller });
      setControllerInstance(controller);
      console.log("[Wallet fix] Controller connection successful");
      return true;
    } catch (error: unknown) {
      console.error("[Wallet fix] Connection error:", error);
      if (
        error instanceof Error &&
        error.message.includes("WebAuthn") &&
        !isRetrying
      ) {
        console.log("[Wallet fix] WebAuthn error detected, retrying connection");
        setIsRetrying(true);
        setTimeout(() => {
          console.log("[Wallet fix] Executing retry connection");
          connect({ connector: controller });
          setIsRetrying(false);
        }, 100);
      } else {
        console.error("[Wallet fix] Non-WebAuthn error or already retrying:", error);
      }
    }
    console.log("[Wallet fix] Connection attempt completed with failure");
    return false;
  }, [connect, controller, isRetrying, address, account]);

  const handleDisconnect = useCallback(() => {
    console.log("[Wallet fix] handleDisconnect called");
    disconnect();
    console.log("[Wallet fix] Wallet disconnected");
  }, [disconnect]);

  useEffect(() => {
    console.log("[Wallet fix] Setting up window methods for handleConnect and handleDisconnect");
    console.log("[Wallet fix] Current wallet state before window setup:", {
      hasAddress: !!address,
      hasAccount: !!account,
      controllerAvailable: controller?.available(),
      isRetrying
    });
    (window as ControllerWindow).handleConnect = handleConnect;
    (window as ControllerWindow).handleDisconnect = handleDisconnect;
    console.log("[Wallet fix] Window methods configured successfully");
  }, [handleConnect, handleDisconnect, address, account, controller, isRetrying]);

  // Monitor connection state changes and auto-connect when possible
  useEffect(() => {
    console.log("[Wallet fix] Connection state change detected:");
    console.log("[Wallet fix] - Address:", address);
    console.log("[Wallet fix] - Account:", !!account);
    console.log("[Wallet fix] - Controller available:", controller?.available());
    console.log("[Wallet fix] - Is retrying:", isRetrying);

    if (!address && !account && controller?.available() && !isRetrying) {
      console.log("[Wallet fix] WARNING: Controller is available but no wallet connection detected");
      console.log("[Wallet fix] Attempting auto-connect to resolve the connection issue");

      // Try to auto-connect when controller is available but no address/account
      const autoConnect = async () => {
        try {
          console.log("[Wallet fix] Auto-connect: Starting connection attempt");
          await connect({ connector: controller });
          console.log("[Wallet fix] Auto-connect: Connection successful");
        } catch (error) {
          console.log("[Wallet fix] Auto-connect: Connection failed", error);
        }
      };

      // Delay auto-connect to avoid rapid retries
      const timeoutId = setTimeout(autoConnect, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [address, account, controller, isRetrying, connect]);

  // Add iframe scaling for landscape mode
  useEffect(() => {
    const scaleControllerIframe = (elementId: string) => {
      const iframe = document.getElementById(elementId) as HTMLIFrameElement;
      if (!iframe) return;

      const viewportHeight = window.innerHeight;

      // Original iframe height
      const originalHeight = 600;

      // Calculate scale factor only if viewport height is less than iframe height
      if (viewportHeight < originalHeight) {
        // Calculate scale factor (with a small margin for safety)
        const scaleFactor = viewportHeight / originalHeight;

        // Apply transform - the iframe will maintain its centered position
        iframe.style.transform = `scale(${scaleFactor})`;
        iframe.style.transformOrigin = "center center";
      } else {
        // Reset transform if no scaling needed
        iframe.style.transform = "none";
      }
    };

    // Initial scaling
    scaleControllerIframe("controller-keychain");
    scaleControllerIframe("controller-profile");

    // Add event listeners with proper event typing
    const handleResize = () => {
      scaleControllerIframe("controller-keychain");
      scaleControllerIframe("controller-profile");
    };

    const handleOrientationChange = () => {
      scaleControllerIframe("controller-keychain");
      scaleControllerIframe("controller-profile");
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleOrientationChange);

    const iframe = document.getElementById("controller") as HTMLIFrameElement;
    if (!iframe) return;

    const sync = () => {
      const vis = getComputedStyle(iframe).visibility;
      iframe.style.display = vis === "visible" ? "flex" : "none";
    };

    // watch for style or class changes
    const observer = new MutationObserver(sync);
    observer.observe(iframe, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    sync();

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleOrientationChange);
      observer.disconnect();
    };
  }, [address, account, controller]);

  return <> </>;
}

export function setControllerInstance(controller: ControllerConnector) {
  console.log("[Wallet fix] Setting controller instance on window");
  (window as ControllerWindow).controllerInstance = controller;
  console.log("[Wallet fix] Controller instance set successfully");
}
