/**
 * Lesson Progress & XP Management
 * 
 * Handles completion tracking and XP awards with transaction-safe operations.
 * XP is awarded only once per user per lesson (first completion).
 */

import { db } from "@/lib/db";
import { getLessonBySlug } from "@/lib/lessons";
import { calculateLevelFromXp, getXpForContentSlug, getContentTypeFromSlug, type ContentType } from "@/lib/gamification";
import { logLessonCompleted, logLevelUp } from "@/lib/telemetry";

// ============================================
// TYPES
// ============================================

export type CompleteLessonArgs = {
  userId: string;
  lessonSlug: string;
};

// Content type labels for UI display
const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  intro: "Intro Lesson",
  core: "Core Lesson",
  puzzle: "Puzzle Set",
  bonus: "Bonus",
};

export type CompleteLessonResult = {
  lessonSlug: string;
  xpAwarded: number;
  totalXp: number;
  previousXp: number;
  alreadyCompleted: boolean;
  leveledUp: boolean;
  newLevel: number;
  contentTypeLabel: string; // e.g., "Core Lesson"
};

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Complete a lesson and award XP (once only per user/lesson).
 * 
 * Uses a transaction to ensure:
 * - No duplicate progress records
 * - No double XP awards
 * - Atomic read-update operations
 */
export async function completeLessonAndAwardXp({
  userId,
  lessonSlug,
}: CompleteLessonArgs): Promise<CompleteLessonResult> {
  // Get lesson from static data (source of truth for Level 0)
  const lesson = getLessonBySlug(lessonSlug);

  if (!lesson) {
    throw new Error(`Unknown lesson slug: ${lessonSlug}`);
  }

  // Use config for XP (can differ from hardcoded lesson.xpReward)
  const xpReward = getXpForContentSlug(lessonSlug);
  const contentType = getContentTypeFromSlug(lessonSlug);
  const contentTypeLabel = CONTENT_TYPE_LABELS[contentType];

  // Single transaction to avoid race conditions and double XP
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return await db.$transaction(async (tx: any) => {
    // Check if user has already completed this lesson
    const existing = await tx.userLessonProgress.findUnique({
      where: {
        userId_lessonSlug: { userId, lessonSlug },
      },
    });

    if (existing) {
      // Already completed - return current XP without awarding more
      const user = await tx.user.findUniqueOrThrow({
        where: { id: userId },
        select: { xp: true },
      });

      const currentLevel = calculateLevelFromXp(user.xp);
      return {
        lessonSlug,
        xpAwarded: 0,
        totalXp: user.xp,
        previousXp: user.xp,
        alreadyCompleted: true,
        leveledUp: false,
        newLevel: currentLevel,
        contentTypeLabel,
      };
    }

    // Get current XP before awarding
    const userBefore = await tx.user.findUniqueOrThrow({
      where: { id: userId },
      select: { xp: true },
    });
    const previousXp = userBefore.xp;
    const previousLevel = calculateLevelFromXp(previousXp);

    // First-time completion → create progress record, award XP
    await tx.userLessonProgress.create({
      data: { userId, lessonSlug },
    });

    const user = await tx.user.update({
      where: { id: userId },
      data: { xp: { increment: xpReward } },
      select: { xp: true },
    });

    const newLevel = calculateLevelFromXp(user.xp);
    const leveledUp = newLevel > previousLevel;

    // Log telemetry events (async, fire-and-forget)
    logLessonCompleted({
      userId,
      lessonSlug,
      lessonTitle: lesson.title,
      lessonLevel: lesson.level,
      xpAwarded: xpReward,
      totalXp: user.xp,
      alreadyCompleted: false,
    });

    if (leveledUp) {
      logLevelUp({
        userId,
        newLevel,
        totalXp: user.xp,
      });
    }

    return {
      lessonSlug,
      xpAwarded: xpReward,
      totalXp: user.xp,
      previousXp,
      alreadyCompleted: false,
      leveledUp,
      newLevel,
      contentTypeLabel,
    };
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get all completed lesson slugs for a user
 */
export async function getCompletedLessonSlugs(userId: string): Promise<string[]> {
  const progress = await db.userLessonProgress.findMany({
    where: { userId },
    select: { lessonSlug: true },
  });

  return progress.map((p: { lessonSlug: string }) => p.lessonSlug);
}

/**
 * Check if a specific lesson is completed by a user
 */
export async function isLessonCompleted(
  userId: string,
  lessonSlug: string
): Promise<boolean> {
  const progress = await db.userLessonProgress.findUnique({
    where: {
      userId_lessonSlug: { userId, lessonSlug },
    },
  });

  return progress !== null;
}

/**
 * Get user's total XP
 */
export async function getUserXp(userId: string): Promise<number> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { xp: true },
  });

  return user?.xp ?? 0;
}

/**
 * Check if user has given feedback (for XP Bounty display)
 */
export async function hasUserGivenFeedback(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { feedbackGiven: true },
  });

  return user?.feedbackGiven ?? false;
}
