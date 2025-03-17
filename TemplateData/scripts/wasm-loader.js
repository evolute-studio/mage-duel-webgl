// WASM Module Loader
class WasmLoader {
    static async loadDojoWasm() {
        console.log('[WasmLoader] Starting WASM module loading...');
        
        return new Promise((resolve, reject) => {
            console.log('[WasmLoader] Creating script element for dojo_c.js');
            const dojoScript = document.createElement("script");
            dojoScript.src = "TemplateData/dojo.js/dojo_c.js";
            
            const startTime = performance.now();
            
            dojoScript.onload = async () => {
                const scriptLoadTime = (performance.now() - startTime).toFixed(2);
                console.log(`[WasmLoader] dojo_c.js loaded in ${scriptLoadTime}ms`);
                
                try {
                    console.log('[WasmLoader] Starting WASM initialization...');
                    const wasmStartTime = performance.now();
                    
                    // Wait for WASM module to load
                    await wasm_bindgen("TemplateData/dojo.js/dojo_c_bg.wasm");
                    
                    const wasmLoadTime = (performance.now() - wasmStartTime).toFixed(2);
                    console.log(`[WasmLoader] WASM module initialized successfully in ${wasmLoadTime}ms`);
                    
                    const totalTime = (performance.now() - startTime).toFixed(2);
                    console.log(`[WasmLoader] Total WASM loading time: ${totalTime}ms`);
                    
                    resolve();
                } catch (error) {
                    console.error('[WasmLoader] Failed to initialize WASM module:', error);
                    reject(error);
                }
            };
            
            dojoScript.onerror = (error) => {
                console.error('[WasmLoader] Failed to load WASM script:', error);
                reject(error);
            };
            
            console.log('[WasmLoader] Appending script to document body');
            document.body.appendChild(dojoScript);
        });
    }
} 
