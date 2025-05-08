"use client";

import { Analytics } from "@vercel/analytics/react";
import { useEffect } from "react";
import "../lib/error-handler";
import { GameLoaded } from "../lib/events";
import { initScreenTimeTracking, stopScreenTimeTracking } from "../lib/events";
import UnityPlayer from "@/components/UnityPlayer";
import ServiceWorker from "@/components/ServiceWorker";
import { ConnectWallet } from "@/components/WalletConnector";
import InstallPWA from "@/components/InstallPWA";
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
      <InstallPWA />
      <DirectOrientationFix />
      <UnityPlayer />
      {/* Rotation message overlay */}
      <div
        id="portrait-blocker"
        style={{
          display: "none", // Initially hidden, will be controlled by DirectOrientationFix
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(/bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "48% center",
          zIndex: 4000,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
          textAlign: "center",
        }}
      >
        {/* Game logo at top */}
        <div
          style={{
            width: "100%",
            paddingTop: "48px",
            paddingBottom: "32px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/mageduel.gif"
            alt="Mage Duel"
            style={{
              width: "80%",
              maxWidth: "500px",
              display: "block",
            }}
          />
        </div>

        {/* Rotation instructions panel */}
        <div
          style={{
            padding: "32px",
            borderRadius: "12px",
            maxWidth: "80%",
          }}
        >
          <h2
            style={{
              margin: "0 0 16px 0",
              fontSize: "28px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Rotate Your Device to Play
          </h2>
        </div>
      </div>
    </StarknetProviderClient>
  );
}
