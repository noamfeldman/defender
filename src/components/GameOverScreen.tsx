import React, { useState } from 'react';
import { isHighScore, saveHighScore } from '../utils/storage';

interface Props {
  score: number;
  onDone: () => void;
}

export const GameOverScreen: React.FC<Props> = ({ score, onDone }) => {
  const [initials, setInitials] = useState('');
  const qualify = isHighScore(score);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (initials.trim().length === 3) {
          saveHighScore(initials, score);
          onDone();
      }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-90 absolute top-0 left-0 z-50 text-center tracking-widest gap-8">
        <h2 className="text-6xl text-[#ff0055] mb-4 animate-[ping_1.5s_infinite]">GAME OVER</h2>
        
        <p className="text-3xl text-white">SCORE: {score}</p>

        {qualify ? (
            <div className="flex flex-col items-center mt-8 space-y-6">
                <p className="text-[#00ffcc] text-xl animate-pulse">NEW HIGH SCORE!</p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="text" 
                        maxLength={3}
                        value={initials}
                        onChange={e => setInitials(e.target.value.toUpperCase())}
                        placeholder="AAA"
                        className="bg-transparent border-b-2 border-[#00ffcc] text-4xl text-center text-white w-32 focus:outline-none placeholder:text-gray-800"
                        autoFocus
                    />
                    <button 
                        type="submit"
                        disabled={initials.length !== 3}
                        className="px-6 py-2 bg-[#00ffcc] text-black disabled:bg-gray-700 disabled:text-gray-500 rounded font-bold"
                    >
                        ENTER
                    </button>
                </form>
            </div>
        ) : (
            <button 
                onClick={onDone}
                className="mt-12 px-8 py-3 bg-[#00ffcc] text-black font-bold uppercase shadow-[0_0_15px_#00ffcc]"
            >
                CONTINUE
            </button>
        )}
    </div>
  );
};
