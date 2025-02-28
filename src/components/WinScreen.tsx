import React, { useState } from 'react';
import bgSuccess from '../assets/bg-success.png';
import Button from './Button';
import GameHeader from './GameHeader';

interface WinScreenProps {
  score: number;
  timeLeft: number;
  onPlayAgain: () => void;
}

const WinScreen: React.FC<WinScreenProps> = ({ score, timeLeft, onPlayAgain }) => {
  const discountCode = "SCRAPCHASE15";
  const [copied, setCopied] = useState(false);

  const visitOvoko = () => {
    window.open('https://ovoko.fr', '_blank');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(discountCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div 
      className="win-screen min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: `radial-gradient(102.79% 102.78% at 45.1% -19.38%, rgba(0, 0, 0, 0.00) 0%, rgba(255, 97, 15, 0.20) 100%), 
                    linear-gradient(0deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.70) 100%), 
                    url(${bgSuccess}) lightgray -71.536px 0px / 126.885% 100% no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="win-header-container">
        <GameHeader score={score} timeLeft={timeLeft} showTime={true} />
      </div>
      
      <div className="text-center text-white bg-black bg-opacity-50 p-8 rounded-xl max-w-md mx-auto">
        <h1 className="win-title">Great success!</h1>
        <p className="win-subtitle">
          Use discount <span 
            className="inline-discount-code"
            onClick={copyToClipboard}
          >
            "{discountCode}"
            {copied && <span className="copied-tooltip">Copied!</span>}
          </span> for your next purchase
        </p>
        
        <div className="win-button-wrapper">
          <Button 
            variant="primary" 
            onClick={visitOvoko}
          >
            Visit Ovoko
          </Button>
          <Button 
            variant="secondary" 
            onClick={onPlayAgain}
          >
            New game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WinScreen;
