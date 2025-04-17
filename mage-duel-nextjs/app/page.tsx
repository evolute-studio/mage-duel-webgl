'use client';

import { useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Evolute Kingdom: Mage Duel</title>
        <meta name="description" content="Evolute Kingdom: Mage Duel - A WebGL Game" />
      </Head>
      <iframe
        src="/unity_build/index.html"
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