"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import "../lib/error-handler";
import { GameLoaded } from "../lib/events";
import { initScreenTimeTracking, stopScreenTimeTracking } from "../lib/events";
import UnityPlayer from "@/components/UnityPlayer";
import ServiceWorker from "@/components/ServiceWorker";
import { ConnectWallet } from "@/components/WalletConnector";
import OfflineNotification from "@/components/OfflineNotification";
import DirectOrientationFix from "@/components/DirectOrientationFix";
import dynamic from "next/dynamic";

const StarknetProviderClient = dynamic(
  () =>
    import("@/components/StarknetProvider").then((mod) => mod.StarknetProvider),
  { ssr: false },
);

export default function Home() {
  useEffect(() => {
    GameLoaded();
    initScreenTimeTracking();

    return () => {
      stopScreenTimeTracking();
    };
  }, []);

  return (
    <StarknetProviderClient>
      <Analytics />
      <OfflineNotification />
      <ServiceWorker />
      <ConnectWallet />
      <DirectOrientationFix />
      <UnityPlayer />
      {/* Rotation message overlay */}
      <div
        id="portrait-blocker"
        className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center z-[4000]"
        style={{
          display: "none", // Initially hidden, will be controlled by DirectOrientationFix
          backgroundImage: "url('/bg.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "48% center",
          color: "white",
        }}
      >
        {/* Game logo at top */}
        <div className="w-full pt-12 pb-8 flex justify-center">
          <img
            src="/mageduel.gif"
            alt="Mage Duel"
            className="w-4/5 max-w-[500px] block"
          />
        </div>

        {/* Rotation instructions panel */}
        <div className="rounded-xl max-w-[80%]">
          <div className="phone-container mx-auto mb-10 scale-[0.8]">
            <img
              src="/phone.png"
              className="phone-rotate"
              alt="Rotate your device"
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
