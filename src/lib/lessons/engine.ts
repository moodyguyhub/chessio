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
import { Chess } from "chess.js";

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

  // Clicking a different piece switches selection
  if (squareHasPiece(currentFen, toSquare)) {
    // Check if it's a friendly piece (same color) - if so, switch selection
    // For Level 0, we only have white pieces, so any piece is switchable
    return {
      state: { selectedSquare: toSquare },
      isAttemptComplete: false,
      isCorrect: false,
      newFen: currentFen,
    };
  }

  // Attempting a move from -> to
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
 * Check if a square has a piece on it
 */
function squareHasPiece(fen: string, square: string): boolean {
  try {
    const chess = new Chess(fen);
    const piece = chess.get(square as Parameters<typeof chess.get>[0]);
    return piece !== null;
  } catch {
    return false;
  }
}

/**
 * Apply a move and return the new FEN
 * For Level 0, we trust the move is valid (it was already checked against expectedMove)
 */
function applyMove(fen: string, from: string, to: string): string {
  try {
    const chess = new Chess(fen);
    chess.move({ from, to });
    return chess.fen();
  } catch {
    // If move fails for some reason, return original FEN
    return fen;
  }
}
