/**
 * XP calculation and awarding functions
 * Uses centralized config from ./config.ts
 */

import { db } from "@/lib/db";
import {
  calculateLevelFromXp,
  getXpProgress,
  XP_PER_LEVEL,
  MAX_LEVEL,
  type XpStats,
} from "./config";

// Re-export for backwards compatibility
export { calculateLevelFromXp, getXpProgress, XP_PER_LEVEL, MAX_LEVEL };
export type { XpStats };

/**
 * Get user's current XP and level stats
 */
export async function getUserXpStats(userId: string): Promise<XpStats> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { xp: true },
  });

  const totalXp = user?.xp ?? 0;
  return getXpProgress(totalXp);
}

/**
 * Award XP to a user
 * Returns the updated XP stats including any level-up info
 */
export async function awardXp(
  userId: string,
  amount: number
): Promise<{
  previousStats: XpStats;
  newStats: XpStats;
  leveledUp: boolean;
}> {
  // Get current stats
  const previousStats = await getUserXpStats(userId);

  // Award XP
  const updatedUser = await db.user.update({
    where: { id: userId },
    data: { xp: { increment: amount } },
    select: { xp: true },
  });

  const newStats = getXpProgress(updatedUser.xp);
  const leveledUp = newStats.level > previousStats.level;

  return { previousStats, newStats, leveledUp };
}

/**
 * Calculate XP breakdown for lesson completion
 * Returns the amount of XP earned for completing a lesson
 */
export function calculateLessonXp(
  lessonXpReward: number,
  _hintsUsed: number = 0,
  _mistakesMade: number = 0
): {
  baseXp: number;
  bonusXp: number;
  totalXp: number;
  breakdown: { label: string; amount: number }[];
} {
  // For now, simple implementation - just return lesson XP
  // Future: Add hint penalties, mistake penalties, time bonuses, etc.
  const baseXp = lessonXpReward;
  const bonusXp = 0;
  const totalXp = baseXp + bonusXp;

  const breakdown = [{ label: "Lesson Complete", amount: baseXp }];

  // Future breakdown items:
  // if (hintsUsed === 0) breakdown.push({ label: "No Hints Bonus", amount: 5 });
  // if (mistakesMade === 0) breakdown.push({ label: "Perfect Run", amount: 5 });

  return { baseXp, bonusXp, totalXp, breakdown };
}

/**
 * @deprecated Use calculateLevelFromXp from config.ts
 */
export function calculateLevel(xp: number): number {
  return calculateLevelFromXp(xp);
}

/**
 * @deprecated Use getXpProgress from config.ts
 */
export function getLevelProgress(xp: number): {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progress: number;
} {
  const stats = getXpProgress(xp);
  return {
    level: stats.level,
    currentLevelXp: stats.currentLevelXp,
    xpForNextLevel: stats.xpForNextLevel,
    progress: stats.progressPercent / 100,
  };
}
