import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Revving up the engines...",
  "Adding extra horsepower...",
  "Good luck!",
];

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => {
        const nextIndex = prev + 1;
        if (nextIndex === loadingMessages.length - 1) {
          // When showing the last message (Good luck!)
          clearInterval(interval);
          setTimeout(() => {
            onLoadingComplete?.();
          }, 1500); // Show "Good luck!" for 1.5 seconds
        }
        return nextIndex < loadingMessages.length ? nextIndex : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-message">{loadingMessages[messageIndex]}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
