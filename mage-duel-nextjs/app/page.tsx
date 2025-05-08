'use client';

import { Analytics } from "@vercel/analytics/react"
import { useEffect } from "react";
import '../lib/error-handler';
import { GameLoaded } from '../lib/events';
import { initScreenTimeTracking, stopScreenTimeTracking } from '../lib/events';
import UnityPlayer from "@/components/UnityPlayer";
import ServiceWorker from "@/components/ServiceWorker";
import OrientationHandler from "@/components/OrientationHandler";
import { ConnectWallet } from "@/components/WalletConnector";
import InstallPWA from "@/components/InstallPWA";
import OfflineNotification from "@/components/OfflineNotification";
import FixUnityDisplay from "@/components/FixUnityDisplay";
import dynamic from "next/dynamic";

const StarknetProviderClient = dynamic(
  () => import("@/components/StarknetProvider").then((mod) => mod.StarknetProvider),
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
        <OrientationHandler />
        <ServiceWorker />
        <ConnectWallet /> 
        <InstallPWA />
        <FixUnityDisplay />
        <UnityPlayer />
    </StarknetProviderClient>
  );
}