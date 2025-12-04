// Data structure for Level 0 Lessons
// TODO (Phase 2+): Migrate to DB-driven lessons or generate this file from admin tooling.

// ============================================
// TASK TYPES - Discriminated Union
// ============================================

export type TaskKind = "select-square" | "move-piece";

type BaseTask = {
  id: string;
  kind: TaskKind;
  prompt: string; // Copy shown to the user ("Click on e4")
  initialFen: string; // Board position before any interaction
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
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get a lesson by its URL slug
 */
export function getLessonBySlug(slug: string): Lesson | null {
  return lessons.find((lesson) => lesson.slug === slug) ?? null;
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
