/**
 * Lesson types for Level 0 MVP
 * These match the Prisma schema for Task model
 */

export interface Task {
  id: number;
  lessonId: string;
  index: number;
  instruction: string;
  startingFen: string;
  goalType: "move" | "capture" | "select";
  targetSquare: string;
  startSquare: string | null;
  validMoves: string; // JSON array
  successMessage: string;
  failureDefault: string;
  failureSpecific: string | null; // JSON map
  hintMessage: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  order: number;
  pieceType: string;
  introText: string;
  xpReward: number;
  tasks: Task[];
}

export type LessonStatus = "LOCKED" | "AVAILABLE" | "COMPLETED";

export interface UserLessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  status: LessonStatus;
  hintsUsed: number;
}
