import React from 'react';

interface Props {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}

/**
 * Standardized header/title component for unified typography and branding.
 * Uses the neon-logo style from the main landing page.
 */
export const PageTitle: React.FC<Props> = ({ text, className = '', as = 'h1' }) => {
  const Component = as;
  
  return (
    <Component 
      className={`neon-logo text-3xl sm:text-5xl md:text-7xl landscape:text-2xl font-bold leading-tight break-words max-w-full text-center ${className}`}
    >
      {text}
    </Component>
  );
};
