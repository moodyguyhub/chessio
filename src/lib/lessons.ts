// Data structure for Level 0 Lessons
// TODO (Phase 2+): Migrate to DB-driven lessons or generate this file from admin tooling.

// ============================================
// TASK TYPES - Discriminated Union
// ============================================

export type TaskKind = "select-square" | "move-piece";

/** Optional feedback messages for tasks */
export type TaskMessages = {
  success?: string; // Shown on correct attempt
  failure?: string; // Shown on incorrect attempt
  hint?: string;    // Shown when user requests hint
};

type BaseTask = {
  id: string;
  kind: TaskKind;
  prompt: string; // Copy shown to the user ("Click on e4")
  initialFen: string; // Board position before any interaction
  messages?: TaskMessages; // Optional custom feedback copy
};

export type SelectSquareTask = BaseTask & {
  kind: "select-square";
  targetSquare: string; // e.g. "e4"
  // Future: could add allowedSquares / hintSquares
};

export type MovePieceTask = BaseTask & {
  kind: "move-piece";
  expectedMove: {
    from: string; // "a1"
    to: string; // "a4"
  };
  // Future: we could add `allowedAlternatives` or `promotion` info.
};

export type LessonTask = SelectSquareTask | MovePieceTask;

// ============================================
// LESSON TYPE
// ============================================

export type Lesson = {
  slug: string;
  title: string;
  description: string;
  level: number;
  xpReward: number;
  tasks: LessonTask[];
};

// ============================================
// DEFAULT MESSAGES (used when task.messages is not set)
// ============================================

export const DEFAULT_MESSAGES = {
  "select-square": {
    success: "Nice, that's the right square!",
    failure: "Not quite — try a different square.",
    hint: "Look carefully at the board coordinates.",
  },
  "move-piece": {
    success: "Nice, that's the correct move!",
    failure: "Try finding the correct piece first, then move it.",
    hint: "Remember how this piece moves.",
  },
} as const;

/**
 * Get the feedback message for a task
 */
export function getTaskMessage(
  task: LessonTask,
  type: keyof TaskMessages
): string {
  return task.messages?.[type] ?? DEFAULT_MESSAGES[task.kind][type];
}

// ============================================
// LEVEL 0 LESSONS
// ============================================

