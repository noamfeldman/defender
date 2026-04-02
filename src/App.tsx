import React, { useState } from 'react';
import type { ScreenType } from './types/index';
import { LandingScreen } from './components/LandingScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { DefenderGame } from './components/DefenderGame';
import { GameOverScreen } from './components/GameOverScreen';
import { HighScoreScreen } from './components/HighScoreScreen';
import { useIsMobile, useOrientation } from './hooks/useMobileDetection';
import { RotateCw } from 'lucide-react';

export const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenType>('MAIN_MENU');
  const [finalScore, setFinalScore] = useState<number>(0);
  const isMobile = useIsMobile();
  const orientation = useOrientation();

  const handleGameOver = (score: number) => {
     setFinalScore(score);
     setScreen('GAMEOVER');
  };

  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden selection:bg-[#00ffcc] selection:text-black font-sans">
        {/* Orientation Recommendation Overlay */}
        {isMobile && orientation === 'portrait' && (
            <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="w-24 h-24 mb-6 text-[#00ffcc] animate-bounce">
                    <RotateCw size={96} strokeWidth={1} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">LANDSCAPE RECOMMENDED</h2>
                <p className="text-gray-400 text-lg max-w-xs">
                    For the best experience, please rotate your device to <span className="text-[#00ffcc] font-bold">Horizontal (Landscape)</span> mode.
                </p>
                <button 
                    onClick={() => {}} // Just visually available, or we could add a "Continue anyway" if needed
                    className="mt-10 px-6 py-2 border border-gray-700 text-gray-500 text-xs tracking-[0.2em] uppercase rounded-full"
                >
                    Waiting for rotation...
                </button>
            </div>
        )}
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
