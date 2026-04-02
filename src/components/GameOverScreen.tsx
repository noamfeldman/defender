import React, { useState, useEffect } from 'react';
import { isHighScore, submitGlobalHighScore, fetchGlobalHighScores } from '../utils/storage';
import { Button } from './ui/Button';


interface Props {
  score: number;
  onDone: () => void;
}

export const GameOverScreen: React.FC<Props> = ({ score, onDone }) => {
  const [initials, setInitials] = useState('');
  const [qualify, setQualify] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-90 absolute top-0 left-0 z-50 text-center tracking-widest gap-8">
        <h2 className="text-6xl text-[#ff0055] mb-4 animate-[ping_1.5s_infinite]">GAME OVER</h2>
        
        <p className="text-3xl text-white">SCORE: {score}</p>

        {loading ? (
             <div className="flex flex-col items-center gap-2">
                 <div className="w-6 h-6 border-2 border-t-transparent border-[#00ffcc] rounded-full animate-spin" />
                 <p className="text-sm text-[#00ffcc]">CHECKING LEADERBOARD...</p>
             </div>
        ) : qualify ? (
            <div className="flex flex-col items-center mt-8 space-y-6">
                <p className="text-[#00ffcc] text-xl animate-pulse font-bold">NEW GLOBAL HIGH SCORE!</p>
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
                        {isSubmitting ? 'UPLOADING...' : 'ENTER HALL OF FAME'}
                    </Button>
                </form>
            </div>
        ) : (
            <Button 
                onClick={onDone}
                variant="primary"
            >
                CONTINUE
            </Button>
        )}
    </div>
  );
};

