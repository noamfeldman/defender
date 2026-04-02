import React from 'react';

interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Standardized Button component for the Astro Strike application.
 * Strictly uses classes from the original landing page for consistency.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  fullWidth = false,
  ...props
}) => {
  // Primary (from LandingScreen):
  // group relative px-4 py-3 sm:px-6 sm:py-4 bg-transparent border-2 border-[#00ffff] text-[#00ffff] text-sm sm:text-xl transition-all hover:bg-[#00ffff]/20 hover:scale-105 active:scale-95 whitespace-nowrap landscape:text-xs landscape:py-2 landscape:px-6
  const primaryClasses = "group relative px-4 py-3 sm:px-6 sm:py-4 bg-transparent border-2 border-[#00ffff] text-[#00ffff] text-sm sm:text-xl transition-all hover:bg-[#00ffff]/20 hover:scale-105 active:scale-95 whitespace-nowrap landscape:text-xs landscape:py-2 landscape:px-6";

  // Secondary (from LandingScreen):
  // px-4 py-3 sm:px-6 sm:py-4 bg-transparent border-2 border-white/30 text-white/70 text-sm sm:text-xl transition-all hover:border-white hover:text-white whitespace-nowrap landscape:text-xs landscape:py-2 landscape:px-6
  const secondaryClasses = "px-4 py-3 sm:px-6 sm:py-4 bg-transparent border-2 border-white/30 text-white/70 text-sm sm:text-xl transition-all hover:border-white hover:text-white whitespace-nowrap landscape:text-xs landscape:py-2 landscape:px-6";

  const baseClasses = variant === 'primary' ? primaryClasses : secondaryClasses;
  const widthClass = fullWidth ? "w-full" : "w-auto";

  return (
    <button
      className={`${baseClasses} ${widthClass} font-['Press_Start_2P'] uppercase disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed`}
      {...props}
    >
      <span className="relative flex items-center justify-center gap-2">
        {variant === 'primary' && (
          <span className="hidden sm:inline-block absolute left-2 opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
            &gt;
          </span>
        )}
        <span className="relative z-10 px-6 sm:px-8">{children}</span>
        {variant === 'primary' && (
          <span className="hidden sm:inline-block absolute right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            &lt;
          </span>
        )}
      </span>
    </button>
  );
};
