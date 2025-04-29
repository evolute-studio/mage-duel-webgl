'use client';

import { Analytics } from "@vercel/analytics/react"
import Head from 'next/head';
import { useEffect } from "react";
import '../lib/error-handler';
import { GameLoaded } from '../lib/events';
import { initScreenTimeTracking, stopScreenTimeTracking } from '../lib/events';
import UnityPlayer from "@/components/UnityPlayer";
import ServiceWorker from "@/components/ServiceWorker";
import OrientationHandler from "@/components/OrientationHandler";
import { ConnectWallet } from "@/components/WalletConnector";

export default function Home() {
  useEffect(() => {
    GameLoaded();
    initScreenTimeTracking();

    return () => {
      stopScreenTimeTracking();
    };
  }, []);

  return (
    <>
        <Analytics />
        <Head>
          <title>Evolute Kingdom: Mage Duel</title>
        <meta name="description" content="Evolute Kingdom: Mage Duel - A WebGL Game" />
        </Head>
        <OrientationHandler />
        <ServiceWorker />
        <UnityPlayer />
        <ConnectWallet /> 
    </>
  );
} 