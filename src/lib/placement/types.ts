export interface PlacementFailState {
  wrongUci: string;
  message: string;
}

export interface PlacementPuzzle {
  id: string;
  category: "Mechanics" | "Tactics" | "Safe Capture" | "Checkmate" | "Endgame";
  title: string;
  question: string;
  fen: string;
  coachHint: string;
  correctUci: string;
  failStates: PlacementFailState[];
}

export interface PlacementExam {
  title: string;
  description: string;
  passingScore: number;
  puzzles: PlacementPuzzle[];
}

export type PlacementResultStatus = "not_taken" | "passed" | "failed";

export interface PlacementResult {
  status: PlacementResultStatus;
  score: number;
  total: number;
  takenAt: string; // ISO
}
