import { useEffect } from 'react';

export default function ServiceWorker() {
    useEffect(() => {
        const loadServiceWorker = async () => {
            try {
                const script = document.createElement('script');
                script.src = '/register-service-worker.js';
                script.async = true;
                document.body.appendChild(script);

                script.onload = () => {
                    console.log('Service Worker script loaded successfully');
                };

                script.onerror = (error) => {
                    console.error('Failed to load Service Worker script:', error);
                };
            } catch (error) {
                console.error('Error loading Service Worker:', error);
            }
        };

        loadServiceWorker();
    }, []);

    return null; // Компонент не рендерить нічого в DOM
}