export const lessons: Lesson[] = [
  // ----------------------------------------
  // Lesson 1: Board Basics (select-square only)
  // ----------------------------------------
  {
    slug: "level-0-lesson-1-board",
    title: "Meet the Board",
    description:
      "Learn how to read ranks, files, and squares like e4.",
    level: 0,
    xpReward: 10,
    tasks: [
      {
        id: "board-1",
        kind: "select-square",
        prompt: "Tap the square e4.",
        initialFen: "8/8/8/8/8/8/8/8 w - - 0 1", // empty board
        targetSquare: "e4",
      },
      {
        id: "board-2",
        kind: "select-square",
        prompt: "Now tap the square a1.",
        initialFen: "8/8/8/8/8/8/8/8 w - - 0 1",
        targetSquare: "a1",
      },
      {
        id: "board-3",
        kind: "select-square",
        prompt: "Tap the square h8.",
        initialFen: "8/8/8/8/8/8/8/8 w - - 0 1",
        targetSquare: "h8",
      },
    ],
  },

  // ----------------------------------------
  // Lesson 2: Rook Movement (move-piece)
  // ----------------------------------------
  {
    slug: "level-0-lesson-2-rook",
    title: "How the Rook Moves",
    description:
      "Practice moving the rook in straight lines.",
    level: 0,
    xpReward: 10,
    tasks: [
      {
        id: "rook-1",
        kind: "move-piece",
        prompt: "Move the rook from a1 to a4.",
        initialFen: "8/8/8/8/8/8/8/R7 w - - 0 1", // white rook on a1
        expectedMove: { from: "a1", to: "a4" },
      },
      {
        id: "rook-2",
        kind: "move-piece",
        prompt: "Move the rook from d4 to d1.",
        initialFen: "8/8/8/8/3R4/8/8/8 w - - 0 1", // white rook on d4
        expectedMove: { from: "d4", to: "d1" },
      },
      {
        id: "rook-3",
        kind: "move-piece",
        prompt: "Move the rook from h1 to h8.",
        initialFen: "8/8/8/8/8/8/8/7R w - - 0 1", // white rook on h1
        expectedMove: { from: "h1", to: "h8" },
      },
    ],
  },

  // ----------------------------------------
  // Lesson 3: Bishop Movement (move-piece)
  // ----------------------------------------
  {
    slug: "level-0-lesson-3-bishop",
    title: "How the Bishop Moves",
    description:
      "Practice moving the bishop diagonally.",
    level: 0,
    xpReward: 10,
    tasks: [
      {
        id: "bishop-1",
        kind: "move-piece",
        prompt: "Move the bishop from c1 to f4.",
        initialFen: "8/8/8/8/8/8/8/2B5 w - - 0 1", // white bishop on c1
        expectedMove: { from: "c1", to: "f4" },
      },
      {
        id: "bishop-2",
        kind: "move-piece",
        prompt: "Move the bishop from a8 to h1.",
        initialFen: "B7/8/8/8/8/8/8/8 w - - 0 1", // white bishop on a8
        expectedMove: { from: "a8", to: "h1" },
      },
      {
        id: "bishop-3",
        kind: "move-piece",
        prompt: "Move the bishop from e3 to b6.",
        initialFen: "8/8/8/8/8/4B3/8/8 w - - 0 1", // white bishop on e3
        expectedMove: { from: "e3", to: "b6" },
      },
    ],
  },

  // ----------------------------------------
  // Lesson 4: Queen Movement (move-piece)
  // ----------------------------------------
  {
    slug: "level-0-lesson-4-queen",
    title: "How the Queen Moves",
    description:
      "The queen is the most powerful piece — she moves like a rook AND a bishop!",
    level: 0,
    xpReward: 15,
    tasks: [
      {
        id: "queen-1",
        kind: "move-piece",
        prompt: "Move the queen from d1 to d8 (like a rook).",
        initialFen: "8/8/8/8/8/8/8/3Q4 w - - 0 1", // white queen on d1
        expectedMove: { from: "d1", to: "d8" },
        messages: {
          success: "Perfect! The queen can move in straight lines like a rook.",
          hint: "The queen can move vertically — go all the way up the d-file.",
        },
      },
      {
        id: "queen-2",
        kind: "move-piece",
        prompt: "Move the queen from a1 to h8 (like a bishop).",
        initialFen: "8/8/8/8/8/8/8/Q7 w - - 0 1", // white queen on a1
        expectedMove: { from: "a1", to: "h8" },
        messages: {
          success: "Great! The queen can also move diagonally like a bishop.",
          hint: "The queen can move diagonally — try the long diagonal.",
        },
      },
      {
        id: "queen-3",
        kind: "move-piece",
        prompt: "Move the queen from e4 to h7.",
        initialFen: "8/8/8/8/4Q3/8/8/8 w - - 0 1", // white queen on e4
        expectedMove: { from: "e4", to: "h7" },
        messages: {
          success: "Excellent! You've mastered the queen's diagonal movement.",
          hint: "Move diagonally toward the top-right corner.",
        },
      },
    ],
  },

  // ----------------------------------------
  // Lesson 5: King Movement (move-piece)
  // ----------------------------------------
  {
    slug: "level-0-lesson-5-king",
    title: "How the King Moves",
    description:
      "The king is the most important piece — protect him at all costs! He moves one square in any direction.",
    level: 0,
    xpReward: 15,
    tasks: [
      {
        id: "king-1",
        kind: "move-piece",
        prompt: "Move the king from e1 to e2.",
        initialFen: "8/8/8/8/8/8/8/4K3 w - - 0 1", // white king on e1
        expectedMove: { from: "e1", to: "e2" },
        messages: {
          success: "Good! The king moves one square at a time.",
          hint: "The king can only move one square — go forward.",
        },
      },
      {
        id: "king-2",
        kind: "move-piece",
        prompt: "Move the king from d4 to e5 (diagonally).",
        initialFen: "8/8/8/8/3K4/8/8/8 w - - 0 1", // white king on d4
        expectedMove: { from: "d4", to: "e5" },
        messages: {
          success: "Nice! The king can move diagonally too — but only one square.",
          hint: "Move diagonally up and to the right.",
        },
      },
      {
        id: "king-3",
        kind: "move-piece",
        prompt: "Move the king from h8 to g7.",
        initialFen: "7K/8/8/8/8/8/8/8 w - - 0 1", // white king on h8
        expectedMove: { from: "h8", to: "g7" },
        messages: {
          success: "Perfect! You understand how the king moves.",
          hint: "Move diagonally down and to the left.",
        },
      },
    ],
  },

  // ----------------------------------------
  // Lesson 6: Pawn Movement (move-piece)
  // ----------------------------------------
  {
    slug: "level-0-lesson-6-pawn",
    title: "How the Pawn Moves",
    description:
      "Pawns are humble but powerful — they can only move forward, but they have a special first-move option!",
    level: 0,
    xpReward: 15,
    tasks: [
      {
        id: "pawn-1",
        kind: "move-piece",
        prompt: "Move the pawn from e2 to e4 (two squares on first move).",
        initialFen: "8/8/8/8/8/8/4P3/8 w - - 0 1", // white pawn on e2
        expectedMove: { from: "e2", to: "e4" },
        messages: {
          success: "Great! Pawns can move two squares on their first move.",
          hint: "From the starting position, a pawn can jump two squares forward.",
        },
      },
      {
        id: "pawn-2",
        kind: "move-piece",
        prompt: "Move the pawn from d4 to d5 (one square forward).",
        initialFen: "8/8/8/8/3P4/8/8/8 w - - 0 1", // white pawn on d4
        expectedMove: { from: "d4", to: "d5" },
        messages: {
          success: "Correct! After the first move, pawns move one square at a time.",
          hint: "Pawns move straight forward — one square only after the first move.",
        },
      },
      {
        id: "pawn-3",
        kind: "move-piece",
        prompt: "Move the pawn from a7 to a8 (promotion square!).",
        initialFen: "8/P7/8/8/8/8/8/8 w - - 0 1", // white pawn on a7
        expectedMove: { from: "a7", to: "a8" },
        messages: {
          success: "Amazing! When a pawn reaches the end, it promotes to a stronger piece!",
          hint: "Move the pawn to the last rank — something special happens there!",
        },
      },
    ],
  },
];

