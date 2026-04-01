import React from 'react';
import { getHighScores } from '../utils/storage';

interface Props {
  onBack: () => void;
}

export const HighScoreScreen: React.FC<Props> = ({ onBack }) => {
  const scores = getHighScores();

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black p-4 tracking-widest gap-8 text-white">
        <h2 className="hall-of-fame mb-8">
            HALL OF FAME
        </h2>

        {scores.length === 0 ? (
            <p className="text-xl text-gray-500">NO SCORES YET</p>
        ) : (
            <div className="flex flex-col gap-4 w-full max-w-lg text-2xl">
                <div className="flex justify-between border-b border-gray-700 pb-2 text-gray-400 text-lg">
                    <span>RANK</span>
                    <span>NAME</span>
                    <span>SCORE</span>
                </div>
                {scores.map((score, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-900 px-4 py-2 drop-shadow-md border border-gray-800">
                        <span className="text-[#ff0055] font-black">{index + 1}</span>
                        <span className="text-[#00ffcc] w-16 text-center">{score.initials}</span>
                        <span className="text-white font-mono">{score.score.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        )}

        <button 
             onClick={onBack}
             className="mt-12 px-8 py-3 bg-transparent border-2 border-gray-500 text-gray-400 hover:text-white hover:border-white transition-colors uppercase tracking-widest"
        >
             RETURN TO MENU
        </button>
    </div>
  );
};
