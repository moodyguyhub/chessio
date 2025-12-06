/**
 * Chessio Logo System v1.3 - Ink & Ivory
 * Spotify-style: Filled amber-200 circle (#FDE68A) with pure black queen (#000000)
 * Creates bold, recognizable icon with high contrast
 * 
 * Usage:
 * - Navbar: <ChessioLogo variant="horizontal" />
 * - Footer/auth pages: <ChessioLogo variant="wordmark" />
 * - Favicon/app icon: Use chessio-icon.svg directly
 */

import React from "react";

interface LogoProps {
  variant?: "icon" | "horizontal" | "wordmark";
  className?: string;
}

export const ChessioLogo: React.FC<LogoProps> = ({ 
  variant = "horizontal", 
  className = "" 
}) => {
  if (variant === "icon") {
    return (
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="50" cy="50" r="50" fill="#FDE68A"/>
        {/* Queen piece - scaled up ~30% */}
        <circle cx="38" cy="28" r="3.2" fill="#000000"/>
        <circle cx="50" cy="23" r="4" fill="#000000"/>
        <circle cx="62" cy="28" r="3.2" fill="#000000"/>
        <path d="M35 33C35 33 38 30 41 33L43 52L57 52L59 33C62 30 65 33 65 33L62 56C62 59 59 62 56 62H44C41 62 38 59 38 56L35 33Z" fill="#000000"/>
        <rect x="33" y="62" width="34" height="8" rx="2" fill="#000000"/>
        <path d="M30 70H70L67 78H33L30 70Z" fill="#000000"/>
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <svg 
        viewBox="0 0 180 42" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <text 
          x="0" 
          y="32" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="42" 
          fontWeight="600" 
          letterSpacing="-0.025em" 
          fill="#FDE68A"
        >
          Chessio
        </text>
        <circle cx="112" cy="6" r="4.5" fill="#FDE68A"/>
      </svg>
    );
  }

  // Default: horizontal lockup
  return (
    <svg 
      viewBox="0 0 280 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="50" cy="50" r="50" fill="#FDE68A"/>
      {/* Queen piece - scaled up ~30% */}
      <circle cx="38" cy="28" r="3.2" fill="#000000"/>
      <circle cx="50" cy="23" r="4" fill="#000000"/>
      <circle cx="62" cy="28" r="3.2" fill="#000000"/>
      <path d="M35 33C35 33 38 30 41 33L43 52L57 52L59 33C62 30 65 33 65 33L62 56C62 59 59 62 56 62H44C41 62 38 59 38 56L35 33Z" fill="#000000"/>
      <rect x="33" y="62" width="34" height="8" rx="2" fill="#000000"/>
      <path d="M30 70H70L67 78H33L30 70Z" fill="#000000"/>
      
      <text 
        x="120" 
        y="62" 
        fontFamily="system-ui, -apple-system, sans-serif" 
        fontSize="42" 
        fontWeight="600" 
        letterSpacing="-0.025em" 
        fill="#FDE68A"
      >
        Chessio
      </text>
      <circle cx="232" cy="36" r="4.5" fill="#FDE68A"/>
    </svg>
  );
};

export default ChessioLogo;
