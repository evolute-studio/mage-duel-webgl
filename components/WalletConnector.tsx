"use client";

import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useEffect, useState, useCallback } from "react";
import ControllerConnector from "@cartridge/connector/controller";
import { UnityWindow } from "./UnityPlayer";
import { AccountInterface } from "starknet";
import { controllerLoginEvent } from "@/lib/events";
import { IsNewVersion } from "@/lib/version-checker";

export interface ControllerWindow extends Window {
  controllerInstance: ControllerConnector & {
    disconnect: () => void;
  };
  username: string;
  account: AccountInterface;
  handleConnect: () => Promise<boolean>;
  handleDisconnect: () => void;
}

export function ConnectWallet() {
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, account } = useAccount();
  const controller = connectors[0] as ControllerConnector;
  const [, setUsername] = useState<string>();
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!address) return;
    controller.username()?.then((n) => {
      setUsername(n);
      setControllerInstance(controller);
      (window as ControllerWindow).username = n;
      if (account) {
        (window as ControllerWindow).account = account;
      }
      (window as UnityWindow).unityConnector.OnControllerLogin();
      (window as UnityWindow).unityConnector.BecomeController();
      controllerLoginEvent();
    });
  }, [address, account, controller]);

  const handleConnect = useCallback(async () => {
    if (address || account) {
      console.log("Controller already connected");
      if(IsNewVersion()) {
        console.log("[WalletConnector] New version found, clearing data");
        disconnect();
        window.location.reload();
        return false;
      }
      return true;
    }
    try {
      await connect({ connector: controller });
      setControllerInstance(controller);
      return true;
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message.includes("WebAuthn") &&
        !isRetrying
      ) {
        setIsRetrying(true);
        setTimeout(() => {
          connect({ connector: controller });
          setIsRetrying(false);
        }, 100);
      }
    }
    return false;
  }, [connect, controller, isRetrying, address, account]);

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  useEffect(() => {
    (window as ControllerWindow).handleConnect = handleConnect;
    (window as ControllerWindow).handleDisconnect = handleDisconnect;
  }, [handleConnect, handleDisconnect]);

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
  (window as ControllerWindow).controllerInstance = controller;
}
