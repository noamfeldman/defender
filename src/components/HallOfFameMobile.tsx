import React from 'react';

interface Score {
  initials: string;
  score: number;
}

interface Props {
  scores: Score[];
}

export const HallOfFameMobile: React.FC<Props> = ({ scores }) => {
  return (
    <div className="flex flex-col w-full h-full max-w-md mx-auto overflow-hidden relative">
      {/* Header for table - Grid alignment */}
      <div className="grid grid-cols-[50px_1fr_90px] border-b border-gray-700 pb-3 text-gray-400 text-[10px] mb-3 px-4 shrink-0 font-bold tracking-tighter">
        <span>RANK</span>
        <span className="text-center">NAME</span>
        <span className="text-right">SCORE</span>
      </div>

      {/* Scrollable Container with Fade Effect */}
      <div className="relative flex-1 overflow-hidden">
        {/* Top Fade Indicator if scrollable */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />

        {/* The Scrollable List */}
        <div className="h-full overflow-y-auto px-4 pb-4 space-y-2 custom-scrollbar">
          {scores.map((score, index) => (
            <div 
              key={index} 
              className="grid grid-cols-[50px_1fr_90px] items-center bg-gray-900/60 px-4 py-3 rounded border border-gray-800 active:bg-gray-800 transition-all shadow-md active:scale-[0.98] touch-manipulation"
            >
              <span className="text-[#ff0055] font-black text-sm">{index + 1}</span>
              <span className="text-[#00ffcc] font-bold text-center text-xs">{score.initials}</span>
              <span className="text-white font-mono text-xs text-right">{score.score.toLocaleString()}</span>
            </div>
          ))}
        </div>

        {/* Bottom Fade Indicator if scrollable */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none z-10" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #000;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
      `}} />
    </div>
  );
};
