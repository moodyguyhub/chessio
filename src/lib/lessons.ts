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
];

// Combined lessons array for all levels
export const allLessons: Lesson[] = [...lessons, ...LEVEL_1_LESSONS];

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
