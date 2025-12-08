/**
 * Coach Bot (Chip) Behavior Profiles
 * 
 * Simple rule-based bot that makes intentional mistakes
 * to give beginners a fair challenge without being overwhelming.
 * 
 * NO engine, NO depth search - just one-ply heuristics.
 */

import { Chess, Move, Square } from "chess.js";
import { isSquareDefended, Color } from "./eval";

export type BotProfileId = "chip_l0" | "chip_l1";

/**
 * Get the next move for Chip based on the profile
 */
export function getChipMove(game: Chess, profile: BotProfileId): Move | null {
  if (profile === "chip_l0") {
    return getChipL0Move(game);
  } else {
    return getChipL1Move(game);
  }
}

/**
 * Level 0 Chip: Very basic, makes occasional obvious mistakes
 * 
 * Strategy:
 * 1. 30% of the time: intentionally hang a pawn or queen on an attacked square
 * 2. Otherwise: make a safe-ish random move (avoid hanging queen/king)
 */
function getChipL0Move(game: Chess): Move | null {
  const allMoves = game.moves({ verbose: true });
  if (allMoves.length === 0) return null;
  
  const botColor: Color = game.turn();
  const playerColor: Color = botColor === "w" ? "b" : "w";
  
  // 30% chance to make a "mistake" - hang a piece intentionally
  if (Math.random() < 0.3) {
    const mistakeMoves = findMistakeMoves(game, allMoves, botColor, playerColor);
    if (mistakeMoves.length > 0) {
      return mistakeMoves[Math.floor(Math.random() * mistakeMoves.length)];
    }
  }
  
  // Otherwise, pick a "safe-ish" move
  const safeMoves = filterSafeMoves(game, allMoves, botColor, playerColor);
  if (safeMoves.length > 0) {
    return safeMoves[Math.floor(Math.random() * safeMoves.length)];
  }
  
  // Fallback: any legal move
  return allMoves[Math.floor(Math.random() * allMoves.length)];
}

/**
 * Level 1 Chip: Smarter - punishes undefended pieces, but still makes small mistakes
 * 
 * Strategy:
 * 1. If player has undefended pieces: capture them (highest value first)
 * 2. 30% chance: intentionally hang a minor piece (N or B)
 * 3. Otherwise: make a safe-ish random move
 */
function getChipL1Move(game: Chess): Move | null {
  const allMoves = game.moves({ verbose: true });
  if (allMoves.length === 0) return null;
  
  const botColor: Color = game.turn();
  const playerColor: Color = botColor === "w" ? "b" : "w";
  
  // First priority: capture undefended player pieces
  const captureMoves = findUndefendedCaptures(game, allMoves, playerColor);
  if (captureMoves.length > 0) {
    // Pick the highest value capture
    return captureMoves[0]; // Already sorted by value
  }
  
  // 30% chance to hang a minor piece intentionally
  if (Math.random() < 0.3) {
    const hangMinorMoves = findHangMinorMoves(game, allMoves, botColor, playerColor);
    if (hangMinorMoves.length > 0) {
      return hangMinorMoves[Math.floor(Math.random() * hangMinorMoves.length)];
    }
  }
  
  // Otherwise, make a safe move
  const safeMoves = filterSafeMoves(game, allMoves, botColor, playerColor);
  if (safeMoves.length > 0) {
    return safeMoves[Math.floor(Math.random() * safeMoves.length)];
  }
  
  // Fallback: any legal move
  return allMoves[Math.floor(Math.random() * allMoves.length)];
}

/**
 * Find moves that intentionally hang a pawn or queen
 */
