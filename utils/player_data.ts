
const UUID_CONFIG = {
    useDeterministic: false
}

export const getPlayerId = () => {
    var player_id = localStorage.getItem('player_id');
    if (!player_id) {
        player_id = setPlayerId();
    }
    return player_id;
};

export const setPlayerId = () => {
    const player_id = generatePlayerId();
    const player_id_timestamp = Date.now();
    localStorage.setItem('player_id', player_id);
    localStorage.setItem('player_id_timestamp', player_id_timestamp.toString());
    return player_id;
};

const generatePlayerId = () => {
    return UUID_CONFIG.useDeterministic ? generateDeterministicUUID() : generateRandomUUID();
};


const generateRandomUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

const generateDeterministicUUID = () => {
    
    const deviceInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        hardwareConcurrency: navigator.hardwareConcurrency,
        deviceMemory: (navigator as any).deviceMemory,
        
        webglVendor: getWebGLInfo().vendor,
        webglRenderer: getWebGLInfo().renderer,
        
        audioContext: getAudioContextInfo(),
        fonts: getAvailableFonts(),
    };

    const deviceString = JSON.stringify(deviceInfo);
    let hash = 0;
    for (let i = 0; i < deviceString.length; i++) {
        const char = deviceString.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    const template = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    return template.replace(/[xy]/g, function(c) {
        const r = (hash + Math.abs(hash)) % 16;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

const getWebGLInfo = () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
        return { vendor: 'unknown', renderer: 'unknown' };
    }
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
        return { vendor: 'unknown', renderer: 'unknown' };
    }
    return {
        vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
        renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
    };
};

const getAudioContextInfo = () => {
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        return {
            sampleRate: audioContext.sampleRate,
            state: audioContext.state,
            baseLatency: audioContext.baseLatency
        };
    } catch (e) {
        return 'unknown';
    }
};

const getAvailableFonts = () => {
    if (!document.fonts || !document.fonts.check) {
        return 'unknown';
    }
    
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const fontList = [];
    
    for (const baseFont of baseFonts) {
        for (const font of ['Arial', 'Times New Roman', 'Courier New', 'Georgia', 'Verdana']) {
            if (document.fonts.check(`12px "${font}"`)) {
                fontList.push(font);
            }
        }
    }
    
    return fontList;
};
