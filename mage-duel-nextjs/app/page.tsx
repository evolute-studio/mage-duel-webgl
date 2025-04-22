'use client';

import { Analytics } from "@vercel/analytics/react"
import Head from 'next/head';
import { useEffect } from "react";
import '../lib/error-handler';
import { GameLoaded } from '../lib/events';
import { initScreenTimeTracking, stopScreenTimeTracking } from '../lib/events';

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
      <iframe
        src="/index.html"
        style={{
          width: '100vw',
          height: '100vh',
          border: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
        }}
      />

    </>
  );
} 