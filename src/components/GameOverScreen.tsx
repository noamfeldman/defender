import React, { useState, useEffect } from 'react';
import { isHighScore, submitGlobalHighScore, fetchGlobalHighScores } from '../utils/storage';
import { Button } from './ui/Button';
import { PageTitle } from './ui/PageTitle';
import { useIsMobile, useOrientation } from '../hooks/useMobileDetection';

interface Props {
  score: number;
  onDone: () => void;
}

export const GameOverScreen: React.FC<Props> = ({ score, onDone }) => {
  const [initials, setInitials] = useState('');
  const [qualify, setQualify] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  const orientation = useOrientation();
  const isLandscape = isMobile && orientation === 'landscape';

  useEffect(() => {
    async function checkQualification() {
      const globalScores = await fetchGlobalHighScores();
      setQualify(isHighScore(score, globalScores));
      setLoading(false);
    }
    checkQualification();
  }, [score]);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (initials.trim().length === 3 && !isSubmitting) {
          setIsSubmitting(true);
          await submitGlobalHighScore(initials, score);
          onDone();
      }
  };

  return (
    <div className={`w-full h-full flex flex-col items-center bg-black bg-opacity-95 absolute top-0 left-0 z-50 text-center tracking-widest ${isLandscape ? 'gap-1 pt-2' : 'justify-center gap-8'}`}>
        
        {/* Landscape Buttons at Top */}
        {isLandscape && !loading && (
            <div className="w-full flex justify-center gap-4 mb-2 shrink-0 px-4">
                {qualify ? (
                    <div className="flex flex-row items-center gap-4">
                        <form onSubmit={handleSubmit} className="flex flex-row items-center gap-2">
                           <input 
                                type="text" 
                                maxLength={3}
                                value={initials}
                                onChange={e => setInitials(e.target.value.toUpperCase())}
                                placeholder="AAA"
                                className="bg-transparent border-b-2 border-[#00ffcc] text-center text-white focus:outline-none placeholder:text-gray-800 disabled:opacity-50 text-xl w-16"
                                autoFocus
                                disabled={isSubmitting}
                            />
                            <Button 
                                type="submit"
                                disabled={initials.length !== 3 || isSubmitting}
                                variant="primary"
                                className="h-8 text-[10px] px-3"
                            >
                                {isSubmitting ? '...' : 'SAVE'}
                            </Button>
                        </form>
                        <Button 
                            onClick={onDone}
                            variant="secondary"
                            disabled={isSubmitting}
                            className="h-8 text-[10px] px-3"
                        >
                            SKIP
                        </Button>
                    </div>
                ) : (
                    <Button 
                        onClick={onDone}
                        variant="primary"
                        className="h-8 text-[10px] px-6"
                    >
                        CONTINUE
                    </Button>
                )}
            </div>
        )}

        <PageTitle 
            text="GAME OVER" 
            as="h2" 
            className={`animate-[ping_1.5s_infinite] ${isLandscape ? 'text-xl mb-0' : 'text-6xl mb-4'}`} 
        />
        
        <p className={`${isLandscape ? 'text-md mt-1' : 'text-3xl'} text-white`}>SCORE: {score}</p>

        {loading ? (
             <div className="flex flex-col items-center gap-2 mt-4">
                 <div className="w-6 h-6 border-2 border-t-transparent border-[#00ffcc] rounded-full animate-spin" />
                 <p className="text-sm text-[#00ffcc]">CHECKING LEADERBOARD...</p>
             </div>
        ) : qualify ? (
            <div className={`flex flex-col items-center ${isLandscape ? 'mt-1' : 'mt-8 space-y-6'}`}>
                <PageTitle 
                    text="NEW HIGH SCORE!" 
                    as="h3" 
                    className={`${isLandscape ? 'text-lg' : 'text-2xl'} animate-pulse`}
                />
                
                {/* Standard Portrait/Desktop Entry Form */}
                {!isLandscape && (
                    <div className="flex flex-col items-center gap-6">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input 
                                type="text" 
                                maxLength={3}
                                value={initials}
                                onChange={e => setInitials(e.target.value.toUpperCase())}
                                placeholder="AAA"
                                className="bg-transparent border-b-2 border-[#00ffcc] text-4xl text-center text-white w-32 focus:outline-none placeholder:text-gray-800 disabled:opacity-50"
                                autoFocus
                                disabled={isSubmitting}
                            />
                            <Button 
                                type="submit"
                                disabled={initials.length !== 3 || isSubmitting}
                                variant="primary"
                            >
                                {isSubmitting ? 'UPLOADING...' : 'SAVE TO HALL OF FAME'}
                            </Button>
                        </form>
                        
                        <Button 
                            onClick={onDone}
                            variant="secondary"
                            disabled={isSubmitting}
                            className="w-full max-w-[200px]"
                        >
                            SKIP & RETURN
                        </Button>
                    </div>
                )}
            </div>
        ) : !isLandscape ? (
            <Button 
                onClick={onDone}
                variant="primary"
            >
                CONTINUE
            </Button>
        ) : null}
    </div>
  );
};

