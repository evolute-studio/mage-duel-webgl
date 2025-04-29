import { useEffect, useRef } from 'react'
interface UnityInstance {
    SendMessage: (objectName: string, methodName: string, ...args: unknown[]) => void;
}

interface UnityConfig {
    dataUrl: string;
    frameworkUrl: string;
    codeUrl: string;
    streamingAssetsUrl: string;
    companyName: string;
    productName: string;
    productVersion: string;
    showBanner: (msg: string, type: string) => void;
}

interface UnityWindow extends Window {
    gameInstance: UnityInstance;
    createUnityInstance: (
        canvas: HTMLCanvasElement | null,
        config: UnityConfig,
        onProgress?: (progress: number) => void
    ) => Promise<UnityInstance>;
}

export default function UnityPlayer() {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const loadUnity = async () => {
            const buildUrl = "Build";
            const loaderUrl = buildUrl + "/mageduel-webgl-1.2.10r.loader.js";
            const config: UnityConfig = {
                dataUrl: buildUrl + "/mageduel-webgl-1.2.10r.data.br",
                frameworkUrl: buildUrl + "/mageduel-webgl-1.2.10r.framework.js.br",
                codeUrl: buildUrl + "/mageduel-webgl-1.2.10r.wasm.br",
                streamingAssetsUrl: "StreamingAssets",
                companyName: "EvoluteStudio",
                productName: "Evolute Kingdom: Mage Duel",
                productVersion: "1.2.10r",
                showBanner: (msg: string, type: string) => {
                    console.log(`Unity Banner: ${msg} (${type})`);
                }
            };

        
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            
                const meta = document.createElement('meta');
                meta.name = 'viewport';
                meta.content = 'width=device-width, height=device-height, initial-scale=1.0, user-scalable=no, shrink-to-fit=yes';
                document.getElementsByTagName('head')[0].appendChild(meta);

                // Встановлюємо класи для мобільних пристроїв
                if (containerRef.current) {
                    containerRef.current.className = "unity-mobile";
                }
                if (canvasRef.current) {
                    canvasRef.current.className = "unity-mobile";
                }

                
            } else {
                
                if (canvasRef.current) {
                    canvasRef.current.style.width = "1880px";
                    canvasRef.current.style.height = "930px";
                }
            }
    
            const dojoScript = document.createElement("script");
            dojoScript.src = "TemplateData/dojo.js/dojo_c.js";
            dojoScript.onload = async () => {
                await wasm_bindgen();
                console.log("Dojo loaded successfully");
            };
    
           
            await new Promise<void>((resolve, reject) => {
                const script = document.createElement('script');
                script.src = loaderUrl;
                script.onload = () => resolve();
                script.onerror = reject;
                document.body.appendChild(script);
                document.body.appendChild(dojoScript);
            });
    
            
            (window as UnityWindow).createUnityInstance(canvasRef.current, config, (progress: number) => {
                console.log(`Loading progress: ${progress * 100}%`);
            }).then((unityInstance: UnityInstance) => {
                console.log("Unity loaded successfully");
                window.gameInstance = unityInstance; 
            }).catch((message: string) => {
                console.error("Failed to load Unity:", message);
            });
        };
    
        loadUnity();
    }, []);
    
    return (
        <>
        <div ref={containerRef} id="unity-container" style={{ width: '100%', height: '100%' }}>
            <canvas 
                ref={canvasRef} 
                id="unity-canvas" 
                style={{ width: '100%', height: '100%' }}
                tabIndex={-1}
            />
            <div id="unity-warning"></div>
        </div>
        </>
    );
}