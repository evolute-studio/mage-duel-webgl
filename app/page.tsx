"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import "../lib/error-handler";

import { initScreenTimeTracking, stopScreenTimeTracking } from "../lib/events";
import UnityPlayer from "@/components/UnityPlayer";
import ServiceWorker from "@/components/ServiceWorker";
import { ConnectWallet } from "@/components/WalletConnector";
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
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const [gameContainerMounted, setGameContainerMounted] = useState(false);
  const [gameLoaded, setGameLoaded] = useState(false);

  useEffect(() => {
    console.log("New code loaded");
  }, []);

  useEffect(() => {
    initScreenTimeTracking();

    // Enhanced PWA/APK detection
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error: Safari-specific standalone property
      window.navigator.standalone ||
      document.referrer.includes("android-app://") ||
      // Additional checks for PWA Builder APK
      window.location.href.includes("android-app://") ||
      // Check if running in a WebView (common for APK)
      /wv|WebView/i.test(navigator.userAgent) ||
      // Check for TWA (Trusted Web Activity) indicators
      window.location.search.includes("utm_source=android-app") ||
      // Check if the app is running in fullscreen mode (common for APK)
      (window.screen.height === window.innerHeight && window.screen.width === window.innerWidth) ||
      // Additional APK detection methods
      window.location.protocol === "file:" ||
      // Check for custom URL schemes used by PWA Builder
      window.location.href.includes("pwa-builder://") ||
      // Check for specific Android WebView indicators
      /Android.*Version\/[0-9]+\.[0-9]+.*Chrome\/[0-9]+\.[0-9]+.*Mobile/i.test(navigator.userAgent) ||
      // Additional PWA Builder specific checks
      window.location.href.includes("twa://") ||
      // Check for specific PWA Builder user agent patterns
      /PWA Builder|TWA/i.test(navigator.userAgent) ||
      // Check if running in a custom WebView container
      /CustomWebView|AppWebView/i.test(navigator.userAgent) ||
      // Check for URL parameters that indicate APK
      window.location.search.includes("source=apk") ||
      window.location.search.includes("mode=standalone") ||
      // Check for specific PWA Builder APK indicators
      window.location.search.includes("pwa-builder=true") ||
      // Check for TWA specific indicators
      window.location.search.includes("twa=true");

    setIsPWA(isStandalone);
    
    // Debug logging for PWA detection
    console.log("PWA Detection Debug:", {
      displayMode: window.matchMedia("(display-mode: standalone)").matches,
      navigatorStandalone: (window.navigator as any).standalone,
      referrer: document.referrer,
      locationHref: window.location.href,
      userAgent: navigator.userAgent,
      screenVsInner: {
        screenHeight: window.screen.height,
        screenWidth: window.screen.width,
        innerHeight: window.innerHeight,
        innerWidth: window.innerWidth
      },
      isStandalone,
      // Additional APK detection info
      isWebView: /wv|WebView/i.test(navigator.userAgent),
      isTWA: /TWA/i.test(navigator.userAgent),
      isPWABuilder: /PWA Builder/i.test(navigator.userAgent),
      protocol: window.location.protocol,
      hasAndroidAppScheme: window.location.href.includes("android-app://"),
      hasPwaBuilderScheme: window.location.href.includes("pwa-builder://"),
      hasTWAScheme: window.location.href.includes("twa://"),
      // URL parameters for APK detection
      searchParams: window.location.search,
      hasSourceApk: window.location.search.includes("source=apk"),
      hasModeStandalone: window.location.search.includes("mode=standalone"),
      hasPwaBuilderTrue: window.location.search.includes("pwa-builder=true"),
      hasTwaTrue: window.location.search.includes("twa=true")
    });

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
    const isAndroidDevice = Boolean(/android/i.test(userAgentLower));

    setIsMobile(isMobileDevice);
    setIsIOS(isIOSDevice);
    setIsAndroid(isAndroidDevice);

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
        <ConnectWallet />
        {(!isMobile || isPWA) && (
          <UnityPlayer
            onUnityContainerMounted={() => setGameContainerMounted(true)}
            onGameLoaded={() => setGameLoaded(true)}
          />
        )}

        {/* PWA Install Prompt - shown differently based on orientation */}
        {isMobile && !isPWA && 
         !window.location.href.includes("android-app://") && 
         !window.location.href.includes("pwa-builder://") &&
         !window.location.href.includes("twa://") &&
         window.location.protocol !== "file:" &&
         !/PWA Builder|TWA|CustomWebView|AppWebView/i.test(navigator.userAgent) &&
         !window.location.search.includes("source=apk") &&
         !window.location.search.includes("mode=standalone") &&
         !window.location.search.includes("pwa-builder=true") &&
         !window.location.search.includes("twa=true") && (
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
                {isAndroid || isIOS ? (
                  <a
                    href={
                      isAndroid
                        ? "/MageDuelAndroid.apk"
                        : "https://testflight.apple.com/join/kypR9ywg"
                    }
                    className="bg-[#BD835B] hover:bg-[#A6724F] px-10 py-4 rounded text-white font-semibold text-outline-sm text-2xl transition-colors mb-4 inline-block shadow-2xl"
                    download={isAndroid ? "MageDuelAndroid.apk" : undefined}
                  >
                    Download Now
                  </a>
                ) : (
                  <div className="bg-gray-600 px-10 py-4 rounded text-white font-semibold text-outline-sm text-2xl mb-4 inline-block shadow-2xl">
                    Device Not Supported
                  </div>
                )}
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
