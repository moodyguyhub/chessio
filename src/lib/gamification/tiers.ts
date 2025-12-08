/**
 * Tier identity and messaging
 * 
 * Defines the three progression tiers in Chessio and their copy.
 * Used for UI consistency across tier-related features.
 */

import type { Tier } from "./config";

export const TIER_COPY = {
  school: {
    name: "Chessio School",
    range: "Levels 0–3",
    tagline: "Learn to Play.",
    description:
      "Master the board, the pieces, and the rules so you can play a legal game without fear.",
  },
  club: {
    name: "Chessio Club",
    range: "Levels 4–9",
    tagline: "Learn to Win.",
    description:
      "Stop giving pieces away. Learn to spot simple tactics, avoid blunders, and punish mistakes.",
  },
  college: {
    name: "Chessio College",
    range: "Levels 10–20",
    tagline: "Master the Game.",
    description:
      "Deepen your understanding with opening ideas, endgames, and real strategy.",
  },
} as const;

export type TierCopy = typeof TIER_COPY;

/**
 * Get tier copy for a given tier.
 */
export function getTierCopy(tier: Tier): TierCopy[Tier] {
  return TIER_COPY[tier];
}
