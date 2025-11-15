"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AppleLogo } from "@/components/AppleLogo";

// Spacing constants for easy modification
const SPACING = {
  popup: {
    mobile: { bottom: "30%" },
    desktop: { bottom: "8%" },
  },
  content: {
    gap: "gap-4",
    padding: "px-10 py-6",
  },
  iconTitle: {
    gap: "gap-1",
  },
  button: {
    padding: "px-10 mt-5 py-4",
  },
};

// Component: Background Image
const BackgroundImage = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="w-full h-full md:scale-100">
      <Image
        src="/bg.png"
        alt="Background"
        fill
        className="object-cover object-[35%_bottom] md:object-center "
        priority
        quality={100}
        sizes="100vw"
        unoptimized
      />
    </div>
  </div>
);

// Component: Logo
const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex justify-center animate-[scaleIn_0.2s_ease-out] ${className}`}>
    <Image
      src="/logo.png"
      alt="Logo"
      width={400}
      height={80}
      className="object-contain max-w-[300px] md:max-w-full"
      priority
    />
  </div>
);

// Component: Logo at Top (Mobile only - hidden on desktop)
const LogoTop = () => (
  <div className="absolute top-0 left-0 right-0 flex justify-center z-20 pt-4 md:pt-6 md:hidden">
    <Logo />
  </div>
);

// Component: Logo and Button at Bottom (Desktop only - hidden on mobile)
const LogoAndButtonBottom = () => (
  <div className="hidden md:flex absolute bottom-0 left-0 right-0 flex-col items-center z-20 pb-[5%]">
    <Logo />
    <AppStoreButton className="mt-2" />
  </div>
);

// Component: Icon with Border
const IconWithBorder = ({ className = "" }: { className?: string }) => (
  <div className={`liquid-glass-border rounded-[2rem] ${className}`}>
    <Image
      src="/icon.png"
      alt="Mage Duel Icon"
      width={140}
      height={140}
      className="rounded-[1.75rem]"
      priority
    />
  </div>
);

// Component: Game Title
const GameTitle = ({ className = "" }: { className?: string }) => (
  <h2 className={`text-2xl font-bold text-white text-center text-outline-sm ${className}`}>
    Mage Duel
  </h2>
);

// Component: Download Button
const DownloadButton = ({
  href,
  download,
  platform,
  className = "",
}: {
  href?: string | null;
  download?: string;
  platform?: "ios" | "android" | "desktop";
  className?: string;
}) => {
  const baseClasses = "border-2 border-white rounded-xl text-white font-semibold text-outline-sm text-2xl shadow-xl w-full text-center";
  const activeClasses = "bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-colors";
  
  // Always use App Store link if no href provided (desktop case)
  const appStoreLink = "https://apps.apple.com/ua/app/mage-duel/id6745639584";
  const finalHref = href || appStoreLink;
  const isExternalLink = !href || platform === "ios" || platform === "desktop";

  return (
    <a
      href={finalHref}
      download={download}
      target={isExternalLink ? "_blank" : undefined}
      rel={isExternalLink ? "noopener noreferrer" : undefined}
      className={`${baseClasses} ${activeClasses} ${SPACING.button.padding} pulse-button ${className}`}
      style={{ display: 'inline-block' }}
    >
      Download
    </a>
  );
};

// Component: App Store Button (Desktop)
const AppStoreButton = ({ className = "" }: { className?: string }) => (
  <a
    href="https://apps.apple.com/ua/app/mage-duel/id6745639584"
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-block hover:opacity-90 transition-opacity ${className}`}
  >
    <div className="bg-black border-white rounded-lg px-5 border-1 py-2 flex items-center gap-3 shadow-lg">
      <AppleLogo width={36} height={36} />
      <div className="flex flex-col leading-tight">
        <span
          className="text-xs text-white opacity-90"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          }}
        >
          Download on the
        </span>
        <span
          className="text-xl text-white font-semibold"
          style={{
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
            letterSpacing: "0.2px",
          }}
        >
          App Store
        </span>
      </div>
    </div>
  </a>
);

// Component: Popup Content (Mobile only)
const PopupContent = ({
  downloadLink,
  platform,
}: {
  downloadLink: string | null;
  platform: "ios" | "android" | "desktop";
}) => (
  <div className={`flex flex-col items-center ${SPACING.content.gap} ${SPACING.content.padding}`}>
    {downloadLink ? (
      <a
        href={downloadLink}
        download={platform === "android" ? "MageDuelAndroid.apk" : undefined}
        target={platform === "ios" ? "_blank" : undefined}
        rel={platform === "ios" ? "noopener noreferrer" : undefined}
        className={`flex flex-col items-center ${SPACING.iconTitle.gap} cursor-pointer hover:opacity-90 transition-opacity`}
      >
        <IconWithBorder />
        <GameTitle />
      </a>
    ) : (
      <div className={`flex flex-col items-center ${SPACING.iconTitle.gap}`}>
        <IconWithBorder />
        <GameTitle />
      </div>
    )}

    <div className="w-full">
      <DownloadButton
        href={downloadLink}
        download={platform === "android" ? "MageDuelAndroid.apk" : undefined}
        platform={platform}
      />
    </div>
  </div>
);

// Component: Popup Container (Mobile only - hidden on desktop)
const Popup = ({
  isReady,
  downloadLink,
  platform,
}: {
  isReady: boolean;
  downloadLink: string | null;
  platform: "ios" | "android" | "desktop";
}) => {
  if (!isReady) return null;

  return (
    <div className="absolute left-0 right-0 bottom-[7%] flex justify-center z-10 md:hidden">
      <div className="liquid-glass-border p-1 bg-[#08226a]/30 backdrop-blur-sm rounded-xl shadow-2xl animate-[scaleIn_0.2s_ease-out]">
        <PopupContent downloadLink={downloadLink} platform={platform} />
      </div>
    </div>
  );
};

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS =
      /iphone|ipad|ipod/i.test(userAgent) ||
      (navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform));
    const isAndroid = /android/i.test(userAgent);

    setPlatform(isIOS ? "ios" : isAndroid ? "android" : "desktop");
    setTimeout(() => setIsReady(true), 0);
  }, []);

  const downloadLink =
    platform === "ios"
      ? "https://apps.apple.com/ua/app/mage-duel/id6745639584"
      : platform === "android"
        ? "/MageDuelAndroid.apk"
        : null;

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <BackgroundImage />
      {isReady && (
        <>
          <LogoTop />
          <Popup
            isReady={isReady}
            downloadLink={downloadLink}
            platform={platform}
          />
          <LogoAndButtonBottom />
        </>
      )}
    </div>
  );
}
