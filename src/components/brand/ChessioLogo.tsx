/**
 * Chessio Logo System v1.3 - Ink & Ivory
 * Spotify-style: Filled amber-200 circle (#FDE68A) with dark queen (#0A0A0A)
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
        {/* Queen piece */}
        <circle cx="42" cy="32" r="2.5" fill="#0A0A0A"/>
        <circle cx="50" cy="28" r="3" fill="#0A0A0A"/>
        <circle cx="58" cy="32" r="2.5" fill="#0A0A0A"/>
        <path d="M40 36C40 36 42 34 44 36L46 50L54 50L56 36C58 34 60 36 60 36L58 54C58 56 56 58 54 58H46C44 58 42 56 42 54L40 36Z" fill="#0A0A0A"/>
        <rect x="38" y="58" width="24" height="6" rx="2" fill="#0A0A0A"/>
        <path d="M36 64H64L62 70H38L36 64Z" fill="#0A0A0A"/>
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
      {/* Queen piece */}
      <circle cx="42" cy="32" r="2.5" fill="#0A0A0A"/>
      <circle cx="50" cy="28" r="3" fill="#0A0A0A"/>
      <circle cx="58" cy="32" r="2.5" fill="#0A0A0A"/>
      <path d="M40 36C40 36 42 34 44 36L46 50L54 50L56 36C58 34 60 36 60 36L58 54C58 56 56 58 54 58H46C44 58 42 56 42 54L40 36Z" fill="#0A0A0A"/>
      <rect x="38" y="58" width="24" height="6" rx="2" fill="#0A0A0A"/>
      <path d="M36 64H64L62 70H38L36 64Z" fill="#0A0A0A"/>
      
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
