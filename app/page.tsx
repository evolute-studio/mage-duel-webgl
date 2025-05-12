"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import "../lib/error-handler";
import { GameLoaded } from "../lib/events";
import { initScreenTimeTracking, stopScreenTimeTracking } from "../lib/events";
import UnityPlayer from "@/components/UnityPlayer";
import ServiceWorker from "@/components/ServiceWorker";
import { ConnectWallet } from "@/components/WalletConnector";
import OfflineNotification from "@/components/OfflineNotification";
import dynamic from "next/dynamic";
import Image from "next/image";

const StarknetProviderClient = dynamic(
  () =>
    import("@/components/StarknetProvider").then((mod) => mod.StarknetProvider),
  { ssr: false },
);

export default function Home() {
  const [isPWA, setIsPWA] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    GameLoaded();
    initScreenTimeTracking();

    // Detect if running as PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error: Safari-specific standalone property
      window.navigator.standalone ||
      document.referrer.includes("android-app://");

    setIsPWA(isStandalone);

    // Check if on mobile device and detect platform
    const userAgent =
      navigator.userAgent ||
      navigator.vendor ||
      // @ts-expect-error: Opera-specific property
      window.opera;
    const userAgentLower = userAgent.toLowerCase();
    const isMobileDevice =
      /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgentLower,
      );
    // Make sure this is always a boolean
    const isIOSDevice = Boolean(
      /iphone|ipad|ipod/i.test(userAgentLower) ||
        (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform)),
    );

    setIsMobile(isMobileDevice);
    setIsIOS(isIOSDevice);

    // Initial orientation check
    checkOrientation();

    // Check if game is already loaded
    if (typeof window !== "undefined" && window.gameInstance !== undefined) {
      setGameLoaded(true);
    }

    // Check for game loading periodically
    const loadInterval = setInterval(() => {
      if (typeof window !== "undefined" && window.gameInstance !== undefined) {
        setGameLoaded(true);
      }
    }, 500);

    // Set up orientation listeners
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      stopScreenTimeTracking();
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", handleOrientationChange);
      clearInterval(loadInterval);
    };
  }, []);

  // Function to check if display is in landscape mode or has sufficient aspect ratio
  const checkOrientation = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    // Consider it landscape if width > height and aspect ratio is at least 1 (square or wider)
    setIsLandscape(width > height && aspectRatio >= 1);
  };

  // Function to handle orientation change with multiple checks
  const handleOrientationChange = () => {
    setTimeout(checkOrientation, 100);
    setTimeout(checkOrientation, 500);
  };

  // Update UI elements when orientation changes
  useEffect(() => {
    const portraitOverlay = document.getElementById("portrait-blocker");
    const gameContainer = document.getElementById("unity-container");

    if (!portraitOverlay || !gameContainer) {
      return;
    }

    if (isLandscape) {
      // Landscape mode - show game, hide overlay
      portraitOverlay.style.display = "none";
      gameContainer.style.display = "block";

      const canvas = document.getElementById("unity-canvas");
      if (canvas) {
        canvas.style.display = "block";
      }

      // Check if game is loaded to hide loading overlay
      const loadingOverlay = document.getElementById("game-loading-overlay");
      if (loadingOverlay && gameLoaded) {
        loadingOverlay.style.display = "none";
      }
    } else {
      // Portrait mode - handle differently based on device type and PWA status
      gameContainer.style.display = "none";

      // For mobile, show rotate screen only if it's a PWA, otherwise keep it hidden
      if (isMobile && !isPWA) {
        // If mobile and not PWA, hide rotate screen (will show PWA install hint instead)
        portraitOverlay.style.display = "none";
      } else {
        // In all other cases (desktop or PWA), show the rotate screen
        portraitOverlay.style.display = "flex";
      }

      // Hide loading overlay in portrait mode
      const loadingOverlay = document.getElementById("game-loading-overlay");
      if (loadingOverlay) {
        loadingOverlay.style.display = "none";
      }
    }
  }, [isLandscape, gameLoaded, isMobile, isPWA]);

  return (
    <StarknetProviderClient>
      <Analytics />
      <OfflineNotification />
      <ServiceWorker />
      <ConnectWallet />

      <UnityPlayer />

      {/* PWA Install Prompt - shown differently based on orientation */}
      {isMobile && !isPWA && (
        <div
          className={`fixed text-white text-center z-[5000] ${
            !isLandscape
              ? "top-0 left-0 w-full h-full flex flex-col justify-center items-center" // Full screen in portrait
              : "top-0 left-0 right-0 bg-black/80 p-3" // Banner in landscape
          }`}
          style={
            !isLandscape
              ? {
                  backgroundImage: "url('/bg.png')",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "48% center",
                }
              : {}
          }
        >
          {!isLandscape ? (
            // Full screen PWA install prompt in portrait mode
            <>
              <div className="w-full pt-12 pb-10 flex justify-center">
                <Image
                  src="/mageduel.gif"
                  alt="Mage Duel"
                  className="w-4/5 max-w-[500px] block"
                  width={500}
                  height={150}
                  priority
                />
              </div>

              <div className="bg-black/70 border-[#BD835B] border-2 rounded-xl px-6 py-6 mx-4 mb-8 max-w-[90%]">
                <h2 className="text-3xl font-bold text-outline-sm mb-7">
                  Install Mage Duel
                </h2>
                <p className="text-md mb-3 text-outline-sm">
                  Tap in Address Bar:
                </p>
                <div className="text-center mx-auto ">
                  {isIOS ? (
                    <p className="mb-3">
                      <span className="bg-[#BD835B] px-2 py-1 rounded">
                        <img
                          src="/ios-share.svg"
                          alt="Share"
                          className="inline-block w-[21px] h-[21px] mb-2"
                        />
                      </span>{" "}
                      →{" "}
                      <span className="bg-[#BD835B] px-2 py-1 rounded text-outline-sm">
                        Add to Home Screen
                      </span>
                    </p>
                  ) : (
                    <p>
                      <span className="bg-[#BD835B] px-2 py-1 rounded">
                        <span className="px-1 inline-block leading-0  text-xl">
                          ⋮
                        </span>
                      </span>{" "}
                      →{" "}
                      <span className="bg-[#BD835B] px-2 py-1 rounded whitespace-nowrap flex-nowrap text-outline-sm">
                        Add to Home Screen
                      </span>
                    </p>
                  )}
                  <div className="flex items-center gap-3 flex-col mt-8">
                    Play from Home Screen:
                    <div className="flex items-center gap-2 justify-center flex-col">
                      <img
                        src="/icon-512.png"
                        alt="Mage Duel Icon"
                        className="w-15 h-15"
                      />
                      <span className="text-xs">Mage Duel</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Small banner in landscape mode
            <>
              <p className="text-sm font-semibold mb-1">
                📱 Install Mage Duel for best experience
              </p>
              <p className="text-xs flex items-center gap-2 justify-center">
                In Address Bar:
                <span className="bg-[#BD835B] px-2 py-1 rounded ">
                  Menu
                </span> →{" "}
                <span className="bg-[#BD835B] px-2 py-1 rounded ">
                  Add to Home Screen
                </span>
              </p>
            </>
          )}
        </div>
      )}

      {/* Loading overlay */}
      <div
        id="game-loading-overlay"
        className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-black/90 text-white"
        style={{ display: isLandscape && !gameLoaded ? "flex" : "none" }}
      >
        <div className="flex h-full w-full items-center justify-center">
          <Image
            src="/loader.gif"
            alt="Loading"
            className="absolute left-1/2 top-1/2 block h-[35vh] w-auto -translate-x-1/2 -translate-y-1/2"
            width={200}
            height={200}
            priority
          />
        </div>
      </div>

      {/* Rotation message overlay - shown whenever in portrait mode */}
      <div
        id="portrait-blocker"
        className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center z-[4000]"
        style={{
          display: "none", // Initially hidden, will be controlled by orientation code
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "48% center",
          color: "white",
        }}
      >
        {/* Game logo at top */}
        <div className="w-full pt-12 pb-8 flex justify-center">
          <Image
            src="/mageduel.gif"
            alt="Mage Duel"
            className="w-4/5 max-w-[500px] block"
            width={500}
            height={150}
            priority
          />
        </div>

        {/* Rotation instructions panel */}
        <div className="rounded-xl max-w-[80%]">
          <div className="phone-container mx-auto mb-10 scale-[0.8]">
            <Image
              src="/phone.png"
              className="phone-rotate"
              alt="Rotate your device"
              width={300}
              height={200}
              priority
            />
          </div>
          <h2
            className="m-0 mb-4 text-3xl font-bold text-center text-outline max-w-50"
            style={{ color: "white" }}
          >
            Rotate Device to Play
          </h2>
        </div>
      </div>
    </StarknetProviderClient>
  );
}