function findMistakeMoves(
  game: Chess,
  moves: Move[],
  botColor: Color,
  playerColor: Color
): Move[] {
  const mistakes: Move[] = [];
  
  for (const move of moves) {
    const piece = game.get(move.from);
    if (!piece) continue;
    
    // Only hang pawns or queen (dramatic for level 0)
    if (piece.type !== "p" && piece.type !== "q") continue;
    
    // Simulate the move
    const testGame = new Chess(game.fen());
    testGame.move(move);
    
    // Check if the piece is now attacked and undefended
    const isDefended = isSquareDefended(testGame, move.to, botColor);
    const isAttacked = isSquareAttacked(testGame, move.to, playerColor);
    
    if (isAttacked && !isDefended) {
      mistakes.push(move);
    }
  }
  
  return mistakes;
}

/**
 * Find moves that hang a minor piece (knight or bishop)
 */
function findHangMinorMoves(
  game: Chess,
  moves: Move[],
  botColor: Color,
  playerColor: Color
): Move[] {
  const hangMoves: Move[] = [];
  
  for (const move of moves) {
    const piece = game.get(move.from);
    if (!piece) continue;
    
    // Only hang minor pieces
    if (piece.type !== "n" && piece.type !== "b") continue;
    
    // Simulate the move
    const testGame = new Chess(game.fen());
    testGame.move(move);
    
    // Check if the piece is now attacked and undefended
    const isDefended = isSquareDefended(testGame, move.to, botColor);
    const isAttacked = isSquareAttacked(testGame, move.to, playerColor);
    
    if (isAttacked && !isDefended) {
      hangMoves.push(move);
    }
  }
  
  return hangMoves;
}

/**
 * Find captures of undefended player pieces
 * Returns moves sorted by captured piece value (highest first)
 */
function findUndefendedCaptures(
  game: Chess,
  moves: Move[],
  playerColor: Color
): Move[] {
  const captures: { move: Move; value: number }[] = [];
  
  for (const move of moves) {
    if (!move.captured) continue;
    
    // Simulate the move to check if player can recapture
    const testGame = new Chess(game.fen());
    testGame.move(move);
    
    const canRecapture = isSquareDefended(testGame, move.to, playerColor);
    
    if (!canRecapture) {
      const value = getPieceValue(move.captured);
      captures.push({ move, value });
    }
  }
  
  // Sort by value descending
  captures.sort((a, b) => b.value - a.value);
  return captures.map((c) => c.move);
}

/**
 * Filter moves that don't obviously hang valuable pieces
 */
function filterSafeMoves(
  game: Chess,
  moves: Move[],
  botColor: Color,
  playerColor: Color
): Move[] {
  const safeMoves: Move[] = [];
  
  for (const move of moves) {
    const piece = game.get(move.from);
    if (!piece) continue;
    
    // Don't move queen or king into danger
    if (piece.type === "q" || piece.type === "k") {
      // Simulate move
      const testGame = new Chess(game.fen());
      testGame.move(move);
      
      const isDefended = isSquareDefended(testGame, move.to, botColor);
      const isAttacked = isSquareAttacked(testGame, move.to, playerColor);
      
      if (isAttacked && !isDefended) {
        continue; // Skip this move
      }
    }
    
    safeMoves.push(move);
  }
  
  return safeMoves.length > 0 ? safeMoves : moves; // Fallback to all moves
}

/**
 * Check if a square is attacked by pieces of the given color
 */
function isSquareAttacked(game: Chess, square: Square, byColor: Color): boolean {
  // chess.js doesn't have a direct "isAttacked" method, but we can check
  // by looking for moves from the opposing color that can reach this square
  
  // We need to switch turns temporarily to check attacks
  const currentTurn = game.turn();
  if (currentTurn === byColor) {
    // Already correct turn, check moves
    const moves = game.moves({ verbose: true });
    return moves.some((m) => m.to === square);
  } else {
    // Need to switch turn to check
    // This is tricky with chess.js - we'll use isSquareDefended from eval.ts
    // which checks from defender's perspective
    return isSquareDefended(game, square, byColor);
  }
}

/**
 * Get standard piece value
 */
function getPieceValue(pieceType: string): number {
  const values: Record<string, number> = {
    p: 1,
    n: 3,
    b: 3,
    r: 5,
    q: 9,
    k: 0,
  };
  return values[pieceType] || 0;
}
