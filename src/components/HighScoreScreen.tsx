import React, { useEffect, useState } from 'react';
import { fetchGlobalHighScores } from '../utils/storage';
import { useIsMobile } from '../hooks/useMobileDetection';
import { HallOfFameDesktop } from './HallOfFameDesktop';
import { HallOfFameMobile } from './HallOfFameMobile';
import { Button } from './ui/Button';
import type { HighScore } from '../types';

interface Props {
  onBack: () => void;
}

export const HighScoreScreen: React.FC<Props> = ({ onBack }) => {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function getScores() {
      const data = await fetchGlobalHighScores();
      setScores(data);
      setLoading(false);
    }
    getScores();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center bg-black p-3 md:p-6 tracking-widest text-white overflow-hidden relative">
        {/* Header - Very compact on small screens */}
        <div className="flex flex-col items-center shrink-0 mt-1 sm:mt-4">
          <h2 className="hall-of-fame mb-1 text-xl md:text-5xl lg:text-6xl text-center leading-tight">
              GLOBAL LEADERBOARD
          </h2>
          <p className="text-[10px] md:text-sm text-[#00ffcc] animate-pulse mb-2">SHARED ACROSS ALL PILOTS</p>
        </div>

        {/* Content Area Container with Fade Effect */}
        <div className="flex-1 w-full flex justify-center overflow-hidden min-h-0 relative py-1">
            {/* Top Fade */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
            
            <div className="w-full h-full max-w-lg">
                {loading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                        <div className="w-8 h-8 border-2 border-t-transparent border-[#00ffcc] rounded-full animate-spin" />
                        <p className="text-xl text-[#00ffcc] animate-pulse">ESTABLISHING UPLINK...</p>
                    </div>
                ) : scores.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-xl text-gray-500">NO SCORES RECORDED</p>
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
          <Button
               variant="secondary"
               onClick={onBack}
          >
               RETURN TO MENU
          </Button>
        </div>
    </div>
  );
};

