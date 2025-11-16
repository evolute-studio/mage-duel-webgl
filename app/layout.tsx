import "./globals.css";
import type { Metadata, Viewport } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Mage Duel",
  description: "Mage Duel - Download Now",
  manifest: undefined, // Explicitly disable manifest
  appleWebApp: {
    capable: false, // Disable iOS web app mode
  },
  other: {
    "screen-orientation": "portrait",
    "orientation": "portrait",
    "mobile-web-app-capable": "no",
    "apple-mobile-web-app-capable": "no",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" style={{ height: "100%", overflow: "hidden" }}>
      <body style={{ height: "100%", overflow: "hidden" }}>
        <Script
          id="prevent-pwa"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent PWA installation
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for(let registration of registrations) {
                    registration.unregister();
                  }
                });
              }
              // Prevent standalone mode - redirect to browser
              if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
                window.location.href = window.location.href;
              }
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
