import React, { useRef, useState, useEffect } from 'react';
import { useControls } from '../hooks/useControls';
import { useGameLoop } from '../hooks/useGameLoop';
import { Target, Rocket, Zap } from 'lucide-react';
import { useIsMobile, useOrientation } from '../hooks/useMobileDetection';
import { ActionButton } from './ui/ActionButton';

interface DefenderGameProps {
    onGameOver: (finalScore: number) => void;
}

export const DefenderGame: React.FC<DefenderGameProps> = ({ onGameOver }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const controlsRef = useControls();
    const isMobile = useIsMobile();
    const orientation = useOrientation();

    // HUD state separated from loop to update 60FPS minimally
    const [hud, setHud] = useState({ score: 0, lives: 3, bombs: 3, level: 1 });

    // Prevent double-tap to zoom and pull-to-refresh
    useEffect(() => {
        const preventDefault = (e: TouchEvent) => {
            if (e.touches.length > 1) e.preventDefault();
        };
        document.addEventListener('touchstart', preventDefault, { passive: false });
        return () => document.removeEventListener('touchstart', preventDefault);
    }, []);

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
                // Only activate if not on a button (though buttons are on the right)
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
                const mag = Math.sqrt(dx * dx + dy * dy);
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

    const isLandscape = orientation === 'landscape';

    return (
        <div
            className="relative w-full h-[100svh] bg-black overflow-hidden flex items-center justify-center select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            style={{ touchAction: 'none' }}
        >
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full object-contain pointer-events-none"
                style={{ imageRendering: 'pixelated' }}
            />

            {/* HUD (Top layer) */}
            <div className={`absolute top-0 w-full p-4 flex justify-between text-white text-xl drop-shadow-[0_0_5px_rgba(255,255,255,0.8)] pointer-events-none ${isMobile && isLandscape ? 'px-16' : ''}`}>
                <div className="flex items-center gap-4 md:gap-8 pl-4 md:pl-8">
                    <div className="text-xl md:text-2xl font-mono">{hud.score.toString().padStart(4, '0')}</div>
                    <div className="flex items-center gap-1.5 md:gap-2">
                        {Array.from({ length: Math.min(hud.lives, 10) }).map((_, i) => (
                            <div key={`life-${i}`} className="w-4 h-2 md:w-6 md:h-3 bg-white" style={{ clipPath: 'polygon(0% 50%, 50% 100%, 100% 50%, 50% 0%)' }} />
                        ))}
                    </div>
                    <div className="flex items-center gap-0.5 md:gap-1">
                        {Array.from({ length: Math.min(hud.bombs, 10) }).map((_, i) => (
                            <div key={`bomb-${i}`} className="w-1.5 h-2 md:w-2 md:h-3 bg-[#00ffcc]" />
                        ))}
                    </div>
                </div>
                <div className="text-[#00ffcc] opacity-60 text-xs md:text-sm mt-1 uppercase tracking-tighter">WAVE {hud.level}</div>
            </div>

            {/* Floating Joystick Visuals */}
            {controlsRef.current.joystickActive && (
                <div
                    className="absolute border-2 border-white/20 rounded-full pointer-events-none backdrop-blur-[1px] bg-white/5"
                    style={{
                        left: controlsRef.current.joystickOriginX - 50,
                        top: controlsRef.current.joystickOriginY - 50,
                        width: 100, height: 100,
                    }}
                >
                    <div
                        className="absolute bg-white/50 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                        style={{
                            left: 50 + controlsRef.current.joystickX * 50 - 20,
                            top: 50 + controlsRef.current.joystickY * 50 - 20,
                            width: 40, height: 40,
                        }}
                    />
                </div>
            )}

            {/* Mobile Action Buttons (Optimized for Landscape) */}
            {isMobile && (
                <div className={`absolute bottom-0 right-2 p-2 md:p-10 flex flex-col items-center gap-4 md:gap-8 pointer-events-none z-50 ${isLandscape ? 'scale-[0.85] origin-bottom-right' : 'bottom-2 right-3'}`}>
                    {/* Pyramid Layout: FIRE on Top */}
                    <ActionButton
                        color="red"
                        size="large"
                        onTouchStart={(e) => { e.preventDefault(); controlsRef.current.fire = true; }}
                        onTouchEnd={(e) => { e.preventDefault(); controlsRef.current.fire = false; }}
                        svg={
                            <svg width="40" height="40" viewBox="0 0 40 40">
                                <circle cx="20" cy="20" r="16" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" className="opacity-60" />
                                <circle cx="20" cy="20" r="8" fill="none" stroke="white" strokeWidth="1" />
                                <line x1="20" y1="4" x2="20" y2="12" stroke="white" strokeWidth="2" />
                                <line x1="20" y1="28" x2="20" y2="36" stroke="white" strokeWidth="2" />
                                <line x1="4" y1="20" x2="12" y2="20" stroke="white" strokeWidth="2" />
                                <line x1="28" y1="20" x2="36" y2="20" stroke="white" strokeWidth="2" />
                                <circle cx="20" cy="20" r="4" fill="white" className="animate-pulse" />
                            </svg>
                        }
                    />

                    {/* Utility Row Below FIRE */}
                    <div className="flex flex-row items-center gap-4 md:gap-6">
                        <ActionButton
                            color="blue"
                            size="small"
                            onTouchStart={(e) => { e.preventDefault(); controlsRef.current.thrust = true; }}
                            onTouchEnd={(e) => { e.preventDefault(); controlsRef.current.thrust = false; }}
                            svg={<Zap size={24} className="text-white" />}
                        />
                        <ActionButton
                            color="red"
                            size="small"
                            onTouchStart={(e) => { e.preventDefault(); controlsRef.current.smartBomb = true; }}
                            onTouchEnd={(e) => { e.preventDefault(); controlsRef.current.smartBomb = false; }}
                            svg={<Target size={24} className="text-white" />}
                        />
                        <ActionButton
                            color="purple"
                            size="small"
                            onTouchStart={(e) => { e.preventDefault(); controlsRef.current.hyperspace = true; }}
                            onTouchEnd={(e) => { e.preventDefault(); controlsRef.current.hyperspace = false; }}
                            svg={<Rocket size={24} className="text-white" />}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
