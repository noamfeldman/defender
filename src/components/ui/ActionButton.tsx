import React from 'react';

type ActionButtonColor = 'red' | 'blue' | 'purple' | 'green';
type ActionButtonSize = 'small' | 'large';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color: ActionButtonColor;
  svg: React.ReactNode;
  size?: ActionButtonSize;
}

const colorMap = {
  red: {
    light: '#ff4d4d',
    dark: '#b30000',
    shadow: '#800000',
  },
  blue: {
    light: '#4d9eff',
    dark: '#0059b3',
    shadow: '#003d80',
  },
  purple: {
    light: '#d14dff',
    dark: '#7a00b3',
    shadow: '#520080',
  },
  green: {
    light: '#4dff88',
    dark: '#00b33c',
    shadow: '#00802b',
  },
};

/**
 * Reusable Retro Arcade Action Button.
 * Standardizes the look and feel across all game controls.
 */
export const ActionButton: React.FC<ActionButtonProps> = ({ 
  color, 
  svg, 
  size = 'small', 
  className = '',
  ...props 
}) => {
  const colors = colorMap[color];
  const sizeClass = size === 'large' ? 'arcade-button-large' : 'arcade-button-small';
  
  return (
    <button
      className={`arcade-button-retro ${sizeClass} pointer-events-auto touch-manipulation z-20 group ${className}`}
      style={{
        // @ts-ignore - Custom CSS variables
        '--btn-color-light': colors.light,
        '--btn-color-dark': colors.dark,
        '--btn-shadow-color': colors.shadow,
      }}
      {...props}
    >
      <div className="relative z-10 transition-transform group-active:scale-95 flex items-center justify-center">
        {svg}
      </div>
    </button>
  );
};
