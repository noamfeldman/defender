import React, { useRef, useState } from 'react';
import { useControls } from '../hooks/useControls';
import { useGameLoop } from '../hooks/useGameLoop';
import { Circle, Target, Rocket } from 'lucide-react'; // Some placeholder icons for buttons

interface DefenderGameProps {
  onGameOver: (finalScore: number) => void;
}

export const DefenderGame: React.FC<DefenderGameProps> = ({ onGameOver }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useControls();

  // HUD state separated from loop to update 60FPS minimally
  const [hud, setHud] = useState({ score: 0, lives: 3, bombs: 3, level: 1 });

  // Debounced HUD updater to prevent excessive React renders
  const lastHudUpdate = useRef(0);
  const handleUpdateHUD = (score: number, lives: number, bombs: number, level: number) => {
    const now = performance.now();
    if (now - lastHudUpdate.current > 100) { // 10fps HUD update is fine
      setHud({ score, lives, bombs, level });
      lastHudUpdate.current = now;
    }
  };

  useGameLoop(canvasRef, controlsRef, onGameOver, handleUpdateHUD);

  // Floating Joystick logic
  const handleTouchStart = (e: React.TouchEvent) => {
      // Find left side touch
      Array.from(e.touches).forEach(touch => {
         if (touch.clientX < window.innerWidth / 2 && !controlsRef.current.joystickActive) {
             controlsRef.current.joystickActive = true;
             controlsRef.current.joystickOriginX = touch.clientX;
             controlsRef.current.joystickOriginY = touch.clientY;
         }
      });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
      if (!controlsRef.current.joystickActive) return;
      Array.from(e.touches).forEach(touch => {
          if (touch.clientX < window.innerWidth / 2) {
             let dx = touch.clientX - controlsRef.current.joystickOriginX;
             let dy = touch.clientY - controlsRef.current.joystickOriginY;
             const mag = Math.sqrt(dx*dx + dy*dy);
             const maxRadius = 50;
             if (mag > maxRadius) {
                 dx = (dx / mag) * maxRadius;
                 dy = (dy / mag) * maxRadius;
             }
             controlsRef.current.joystickX = dx / maxRadius;
             controlsRef.current.joystickY = dy / maxRadius;
          }
      });
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      let leftTouchFound = false;
      Array.from(e.touches).forEach(touch => {
           if (touch.clientX < window.innerWidth / 2) {
               leftTouchFound = true;
           }
      });
      if (!leftTouchFound) {
          controlsRef.current.joystickActive = false;
          controlsRef.current.joystickX = 0;
          controlsRef.current.joystickY = 0;
      }
  };

  return (
    <div 
        className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        // Prevent default browser behaviours like scroll/zoom on touch
        style={{ touchAction: 'none' }}
    >
      <canvas 
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full h-full object-contain"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* HUD (Top layer) */}
      <div className="absolute top-0 w-full p-4 flex justify-between text-white text-xl drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] pointer-events-none">
        <div className="flex items-center gap-8 pl-8">
            <div className="text-2xl">{hud.score.toString().padStart(4, ' ')}</div>
            <div className="flex items-center gap-2 mt-1 -ml-4">
                {Array.from({length: Math.min(hud.lives, 10)}).map((_, i) => (
                    <div key={`life-${i}`} className="w-6 h-3 bg-white" style={{ clipPath: 'polygon(0% 50%, 50% 100%, 100% 50%, 50% 0%)' }} />
                ))}
            </div>
            <div className="flex items-center gap-1 mt-1 ml-4">
                {Array.from({length: Math.min(hud.bombs, 10)}).map((_, i) => (
                    <div key={`bomb-${i}`} className="w-2 h-3 bg-[#00ffcc]" />
                ))}
            </div>
        </div>
        <div className="text-[#00ffcc] opacity-50 text-sm mt-1">WAVE {hud.level}</div>
      </div>

      {/* Floating Joystick Visuals */}
      {controlsRef.current.joystickActive && (
          <div 
             className="absolute border-2 border-white/50 rounded-full pointer-events-none backdrop-blur-sm bg-white/10"
             style={{
                 left: controlsRef.current.joystickOriginX - 50,
                 top: controlsRef.current.joystickOriginY - 50,
                 width: 100, height: 100,
             }}
          >
             <div 
                className="absolute bg-white/80 rounded-full"
                style={{
                    left: 50 + controlsRef.current.joystickX * 50 - 20,
                    top: 50 + controlsRef.current.joystickY * 50 - 20,
                    width: 40, height: 40,
                }}
             />
          </div>
      )}

      {/* Mobile Action Buttons (Right Side) */}
      <div className="absolute bottom-10 right-10 flex flex-col gap-4 sm:hidden pointer-events-auto">
          <div className="flex gap-4">
            <button 
                className="w-16 h-16 rounded-full bg-red-500/50 border border-red-400 flex items-center justify-center text-white active:bg-red-500"
                onTouchStart={(e) => { e.preventDefault(); controlsRef.current.smartBomb = true; }}
                onTouchEnd={(e) => { e.preventDefault(); controlsRef.current.smartBomb = false; }}
            >
                <Target size={24} />
            </button>
            <button 
                className="w-16 h-16 rounded-full bg-blue-500/50 border border-blue-400 flex items-center justify-center text-white active:bg-blue-500"
                onTouchStart={(e) => { e.preventDefault(); controlsRef.current.hyperspace = true; }}
                onTouchEnd={(e) => { e.preventDefault(); controlsRef.current.hyperspace = false; }}
            >
                <Rocket size={24} />
            </button>
          </div>
          <button 
            className="w-24 h-24 rounded-full bg-green-500/50 border border-green-400 flex items-center justify-center text-white active:bg-green-500 self-end"
            onTouchStart={(e) => { e.preventDefault(); controlsRef.current.fire = true; }}
            onTouchEnd={(e) => { e.preventDefault(); controlsRef.current.fire = false; }}
          >
             <Circle fill="white" size={32} />
          </button>
      </div>
    </div>
  );
};
