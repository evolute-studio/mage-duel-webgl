'use client';

import { useState } from 'react';

export default function GamePage() {
  const [isGameLoaded, setIsGameLoaded] = useState(false);

  const handlePlayClick = () => {
    setIsGameLoaded(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
      {!isGameLoaded ? (
        <button
          onClick={handlePlayClick}
          className="px-8 py-4 text-2xl font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Play
        </button>
      ) : (
        <div className="w-full h-screen">
          <iframe
            src="/unity_build/index.html"
            className="w-full h-full"
            allow="fullscreen"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        </div>
      )}
    </div>
  );
} 