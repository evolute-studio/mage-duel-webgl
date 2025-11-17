"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// Background shift constants for easy modification
const BACKGROUND_SHIFT = {
  position1: "75%", // First background position
  position2: "72%", // Second background position
};

// App Store / TestFlight link
const APPLE_LINK = "https://testflight.apple.com/join/kypR9ywg";

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
    <div className="w-full h-full">
      <Image
        src="/bg.png"
        alt="Background"
        fill
        className="object-cover object-[75%_top] md:object-center bg-bounce"
        style={{
          objectPosition: `${BACKGROUND_SHIFT.position1} top`,
          '--bg-position1': BACKGROUND_SHIFT.position1,
          '--bg-position2': BACKGROUND_SHIFT.position2,
        } as React.CSSProperties}
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
  <div className={`flex justify-center animate-[scaleIn_0.2s_ease-out] ${className} mt-4`}>
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
const LogoTop = ({ isMobileLayout }: { isMobileLayout: boolean }) => (
  <div className={`absolute top-0 left-0 right-0 flex justify-center z-20 ${isMobileLayout ? 'flex' : 'hidden'}`}>
    <Logo />
  </div>
);

// Component: Logo and Button at Bottom (Desktop only - hidden on mobile)
const LogoAndButtonBottom = ({ isMobileLayout }: { isMobileLayout: boolean }) => (
  <div className={`${isMobileLayout ? 'hidden' : 'flex'} absolute bottom-0 left-0 right-0 flex-col items-center z-20 pb-[5%]`}>
    <Logo />
    <div className="flex flex-row items-center gap-4 mt-2">
      <GooglePlayButton />
      <AppStoreButton />
    </div>
    <SocialLinks className="mt-3" />
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

// Component: X (Twitter) Icon
const XIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      fill="white"
    />
  </svg>
);

// Component: Discord Icon
const DiscordIcon = ({ className = "" }: { className?: string }) => (
  <svg
    width="28"
    height="28"
    viewBox="0 -28.5 256 256"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
      fill="white"
      fillRule="nonzero"
    />
  </svg>
);

// Component: Social Links
const SocialLinks = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-row items-center gap-4 justify-center ${className}`}>
    <a
      href="https://x.com/evolute_studio"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-75 transition-opacity"
    >
      <XIcon />
    </a>
    <a
      href="https://discord.gg/WJqjpEFhm3"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:opacity-75 transition-opacity"
    >
      <DiscordIcon />
    </a>
  </div>
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
  const finalHref = href || APPLE_LINK;
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
    href={APPLE_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-block hover:opacity-90 transition-opacity ${className}`}
  >
    <Image
      src="/apple-button.png"
      alt="Download on the App Store"
      width={200}
      height={60}
      className="object-contain"
      priority
    />
  </a>
);

// Component: Google Play Button (Desktop)
const GooglePlayButton = ({ className = "" }: { className?: string }) => (
  <a
    href="/MageDuelAndroid.apk"
    download="MageDuelAndroid.apk"
    className={`inline-block hover:opacity-90 transition-opacity ${className}`}
  >
    <Image
      src="/google-button.png"
      alt="Download APK"
      width={200}
      height={60}
      className="object-contain"
      priority
    />
  </a>
);

// Component: Popup Content (Mobile only)
const PopupContent = ({
  downloadLink,
  platform,
  isDesktopForced,
}: {
  downloadLink: string | null;
  platform: "ios" | "android" | "desktop";
  isDesktopForced: boolean;
}) => {
  // Show 2 buttons if desktop site is forced on Android
  const showTwoButtons = isDesktopForced && platform === "android";

  return (
    <div className={`flex flex-col items-center ${SPACING.content.gap} ${SPACING.content.padding} relative z-10`}>
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

      {showTwoButtons ? (
        <>
          <div className="flex flex-row items-center gap-4 w-full justify-center">
            <GooglePlayButton />
            <AppStoreButton />
          </div>
          <SocialLinks className="mt-2" />
        </>
      ) : (
        <>
          <div className="w-full">
            <DownloadButton
              href={downloadLink}
              download={platform === "android" ? "MageDuelAndroid.apk" : undefined}
              platform={platform}
            />
          </div>
          <SocialLinks className="mt-2" />
        </>
      )}
    </div>
  );
};

