declare global {
    interface Window {
        gameInstance: any;
        createUnityInstance: any;
        stopUnityLoading: boolean;
        
        // Controller
        controllerInstance: any;
        username: string;
        account: any;
        unityConnector: UnityConnector;
        handleConnect: () => Promise<void>;
    }
}

export {}; 