import "./globals.css";
import type { Metadata, Viewport } from "next";
import VersionChecker from "@/components/VersionChecker";

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
        url: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        url: "/icon-1024.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icon-1024.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
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
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icon-1024.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body>
        <VersionChecker />
        {children}
      </body>
    </html>
  );
}
