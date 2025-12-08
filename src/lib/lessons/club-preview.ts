/**
 * Club Preview Puzzle - A single harder puzzle to preview Club difficulty
 * 
 * This is a tactical puzzle (fork) that's harder than School content.
 * Used after Level 3 graduation to give players a taste of Club-level content.
 */

import type { Lesson } from "@/lib/lessons";

/**
 * Get the Club preview puzzle
 * 
 * Theme: Knight fork - win the Queen
 * Difficulty: Harder than School, requires seeing 2 moves ahead
 */
export function getClubPreviewPuzzle(): Lesson {
  return {
    slug: "club-preview-knight-fork",
    title: "Club Preview: Knight Fork",
    description:
      "Your first taste of Club-level tactics. Can you find the winning move?",
    level: 4, // Club tier, but special preview
    xpReward: 0, // No XP for preview
    tasks: [
      {
        id: "club-preview-1",
        kind: "move-piece",
        prompt: "White to move. Find the move that wins Black's Queen!",
        initialFen: "r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4",
        // Solution: Nxe5 attacks both king and queen (royal fork)
        expectedMove: { from: "f3", to: "e5" },
        messages: {
          success: "Perfect! Nxe5 is a royal fork—attacking both King and Queen. The Queen is lost. This is Club-level thinking!",
          failure: "Not quite. Look for a move that attacks BOTH the King and the Queen at the same time.",
          hint: "Knights are great at forking. Can your Knight jump to a square that checks the King AND attacks the Queen?",
        },
      },
    ],
  };
}

/**
 * Check if a lesson is the club preview puzzle
 */
export function isClubPreviewPuzzle(slug: string): boolean {
  return slug === "club-preview-knight-fork";
}