// ============================================
// LEVEL 1 LESSONS - Advanced Interactions
// ============================================

export const LEVEL_1_LESSONS: Lesson[] = [
  // ----------------------------------------
  // Lesson 7: The Knight (L-shape, jumping)
  // ----------------------------------------
  {
    slug: "level-1-lesson-1-knight",
    title: "Meet the Knight",
    description:
      "Learn the knight's unique L-shaped jump — the only piece that can hop over others.",
    level: 1,
    xpReward: 20,
    tasks: [
      {
        id: "knight-1",
        kind: "move-piece",
        prompt: "Move the knight from b1 to c3 to see its special 'L' shape jump.",
        initialFen: "8/8/8/8/8/8/8/1N6 w - - 0 1", // Knight at b1
        expectedMove: { from: "b1", to: "c3" },
        messages: {
          success: "Perfect! Two squares up, one square over. That's the knight's L-shape.",
          failure: "Not quite. Knights move in an L-shape: 2 steps one way, 1 step to the side.",
          hint: "Imagine the letter 'L'. Go up two squares to b3, then turn right to c3.",
        },
      },
      {
        id: "knight-2",
        kind: "move-piece",
        prompt: "The knight is surrounded by pawns, but it can jump! Move from g1 to f3.",
        initialFen: "8/8/8/8/8/8/5PPP/6N1 w - - 0 1", // Knight at g1 surrounded by pawns
        expectedMove: { from: "g1", to: "f3" },
        messages: {
          success: "Excellent! The knight is the only piece that can jump over others like that.",
          failure: "Try jumping! The pawns block straight lines, but the knight jumps right over them to f3.",
          hint: "The knight doesn't care about pieces in its path. It simply lands on the destination square.",
        },
      },
      {
        id: "knight-3",
        kind: "move-piece",
        prompt: "Capture the black pawn on e3. Remember, the knight lands on the piece to capture it.",
        initialFen: "8/8/8/8/8/4p3/8/3N4 w - - 0 1", // Knight on d1, Pawn on e3
        expectedMove: { from: "d1", to: "e3" },
        messages: {
          success: "Got it! You jumped, landed, and captured in one move.",
          failure: "Close. Look for the L-shape that lands exactly on the black pawn at e3.",
          hint: "Count it out: 2 squares up (to d3), 1 square right (to e3). Capture!",
        },
      },
    ],
  },
  // ----------------------------------------
  // Lesson 8: Castling (special King-Rook move)
  // ----------------------------------------
  {
    slug: "level-1-lesson-2-castling",
    title: "Castling",
    description:
      "Learn the special move where King and Rook work together to keep the King safe.",
    level: 1,
    xpReward: 20,
    tasks: [
      {
        id: "castling-1",
        kind: "move-piece",
        prompt: "Castle kingside: move your King two squares toward the Rook (e1 to g1).",
        initialFen: "r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1",
        expectedMove: { from: "e1", to: "g1" },
        messages: {
          success: "Safe and sound! The King moved two squares, and the Rook jumped over to protect him.",
          failure: "To castle kingside, move the King exactly two squares to the right (e1 to g1).",
          hint: "Click the King on e1, then click g1. The Rook will move automatically!",
        },
      },
      {
        id: "castling-2",
        kind: "move-piece",
        prompt: "Castle queenside: move the King two squares toward the a-file Rook (e1 to c1).",
        initialFen: "r3kbnr/pppq1ppp/2np4/4p3/2B1P3/2NP1N2/PPP2PPP/R3K2R w KQkq - 0 1",
        expectedMove: { from: "e1", to: "c1" },
        messages: {
          success: "Perfect! Long castling takes more setup, but it keeps the King very safe.",
          failure: "Move the King two squares to the left (e1 to c1) to castle queenside.",
          hint: "Click the King on e1, then click c1. Watch the Rook fly over!",
        },
      },
      {
        id: "castling-3",
        kind: "move-piece",
        prompt: "You can't castle through check! The Bishop controls f1. Move your King to d2 instead.",
        initialFen: "r2qk2r/ppp2ppp/2np1n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1",
        expectedMove: { from: "e1", to: "d2" },
        messages: {
          success: "Smart! You noticed you couldn't castle because the Bishop watched f1, so you moved safely.",
          failure: "The Bishop on c5 attacks f1, blocking castling. Move the King to d2 instead.",
          hint: "Castling is blocked! Just move the King one square to d2.",
        },
      },
    ],
  },
  // ----------------------------------------
  // Lesson 9: Check (King under attack)
  // ----------------------------------------
  {
    slug: "level-1-lesson-3-check",
    title: "Check!",
    description:
      "Learn what happens when your King is under attack — and how to escape.",
    level: 1,
    xpReward: 20,
    tasks: [
      {
        id: "check-1",
        kind: "move-piece",
        prompt: "Your King is in check from the Rook! Move the King to f2 to escape.",
        initialFen: "4r3/8/8/8/8/8/8/4K3 w - - 0 1", // Rook on e8 checking King on e1
        expectedMove: { from: "e1", to: "f2" },
        messages: {
          success: "Phew! The King escaped the Rook's attack.",
          failure: "Your King is in danger! Move him to f2 to get out of the Rook's line of fire.",
          hint: "The Rook attacks the whole e-file. Step diagonally to f2.",
        },
      },
      {
        id: "check-2",
        kind: "move-piece",
        prompt: "The Queen is attacking your King. Block the check by moving your Rook to e1.",
        initialFen: "4q3/8/8/8/8/8/8/3R1K2 w - - 0 1", // Queen on e8, Rook on d1, King on f1
        expectedMove: { from: "d1", to: "e1" },
        messages: {
          success: "Great defense! The Rook acts as a shield for the King.",
          failure: "The King can't escape. Use your Rook to block the Queen's path on e1.",
          hint: "Move the Rook from d1 to e1 to intercept the attack.",
        },
      },
      {
        id: "check-3",
        kind: "move-piece",
        prompt: "The black Knight is checking your King. Don't run — capture it with your Pawn!",
        initialFen: "8/8/8/8/3n4/4P3/8/4K3 w - - 0 1", // Knight on d4 checking King on e1
        expectedMove: { from: "e3", to: "d4" },
        messages: {
          success: "Best defense is a good offense! You removed the threat completely.",
          failure: "Your pawn on e3 can capture the Knight on d4. Take it!",
          hint: "Pawns capture diagonally. Take that Knight!",
        },
      },
    ],
  },
  // ----------------------------------------
  // Lesson 10: Checkmate (winning the game)
  // ----------------------------------------
  {
    slug: "level-1-lesson-4-checkmate",
    title: "Checkmate!",
    description:
      "Learn how to deliver checkmate — the King is in check with no escape.",
    level: 1,
    xpReward: 25,
    tasks: [
      {
        id: "mate-1",
        kind: "move-piece",
        prompt: "The black King is trapped behind his pawns. Move your Rook to c8 for checkmate!",
        initialFen: "6k1/5ppp/8/8/8/8/8/2R3K1 w - - 0 1", // Back rank mate setup
        expectedMove: { from: "c1", to: "c8" },
        messages: {
          success: "Checkmate! The King is trapped on the back rank with nowhere to run.",
          failure: "Look for a move that attacks the King on the back row. Try Rook to c8.",
          hint: "Move the Rook all the way up to c8. The King is trapped!",
        },
      },
      {
        id: "mate-2",
        kind: "move-piece",
        prompt: "Scholar's Mate! Move your Queen to f7 — the Bishop protects her.",
        initialFen: "r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 1",
        expectedMove: { from: "h5", to: "f7" },
        messages: {
          success: "Checkmate! The King can't take the Queen because she's protected by the Bishop.",
          failure: "Target the weak f7 square with your Queen. The Bishop on c4 protects her.",
          hint: "Move the Queen to f7. Game over!",
        },
      },
      {
        id: "mate-3",
        kind: "move-piece",
        prompt: "Ladder Mate! Your Rooks work together. Move the bottom Rook to b8 for checkmate.",
        initialFen: "7k/R7/8/8/8/8/8/1R5K w - - 0 1", // Rook on a7 cuts off 7th, Rook on b1
        expectedMove: { from: "b1", to: "b8" },
        messages: {
          success: "Checkmate! The Rooks worked like a ladder to trap the King.",
          failure: "The Rook on a7 blocks the escape. Use the other Rook to deliver mate on b8.",
          hint: "Move the Rook from b1 all the way to b8. The King has no escape!",
        },
      },
    ],
  },
];

