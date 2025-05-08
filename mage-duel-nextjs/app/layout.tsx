import "./globals.css";
import "./ios-fixes.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Evolute Kingdom: Mage Duel",
  description: "A WebGL game by EvoluteStudio",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Mage Duel",
  },
  applicationName: "Mage Duel",
  themeColor: "#000000",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "192x192",
        type: "image/ico",
      },
    ],
    apple: [
      {
        url: "/favicon.ico",
        sizes: "192x192",
        type: "image/ico",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>{children}</body>
    </html>
  );
}
