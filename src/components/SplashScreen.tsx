import React from 'react';
import Button from './Button';

interface SplashScreenProps {
  onStartGame: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStartGame }) => {
  return (
    <div className="splash-screen">
      <img className="splash-logo" src="src/assets/Logo-scrapchase.svg" alt="Scrap Chase Logo" />
      <div className="splash-content">
        <h1 className="splash-title">Scrap Chase</h1>
        <p className="splash-description">
          Collect all parts for your car in time to win a delivery discount code.
          Navigate through obstacles and gather 10 parts to win!
        </p>
        <Button
          onClick={onStartGame}
          variant="primary"
        >
          Start Game
        </Button>
      </div>
      <div className="splash-screen-image">
        <img className="splash-car" src="src/assets/car.png" alt="Car" />
        <div className="part-image"><img src="src/assets/Property 1=Engine.png" alt="Engine" /></div>
        <div className="part-image"><img src="src/assets/Property 1=Steering wheel.png" alt="Steering Wheel" /></div>
        <div className="part-image"><img src="src/assets/Property 1=Turbo.png" alt="Turbo" /></div>
        <div className="part-image"><img src="src/assets/Property 1=Wheel.png" alt="Wheel" /></div>
        <div className="part-image"><img src="src/assets/Property 1=Spring coil.png" alt="Spring" /></div>
        <div className="part-image"><img src="src/assets/Property 1=Battery.png" alt="Battery" /></div>
        <div className="part-image"><img src="src/assets/Property 1=Headlight.png" alt="Headlight" /></div>
        <div className="part-image"><img src="src/assets/Property 1=Mirror.png" alt="Mirror" /></div>
        <div className="part-image"><img src="src/assets/Property 1=Variant9.png" alt="Variant" /></div>
      </div>
    </div>
  );
};

export default SplashScreen;