// ============================================
// PUZZLES - Active Recall / Practice Mode
// ============================================

export const PUZZLES: Lesson[] = [
  // ----------------------------------------
  // Puzzle Set 1: Mate in One
  // ----------------------------------------
  {
    slug: "puzzle-set-1-mate-in-one",
    title: "Practice: Mate in One",
    description:
      "Find the checkmate in one move. Test your pattern recognition!",
    level: 2, // Puzzles are "Level 2" in progression
    xpReward: 30,
    tasks: [
      {
        id: "puzzle-1-back-rank",
        kind: "move-piece",
        prompt: "White to move. Find the checkmate!",
        initialFen: "6k1/5ppp/8/8/8/8/2Q5/4K3 w - - 0 1", // Queen can deliver back rank mate
        expectedMove: { from: "c2", to: "c8" },
        messages: {
          success: "Checkmate! The King is trapped behind his own pawns.",
          failure: "Not quite. Look for a move that attacks the King on the back row.",
          hint: "Move the Queen to the 8th rank where the King can't escape.",
        },
      },
      {
        id: "puzzle-2-queen-kiss",
        kind: "move-piece",
        prompt: "White to move. The Queen delivers the 'kiss of death'!",
        initialFen: "7k/7p/7K/6Q1/8/8/8/8 w - - 0 1", // King on h6 supports Queen mate on g7
        expectedMove: { from: "g5", to: "g7" },
        messages: {
          success: "Checkmate! The King protects the Queen, so Black can't capture.",
          failure: "The King on h6 supports the Queen. Look for a protected checkmate.",
          hint: "Move the Queen right next to the Black King on g7.",
        },
      },
      {
        id: "puzzle-3-rook-corner",
        kind: "move-piece",
        prompt: "White to move. Trap the King in the corner!",
        initialFen: "k7/8/2K5/1R6/8/8/8/8 w - - 0 1", // King c6, Rook b5, Black King a8
        expectedMove: { from: "b5", to: "b8" },
        messages: {
          success: "Checkmate! The King is stuck in the corner with nowhere to go.",
          failure: "The Black King is almost trapped. Deliver the final blow!",
          hint: "Move the Rook to b8. The King has no escape squares.",
        },
      },
      {
        id: "puzzle-4-queen-corner",
        kind: "move-piece",
        prompt: "White to move. The Queen finishes the job!",
        initialFen: "k7/2Q5/1K6/8/8/8/8/8 w - - 0 1", // Queen c7, King b6, Black King a8
        expectedMove: { from: "c7", to: "a7" },
        messages: {
          success: "Checkmate! The Queen covers all escape squares.",
          failure: "The King is almost trapped. Find the square that delivers mate.",
          hint: "Move the Queen to a7. The Black King can't escape!",
        },
      },
      {
        id: "puzzle-5-knight-smother",
        kind: "move-piece",
        prompt: "White to move. A smothered mate! The Knight delivers checkmate.",
        initialFen: "6rk/5Npp/8/8/8/8/8/4K3 w - - 0 1", // Knight f7, can go to h6 for mate
        expectedMove: { from: "f7", to: "h6" },
        messages: {
          success: "Smothered Mate! The Knight checkmates because the King is blocked by his own pieces!",
          failure: "Knights can deliver checkmate in tight spaces. Look for the L-shape.",
          hint: "The Knight hops to h6. The Black King is smothered by his own Rook and pawns!",
        },
      },
    ],
  },
];

