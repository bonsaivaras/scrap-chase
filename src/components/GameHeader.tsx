import React from 'react';
import logoSrc from '../assets/Logo-scrapchase.svg';
import engineSrc from '../assets/Property 1=Engine.png';
import { GAME_CONFIG } from '../config/gameConfig';

interface GameHeaderProps {
  score: number;
  timeLeft?: number;
  showTime?: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({ 
  score, 
  timeLeft = 0, 
  showTime = true 
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="header">
      <div className="flex items-center">
        <img src={logoSrc} alt="Scrap Chase" className="game-logo" />
      </div>
      
      {showTime && (
        <div className="timer">{formatTime(timeLeft)}</div>
      )}
      
      <div className="score">
        <img src={engineSrc} alt="Engine" className="score-icon" />
        <div className="score-value">{score}/{GAME_CONFIG.WIN_SCORE}</div>
      </div>
    </div>
  );
};

export default GameHeader;
