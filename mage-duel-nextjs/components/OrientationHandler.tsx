import { useEffect, useRef, useState } from "react";

export default function OrientationHandler() {
  const portraitOverlayRef = useRef<HTMLDivElement>(null);
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        const aspectRatio = window.innerWidth / window.innerHeight;
        const portraitOverlay = portraitOverlayRef.current;
        const unityContainer = document.getElementById("unity-container");
        const loadingBar = document.getElementById("unity-loading-bar");
        setIsPortrait(
          window.innerHeight > window.innerWidth || aspectRatio < 1.46,
        );
        if (!portraitOverlay || !unityContainer || !loadingBar) return;

        if (window.innerHeight > window.innerWidth || aspectRatio < 1.46) {
          portraitOverlay.style.display = "flex";
          unityContainer.style.display = "none";
          loadingBar.style.display = "none";

          if (window.gameInstance) {
            try {
              window.gameInstance.SendMessage("GameManager", "PauseGame");
            } catch {
              console.log("Не вдалося поставити гру на паузу");
            }
          }

          if (!window.gameInstance) {
            window.stopUnityLoading = true;
          }
        } else {
          portraitOverlay.style.display = "none";
          unityContainer.style.display = "block";
          loadingBar.style.display = "block";

          if (window.stopUnityLoading && !window.gameInstance) {
            window.location.reload();
            return;
          }

          if (window.gameInstance) {
            try {
              window.gameInstance.SendMessage("GameManager", "ResumeGame");
            } catch {
              console.log("Не вдалося відновити гру");
            }
          }
        }
      }
    };

    window.addEventListener("load", checkOrientation);
    window.addEventListener("resize", checkOrientation);

    checkOrientation();

    return () => {
      window.removeEventListener("load", checkOrientation);
      window.removeEventListener("resize", checkOrientation);
    };
  }, []);

  return (
    <>
      {isPortrait && (
        <div
          id="portrait-overlay"
          ref={portraitOverlayRef}
          style={{
            display: "flex",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 1)",
            opacity: 0.5,
            zIndex: 1000,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            textAlign: "center",
          }}
        >
          Rotate device
        </div>
      )}
    </>
  );
}
