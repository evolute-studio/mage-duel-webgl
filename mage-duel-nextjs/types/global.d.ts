declare global {
    interface Window {
        gameInstance: any;
        createUnityInstance: any;
        stopUnityLoading: boolean;
        
        // Controller
        controllerInstance: any;
        username: string;
        unityConnector: UnityConnector;

    }
}

export {}; 