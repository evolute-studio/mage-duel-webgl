'use client';

import { Analytics } from "@vercel/analytics/react"
import { track } from '@vercel/analytics';
import Head from 'next/head';
import { useEffect } from "react";
import { logEvent } from '../lib/axiom';
import '../lib/error-handler';

export default function Home() {
  useEffect(() => {
    track("page_view");
    logEvent('page_loaded', { page: 'home' });
  }, [])
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