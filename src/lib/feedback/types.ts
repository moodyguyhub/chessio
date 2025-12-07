/**
 * Feedback system types for Chessio
 * Captures lesson, exam, and coach chat interactions
 */

export type FeedbackSource =
  | "lesson"
  | "exam"
  | "coach_chat"
  | "pre_school";

export type FeedbackDifficulty =
  | "too_easy"
  | "just_right"
  | "too_hard";

export type PreSchoolMood = "lost" | "okay" | "love";

export interface FeedbackPayload {
  level?: number;                // undefined for coach_chat without context
  lessonSlug?: string;           // undefined for exam-only feedback
  source: FeedbackSource;
  rating?: number;               // 1–5 for exam/overall ratings
  difficulty?: FeedbackDifficulty;
  mood?: PreSchoolMood;          // for pre_school feedback
  text?: string;
  tags?: string[];               // e.g. ["confusing-instruction", "ui-bug"]
  path?: string;                 // current route
  device?: "mobile" | "desktop" | "unknown";
}

export interface FeedbackStored extends FeedbackPayload {
  id: string;
  createdAt: string;             // ISO timestamp
  userId?: string;               // if auth available
  sessionId?: string;            // from cookie if available
}
