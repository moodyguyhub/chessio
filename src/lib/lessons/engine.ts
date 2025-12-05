/**
 * Lesson Engine - Pure functions for handling task interactions
 *
 * This module contains the core logic for processing user interactions
 * during lessons. It's designed to be:
 * - Pure (no side effects)
 * - Type-safe (leverages discriminated union on task.kind)
 * - Testable (all logic is in plain functions)
 *
 * React components call these functions and use the results to update UI state.
 */

import type { LessonTask, SelectSquareTask, MovePieceTask } from "@/lib/lessons";

// ============================================
// STATE TYPES
// ============================================

/**
 * State maintained during a lesson interaction
 * - For select-square: no state needed (single click)
 * - For move-piece: tracks the selected "from" square
 */
export type LessonInteractionState = {
  selectedSquare: string | null;
};

/**
 * Result of processing a square click
 */
export type LessonInteractionResult = {
  /** Updated interaction state */
  state: LessonInteractionState;
  /** Did this click complete an attempt? (true for select-square, or move-piece second click) */
  isAttemptComplete: boolean;
  /** If attempt is complete, was it correct? */
  isCorrect: boolean;
  /** Board position after the interaction (same for select-square, updated for correct move-piece) */
  newFen: string;
};

// ============================================
// INITIAL STATE
// ============================================

/**
 * Get initial interaction state for a new task
 */
export function getInitialInteractionState(): LessonInteractionState {
  return {
    selectedSquare: null,
  };
}

// ============================================
// MAIN HANDLER
// ============================================

/**
 * Handle a square click during a lesson task
 *
 * This is the main entry point for the engine. It delegates to the appropriate
 * handler based on task.kind (discriminated union).
 *
 * @param params.task - The current task definition
 * @param params.currentFen - Current board position
 * @param params.state - Current interaction state
 * @param params.clickedSquare - The square that was clicked (e.g., "e4")
 * @returns Result with updated state and whether the attempt was correct
 */
export function handleSquareClick(params: {
  task: LessonTask;
  currentFen: string;
  state: LessonInteractionState;
  clickedSquare: string;
}): LessonInteractionResult {
  const { task, currentFen, state, clickedSquare } = params;

  // TypeScript narrows based on task.kind
  if (task.kind === "select-square") {
    return handleSelectSquareClick(task, currentFen, clickedSquare);
  } else {
    return handleMovePieceClick(task, currentFen, state, clickedSquare);
  }
}

// ============================================
// SELECT-SQUARE HANDLER
// ============================================

/**
 * Handle click for a "select-square" task
 *
 * Single click = complete attempt
 * Board doesn't change for select-square tasks
 */
function handleSelectSquareClick(
  task: SelectSquareTask,
  currentFen: string,
  clickedSquare: string
): LessonInteractionResult {
  const isCorrect = clickedSquare === task.targetSquare;

  return {
    state: { selectedSquare: null },
    isAttemptComplete: true,
    isCorrect,
    newFen: currentFen, // Board doesn't change
  };
}

// ============================================
// MOVE-PIECE HANDLER
// ============================================

/**
 * Handle click for a "move-piece" task
 *
 * Two-click interaction:
 * 1. First click: select the "from" square
 * 2. Second click: attempt to move to "to" square
 *
 * If the user clicks on a different piece (wrong "from"), update selection.
 * If the user clicks the same square twice, deselect.
 */
