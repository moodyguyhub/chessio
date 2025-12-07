import fs from "node:fs/promises";
import path from "node:path";
import { PlacementExam } from "./types";

/**
 * Server-side: Load placement exam from JSON file
 */
export async function getPlacementExam(): Promise<PlacementExam> {
  const filePath = path.join(process.cwd(), "data", "chessio", "placement", "exam.json");
  const raw = await fs.readFile(filePath, "utf8");
  const json = JSON.parse(raw);

  return {
    title: json.title,
    description: json.description,
    passingScore: json.passing_score,
    puzzles: json.puzzles.map((p: any) => ({
      id: p.id,
      category: p.category,
      title: p.title,
      question: p.question,
      fen: p.fen,
      coachHint: p.coach_hint,
      correctUci: p.correct_uci,
      failStates: p.fail_states.map((f: any) => ({
        wrongUci: f.wrong_uci,
        message: f.message,
      })),
    })),
  };
}
