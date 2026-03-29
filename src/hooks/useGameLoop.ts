import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import { GameEngine } from '../engine/GameEngine';
import type { ControlState } from './useControls';
import { audio } from '../utils/AudioEngine';

export function useGameLoop(
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  controlsRef: MutableRefObject<ControlState>,
  onGameOver: (score: number) => void,
  onUpdateHUD: (score: number, lives: number, bombs: number, level: number) => void
) {
  const engineRef = useRef<GameEngine | null>(null);
  const onGameOverRef = useRef(onGameOver);
  const onUpdateHUDRef = useRef(onUpdateHUD);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
    onUpdateHUDRef.current = onUpdateHUD;
  }, [onGameOver, onUpdateHUD]);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    audio.init(); // Initialize audio context on first render/interaction

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    engineRef.current = new GameEngine();
    let animationFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      // Calculate delta time in seconds
      const dt = Math.min((time - lastTime) / 1000, 0.1); // cap dt to 0.1s to avoid physics explosions on lag
      lastTime = time;

      if (engineRef.current) {
        engineRef.current.update(dt, controlsRef.current);
        engineRef.current.draw(ctx, canvas.width, canvas.height);
        
        onUpdateHUDRef.current(
          engineRef.current.score,
          engineRef.current.lives,
          engineRef.current.smartBombs,
          engineRef.current.level
        );

        if (engineRef.current.isGameOver) {
          onGameOverRef.current(engineRef.current.score);
          return; // Stop loop
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []); // Empty dependency array prevents loop remounts

  return engineRef;
}
