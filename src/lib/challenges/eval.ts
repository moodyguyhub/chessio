/**
 * Challenge Evaluation Helpers
 * 
 * Material scoring, blunder detection, and defensive checks for Coach's Challenges.
 */

import { Chess, Square } from "chess.js";

export type Color = "w" | "b";

/**
 * Standard piece values for material calculation
 */
export const PIECE_VALUES = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
} as const;

/**
 * Calculate material score for a given color
 * Returns the sum of piece values
 */
export function getMaterialForColor(game: Chess, color: Color): number {
  const board = game.board();
  let material = 0;
  
  for (const row of board) {
    for (const square of row) {
      if (square && square.color === color) {
        material += PIECE_VALUES[square.type as keyof typeof PIECE_VALUES];
      }
    }
  }
  
  return material;
}

/**
 * Calculate material score (player - bot)
 * Positive means player is ahead
 */
export function getMaterialScore(game: Chess, playerColor: Color): number {
  const botColor: Color = playerColor === "w" ? "b" : "w";
  const playerMaterial = getMaterialForColor(game, playerColor);
  const botMaterial = getMaterialForColor(game, botColor);
  
  return playerMaterial - botMaterial;
}

/**
 * Check if a square is defended by pieces of the given color
 * A square is defended if capturing it would allow a recapture
 */
export function isSquareDefended(game: Chess, square: Square, byColor: Color): boolean {
  // Check all pieces of byColor to see if any can capture on this square
  const board = game.board();
  
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (!piece || piece.color !== byColor) continue;
      
      // Get the square name for this piece
      const fromSquare = String.fromCharCode(97 + file) + String(8 - rank) as Square;
      
      // Try a capture move to the target square
      const moves = game.moves({ square: fromSquare, verbose: true });
      for (const move of moves) {
        if (move.to === square) {
          return true; // This piece can capture on the target square
        }
      }
    }
  }
  
  return false;
}

/**
 * Check if a queen blunder occurred (Level 0 specific rule)
 * 
 * A queen blunder is when:
 * 1. The queen was moved to an undefended square
 * 2. The square is attacked by opponent
 * 3. The queen did not capture an equal or higher value piece
 */
export function isQueenBlunder(
  previousGame: Chess,
  currentGame: Chess,
  playerColor: Color,
  lastMove: { from: Square; to: Square; captured?: string }
): boolean {
  // Only check queen moves
  const movedPiece = previousGame.get(lastMove.from);
  if (!movedPiece || movedPiece.type !== "q") {
    return false;
  }
  
  // If queen captured a queen or better, it's not a blunder (no piece is better than Q though)
  if (lastMove.captured && PIECE_VALUES[lastMove.captured as keyof typeof PIECE_VALUES] >= 9) {
    return false;
  }
  
  // Check if the queen's new square is defended by player
  const queenSquare = lastMove.to;
  const queenDefended = isSquareDefended(currentGame, queenSquare, playerColor);
  
  if (queenDefended) {
    return false; // Queen is safe
  }
  
  // Check if opponent can capture the queen
  // We need to check from bot's perspective, so temporarily make a move
  // to see if bot can capture the queen
  const testGame = new Chess(currentGame.fen());
  const moves = testGame.moves({ verbose: true });
  
  for (const move of moves) {
    if (move.to === queenSquare && move.captured === "q") {
      return true; // Bot can capture the queen!
    }
  }
  
  return false;
}

/**
 * Check if a generic blunder occurred
 * A blunder is losing 3+ points of material with no compensation
 */
export function isNetBlunder(prevScore: number, newScore: number): boolean {
  return newScore <= prevScore - 3;
}

/**
 * Count how many pieces the player has captured
 * This is used for Level 0's capture-based win condition
 * Note: This is tracked by the engine, not by FEN parsing
 */
export function countCaptures(): number {
  // This is tracked externally in the engine since
  // FEN halfmove clock resets on captures
  return 0;
}

/**
 * Check if a move results in a capture
 */
export function isCapture(move: { captured?: string }): boolean {
  return !!move.captured;
}

/**
 * Get the value of a captured piece
 */
export function getCaptureValue(captured: string): number {
  return PIECE_VALUES[captured as keyof typeof PIECE_VALUES] || 0;
}
