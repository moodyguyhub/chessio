"use client";

import { useState, useCallback, useMemo } from "react";

// ============================================
// TYPES
// ============================================

/** Semantic highlight kinds per Lyra's design spec */
export type HighlightKind = "selected" | "target" | "warning" | "hint" | "success";

/** Map of square to highlight kind */
export type HighlightsMap = Record<string, HighlightKind>;

/** Board state for visual feedback */
export type BoardState = {
  isError?: boolean;
  isCorrect?: boolean;
  isDisabled?: boolean;
};

export interface ChessboardProps {
  /** Position in FEN notation */
  fen: string;
  /** Called when a square is clicked */
  onSquareClick?: (square: string) => void;
  /** Semantic highlights map: { "e4": "selected", "a1": "target" } */
  highlights?: HighlightsMap;
  /** Board state for global feedback (error shake, etc.) */
  state?: BoardState;
  /** Board orientation */
  orientation?: "white" | "black";
}

// ============================================
// CONSTANTS
// ============================================

// Piece characters for rendering
const PIECE_SYMBOLS: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

// Map highlight kinds to CSS classes (defined in globals.css)
const HIGHLIGHT_CLASSES: Record<HighlightKind, string> = {
  selected: "chessboard-square--selected",
  target: "chessboard-square--target",
  warning: "chessboard-square--warning animate-shake",
  hint: "chessboard-square--hint",
  success: "chessboard-square--success",
};

// ============================================
// HELPERS
// ============================================

/** Parse FEN to get piece positions */
function parseFen(fen: string): Record<string, string> {
  const pieces: Record<string, string> = {};
  const rows = fen.split(" ")[0].split("/");
  
  rows.forEach((row, rowIndex) => {
    let col = 0;
    for (const char of row) {
      if (/\d/.test(char)) {
        col += parseInt(char);
      } else {
        const file = String.fromCharCode(97 + col); // a-h
        const rank = 8 - rowIndex; // 8-1
        pieces[`${file}${rank}`] = char;
        col++;
      }
    }
  });
  
  return pieces;
}

// ============================================
// COMPONENT
// ============================================

export function Chessboard({
  fen,
  onSquareClick,
  highlights = {},
  state = {},
  orientation = "white",
}: ChessboardProps) {
  const pieces = useMemo(() => parseFen(fen), [fen]);
  const isDisabled = state.isDisabled ?? false;

  // Generate squares
  const squares = useMemo(() => {
    const result: { square: string; isLight: boolean }[] = [];
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const file = orientation === "white" 
          ? String.fromCharCode(97 + col)
          : String.fromCharCode(97 + (7 - col));
        const rank = orientation === "white" ? 8 - row : row + 1;
        const square = `${file}${rank}`;
        const isLight = (row + col) % 2 === 0;
        result.push({ square, isLight });
      }
    }
    
    return result;
  }, [orientation]);

  const handleSquareClick = useCallback((square: string) => {
    if (isDisabled) return;
    onSquareClick?.(square);
  }, [isDisabled, onSquareClick]);

  return (
    <div className="relative aspect-square w-full max-w-[500px]">
      {/* File labels (a-h) */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-around px-1 text-xs text-chessio-muted dark:text-chessio-muted-dark">
        {(orientation === "white" ? "abcdefgh" : "hgfedcba").split("").map((file) => (
          <span key={file}>{file}</span>
        ))}
      </div>
      
      {/* Rank labels (1-8) */}
      <div className="absolute -left-5 top-0 bottom-0 flex flex-col justify-around py-1 text-xs text-chessio-muted dark:text-chessio-muted-dark">
        {(orientation === "white" ? "87654321" : "12345678").split("").map((rank) => (
          <span key={rank}>{rank}</span>
        ))}
      </div>

      {/* Board */}
      <div 
        className={`
          grid grid-cols-8 rounded-lg overflow-hidden shadow-lg
          ${state.isError ? "animate-shake" : ""}
        `}
      >
        {squares.map(({ square, isLight }) => {
          const piece = pieces[square];
          const highlightKind = highlights[square];
          const highlightClass = highlightKind ? HIGHLIGHT_CLASSES[highlightKind] : "";

          return (
            <div
              key={square}
              className={`
                aspect-square flex items-center justify-center relative
                transition-all duration-150
                ${isLight ? "bg-amber-100" : "bg-amber-700"}
                ${highlightClass}
                ${isDisabled ? "cursor-not-allowed" : "cursor-pointer"}
              `}
              onClick={() => handleSquareClick(square)}
            >
              {/* Piece */}
              {piece && (
                <span
                  className={`
                    text-4xl sm:text-5xl select-none pointer-events-none
                    ${piece === piece.toUpperCase() 
                      ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" 
                      : "text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]"}
                  `}
                >
                  {PIECE_SYMBOLS[piece]}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Chessboard;
