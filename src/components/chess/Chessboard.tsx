"use client";

import { useState, useCallback, useMemo } from "react";

export interface ChessboardProps {
  /** Position in FEN notation */
  fen: string;
  /** Called when a square is clicked */
  onSquareClick?: (square: string) => void;
  /** Called when a move is made (drag or click-click) */
  onMove?: (from: string, to: string) => void;
  /** Squares to highlight (e.g., valid moves, target) */
  highlightSquares?: string[];
  /** Currently selected square */
  selectedSquare?: string | null;
  /** Board orientation */
  orientation?: "white" | "black";
  /** Whether interaction is enabled */
  interactive?: boolean;
}

// Piece characters for rendering
const PIECE_SYMBOLS: Record<string, string> = {
  K: "♔", Q: "♕", R: "♖", B: "♗", N: "♘", P: "♙",
  k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟",
};

// Parse FEN to get piece positions
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

export function Chessboard({
  fen,
  onSquareClick,
  onMove,
  highlightSquares = [],
  selectedSquare = null,
  orientation = "white",
  interactive = true,
}: ChessboardProps) {
  const [dragFrom, setDragFrom] = useState<string | null>(null);
  const pieces = useMemo(() => parseFen(fen), [fen]);

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
    if (!interactive) return;
    
    if (selectedSquare && selectedSquare !== square) {
      // Second click - try to make a move
      onMove?.(selectedSquare, square);
    }
    
    onSquareClick?.(square);
  }, [interactive, selectedSquare, onMove, onSquareClick]);

  const handleDragStart = useCallback((square: string) => {
    if (!interactive) return;
    setDragFrom(square);
    onSquareClick?.(square);
  }, [interactive, onSquareClick]);

  const handleDragEnd = useCallback(() => {
    setDragFrom(null);
  }, []);

  const handleDrop = useCallback((toSquare: string) => {
    if (dragFrom && dragFrom !== toSquare) {
      onMove?.(dragFrom, toSquare);
    }
    setDragFrom(null);
  }, [dragFrom, onMove]);

  return (
    <div className="relative aspect-square w-full max-w-[500px]">
      {/* File labels (a-h) */}
      <div className="absolute -bottom-6 left-0 right-0 flex justify-around px-1 text-xs text-slate-500">
        {(orientation === "white" ? "abcdefgh" : "hgfedcba").split("").map((file) => (
          <span key={file}>{file}</span>
        ))}
      </div>
      
      {/* Rank labels (1-8) */}
      <div className="absolute -left-5 top-0 bottom-0 flex flex-col justify-around py-1 text-xs text-slate-500">
        {(orientation === "white" ? "87654321" : "12345678").split("").map((rank) => (
          <span key={rank}>{rank}</span>
        ))}
      </div>

      {/* Board */}
      <div className="grid grid-cols-8 rounded-lg overflow-hidden shadow-lg border border-slate-300">
        {squares.map(({ square, isLight }) => {
          const piece = pieces[square];
          const isHighlighted = highlightSquares.includes(square);
          const isSelected = selectedSquare === square;
          const isDragging = dragFrom === square;

          return (
            <div
              key={square}
              className={`
                aspect-square flex items-center justify-center relative cursor-pointer
                transition-colors duration-150
                ${isLight ? "bg-amber-100" : "bg-amber-700"}
                ${isHighlighted ? "ring-4 ring-inset ring-emerald-400/70" : ""}
                ${isSelected ? "bg-yellow-300" : ""}
                ${isDragging ? "opacity-50" : ""}
              `}
              onClick={() => handleSquareClick(square)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(square)}
            >
              {/* Highlight dot for valid moves */}
              {isHighlighted && !piece && (
                <div className="absolute w-3 h-3 rounded-full bg-emerald-500/50" />
              )}
              
              {/* Piece */}
              {piece && (
                <span
                  className={`
                    text-4xl sm:text-5xl select-none
                    ${piece === piece.toUpperCase() ? "text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" : "text-slate-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.3)]"}
                    ${interactive ? "cursor-grab active:cursor-grabbing" : ""}
                  `}
                  draggable={interactive}
                  onDragStart={() => handleDragStart(square)}
                  onDragEnd={handleDragEnd}
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
