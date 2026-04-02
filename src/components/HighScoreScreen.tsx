import React from 'react';
import { getHighScores } from '../utils/storage';
import { useIsMobile } from '../hooks/useMobileDetection';
import { HallOfFameDesktop } from './HallOfFameDesktop';
import { HallOfFameMobile } from './HallOfFameMobile';

interface Props {
  onBack: () => void;
}

export const HighScoreScreen: React.FC<Props> = ({ onBack }) => {
  const scores = getHighScores();
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-full flex flex-col items-center bg-black p-3 md:p-6 tracking-widest text-white overflow-hidden relative">
        {/* Header - Very compact on small screens */}
        <div className="flex flex-col items-center shrink-0 mt-1 sm:mt-4">
          <h2 className="hall-of-fame mb-3 text-xl md:text-5xl lg:text-6xl text-center leading-tight">
              HALL OF FAME
          </h2>
        </div>

        {/* Content Area Container with Fade Effect */}
        <div className="flex-1 w-full flex justify-center overflow-hidden min-h-0 relative py-1">
            {/* Top Fade */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
            
            <div className="w-full h-full max-w-lg">
                {scores.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-xl text-gray-500">NO SCORES YET</p>
                    </div>
                ) : (
                    isMobile ? 
                    <HallOfFameMobile scores={scores} /> : 
                    <HallOfFameDesktop scores={scores} />
                )}
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="mt-3 flex flex-col items-center justify-center shrink-0 w-full mb-1">
          <button 
               onClick={onBack}
               className="w-full md:w-auto px-8 py-2 bg-transparent border-2 border-gray-500 text-gray-400 hover:text-white hover:border-[#00ffcc] active:bg-[#00ffcc]/10 transition-all uppercase tracking-widest text-sm md:text-lg font-bold shadow-neon"
          >
               RETURN TO MENU
          </button>
        </div>
    </div>
  );
};
