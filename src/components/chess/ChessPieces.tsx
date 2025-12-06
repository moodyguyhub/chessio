/**
 * Flat Staunton "Ink & Ivory" Chess Pieces
 * 
 * Design: Physically grounded, digitally native
 * Stroke: 3px at 100x100 viewBox (scales to ~1px at 32px)
 * Accent: Amber-500 (#F59E0B) base ring as subtle brand signature
 * 
 * Color Mapping:
 * - White Fill: stone-100 (#F5F5F4)
 * - White Stroke: stone-500 (#78716C)
 * - Black Fill: neutral-800 (#262626)
 * - Black Stroke: neutral-600 (#525252) - lighter for visibility on dark squares
 * - Accent: amber-500 (#F59E0B)
 * 
 * v1.1 Polish: Base height reduced to 6px for subtler signature
 */

import React from "react";

interface PieceProps {
  className?: string;
}

/* ========================================
   WHITE PIECES
   ======================================== */

export const WhitePawn: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 22C43.3726 22 38 27.3726 38 34C38 39.5 41.5 44.1 46.5 45.5L40 75H60L53.5 45.5C58.5 44.1 62 39.5 62 34C62 27.3726 56.6274 22 50 22Z" fill="#F5F5F4" stroke="#78716C" strokeWidth="3" strokeLinejoin="round"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#F5F5F4" stroke="#78716C" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const WhiteRook: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M35 30V45L38 75H62L65 45V30H35Z" fill="#F5F5F4" stroke="#78716C" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M32 20H68V30H32V20ZM44 20V26M56 20V26" stroke="#78716C" strokeWidth="3" strokeLinecap="round"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#F5F5F4" stroke="#78716C" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const WhiteKnight: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M56 20C56 20 45 22 40 32C35 42 40 50 40 50C40 50 32 50 30 55C28 60 35 75 35 75H65L68 60C68 60 70 40 65 30C60 20 56 20 56 20Z" fill="#F5F5F4" stroke="#78716C" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M58 24C60 28 62 32 62 38" stroke="#78716C" strokeWidth="3" strokeLinecap="round"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#F5F5F4" stroke="#78716C" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const WhiteBishop: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15C42 15 38 25 38 35C38 45 42 55 42 55L38 75H62L58 55C58 55 62 45 62 35C62 25 58 15 50 15Z" fill="#F5F5F4" stroke="#78716C" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 20L50 40" stroke="#78716C" strokeWidth="3" strokeLinecap="round"/>
    <path d="M42 22L58 22" stroke="#78716C" strokeWidth="3" strokeLinecap="round"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#F5F5F4" stroke="#78716C" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const WhiteQueen: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M36 75L40 45C35 40 32 30 32 25C32 20 36 18 36 18L42 28L50 15L58 28L64 18C64 18 68 20 68 25C68 30 65 40 60 45L64 75H36Z" fill="#F5F5F4" stroke="#78716C" strokeWidth="3" strokeLinejoin="round"/>
    <circle cx="50" cy="12" r="3" fill="#F59E0B"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#F5F5F4" stroke="#78716C" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const WhiteKing: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M38 75L40 40C35 35 35 30 40 25H60C65 30 65 35 60 40L62 75H38Z" fill="#F5F5F4" stroke="#78716C" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 10V25M42 18H58" stroke="#78716C" strokeWidth="4" strokeLinecap="round"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#F5F5F4" stroke="#78716C" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

/* ========================================
   BLACK PIECES
   Same paths, swapped colors per spec
   ======================================== */

export const BlackPawn: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 22C43.3726 22 38 27.3726 38 34C38 39.5 41.5 44.1 46.5 45.5L40 75H60L53.5 45.5C58.5 44.1 62 39.5 62 34C62 27.3726 56.6274 22 50 22Z" fill="#262626" stroke="#525252" strokeWidth="3" strokeLinejoin="round"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#262626" stroke="#525252" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const BlackRook: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M35 30V45L38 75H62L65 45V30H35Z" fill="#262626" stroke="#525252" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M32 20H68V30H32V20ZM44 20V26M56 20V26" stroke="#525252" strokeWidth="3" strokeLinecap="round"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#262626" stroke="#525252" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const BlackKnight: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M56 20C56 20 45 22 40 32C35 42 40 50 40 50C40 50 32 50 30 55C28 60 35 75 35 75H65L68 60C68 60 70 40 65 30C60 20 56 20 56 20Z" fill="#262626" stroke="#525252" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M58 24C60 28 62 32 62 38" stroke="#525252" strokeWidth="3" strokeLinecap="round"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#262626" stroke="#525252" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const BlackBishop: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15C42 15 38 25 38 35C38 45 42 55 42 55L38 75H62L58 55C58 55 62 45 62 35C62 25 58 15 50 15Z" fill="#262626" stroke="#525252" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 20L50 40" stroke="#525252" strokeWidth="3" strokeLinecap="round"/>
    <path d="M42 22L58 22" stroke="#525252" strokeWidth="3" strokeLinecap="round"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#262626" stroke="#525252" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const BlackQueen: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M36 75L40 45C35 40 32 30 32 25C32 20 36 18 36 18L42 28L50 15L58 28L64 18C64 18 68 20 68 25C68 30 65 40 60 45L64 75H36Z" fill="#262626" stroke="#525252" strokeWidth="3" strokeLinejoin="round"/>
    <circle cx="50" cy="12" r="3" fill="#F59E0B"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#262626" stroke="#525252" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

export const BlackKing: React.FC<PieceProps> = ({ className = "" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M38 75L40 40C35 35 35 30 40 25H60C65 30 65 35 60 40L62 75H38Z" fill="#262626" stroke="#525252" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 10V25M42 18H58" stroke="#525252" strokeWidth="4" strokeLinecap="round"/>
    <rect x="30" y="76" width="40" height="6" rx="2" fill="#262626" stroke="#525252" strokeWidth="3"/>
    <path d="M35 78H65" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round"/>
  </svg>
);

/* ========================================
   PIECE MAP (for easy lookup)
   ======================================== */

export const PIECE_COMPONENTS: Record<string, React.FC<PieceProps>> = {
  K: WhiteKing,
  Q: WhiteQueen,
  R: WhiteRook,
  B: WhiteBishop,
  N: WhiteKnight,
  P: WhitePawn,
  k: BlackKing,
  q: BlackQueen,
  r: BlackRook,
  b: BlackBishop,
  n: BlackKnight,
  p: BlackPawn,
};
