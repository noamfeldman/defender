import React, { useEffect, useState } from 'react';

interface Props {
  onStart: () => void;
  onHighScores: () => void;
}

export const LandingScreen: React.FC<Props> = ({ onStart, onHighScores }) => {
  const [stars, setStars] = useState<{ id: number; left: string; top: string; size: string; opacity: number; delay: string }[]>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 100 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      opacity: Math.random(),
      delay: `${Math.random() * 5}s`,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="crt relative w-full h-full bg-black overflow-hidden flex flex-col items-center justify-between font-['Press_Start_2P']">
      {/* Starfield Scrolling Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="starfield-scroll flex w-[200%] h-full">
          <div className="relative w-1/2 h-full">
            {stars.map((star) => (
              <div
                key={`star1-${star.id}`}
                className="absolute bg-white rounded-full opacity-60"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  boxShadow: `0 0 ${star.size} 1px rgba(255, 255, 255, 0.4)`,
                }}
              />
            ))}
          </div>
          <div className="relative w-1/2 h-full">
            {stars.map((star) => (
              <div
                key={`star2-${star.id}`}
                className="absolute bg-white rounded-full opacity-60"
                style={{
                  left: star.left,
                  top: star.top,
                  width: star.size,
                  height: star.size,
                  boxShadow: `0 0 ${star.size} 1px rgba(255, 255, 255, 0.4)`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Vector Terrain Background */}
      <div className="absolute bottom-[60px] left-0 w-full h-32 pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none">
          <path
            d="M 0 80 L 100 60 L 200 90 L 300 40 L 400 70 L 500 20 L 600 80 L 700 50 L 800 90 L 900 30 L 1000 80"
            fill="none"
            stroke="#ff0000"
            strokeWidth="2"
            className="animate-[landscape-scroll_20s_linear_infinite]"
          />
        </svg>
      </div>

      {/* Animated Ship and Enemies */}
      <div className="absolute bottom-20 left-4 sm:bottom-24 sm:left-10 animate-bounce pointer-events-none landscape:bottom-12 landscape:scale-75">
         <svg width="40" height="20" viewBox="0 0 40 20">
            <path d="M 0 10 L 10 5 L 30 5 L 40 10 L 30 15 L 10 15 Z" fill="#fff" stroke="#00ffff" strokeWidth="1" />
            <path d="M 5 8 L 15 8 L 15 12 L 5 12 Z" fill="#00ffff" />
         </svg>
         <div className="text-[6px] sm:text-[8px] text-white mt-1 text-center">SHIP</div>
      </div>

      <div className="absolute bottom-24 right-1/4 sm:bottom-32 animate-[pulse_1.5s_infinite] pointer-events-none landscape:bottom-14 landscape:scale-75">
         <svg width="30" height="30" viewBox="0 0 30 30">
            <rect x="5" y="5" width="20" height="15" fill="#00ff00" stroke="#fff" strokeWidth="1" />
            <rect x="10" y="20" width="2" height="8" fill="#fff" />
            <rect x="18" y="20" width="2" height="8" fill="#fff" />
         </svg>
         <div className="text-[6px] sm:text-[8px] text-[#00ff00] mt-1 text-center">LANDER</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center z-10 gap-4 sm:gap-8 mt-4 sm:mt-10 w-full px-4 text-center landscape:gap-2 landscape:mt-2">
        <h1 className="neon-logo text-3xl sm:text-5xl md:text-7xl landscape:text-2xl font-bold leading-tight break-words max-w-full">
          ASTRO STRIKE
        </h1>

        <div className="flex flex-col items-center gap-2 sm:gap-6 mt-2 sm:mt-4 landscape:mt-1">
          <div className="text-[10px] sm:text-base md:text-xl text-[#00ffcc] flash tracking-widest px-2 landscape:text-[8px] landscape:mb-1">
            = SELECT MISSION =
          </div>

          <div className="flex flex-col gap-2 sm:gap-4 w-56 sm:w-72 landscape:flex-row landscape:w-auto landscape:gap-4">
            <button
              onClick={onStart}
              className="group relative px-4 py-3 sm:px-6 sm:py-4 bg-transparent border-2 border-[#00ffff] text-[#00ffff] text-sm sm:text-xl transition-all hover:bg-[#00ffff]/20 hover:scale-105 active:scale-95 whitespace-nowrap landscape:text-xs landscape:py-2 landscape:px-6"
            >
              <span className="hidden group-hover:inline absolute left-1">&gt;</span>
              START GAME
              <span className="hidden group-hover:inline absolute right-1">&lt;</span>
            </button>

            <button
              onClick={onHighScores}
              className="px-4 py-3 sm:px-6 sm:py-4 bg-transparent border-2 border-white/30 text-white/70 text-sm sm:text-xl transition-all hover:border-white hover:text-white whitespace-nowrap landscape:text-xs landscape:py-2 landscape:px-6"
            >
              HIGH SCORES
            </button>
          </div>
        </div>
      </div>

      {/* Woodgrain Footer */}
      <div className="woodgrain w-full py-2 sm:py-4 text-center z-20 text-[10px] sm:text-xs">
        Super Shman - © 2026
      </div>
    </div>
  );
};
