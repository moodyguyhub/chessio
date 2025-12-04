/**
 * Chess Logic Utilities
 *
 * Wraps chess.js for move validation and game state checks.
 * Use this for any chess rule enforcement beyond Level 0's explicit validMoves.
 */

import { Chess, Square, Move } from "chess.js";

export type { Square, Move };

/**
 * Creates a new Chess instance from a FEN string.
 */
export function createGame(fen?: string): Chess {
  return new Chess(fen);
}

/**
 * Validates if a move is legal according to chess rules.
 * Returns the move object if valid, null if invalid.
 */
export function validateMove(
  fen: string,
  from: Square,
  to: Square,
  promotion?: "q" | "r" | "b" | "n"
): Move | null {
  const game = new Chess(fen);
  try {
    return game.move({ from, to, promotion });
  } catch {
    return null;
  }
}

/**
 * Gets all legal moves for a piece at a given square.
 */
export function getLegalMoves(fen: string, square: Square): Move[] {
  const game = new Chess(fen);
  return game.moves({ square, verbose: true });
}

/**
 * Checks if the current position is checkmate.
 */
export function isCheckmate(fen: string): boolean {
  const game = new Chess(fen);
  return game.isCheckmate();
}

/**
 * Checks if the current position is stalemate.
 */
export function isStalemate(fen: string): boolean {
  const game = new Chess(fen);
  return game.isStalemate();
}

/**
 * Checks if the current position is a draw.
 */
export function isDraw(fen: string): boolean {
  const game = new Chess(fen);
  return game.isDraw();
}

/**
 * Checks if the current side is in check.
 */
export function isInCheck(fen: string): boolean {
  const game = new Chess(fen);
  return game.isCheck();
}

/**
 * Gets the piece at a given square.
 */
export function getPieceAt(
  fen: string,
  square: Square
): { type: string; color: "w" | "b" } | null {
  const game = new Chess(fen);
  const piece = game.get(square);
  return piece ?? null;
}

/**
 * Applies a move and returns the new FEN.
 * Throws if the move is illegal.
 */
export function applyMove(
  fen: string,
  from: Square,
  to: Square,
  promotion?: "q" | "r" | "b" | "n"
): string {
  const game = new Chess(fen);
  game.move({ from, to, promotion });
  return game.fen();
}

/**
 * Checks if a move results in castling.
 */
export function isCastling(move: Move): boolean {
  return move.flags.includes("k") || move.flags.includes("q");
}

/**
 * Checks if a move is en passant.
 */
export function isEnPassant(move: Move): boolean {
  return move.flags.includes("e");
}

/**
 * Checks if a move results in promotion.
 */
export function isPromotion(move: Move): boolean {
  return move.flags.includes("p");
}

/**
 * Gets whose turn it is from a FEN.
 */
export function getTurn(fen: string): "w" | "b" {
  const game = new Chess(fen);
  return game.turn();
}
