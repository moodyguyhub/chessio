/**
 * Chessio Logo System v1.4 - Ink & Ivory
 * WhatsApp-inspired: Amber-200 circle (#FDE68A) with pure black queen (#000000)
 * Clean, minimal, recognizable icon design
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
        {/* WhatsApp-style clean circle with queen */}
        <circle cx="50" cy="50" r="50" fill="#FDE68A"/>
        <g transform="translate(50, 50)">
          {/* Simplified queen silhouette - centered */}
          <circle cx="-10" cy="-18" r="2.5" fill="#000000"/>
          <circle cx="0" cy="-20" r="3" fill="#000000"/>
          <circle cx="10" cy="-18" r="2.5" fill="#000000"/>
          <path d="M-12 -14L-8 8L8 8L12 -14C12 -14 10 -16 8 -14L6 2L0 2L-6 2L-8 -14C-10 -16 -12 -14 -12 -14Z" fill="#000000"/>
          <ellipse cx="0" cy="12" rx="16" ry="6" fill="#000000"/>
        </g>
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
      {/* WhatsApp-style clean circle with queen */}
      <circle cx="50" cy="50" r="50" fill="#FDE68A"/>
      <g transform="translate(50, 50)">
        {/* Simplified queen silhouette - centered */}
        <circle cx="-10" cy="-18" r="2.5" fill="#000000"/>
        <circle cx="0" cy="-20" r="3" fill="#000000"/>
        <circle cx="10" cy="-18" r="2.5" fill="#000000"/>
        <path d="M-12 -14L-8 8L8 8L12 -14C12 -14 10 -16 8 -14L6 2L0 2L-6 2L-8 -14C-10 -16 -12 -14 -12 -14Z" fill="#000000"/>
        <ellipse cx="0" cy="12" rx="16" ry="6" fill="#000000"/>
      </g>
      
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
