import React, { useEffect, useState } from 'react';
import { fetchGlobalHighScores } from '../utils/storage';
import { useIsMobile, useOrientation } from '../hooks/useMobileDetection';
import { HallOfFameDesktop } from './HallOfFameDesktop';
import { HallOfFameMobile } from './HallOfFameMobile';
import { Button } from './ui/Button';
import { PageTitle } from './ui/PageTitle';
import type { HighScore } from '../types';

interface Props {
  onBack: () => void;
}

export const HighScoreScreen: React.FC<Props> = ({ onBack }) => {
  const [scores, setScores] = useState<HighScore[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  const isLandscape = orientation === 'landscape' && isMobile;

  useEffect(() => {
    async function getScores() {
      const data = await fetchGlobalHighScores();
      setScores(data);
      setLoading(false);
    }
    getScores();
  }, []);

  return (
    <div className="w-full h-full flex flex-col items-center bg-black p-2 md:p-6 tracking-widest text-white overflow-hidden relative">
        
        {/* Landscape Return Button (at top) */}
        {isLandscape && (
            <div className="w-full flex justify-center mb-1 shrink-0">
                <Button
                    variant="secondary"
                    onClick={onBack}
                    className="h-8 text-[10px] py-1"
                >
                    RETURN TO MENU
                </Button>
            </div>
        )}

        {/* Header */}
        <div className="flex flex-col items-center shrink-0 mt-0 sm:mt-4">
          <PageTitle text="HIGH SCORES" as="h2" className="mb-0 landscape:text-lg" />
          <p className="text-[8px] md:text-sm text-[#00ffcc] animate-pulse mb-4 md:mb-10">SHARED ACROSS GALAXIES</p>
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

        {/* Footer - Only visible when not in landscape mobile to save vertical space */}
        {!isLandscape && (
            <div className="mt-2 flex flex-col items-center justify-center shrink-0 w-full mb-1">
              <Button
                   variant="secondary"
                   onClick={onBack}
              >
                   RETURN TO MENU
              </Button>
            </div>
        )}
    </div>
  );
};