// Component: Popup Container (Mobile only - hidden on desktop)
const Popup = ({
  isReady,
  downloadLink,
  platform,
  isMobileLayout,
  isDesktopForced,
}: {
  isReady: boolean;
  downloadLink: string | null;
  platform: "ios" | "android" | "desktop";
  isMobileLayout: boolean;
  isDesktopForced: boolean;
}) => {
  if (!isReady || !isMobileLayout) return null;

  return (
    <div 
      className="absolute left-0 right-0 flex justify-center z-10"
      style={{
        bottom: 'calc(2dvh + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div className="rounded-xl animate-[scaleIn_0.2s_ease-out]">
        <PopupContent downloadLink={downloadLink} platform={platform} isDesktopForced={isDesktopForced} />
      </div>
    </div>
  );
};

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");
  const [isMobileLayout, setIsMobileLayout] = useState(true); // Default to mobile for SSR
  const [isDesktopForced, setIsDesktopForced] = useState(false);

  useEffect(() => {
    // Detect platform for download link (works even when desktop site is forced)
    // Check multiple methods since user agent can be modified
    const userAgent = navigator.userAgent.toLowerCase();
    const platformStr = navigator.platform?.toLowerCase() || "";
    const vendor = navigator.vendor?.toLowerCase() || "";
    
    // Check for iOS
    const isIOS =
      /iphone|ipad|ipod/i.test(userAgent) ||
      /iPad|iPhone|iPod/.test(platformStr) ||
      (vendor.includes("apple") && /mobile/i.test(userAgent));
    
    // Check for Android - use multiple detection methods
    // When desktop site is forced, user agent might be modified, so check other indicators
    const screenWidth = window.screen.width || window.screen.availWidth;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const isAndroid =
      /android/i.test(userAgent) ||
      /android/i.test(platformStr) ||
      // Check if it's a mobile device with Android-like characteristics
      (screenWidth < 768 && /linux/i.test(platformStr) && 'ontouchstart' in window && !isIOS) ||
      // If mobile screen but desktop viewport and not iOS, likely Android with desktop mode
      (screenWidth < 768 && viewportWidth > 700 && !isIOS && 'ontouchstart' in window);

    setPlatform(isIOS ? "ios" : isAndroid ? "android" : "desktop");

    // Detect actual screen width for layout (works even if desktop site is forced)
    // When desktop site is requested, viewport width changes but screen.width stays the same
    const checkLayout = () => {
      // Check actual physical screen width (doesn't change when desktop site is requested)
      const actualScreenWidth = window.screen.width || window.screen.availWidth;
      // Check viewport width (changes when desktop site is requested)
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      
      // Detect if desktop site is forced (viewport much larger than screen on mobile device)
      // Use a lower threshold (1.2x) to catch desktop mode more reliably
      const desktopForced = actualScreenWidth < 768 && viewportWidth > Math.max(actualScreenWidth * 1.2, 600);
      setIsDesktopForced(desktopForced);
      
      // If actual screen is mobile-sized (< 768px), always use mobile layout
      // Otherwise, use viewport width to allow responsive behavior on desktop
      if (actualScreenWidth < 768) {
        setIsMobileLayout(true);
      } else {
        // Real desktop device - use viewport width for responsive behavior
        setIsMobileLayout(viewportWidth < 768);
      }
    };

    // Check on mount
    checkLayout();
    setIsReady(true);

    // Listen for resize and orientation changes
    window.addEventListener("resize", checkLayout);
    window.addEventListener("orientationchange", checkLayout);
    
    return () => {
      window.removeEventListener("resize", checkLayout);
      window.removeEventListener("orientationchange", checkLayout);
    };
  }, []);

  // Download link based on platform - design is based on screen size (Tailwind media queries)
  const downloadLink =
    platform === "ios"
      ? APPLE_LINK
      : platform === "android"
        ? "/MageDuelAndroid.apk"
        : APPLE_LINK; // Default to App Store for desktop

  return (
    <div className="w-screen h-[100dvh] relative overflow-hidden">
      <BackgroundImage />
      {isReady && (
        <>
          <LogoTop isMobileLayout={isMobileLayout} />
          <Popup
            isReady={isReady}
            downloadLink={downloadLink}
            platform={platform}
            isMobileLayout={isMobileLayout}
            isDesktopForced={isDesktopForced}
          />
          <LogoAndButtonBottom isMobileLayout={isMobileLayout} />
        </>
      )}
    </div>
  );
}
