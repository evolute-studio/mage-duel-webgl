"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import "../lib/error-handler";

import { initScreenTimeTracking, stopScreenTimeTracking } from "../lib/events";
import UnityPlayer from "@/components/UnityPlayer";
import ServiceWorker from "@/components/ServiceWorker";
import { ConnectWallet } from "@/components/WalletConnector";
import OfflineNotification from "@/components/OfflineNotification";
import dynamic from "next/dynamic";

import LoginButtonsWeb from "@/components/LoginButtonsWeb";

const StarknetProviderClient = dynamic(
  () =>
    import("@/components/StarknetProvider").then((mod) => mod.StarknetProvider),
  { ssr: false },
);

export default function Home() {
  const [isPWA, setIsPWA] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [, setIsIOS] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [gameContainerMounted, setGameContainerMounted] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    console.log("New code loaded");
  }, []);

  useEffect(() => {
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

    // Set up orientation listeners
    window.addEventListener("resize", checkOrientation);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      stopScreenTimeTracking();
      window.removeEventListener("resize", checkOrientation);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [gameLoaded]);

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
    if (!gameContainerMounted) {
      return;
    }

    const gameContainer = document.getElementById("unity-container");

    if (!gameContainer) {
      console.error("GameContainer not found");
      return;
    }

    if (isLandscape) {
      if (gameLoaded) {
        gameContainer.style.display = "block";
      }

      const canvas = document.getElementById("unity-canvas");
      if (canvas) {
        canvas.style.display = "block";
      }

      document.body.style.height = "auto"; // Hide scrollbars
    } else {
      console.log("Portrait mode detected");
      // Portrait mode - handle differently based on device type and PWA status
      document.body.style.height = "100vh";
      gameContainer.style.display = "none";
    }
  }, [isLandscape, isMobile, isPWA, gameContainerMounted, gameLoaded]);

  return (
    <StarknetProviderClient>
      <div className="w-screen h-screen relative">
        {/* Background Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover object-left -z-10"
          autoPlay
          muted
          loop
          playsInline
          poster="/poster.jpg"
        >
          <source src="/background.webm" type="video/webm" />
          <source src="/background.mp4" type="video/mp4" />
        </video>
        <ServiceWorker />
        <Analytics />
        <OfflineNotification />
        <ConnectWallet />
        {(!isMobile || isPWA) && (
          <UnityPlayer
            onUnityContainerMounted={() => setGameContainerMounted(true)}
            onGameLoaded={() => setGameLoaded(true)}
          />
        )}

        {/* PWA Install Prompt - shown differently based on orientation */}
        {isMobile && !isPWA && (
          <div
            className={`fixed text-white text-center z-[5000] top-0 left-0 w-full h-full flex flex-col justify-center items-center over`}
          >
            <div
              className="w-full pt-12 pb-2 flex justify-center"
              style={{ display: isLandscape ? "none" : "flex" }}
            >
              <Image
                src="/mageduel.gif"
                alt="Mage Duel"
                className="w-4/5 max-w-[500px] block"
                width={500}
                height={150}
                priority
              />
            </div>

            <div className="bg-[#24170e] rounded-xl px-10 mx-4 my-8 max-w-[90%] py-8 pb-6">
              <h2 className="text-lg font-bold mb-4 text-outline-sm">
                Mage Duel <br /> is Available on Stores!
              </h2>
              <div className="flex items-center gap-3 flex-col my-8 ">
                <div className="flex items-center gap-2 justify-center flex-col">
                  <img
                    src="/icon-512.png"
                    alt="Mage Duel Icon"
                    className="w-25 h-25 "
                  />
                  <span className="text-sm text-outline-sm">Mage Duel</span>
                </div>
              </div>

              <div
                className="text-center mx-auto hover:scale-110 transition-transform"
                style={{
                  animation: "scaleAnimation 2s ease-in-out infinite",
                }}
              >
                <a
                  href="https://testflight.apple.com/join/kypR9ywg"
                  className="bg-[#BD835B] hover:bg-[#A6724F] px-10 py-4 rounded text-white font-semibold text-outline-sm text-2xl transition-colors mb-4 inline-block shadow-2xl"
                >
                  Download Now
                </a>
              </div>
            </div>
          </div>
        )}

        <div
          id="portrait-blocker"
          className="fixed top-0 left-0 w-full h-full gap-10 flex flex-col justify-center items-center text-center text-white z-[4000]"
          style={{
            display: isLandscape || !gameLoaded ? "none" : "flex",
          }}
        >
          {/* Game logo at top */}
          <div className="w-full flex justify-center items-end flex-1">
            <Image
              src="/mageduel.gif"
              alt="Mage Duel"
              className="w-4/5 max-w-[500px] block"
              width={500}
              height={150}
              priority
            />
          </div>

          <div className="flex-1 flex flex-col items-center ">
            <LoginButtonsWeb />
          </div>
        </div>
      </div>
    </StarknetProviderClient>
  );
}
