/**
 * Chessio Logo System v1.2 - Ink & Ivory
 * Spotify-style: Filled amber-200 circle (#FDE68A) with dark pawn (#0A0A0A)
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
        <path d="M50 28C45.0294 28 41 32.0294 41 37C41 41 43.5 44.4 47 45.5L42 68H58L53 45.5C56.5 44.4 59 41 59 37C59 32.0294 54.9706 28 50 28Z" fill="#0A0A0A"/>
        <rect x="36" y="68" width="28" height="6" rx="2" fill="#0A0A0A"/>
        <path d="M38 71H62" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round"/>
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
      <path d="M50 28C45.0294 28 41 32.0294 41 37C41 41 43.5 44.4 47 45.5L42 68H58L53 45.5C56.5 44.4 59 41 59 37C59 32.0294 54.9706 28 50 28Z" fill="#0A0A0A"/>
      <rect x="36" y="68" width="28" height="6" rx="2" fill="#0A0A0A"/>
      <path d="M38 71H62" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round"/>
      
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
