import React, { useEffect, useRef, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GAME_CONFIG } from '../config/gameConfig';
import GameHeader from './GameHeader';

interface GameScreenProps {
  onGameOver: (score: number, reason: 'crash' | 'timeout', timeLeft?: number) => void;
  onWin: (score: number, timeLeft?: number) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onGameOver, onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timeLeft, setTimeLeft] = useState<number>(GAME_CONFIG.GAME_TIME_SECONDS);
  const { score, initGame } = useGameLogic(canvasRef, timeLeft, 
    (score, reason) => onGameOver(score, reason, timeLeft), 
    (score) => onWin(score, timeLeft)
  );

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        initGame();
      }
    };

    updateCanvasSize();
    const resizeObserver = new ResizeObserver(updateCanvasSize);
    if (canvasRef.current) {
      resizeObserver.observe(canvasRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          onGameOver(score, 'timeout', timeLeft);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [score, onGameOver, timeLeft]);

  return (
    <div className="game-container">
      <GameHeader score={score} timeLeft={timeLeft} showTime={true} />
      
      <div className="canvas-container">
        <canvas ref={canvasRef} className="game-canvas" />
      </div>
    </div>
  );
};

export default GameScreen;
