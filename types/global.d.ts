declare global {
    interface Window {
        gameInstance: any;
        createUnityInstance: any;
        stopUnityLoading: boolean;
        
        // Controller
        controllerInstance: any;
        username: string;
        account: any;
        provider: any;
        unityConnector: UnityConnector;
        handleConnect: () => Promise<boolean>;
        handleDisconnect: () => void;
    }
}

export {}; 