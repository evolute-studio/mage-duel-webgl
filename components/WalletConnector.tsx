"use client";

import { ChainProviderFactory, useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useEffect, useState, useCallback } from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { UnityWindow } from "./UnityPlayer";
import { AccountInterface, RpcProvider } from "starknet";
import { controllerLoginEvent } from "@/lib/events";
import { IsNewVersion } from "@/lib/version-checker";
import { useStarknetProvider } from "./StarknetProvider";

// Constants
const IFRAME_ORIGINAL_HEIGHT = 600;
const RETRY_DELAY = 100;
const AUTO_CONNECT_DELAY = 1000;
const HAS_LOGGED_IN_BEFORE_KEY = 'hasLoggedInBefore';
const IFRAME_IDS = {
  KEYCHAIN: "controller-keychain",
  PROFILE: "controller-profile",
  CONTROLLER: "controller"
} as const;

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
  
  // Helper functions for localStorage management
  const hasLoggedInBefore = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(HAS_LOGGED_IN_BEFORE_KEY) === 'true';
  };
  
  const setHasLoggedInBefore = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(HAS_LOGGED_IN_BEFORE_KEY, 'true');
    }
  };
  
  const clearHasLoggedInBefore = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(HAS_LOGGED_IN_BEFORE_KEY);
    }
  };

  console.log("[Wallet] Component render - connectors:", connectors.length, "controller:", controller?.name);

  // Monitor connector initialization
  useEffect(() => {
    // Handle version updates
      if (IsNewVersion()) {
        console.log("[Wallet] New version found, clearing data and reloading");
        disconnect();
        window.location.reload();
      }

    const logConnectorState = () => {
      console.log("[Wallet] Connectors changed:", {
        count: connectors.length,
        controllers: connectors.map(c => ({ 
          id: c.id, 
          name: c.name, 
          available: c.available() 
        }))
      });
    };

    const checkConnectorAvailability = () => {
      if (connectors.length === 0) {
        console.log("[Wallet] WARNING: No connectors available - this might prevent wallet connection");
        return;
      }
      
      if (!controller) {
        console.log("[Wallet] WARNING: Controller not found in connectors array");
        return;
      }

      console.log("[Wallet] Controller found:", controller.name, "available:", controller.available());
      checkExistingSession();
    };

    const checkExistingSession = () => {
      if (!controller?.available()) return;
      
      console.log("[Wallet] Controller is available, checking for existing session...");
      try {
        if (typeof controller.account === 'function') {
          const existingAccount = controller.account();
          console.log("[Wallet] Existing controller account:", existingAccount ? 'found' : 'none');
        }
      } catch (error) {
        console.log("[Wallet] Could not check existing controller account:", error);
      }
    };

    logConnectorState();
    checkConnectorAvailability();
  }, [connectors, controller]);

  // Handle wallet connection state and setup Unity integration
  useEffect(() => {
    const logConnectionState = () => {
      console.log("[Wallet] Connection state - address:", address, "account:", !!account);
      console.log("[Wallet] Controller state:", {
        isConnected: controller?.available(),
        id: controller?.id,
        name: controller?.name
      });
    };

    const handleNoAddress = () => {
      console.log("[Wallet] No address found, checking controller availability");
      if (controller?.available()) {
        console.log("[Wallet] Controller is available but no address - possible connection issue");
      } else {
        console.log("[Wallet] Controller is not available, skipping wallet initialization");
      }
    };

    const setupWalletConnection = async () => {
      try {
        console.log("[Wallet] Starting controller username retrieval");
        const username = await controller.username?.();
        
        if (!username) {
          console.warn("[Wallet] No username retrieved from controller");
          return;
        }

        console.log("[Wallet] Username retrieved:", username);
        setUsername(username);
        setControllerInstance(controller);
        
        // Set up window globals
        const controllerWindow = window as ControllerWindow;
        controllerWindow.username = username;
        controllerWindow.provider = starknetProvider.provider;
        console.log("[Wallet] Set username and provider on window");

        // Setup Unity connection if account is available
        if (account && address) {
          setupUnityConnection(username, address, account);
        } else {
          console.log("[Wallet] No account found, skipping Unity connection");
        }
      } catch (error) {
        console.error("[Wallet] Error retrieving username:", error);
      }
    };

    const setupUnityConnection = (username: string, walletAddress: string, account: AccountInterface) => {
      console.log("[Wallet] Account found, setting up Unity connection");
      const controllerWindow = window as ControllerWindow;
      const unityWindow = window as UnityWindow;
      
      controllerWindow.account = account;
      unityWindow.unityConnector.OnControllerLogin(username, walletAddress);
      unityWindow.unityConnector.BecomeController();
      controllerLoginEvent();
      
      // Mark that user has logged in successfully
      setHasLoggedInBefore();
      console.log("[Wallet] Unity connection established and controller login event triggered");
    };

    logConnectionState();
    
    if (!address) {
      handleNoAddress();
      return;
    }

    setupWalletConnection();
  }, [address, account, controller, starknetProvider]);

  const handleConnect = useCallback(async (): Promise<boolean> => {
    console.log("[Wallet] handleConnect called, current state - address:", address, "account:", !!account);

    // Check if already connected
    if (address || account) {
      console.log("[Wallet] Controller already connected");
      
      console.log("[Wallet] Using existing connection");
      return true;
    }

    return await attemptNewConnection();
  }, [connect, controller, isRetrying, address, account, disconnect]);

  const attemptNewConnection = useCallback(async (): Promise<boolean> => {
    console.log("[Wallet] Starting new wallet connection");
    
    try {
      console.log("[Wallet] Attempting to connect with controller");
      await connect({ connector: controller });
      setControllerInstance(controller);
      // Mark that user has logged in successfully
      setHasLoggedInBefore();
      console.log("[Wallet] Controller connection successful");
      return true;
    } catch (error: unknown) {
      console.error("[Wallet] Connection error:", error);
      
      if (shouldRetryConnection(error)) {
        handleRetryConnection();
      } else {
        console.error("[Wallet] Non-WebAuthn error or already retrying:", error);
      }
    }
    
    console.log("[Wallet] Connection attempt completed with failure");
    return false;
  }, [connect, controller, isRetrying]);

  const shouldRetryConnection = (error: unknown): boolean => {
    return (
      error instanceof Error &&
      error.message.includes("WebAuthn") &&
      !isRetrying
    );
  };

  const handleRetryConnection = () => {
    console.log("[Wallet] WebAuthn error detected, retrying connection");
    setIsRetrying(true);
    
    setTimeout(() => {
      console.log("[Wallet] Executing retry connection");
      connect({ connector: controller });
      setIsRetrying(false);
    }, RETRY_DELAY);
  };

  const handleDisconnect = useCallback(() => {
    console.log("[Wallet] handleDisconnect called");
    disconnect();
    // Clear login history so user won't get auto-reconnected
    clearHasLoggedInBefore();
    console.log("[Wallet] Wallet disconnected and login history cleared");
  }, [disconnect]);

  // Expose wallet methods to window for Unity integration
  useEffect(() => {
    console.log("[Wallet] Setting up window methods for handleConnect and handleDisconnect");
    console.log("[Wallet] Current wallet state before window setup:", {
      hasAddress: !!address,
      hasAccount: !!account,
      controllerAvailable: controller?.available(),
      isRetrying
    });
    
    const controllerWindow = window as ControllerWindow;
    controllerWindow.handleConnect = handleConnect;
    controllerWindow.handleDisconnect = handleDisconnect;
    
    console.log("[Wallet] Window methods configured successfully");
  }, [handleConnect, handleDisconnect, address, account, controller, isRetrying]);

  // Monitor connection state changes and auto-connect when possible
  useEffect(() => {
    const logConnectionState = () => {
      console.log("[Wallet] Connection state change detected:");
      console.log("[Wallet] - Address:", address);
      console.log("[Wallet] - Account:", !!account);
      console.log("[Wallet] - Controller available:", controller?.available());
      console.log("[Wallet] - Is retrying:", isRetrying);
    };

    const shouldAutoConnect = (): boolean => {
      // Only auto-connect if user has logged in before
      return !address && !account && controller?.available() && !isRetrying && hasLoggedInBefore();
    };

    const autoConnect = async () => {
      try {
        console.log("[Wallet] Auto-connect: Starting connection attempt");
        await connect({ connector: controller });
        console.log("[Wallet] Auto-connect: Connection successful");
      } catch (error) {
        console.log("[Wallet] Auto-connect: Connection failed", error);
      }
    };

    logConnectionState();

    if (shouldAutoConnect()) {
      console.log("[Wallet] WARNING: Controller is available but no wallet connection detected");
      console.log("[Wallet] User has logged in before - attempting auto-connect to resolve the connection issue");

      // Delay auto-connect to avoid rapid retries
      const timeoutId = setTimeout(autoConnect, AUTO_CONNECT_DELAY);
      return () => clearTimeout(timeoutId);
    } else if (!address && !account && controller?.available() && !isRetrying && !hasLoggedInBefore()) {
      console.log("[Wallet] Controller is available but user hasn't logged in before - skipping auto-connect");
    }
  }, [address, account, controller, isRetrying, connect]);

  // Handle iframe scaling and display synchronization
  useEffect(() => {
    const scaleControllerIframe = (elementId: string): void => {
      const iframe = document.getElementById(elementId) as HTMLIFrameElement;
      if (!iframe) return;

      const viewportHeight = window.innerHeight;
      const shouldScale = viewportHeight < IFRAME_ORIGINAL_HEIGHT;

      if (shouldScale) {
        const scaleFactor = viewportHeight / IFRAME_ORIGINAL_HEIGHT;
        iframe.style.transform = `scale(${scaleFactor})`;
        iframe.style.transformOrigin = "center center";
      } else {
        iframe.style.transform = "none";
      }
    };

    const handleViewportChange = (): void => {
      scaleControllerIframe(IFRAME_IDS.KEYCHAIN);
      scaleControllerIframe(IFRAME_IDS.PROFILE);
    };

    const setupDisplaySync = (): MutationObserver | null => {
      const iframe = document.getElementById(IFRAME_IDS.CONTROLLER) as HTMLIFrameElement;
      if (!iframe) return null;

      const syncDisplay = (): void => {
        const visibility = getComputedStyle(iframe).visibility;
        iframe.style.display = visibility === "visible" ? "flex" : "none";
      };

      const observer = new MutationObserver(syncDisplay);
      observer.observe(iframe, {
        attributes: true,
        attributeFilter: ["style", "class"],
      });

      syncDisplay();
      return observer;
    };

    // Initial setup
    handleViewportChange();
    const observer = setupDisplaySync();

    // Event listeners
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("orientationchange", handleViewportChange);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("orientationchange", handleViewportChange);
      observer?.disconnect();
    };
  }, [address, account, controller]);

  return <> </>;
}

export function setControllerInstance(controller: ControllerConnector): void {
  console.log("[Wallet] Setting controller instance on window");
  (window as ControllerWindow).controllerInstance = controller;
  console.log("[Wallet] Controller instance set successfully");
}
