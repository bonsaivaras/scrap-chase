import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import GameScreen from './components/GameScreen';
import WinScreen from './components/WinScreen';
import GameOverScreen from './components/GameOverScreen';
import LoadingScreen from './components/LoadingScreen';

type GameState = 'splash' | 'loading' | 'playing' | 'won' | 'gameover';

function App() {
  const [gameState, setGameState] = useState<GameState>('splash');
  const [finalScore, setFinalScore] = useState(0);
  const [gameOverReason, setGameOverReason] = useState<'crash' | 'timeout'>('crash');
  const [timeLeft, setTimeLeft] = useState(0);

  const handleStartGame = () => {
    setGameState('loading');
  };

  const handleLoadingComplete = () => {
    setGameState('playing');
  };

  const handleGameOver = (score: number, reason: 'crash' | 'timeout' = 'crash', remainingTime: number = 0) => {
    setFinalScore(score);
    setGameOverReason(reason);
    setTimeLeft(remainingTime);
    setGameState('gameover');
  };

  const handleWin = (score: number, remainingTime: number = 0) => {
    setFinalScore(score);
    setTimeLeft(remainingTime);
    setGameState('won');
  };

  const handlePlayAgain = () => {
    setGameState('splash');
  };

  return (
    <div className="app-container">
      {gameState === 'splash' && (
        <SplashScreen onStartGame={handleStartGame} />
      )}
      {gameState === 'loading' && (
        <LoadingScreen onLoadingComplete={handleLoadingComplete} />
      )}
      {gameState === 'playing' && (
        <GameScreen 
          onGameOver={handleGameOver}
          onWin={handleWin}
        />
      )}
      {gameState === 'won' && (
        <WinScreen 
          score={finalScore}
          timeLeft={timeLeft}
          onPlayAgain={handlePlayAgain}
        />
      )}
      {gameState === 'gameover' && (
        <GameOverScreen
          score={finalScore}
          reason={gameOverReason}
          timeLeft={timeLeft}
          onTryAgain={handlePlayAgain}
        />
      )}
    </div>
  );
}

export default App;
