import React from 'react';
import bgWipeOut from '../assets/bg-wipe-out.png';
import bgTimeUp from '../assets/bg-time-up.png';
import Button from './Button';
import GameHeader from './GameHeader';

interface GameOverScreenProps {
  score: number;
  reason: 'crash' | 'timeout';
  timeLeft: number;
  onTryAgain: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ score, reason, timeLeft, onTryAgain }) => {
  const subtitle = reason === 'crash' 
    ? 'You wiped out a bus stop!' 
    : 'You ran out of time!';
  const backgroundImage = reason === 'crash' ? bgWipeOut : bgTimeUp;
  
  // If timeout, set timeLeft to 0
  const displayTimeLeft = reason === 'timeout' ? 0 : timeLeft;

  return (
    <div 
      className="game-over-screen min-h-screen flex flex-col items-center justify-center p-4"
      style={{
        background: `radial-gradient(102.79% 102.78% at 45.1% -19.38%, rgba(0, 0, 0, 0.00) 0%, rgba(255, 97, 15, 0.20) 100%), 
                    linear-gradient(0deg, rgba(0, 0, 0, 0.70) 0%, rgba(0, 0, 0, 0.70) 100%), 
                    url(${backgroundImage}) lightgray -71.536px 0px / 126.885% 100% no-repeat`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="game-over-header-container">
        <GameHeader score={score} timeLeft={displayTimeLeft} showTime={true} />
      </div>
      
      <div className="text-center text-white bg-black bg-opacity-50 p-8 rounded-xl max-w-md mx-auto">
        <h1 className="game-over-title">Game Over</h1>
        <p className="game-over-subtitle">{subtitle}</p>
        <div className="game-over-button-wrapper">
          <Button 
            variant="primary" 
            onClick={onTryAgain}
          >
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameOverScreen;
