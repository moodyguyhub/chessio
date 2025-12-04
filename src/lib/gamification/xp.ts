import { db } from "@/lib/db";

/**
 * XP required for each level.
 * Uses a simple quadratic formula: level^2 * 100
 * Level 1: 100 XP, Level 2: 400 XP, Level 3: 900 XP, etc.
 */
export function xpRequiredForLevel(level: number): number {
  return level * level * 100;
}

/**
 * Calculate total XP required to reach a level from level 1
 */
export function totalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += xpRequiredForLevel(i);
  }
  return total;
}

/**
 * Calculate current level based on total XP
 */
export function calculateLevel(totalXp: number): number {
  let level = 1;
  let xpNeeded = 0;
  
  while (true) {
    xpNeeded += xpRequiredForLevel(level);
    if (totalXp < xpNeeded) {
      return level;
    }
    level++;
    
    // Cap at level 100 to prevent infinite loop
    if (level > 100) return 100;
  }
}

/**
 * Get progress within current level (0-100%)
 */
export function getLevelProgress(totalXp: number): {
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
} {
  const level = calculateLevel(totalXp);
  const xpForPreviousLevels = level > 1 ? totalXpForLevel(level - 1) : 0;
  const currentLevelXp = totalXp - xpForPreviousLevels;
  const xpForNextLevel = xpRequiredForLevel(level);
  const progressPercent = Math.floor((currentLevelXp / xpForNextLevel) * 100);

  return {
    level,
    currentLevelXp,
    xpForNextLevel,
    progressPercent,
  };
}

/**
 * Award XP to a user
 */
export async function awardXp(userId: string, xpAmount: number) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { xp: true },
  });

  if (!user) throw new Error("User not found");

  const newTotalXp = user.xp + xpAmount;
  const previousLevel = calculateLevel(user.xp);
  const newLevel = calculateLevel(newTotalXp);
  const leveledUp = newLevel > previousLevel;

  await db.user.update({
    where: { id: userId },
    data: {
      xp: newTotalXp,
    },
  });

  return {
    previousXp: user.xp,
    newXp: newTotalXp,
    previousLevel,
    newLevel,
    leveledUp,
    xpAwarded: xpAmount,
  };
}

/**
 * Get user's XP stats
 */
export async function getUserXpStats(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { xp: true },
  });

  if (!user) throw new Error("User not found");

  return {
    totalXp: user.xp,
    ...getLevelProgress(user.xp),
  };
}
