"use client";

import UnityConnector from "@/lib/unity-connector";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { GameLoaded } from "../lib/events";
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
  showBanner: (msg: string, type: string) => void;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const projectId = "mageduel-webgl";
  const version = "1.3.20";
  const compression = ".gz";
  const is_compressed = false;
  const [gameLoaded, setGameLoaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    onUnityContainerMounted?.();
  }, []);

  useEffect(() => {
    const loadUnity = async () => {
      const buildUrl = "Build";
      const loaderUrl = buildUrl + `/${projectId}-${version}.loader.js`;
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
        streamingAssetsUrl: "StreamingAssets",
        companyName: "EvoluteStudio",
        productName: "Evolute Kingdom: Mage Duel",
        productVersion: version,
        showBanner: (msg: string, type: string) => {
          console.log(`Unity Banner: ${msg} (${type})`);
        },
      };

      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        // Just set the mobile class, other settings will be handled by the IPhoneFix component
        if (containerRef.current) {
          containerRef.current.className = "unity-mobile";
        }
        if (canvasRef.current) {
          canvasRef.current.className = "unity-mobile";
        }
      } else {
        if (canvasRef.current) {
          canvasRef.current.style.width = "1880px";
          canvasRef.current.style.height = "930px";
        }
      }

      const dojoScript = document.createElement("script");
      dojoScript.src = "TemplateData/dojo.js/dojo_c.js";
      dojoScript.onload = async () => {
        await wasm_bindgen();
        console.log("Dojo loaded successfully");
      };

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = loaderUrl;
        script.onload = () => resolve();
        script.onerror = reject;
        document.body.appendChild(script);
        document.body.appendChild(dojoScript);
      });

      (window as UnityWindow)
        .createUnityInstance(canvasRef.current, config, (progress: number) => {
          setLoadingProgress(progress);
        })
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
      (window as UnityWindow).unityConnector = new UnityConnector();
    };

    loadUnity();
  }, [is_compressed]);

  return (
    <>
      {/* Loading overlay */}
      <div
        id="game-loading-overlay"
        className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-blac/90 text-white"
        style={{ display: !gameLoaded ? "flex" : "none" }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="absolute w-full left-1/2 top-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
            <Image
              src="/loader.gif"
              alt="Loading"
              className="block h-[35vh] max-h-[300px] w-auto  mb-8 aspect-square"
              width={200}
              height={200}
              priority
            />

            {/* Progress bar container */}
            <div className="w-[250px] h-[25px] bg-[#5a3a24] rounded-full overflow-hidden border-2 border-black">
              {/* Progress bar fill */}
              <div
                className="h-full bg-[#BD835B] duration-300 ease-out transition-width"
                role="progressbar"
                style={{ width: `${loadingProgress * 100}%` }}
              ></div>
            </div>

            {/* Progress percentage */}
            <div className="mt-4 text-white text-2xl font-bold text-outline">
              Loading {Math.round(loadingProgress * 100)}%
            </div>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        id="unity-container"
        className="fixed w-full h-full top-0 left-0"
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
