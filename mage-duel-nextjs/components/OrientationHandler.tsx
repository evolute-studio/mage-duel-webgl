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
          className="hidden fixed top-0 left-0 w-full h-full z-[1000] flex-col justify-center items-center text-center"
          style={{
            display: "flex", // Need to keep this for dynamic JS control
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)"
          }}
        >
          <div className="flex flex-col items-center justify-center gap-6">
            <div className="phone-container">
              <img 
                src="/phone.png" 
                alt="Rotate your phone"
                className="phone-rotate"
              />
              <div style={{
                position: "absolute",
                top: "50%", 
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "130px",
                height: "30px",
                border: "2px dashed #4CAF50",
                borderRadius: "5px",
                opacity: 0.7,
                animation: "blink 1s ease-in-out infinite alternate"
              }}></div>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold mb-2">Rotate Your Device</span>
              <span className="text-lg">Turn your phone sideways to play</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
