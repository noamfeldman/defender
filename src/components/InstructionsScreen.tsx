import React from 'react';

interface Props {
  onPlay: () => void;
  onBack: () => void;
}

export const InstructionsScreen: React.FC<Props> = ({ onPlay, onBack }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-black p-4 text-center tracking-widest gap-8">
        <h2 className="text-4xl text-[#00ffcc] mb-4">INSTRUCTIONS</h2>

        <div className="flex flex-col md:flex-row gap-16 text-left max-w-4xl w-full">
            <div className="flex-1 space-y-4">
               <h3 className="text-2xl text-[#ff0055] border-b border-[#ff0055] pb-2">DESKTOP</h3>
               <ul className="text-gray-300 space-y-2">
                   <li><span className="text-white font-bold w-24 inline-block">W A S D</span> / <span className="text-white font-bold">ARROWS</span> - MOVE</li>
                   <li><span className="text-white font-bold w-24 inline-block">SPACE</span> - FIRE</li>
                   <li><span className="text-white font-bold w-24 inline-block">SHIFT</span> - THRUST (Faster Move)</li>
                   <li><span className="text-white font-bold w-24 inline-block">B</span> - SMART BOMB (Clear Screen)</li>
                   <li><span className="text-white font-bold w-24 inline-block">H</span> - HYPERSPACE (Random Teleport)</li>
               </ul>
            </div>
            
            <div className="flex-1 space-y-4">
               <h3 className="text-2xl text-[#ff0055] border-b border-[#ff0055] pb-2">MOBILE</h3>
               <ul className="text-gray-300 space-y-2">
                   <li><span className="text-white font-bold w-32 inline-block">LEFT SCREEN</span> - FLOATING JOYSTICK</li>
                   <li><span className="text-white font-bold w-32 inline-block">RIGHT ACTIONS</span> - FIRE / THRUST / BOMBS</li>
               </ul>
            </div>
        </div>

        <div className="mt-8 flex gap-6">
             <button 
                onClick={onBack}
                className="px-8 py-3 border border-gray-500 text-gray-400 hover:text-white hover:border-white transition-colors"
            >
                BACK
            </button>
            <button 
                onClick={onPlay}
                className="px-8 py-3 bg-[#00ffcc] text-black font-bold uppercase shadow-[0_0_15px_#00ffcc] animate-pulse"
            >
                LAUNCH MISSION
            </button>
        </div>
    </div>
  );
};