// ============================================
// LEVEL 2 LESSONS - The Edge Cases
// ============================================

export const LEVEL_2_LESSONS: Lesson[] = [
  // ----------------------------------------
  // Lesson 11: En Passant
  // ----------------------------------------
  {
    slug: "level-2-lesson-1-en-passant",
    title: "En Passant",
    description:
      "A special pawn capture that only happens right after an enemy pawn moves two squares forward. It's French for 'in passing'.",
    level: 3, // Level 3 in progression (after puzzles)
    xpReward: 25,
    tasks: [
      {
        id: "en-passant-1",
        kind: "move-piece",
        prompt: "Your pawn is on e5. Black just moved their pawn two squares to d5, landing right next to you! Capture it 'en passant' by moving to d6.",
        initialFen: "8/8/8/3pP3/8/8/8/4K2k w - d6 0 1", // White pawn e5, Black pawn d5 (just moved). En passant target d6.
        expectedMove: { from: "e5", to: "d6" },
        messages: {
          success: "Magnifique! That's En Passant. You captured the pawn as if it had only moved one square.",
          failure: "Capture the black pawn by moving diagonally to d6 (the empty square behind it).",
          hint: "Move your pawn to the empty square d6. The black pawn disappears!",
        },
      },
      {
        id: "en-passant-2",
        kind: "move-piece",
        prompt: "Another en passant opportunity! Black's pawn just jumped to f5. Capture it!",
        initialFen: "8/8/8/4Pp2/8/8/8/4K2k w - f6 0 1", // White pawn e5, Black pawn f5 (just moved). Target f6.
        expectedMove: { from: "e5", to: "f6" },
        messages: {
          success: "Correct! Remember: you can only capture en passant on the very next turn, or the opportunity is lost forever.",
          failure: "Capture the black pawn by moving diagonally to f6.",
          hint: "Diagonally forward to f6. Take that pawn!",
        },
      },
      {
        id: "en-passant-3",
        kind: "move-piece",
        prompt: "Final en passant practice. Black's c-pawn just moved to c5. Capture it!",
        initialFen: "8/8/8/2pP4/8/8/8/4K2k w - c6 0 1", // White pawn d5, Black pawn c5 (just moved). Target c6.
        expectedMove: { from: "d5", to: "c6" },
        messages: {
          success: "You've mastered en passant! This special capture keeps the game interesting.",
          failure: "The black pawn on c5 can be captured en passant. Move to c6.",
          hint: "Move your pawn from d5 to c6 to capture en passant.",
        },
      },
    ],
  },
  // ----------------------------------------
  // Lesson 12: Stalemate
  // ----------------------------------------
  {
    slug: "level-2-lesson-2-stalemate",
    title: "Stalemate (The Draw!)",
    description:
      "If the enemy King is NOT in check but has no legal moves left, the game ends in a Draw. Be careful not to trap them by accident!",
    level: 3,
    xpReward: 25,
    tasks: [
      {
        id: "stalemate-1",
        kind: "move-piece",
        prompt: "White to move. If you move your Queen to b6, the Black King will be trapped but NOT in check. Try it to see Stalemate!",
        initialFen: "k7/8/2K5/8/8/8/1Q6/8 w - - 0 1", // Black King a8, White King c6, White Queen b2
        expectedMove: { from: "b2", to: "b6" },
        messages: {
          success: "It's a draw! The Black King isn't in check, but has nowhere to go. This is Stalemate — you should have won, but it's only a draw!",
          failure: "Try moving the Queen to b6 to see what happens.",
          hint: "Move the Queen to b6. Watch what happens to the Black King.",
        },
      },
      {
        id: "stalemate-2",
        kind: "move-piece",
        prompt: "Same position. This time, deliver Checkmate instead of Stalemate! Move the Queen to b7.",
        initialFen: "k7/8/2K5/8/8/8/1Q6/8 w - - 0 1", // Same setup
        expectedMove: { from: "b2", to: "b7" },
        messages: {
          success: "Checkmate! The King IS attacked AND has nowhere to go. That's a win, not a draw!",
          failure: "Move the Queen to b7 for checkmate, not stalemate.",
          hint: "Move the Queen to b7. The Black King is attacked with no escape!",
        },
      },
      {
        id: "stalemate-3",
        kind: "move-piece",
        prompt: "Be careful! The Black King looks trapped. Find the Checkmate move — don't stalemate! (Queen to h7)",
        initialFen: "7k/8/6K1/8/8/8/8/7Q w - - 0 1", // Black King h8, White King g6, White Queen h1
        expectedMove: { from: "h1", to: "h7" },
        messages: {
          success: "Checkmate! The Queen attacks the King, and the White King covers the escape squares.",
          failure: "Find the checkmate. The Queen needs to attack the King directly.",
          hint: "Move the Queen to h7. The King is attacked and can't escape!",
        },
      },
    ],
  },
];

