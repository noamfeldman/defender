import React, { useState } from 'react';
import type { ScreenType } from './types/index';
import { LandingScreen } from './components/LandingScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { DefenderGame } from './components/DefenderGame';
import { GameOverScreen } from './components/GameOverScreen';
import { HighScoreScreen } from './components/HighScoreScreen';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('MAIN_MENU');
  const [finalScore, setFinalScore] = useState<number>(0);

  const handleGameOver = (score: number) => {
     setFinalScore(score);
     setScreen('GAMEOVER');
  };

  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden selection:bg-[#00ffcc] selection:text-black">
        {screen === 'MAIN_MENU' && (
           <LandingScreen 
               onStart={() => setScreen('INSTRUCTIONS')} 
               onHighScores={() => setScreen('HIGH_SCORE')} 
           />
        )}
        
        {screen === 'INSTRUCTIONS' && (
            <InstructionsScreen 
               onPlay={() => setScreen('GAME')} 
               onBack={() => setScreen('MAIN_MENU')} 
            />
        )}

        {screen === 'GAME' && (
            <DefenderGame onGameOver={handleGameOver} />
        )}

        {screen === 'GAMEOVER' && (
            <GameOverScreen 
               score={finalScore} 
               onDone={() => setScreen('HIGH_SCORE')} 
            />
        )}

        {screen === 'HIGH_SCORE' && (
             <HighScoreScreen 
                onBack={() => setScreen('MAIN_MENU')} 
             />
        )}
    </div>
  );
};

export default App;
