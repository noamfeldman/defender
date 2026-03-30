import React from 'react';

interface Props {
  onPlay: () => void;
  onBack: () => void;
}

export const InstructionsScreen: React.FC<Props> = ({ onPlay, onBack }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black p-6 md:p-8 text-center tracking-widest gap-6 md:gap-10 overflow-y-auto selection:bg-[#00ffcc] selection:text-black">
        <h2 className="text-2xl md:text-5xl text-[#00ffcc] mb-2 md:mb-6 leading-tight">INSTRUCTIONS</h2>

        <div className="flex flex-col md:flex-row gap-8 md:gap-20 text-left max-w-5xl w-full px-2">
            <div className="flex-1 space-y-4">
               <h3 className="text-xl md:text-2xl text-[#ff0055] border-b border-[#ff0055] pb-2">DESKTOP</h3>
               <ul className="text-gray-300 space-y-3 text-sm md:text-base">
                   <li className="flex flex-wrap items-center gap-2">
                       <span className="text-white font-bold min-w-[70px] md:min-w-[100px] inline-block">W A S D</span>
                       <span>/</span>
                       <span className="text-white font-bold">ARROWS</span>
                       <span className="text-gray-500">-</span>
                       <span>MOVE</span>
                   </li>
                   <li className="flex items-center gap-2">
                       <span className="text-white font-bold min-w-[70px] md:min-w-[100px] inline-block">SPACE</span>
                       <span className="text-gray-500">-</span>
                       <span>FIRE</span>
                   </li>
                   <li className="flex flex-wrap items-center gap-2">
                       <span className="text-white font-bold min-w-[70px] md:min-w-[100px] inline-block">SHIFT</span>
                       <span className="text-gray-500">-</span>
                       <span>THRUST (Faster Move)</span>
                   </li>
                   <li className="flex flex-wrap items-center gap-2">
                       <span className="text-white font-bold min-w-[70px] md:min-w-[100px] inline-block">B</span>
                       <span className="text-gray-500">-</span>
                       <span>SMART BOMB (Clear Screen)</span>
                   </li>
                   <li className="flex flex-wrap items-center gap-2">
                       <span className="text-white font-bold min-w-[70px] md:min-w-[100px] inline-block">H</span>
                       <span className="text-gray-500">-</span>
                       <span>HYPERSPACE (Random Teleport)</span>
                   </li>
               </ul>
            </div>
            
            <div className="flex-1 space-y-4">
               <h3 className="text-xl md:text-2xl text-[#ff0055] border-b border-[#ff0055] pb-2">MOBILE</h3>
               <ul className="text-gray-300 space-y-3 text-sm md:text-base">
                   <li className="flex flex-wrap items-start gap-2">
                       <span className="text-white font-bold min-w-[100px] md:min-w-[140px] inline-block shrink-0">LEFT SCREEN</span>
                       <span className="text-gray-500">-</span>
                       <span>FLOATING JOYSTICK</span>
                   </li>
                   <li className="flex flex-wrap items-start gap-2">
                       <span className="text-white font-bold min-w-[100px] md:min-w-[140px] inline-block shrink-0">RIGHT ACTIONS</span>
                       <span className="text-gray-500">-</span>
                       <span>FIRE / THRUST / BOMBS</span>
                   </li>
               </ul>
            </div>
        </div>

        <div className="mt-4 md:mt-10 flex flex-col sm:flex-row gap-4 md:gap-8 w-full sm:w-auto px-4 md:px-0">
             <button 
                onClick={onBack}
                className="w-full sm:w-auto px-10 py-3 border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-all duration-300 hover:bg-white/5 active:scale-95"
            >
                BACK
            </button>
            <button 
                onClick={onPlay}
                className="w-full sm:w-auto px-12 py-4 bg-[#00ffcc] text-black font-bold uppercase shadow-[0_0_25px_-5px_#00ffcc] hover:shadow-[0_0_35px_-5px_#00ffcc] transition-all duration-300 animate-pulse active:scale-95"
            >
                LAUNCH MISSION
            </button>
        </div>
    </div>
  );
};