function handleMovePieceClick(
  task: MovePieceTask,
  currentFen: string,
  state: LessonInteractionState,
  clickedSquare: string
): LessonInteractionResult {
  // No selection yet - this is the "from" click
  if (state.selectedSquare === null) {
    // Check if clicked square has a piece we can move
    const hasPiece = squareHasPiece(currentFen, clickedSquare);

    if (hasPiece) {
      // Select this square as the "from"
      return {
        state: { selectedSquare: clickedSquare },
        isAttemptComplete: false,
        isCorrect: false,
        newFen: currentFen,
      };
    } else {
      // Clicked empty square with no selection - ignore
      return {
        state: { selectedSquare: null },
        isAttemptComplete: false,
        isCorrect: false,
        newFen: currentFen,
      };
    }
  }

  // Already have a selection - this is the "to" click
  const fromSquare = state.selectedSquare;
  const toSquare = clickedSquare;

  // Clicking the same square deselects
  if (fromSquare === toSquare) {
    return {
      state: { selectedSquare: null },
      isAttemptComplete: false,
      isCorrect: false,
      newFen: currentFen,
    };
  }

  // Check if clicking a friendly piece (same color) - if so, switch selection
  const fromPieceColor = getPieceColor(currentFen, fromSquare);
  const toPieceColor = getPieceColor(currentFen, toSquare);
  
  if (toPieceColor !== null && toPieceColor === fromPieceColor) {
    // Clicking another friendly piece switches selection
    return {
      state: { selectedSquare: toSquare },
      isAttemptComplete: false,
      isCorrect: false,
      newFen: currentFen,
    };
  }

  // Attempting a move (or capture) from -> to
  const attemptedMove = { from: fromSquare, to: toSquare };
  const isCorrect =
    attemptedMove.from === task.expectedMove.from &&
    attemptedMove.to === task.expectedMove.to;

  if (isCorrect) {
    // Apply the move to get new FEN
    const newFen = applyMove(currentFen, fromSquare, toSquare);
    return {
      state: { selectedSquare: null },
      isAttemptComplete: true,
      isCorrect: true,
      newFen,
    };
  } else {
    // Incorrect move - reset selection, don't change board
    return {
      state: { selectedSquare: null },
      isAttemptComplete: true,
      isCorrect: false,
      newFen: currentFen,
    };
  }
}

// ============================================
// CHESS HELPERS
// ============================================

/**
 * Parse FEN to get piece map (handles invalid FENs like those without kings)
 */
function parseFenToPieces(fen: string): Record<string, string> {
  const pieces: Record<string, string> = {};
  const boardPart = fen.split(" ")[0];
  const rows = boardPart.split("/");

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

/**
 * Check if a square has a piece on it
 * Uses manual FEN parsing to support simplified FENs (no king required)
 */
function squareHasPiece(fen: string, square: string): boolean {
  const pieces = parseFenToPieces(fen);
  return square in pieces;
}

/**
 * Get the color of a piece on a square
 * Returns 'white' for uppercase, 'black' for lowercase, null if empty
 */
function getPieceColor(fen: string, square: string): "white" | "black" | null {
  const pieces = parseFenToPieces(fen);
  const piece = pieces[square];
  if (!piece) return null;
  return piece === piece.toUpperCase() ? "white" : "black";
}

/**
 * Apply a move and return the new FEN
 * For Level 0, we manually update the FEN since chess.js requires valid positions
 */
function applyMove(fen: string, from: string, to: string): string {
  const pieces = parseFenToPieces(fen);
  const movingPiece = pieces[from];
  
  if (!movingPiece) {
    return fen; // No piece to move
  }
  
  // Remove piece from source, add to destination
  delete pieces[from];
  pieces[to] = movingPiece;
  
  // Rebuild the board part of FEN
  let boardStr = "";
  for (let rank = 8; rank >= 1; rank--) {
    let emptyCount = 0;
    for (let fileCode = 97; fileCode <= 104; fileCode++) { // a-h
      const file = String.fromCharCode(fileCode);
      const square = `${file}${rank}`;
      const piece = pieces[square];
      
      if (piece) {
        if (emptyCount > 0) {
          boardStr += emptyCount;
          emptyCount = 0;
        }
        boardStr += piece;
      } else {
        emptyCount++;
      }
    }
    if (emptyCount > 0) {
      boardStr += emptyCount;
    }
    if (rank > 1) {
      boardStr += "/";
    }
  }
  
  // Keep the rest of the FEN metadata (turn, castling, etc.)
  const fenParts = fen.split(" ");
  fenParts[0] = boardStr;
  return fenParts.join(" ");
}
