import { useEffect, useRef, useState } from 'react';

export default function OrientationHandler() {
    const portraitOverlayRef = useRef<HTMLDivElement>(null);
    const unityContainerRef = useRef<HTMLDivElement>(null);
    const loadingBarRef = useRef<HTMLDivElement>(null);
    const [isPortrait, setIsPortrait] = useState(false);

    useEffect(() => {
        const checkOrientation = () => {
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                const aspectRatio = window.innerWidth / window.innerHeight;
                const portraitOverlay = portraitOverlayRef.current;
                const unityContainer = document.getElementById('unity-container');
                const loadingBar = document.getElementById('unity-loading-bar');
                setIsPortrait(window.innerHeight > window.innerWidth || aspectRatio < 1.46);
                if (!portraitOverlay || !unityContainer || !loadingBar) return;

                if (window.innerHeight > window.innerWidth || aspectRatio < 1.46) {
                    portraitOverlay.style.display = 'flex';
                    unityContainer.style.display = 'none';
                    loadingBar.style.display = 'none';

                    if (window.gameInstance) {
                        try {
                            window.gameInstance.SendMessage('GameManager', 'PauseGame');
                        } catch {
                            console.log('Не вдалося поставити гру на паузу');
                        }
                    }

                    if (!window.gameInstance) {
                        window.stopUnityLoading = true;
                    }
                } else {
                    portraitOverlay.style.display = 'none';
                    unityContainer.style.display = 'block';
                    loadingBar.style.display = 'block';

                    if (window.stopUnityLoading && !window.gameInstance) {
                        window.location.reload();
                        return;
                    }

                    if (window.gameInstance) {
                        try {
                            window.gameInstance.SendMessage('GameManager', 'ResumeGame');
                        } catch {
                            console.log('Не вдалося відновити гру');
                        }
                    }
                }
            }
        };

        window.addEventListener('load', checkOrientation);
        window.addEventListener('resize', checkOrientation);

        checkOrientation();

        return () => {
            window.removeEventListener('load', checkOrientation);
            window.removeEventListener('resize', checkOrientation);
        };
    }, []);

    return (
        <>
            {
                isPortrait && (
                        <div 
                            id="portrait-overlay" 
                            ref={portraitOverlayRef}
                style={{
                display: 'flex',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 1)',
                zIndex: 1000,
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                textAlign: 'center'
            }}
        >
            <svg 
                id="portrait-icon" 
                viewBox="0 0 24 24" 
                fill="white"
                style={{
                    width: '100px',
                    height: '100px',
                    marginBottom: '20px',
                    animation: 'rotate 2s ease-in-out infinite'
                }}
            >
                <path d="M16 1H8C6.34 1 5 2.34 5 4v16c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3V4c0-1.66-1.34-3-3-3zm-2 20h-4v-1h4v1zm3-3H7V4h10v14z"/>
                <animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 12 12" to="90 12 12" dur="1s" repeatCount="1"/>
            </svg>
            <div 
                id="portrait-message"
                style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    padding: '0 20px'
                }}
                >
                        Please rotate your device to landscape mode for the best experience.
                    </div>
                </div>
            )}
        </>
    );
} 