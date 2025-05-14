'use client'

import UnityConnector from '@/lib/unity-connector';
import { useEffect, useRef} from 'react'
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

export interface UnityWindow extends Window {
    gameInstance: UnityInstance;
    createUnityInstance: (
        canvas: HTMLCanvasElement | null,
        config: UnityConfig,
        onProgress?: (progress: number) => void
    ) => Promise<UnityInstance>;
    unityConnector: UnityConnector;
}

export default function UnityPlayer() {
    const containerRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const projectId = "mageduel-webgl"
    const version = "1.3.16"
    const compression = ".br"
    const is_compressed = false

    useEffect(() => {
        const loadUnity = async () => {
            const buildUrl = "Build";
            const loaderUrl = buildUrl + `/${projectId}-${version}.loader.js`;
            const config: UnityConfig = {
                dataUrl: buildUrl + `/${projectId}-${version}.data${is_compressed ? compression : ""}`,
                frameworkUrl: buildUrl + `/${projectId}-${version}.framework.js${is_compressed ? compression : ""}`,
                codeUrl: buildUrl + `/${projectId}-${version}.wasm${is_compressed ? compression : ""}`,
                streamingAssetsUrl: "StreamingAssets",
                companyName: "EvoluteStudio",
                productName: "Evolute Kingdom: Mage Duel",
                productVersion: version,
                showBanner: (msg: string, type: string) => {
                    console.log(`Unity Banner: ${msg} (${type})`);
                }
            };

        
            if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
                // Just set the mobile class, other settings will be handled by the IPhoneFix component
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
            (window as UnityWindow).unityConnector = new UnityConnector();
        };
    
        loadUnity();
    }, [is_compressed]);
    
    return (
        <>
        <div 
            ref={containerRef} 
            id="unity-container" 
            className="fixed w-full h-full top-0 left-0"
        >
            <canvas 
                ref={canvasRef} 
                id="unity-canvas" 
                className="w-full h-full block"
                tabIndex={-1}
            />
            <div id="unity-warning"></div>
        </div>
        </>
    );
}