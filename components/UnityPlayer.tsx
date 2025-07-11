"use client";

import UnityConnector from "@/lib/unity-connector";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GameLoaded } from "../lib/events";
import { GameVersion } from "@/lib/version-checker";

interface UnityInstance {
  SendMessage: (
    objectName: string,
    methodName: string,
    ...args: unknown[]
  ) => void;
}

interface UnityConfig {
  dataUrl: string;
  frameworkUrl: string;
  codeUrl: string;
  streamingAssetsUrl: string;
  companyName: string;
  productName: string;
  productVersion: string;
  loaderUrl: string;
}

export interface UnityWindow extends Window {
  gameInstance: UnityInstance;
  createUnityInstance: (
    canvas: HTMLCanvasElement | null,
    config: UnityConfig,
    onProgress?: (progress: number) => void,
  ) => Promise<UnityInstance>;
  unityConnector: UnityConnector;
}

export default function UnityPlayer({
  onUnityContainerMounted,
  onGameLoaded,
}: {
  onUnityContainerMounted?: () => void;
  onGameLoaded?: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const projectId = "mageduel-webgl";
  const version = GameVersion;
  const compression = ".br";
  const is_compressed = false;
  const [gameLoaded, setGameLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const buildUrl = "Build";

  const config: UnityConfig = {
    dataUrl:
      buildUrl +
      `/${projectId}-${version}.data${is_compressed ? compression : ""}`,
    frameworkUrl:
      buildUrl +
      `/${projectId}-${version}.framework.js${is_compressed ? compression : ""}`,
    codeUrl:
      buildUrl +
      `/${projectId}-${version}.wasm${is_compressed ? compression : ""}`,
    loaderUrl: buildUrl + `/${projectId}-${version}.loader.js`,
    streamingAssetsUrl: "StreamingAssets",
    companyName: "EvoluteStudio",
    productName: "Evolute Kingdom: Mage Duel",
    productVersion: version,
  };

  useEffect(() => {
    onUnityContainerMounted?.();

    (window as UnityWindow).unityConnector = new UnityConnector();

    const dojoScript = document.createElement("script");
    dojoScript.src = "TemplateData/dojo.js/dojo_c.js";
    dojoScript.onload = async () => {
      console.log("Dojo script loaded");
      await wasm_bindgen();
    };
    document.body.appendChild(dojoScript);
  }, []);

  useEffect(() => {
    const loadUnity = async () => {
      const loaderScript = document.createElement("script");
      loaderScript.src = config.loaderUrl;
      loaderScript.onload = () => {
        (window as UnityWindow)
          .createUnityInstance(
            canvasRef.current,
            config,
            (progress: number) => {
              setLoadingProgress(progress);
            },
          )
          .then((unityInstance: UnityInstance) => {
            console.log("Unity loaded successfully");
            window.gameInstance = unityInstance;
            setGameLoaded(true);
            setLoadingProgress(1);
            onGameLoaded?.();
            GameLoaded();
          })
          .catch((message: string) => {
            console.error("Failed to load Unity:", message);
          });
      };
      document.body.appendChild(loaderScript);
    };

    loadUnity();

    return () => {
      if (window.gameInstance) {
        window.gameInstance.Quit().then();
      }
    };
  }, []);

  return (
    <>
      <div
        id="game-loading-overlay"
        className="fixed inset-0 z-[5000] flex flex-col items-center justify-center text-white"
        style={{
          display: !gameLoaded ? "flex" : "none",
        }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="absolute w-full left-1/2 bottom-[10vh] flex flex-col items-center -translate-x-1/2">
            <Image
              src="/mageduel.gif"
              alt="Mage Duel"
              className="w-[105.5vh] block mb-[10vh]"
              width={1245}
              height={570}
              priority
            />
            <div className="w-[80vh] h-[5vh] bg-[#5a3a24] rounded-full overflow-hidden border-2 border-black">
              <div
                className="h-full bg-[#BD835B] duration-300 ease-out transition-width"
                role="progressbar"
                style={{ width: `${loadingProgress * 100}%` }}
              ></div>
            </div>

            <div className="text-white text-4xl font-bold text-outline text-[3vh] mt-[1vh]">
              Loading {Math.round(loadingProgress * 100)}%
            </div>
          </div>
        </div>
      </div>
      <div
        id="unity-container"
        className="fixed w-full h-full top-0 left-0"
        style={{ display: gameLoaded ? "block" : "none" }}
      >
        <canvas
          ref={canvasRef}
          id="unity-canvas"
          className="w-full h-full block"
        />
        <div id="unity-warning"></div>
      </div>
    </>
  );
}
