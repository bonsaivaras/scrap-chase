import React from 'react';
import Button from './Button';
// Import assets
import logoSrc from '../assets/Logo-scrapchase.svg';
import carSrc from '../assets/car.png';
import engineSrc from '../assets/Property 1=Engine.png';
import steeringWheelSrc from '../assets/Property 1=Steering wheel.png';
import turboSrc from '../assets/Property 1=Turbo.png';
import wheelSrc from '../assets/Property 1=Wheel.png';
import springSrc from '../assets/Property 1=Spring coil.png';
import batterySrc from '../assets/Property 1=Battery.png';
import headlightSrc from '../assets/Property 1=Headlight.png';
import mirrorSrc from '../assets/Property 1=Mirror.png';
import variantSrc from '../assets/Property 1=Variant9.png';

interface SplashScreenProps {
  onStartGame: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onStartGame }) => {
  return (
    <div className="splash-screen">
      <img className="splash-logo" src={logoSrc} alt="Scrap Chase Logo" />
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
        <img className="splash-car" src={carSrc} alt="Car" />
        <div className="part-image"><img src={engineSrc} alt="Engine" /></div>
        <div className="part-image"><img src={steeringWheelSrc} alt="Steering Wheel" /></div>
        <div className="part-image"><img src={turboSrc} alt="Turbo" /></div>
        <div className="part-image"><img src={wheelSrc} alt="Wheel" /></div>
        <div className="part-image"><img src={springSrc} alt="Spring" /></div>
        <div className="part-image"><img src={batterySrc} alt="Battery" /></div>
        <div className="part-image"><img src={headlightSrc} alt="Headlight" /></div>
        <div className="part-image"><img src={mirrorSrc} alt="Mirror" /></div>
        <div className="part-image"><img src={variantSrc} alt="Variant" /></div>
      </div>
    </div>
  );
};

export default SplashScreen;