// Combined lessons array for all levels (includes puzzles and Level 2)
export const allLessons: Lesson[] = [...lessons, ...LEVEL_1_LESSONS, ...PUZZLES, ...LEVEL_2_LESSONS];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a lesson by its URL slug
 */
export function getLessonBySlug(slug: string): Lesson | null {
  return allLessons.find((lesson) => lesson.slug === slug) ?? null;
}

/**
 * Get the first task of a lesson
 */
export function getFirstTask(lesson: Lesson): LessonTask {
  return lesson.tasks[0];
}

/**
 * Get a task by index, or null if out of bounds
 */
export function getTaskByIndex(lesson: Lesson, index: number): LessonTask | null {
  if (index < 0 || index >= lesson.tasks.length) return null;
  return lesson.tasks[index];
}

/**
 * Check if a task index is the last task in a lesson
 */
export function isLastTask(lesson: Lesson, index: number): boolean {
  return index === lesson.tasks.length - 1;
}

/**
 * Get all Level 0 lessons (convenience export)
 */
export function getLevel0Lessons(): Lesson[] {
  return allLessons.filter((lesson) => lesson.level === 0);
}

/**
 * Get all Level 1 lessons (convenience export)
 */
export function getLevel1Lessons(): Lesson[] {
  return allLessons.filter((lesson) => lesson.level === 1);
}

/**
 * Get all puzzles (Practice Mode - Level 2 in data)
 */
export function getPuzzles(): Lesson[] {
  return allLessons.filter((lesson) => lesson.level === 2);
}

/**
 * Get all Level 2 lessons - Edge Cases (Level 3 in data)
 */
export function getLevel2Lessons(): Lesson[] {
  return allLessons.filter((lesson) => lesson.level === 3);
}

/**
 * Get a lesson by its index in the allLessons array
 */
export function getLessonByIndex(index: number): Lesson | null {
  if (index < 0 || index >= allLessons.length) return null;
  return allLessons[index];
}

/**
 * Get the index of a lesson by slug
 */
export function getLessonIndex(slug: string): number {
  return allLessons.findIndex((lesson) => lesson.slug === slug);
}

/**
 * Get the previous lesson (for locking logic)
 */
export function getPreviousLesson(slug: string): Lesson | null {
  const index = getLessonIndex(slug);
  if (index <= 0) return null;
  return allLessons[index - 1];
}

/**
 * Get the next lesson (for navigation)
 */
export function getNextLesson(slug: string): Lesson | null {
  const index = getLessonIndex(slug);
  if (index < 0 || index >= allLessons.length - 1) return null;
  return allLessons[index + 1];
}
