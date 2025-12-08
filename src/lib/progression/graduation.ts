/**
 * Progression state management for tier system
 * 
 * Handles checking and updating graduation flags for users.
 */

import { db } from "@/lib/db";
import { MAX_PLAYABLE_LEVEL, getLevelForXp } from "@/lib/gamification";

/**
 * Check if user has completed Level 3 (School)
 */
export async function hasCompletedSchool(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { xp: true },
  });

  if (!user) return false;

  const levelProgress = getLevelForXp(user.xp);
  return levelProgress.level >= MAX_PLAYABLE_LEVEL;
}

/**
 * Get graduation state for user
 */
export async function getGraduationState(userId: string): Promise<{
  hasCompletedSchool: boolean;
  hasSeenGraduation: boolean;
  hasAttemptedPreview: boolean;
}> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      xp: true,
      hasSeenSchoolGraduation: true,
      hasAttemptedClubPreview: true,
    },
  });

  if (!user) {
    return {
      hasCompletedSchool: false,
      hasSeenGraduation: false,
      hasAttemptedPreview: false,
    };
  }

  const levelProgress = getLevelForXp(user.xp);
  const hasCompletedSchool = levelProgress.level >= MAX_PLAYABLE_LEVEL;

  return {
    hasCompletedSchool,
    hasSeenGraduation: user.hasSeenSchoolGraduation,
    hasAttemptedPreview: user.hasAttemptedClubPreview,
  };
}

/**
 * Mark user as having seen school graduation modal
 */
export async function markSchoolGraduationSeen(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { hasSeenSchoolGraduation: true },
  });
}

/**
 * Mark user as having attempted club preview puzzle
 */
export async function markClubPreviewAttempted(userId: string): Promise<void> {
  await db.user.update({
    where: { id: userId },
    data: { hasAttemptedClubPreview: true },
  });
}
