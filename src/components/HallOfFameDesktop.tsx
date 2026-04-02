import React from 'react';

interface Score {
  initials: string;
  score: number;
}

interface Props {
  scores: Score[];
}

export const HallOfFameDesktop: React.FC<Props> = ({ scores }) => {
  return (
    <div className="flex flex-col w-full max-w-lg h-full overflow-hidden relative group">
      {/* Table Header - Fixed Grid */}
      <div className="grid grid-cols-[80px_1fr_120px] border-b border-gray-700 pb-3 mb-4 text-gray-400 text-sm md:text-base px-6 shrink-0 font-bold tracking-widest">
        <span>RANK</span>
        <span className="text-center">NAME</span>
        <span className="text-right">SCORE</span>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar-desktop pr-2">
        <div className="flex flex-col gap-3">
          {scores.map((score, index) => (
            <div 
              key={index} 
              className="grid grid-cols-[80px_1fr_120px] items-center bg-gray-900/60 px-6 py-4 drop-shadow-md border border-gray-800 hover:border-[#ff0055] hover:bg-gray-800 transition-all cursor-default group/item rounded-sm"
            >
              <span className="text-[#ff0055] font-black text-xl group-hover/item:scale-110 transition-transform">{index + 1}</span>
              <span className="text-[#00ffcc] text-center font-bold text-lg">{score.initials}</span>
              <span className="text-white font-mono text-xl text-right">{score.score.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar-desktop::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar-desktop::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar-desktop::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }
        .custom-scrollbar-desktop::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
      `}} />
    </div>
  );
};
