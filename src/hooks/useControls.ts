import { useEffect, useRef } from 'react';

export interface ControlState {
  // Desktop specific
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  // Common
  thrust: boolean;
  fire: boolean;
  smartBomb: boolean;
  hyperspace: boolean;
  // Mobile specific floating joystick
  joystickActive: boolean;
  joystickOriginX: number;
  joystickOriginY: number;
  joystickX: number;
  joystickY: number;
}

export function useControls() {
  const controlsRef = useRef<ControlState>({
    left: false, right: false, up: false, down: false,
    thrust: false, fire: false, smartBomb: false, hyperspace: false,
    joystickActive: false, joystickOriginX: 0, joystickOriginY: 0, joystickX: 0, joystickY: 0,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'ArrowLeft': case 'KeyA': controlsRef.current.left = true; break;
        case 'ArrowRight': case 'KeyD': controlsRef.current.right = true; break;
        case 'ArrowUp': case 'KeyW': controlsRef.current.up = true; break;
        case 'ArrowDown': case 'KeyS': controlsRef.current.down = true; break;
        case 'ShiftLeft': case 'ShiftRight': controlsRef.current.thrust = true; break;
        case 'Space': controlsRef.current.fire = true; break;
        case 'KeyB': controlsRef.current.smartBomb = true; break;
        case 'KeyH': controlsRef.current.hyperspace = true; break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch(e.code) {
        case 'ArrowLeft': case 'KeyA': controlsRef.current.left = false; break;
        case 'ArrowRight': case 'KeyD': controlsRef.current.right = false; break;
        case 'ArrowUp': case 'KeyW': controlsRef.current.up = false; break;
        case 'ArrowDown': case 'KeyS': controlsRef.current.down = false; break;
        case 'ShiftLeft': case 'ShiftRight': controlsRef.current.thrust = false; break;
        case 'Space': controlsRef.current.fire = false; break;
        case 'KeyB': controlsRef.current.smartBomb = false; break;
        case 'KeyH': controlsRef.current.hyperspace = false; break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return controlsRef;
}
