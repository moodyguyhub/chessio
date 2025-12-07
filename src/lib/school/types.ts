/**
 * School Data Types for Chess Curriculum
 * Defines the structure for lessons, tasks, exams, secret cards, and fail patterns
 */

export type MoveString = string; // UCI format like "d1d8" or SAN

export interface MoveHint {
  move: MoveString;      // wrong move in UCI
  failPatternId: string; // references FailPattern.id
}

export interface LessonTask {
  id: string;
  fen: string;
  prompt: string;
  type: 'move'; // For now, only 'move' tasks
  correctMoves: MoveString[]; // Accepted move(s)
  successMessage?: string; // Coach line on success
  failPatternIds?: string[]; // IDs referencing FailPattern
  failureHints?: MoveHint[]; // Specific wrong moves with tailored feedback
}

export interface Lesson {
  id: string; // "level-1-lesson-1-check"
  level: number; // 1
  order: number; // Order inside the level
  slug: string; // "check-the-warning"
  title: string; // "Check (The Warning)"
  XP: number;
  coachIntro: string; // Short wisdom paragraph
  summary: string; // 1–2 line lesson summary
  tasks: LessonTask[];
  secretCardId?: string; // ID of SecretCard unlocked on completion
}

export interface ExamPuzzle {
  id: string;
  level: number;
  fen: string;
  prompt: string;
  correctMoves: MoveString[];
  coachOnSuccess: string;
  failPatternIds?: string[];
  failureHints?: MoveHint[]; // Specific wrong moves with tailored feedback
}

export interface FailPattern {
  id: string; // "cowards_exit"
  level?: number;
  name: string; // "The Coward's Exit"
  description: string; // Internal description for devs
  coachMessage: string; // What the user sees
}

export interface SecretCard {
  id: string; // "card_cpr"
  title: string; // "The Shield of CPR"
  level: number;
  visualId: string; // Icon / asset key
  text: string; // 1–3 lines of rule text
}
