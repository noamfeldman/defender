import React from 'react';

interface Props {
  onStart: () => void;
  onHighScores: () => void;
}

export const LandingScreen: React.FC<Props> = ({ onStart, onHighScores }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black tracking-widest gap-12">
        <h1 
            className="relative text-[min(12vw,8rem)] italic font-bold uppercase leading-none text-transparent bg-clip-text select-none pr-8
                       before:absolute before:content-[attr(data-text)] before:text-[#e00000] before:left-[4px] before:top-[8px] before:-z-10 before:text-shadow-[4px_8px_0_#900000]"
            data-text="DEFENDER"
            style={{ 
                letterSpacing: '-0.1em',
                backgroundImage: 'linear-gradient(to bottom, #55ffff 55%, #f80000 55%)'
            }}
        >
            DEFENDER
        </h1>
        
        <div className="flex flex-col gap-6 w-64">
            <button 
                onClick={onStart}
                className="py-4 border-2 border-[#00ffcc] text-[#00ffcc] font-bold text-xl uppercase hover:bg-[#00ffcc] hover:text-black transition-all shadow-[0_0_10px_#00ffcc] hover:shadow-[0_0_20px_#00ffcc]"
            >
                Start Game
            </button>
            <button 
                onClick={onHighScores}
                className="py-4 border-2 border-[#ff0055] text-[#ff0055] font-bold text-xl uppercase hover:bg-[#ff0055] hover:text-black transition-all shadow-[0_0_10px_#ff0055] hover:shadow-[0_0_20px_#ff0055]"
            >
                High Scores
            </button>
        </div>
        
        <div className="absolute bottom-8 text-gray-400 text-sm tracking-widest">
            INSERT COIN
        </div>
    </div>
  );
};
