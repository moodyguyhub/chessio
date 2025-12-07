/**
 * @deprecated This service uses the old DB-based lesson model with lessonId.
 * Use the new progress helpers from @/lib/lessons/progress instead:
 * - completeLessonAndAwardXp()
 * - getCompletedLessonSlugs()
 * - isLessonCompleted()
 * - getUserXp()
 * 
 * The new model uses lessonSlug (matching lessons.ts) instead of lessonId.
 */

import { db } from "@/lib/db";

export const lessonService = {
  /**
   * @deprecated Use lessons from @/lib/lessons instead
   */
  async getAll() {
    return db.lesson.findMany({
      orderBy: { order: "asc" },
      include: { Task: { orderBy: { index: "asc" } } },
    });
  },

  /**
   * @deprecated Use getLessonBySlug from @/lib/lessons instead
   */
  async getBySlug(slug: string) {
    return db.lesson.findUnique({
      where: { slug },
      include: { Task: { orderBy: { index: "asc" } } },
    });
  },

  /**
   * @deprecated Use isLessonCompleted from @/lib/lessons/progress instead
   */
  async getUserProgress(userId: string, lessonSlug: string) {
    return db.userLessonProgress.findUnique({
      where: { userId_lessonSlug: { userId, lessonSlug } },
    });
  },

  /**
   * @deprecated Use getCompletedLessonSlugs from @/lib/lessons/progress instead
   */
  async getCompletedLessons(userId: string) {
    return db.userLessonProgress.findMany({
      where: { userId },
      select: { lessonSlug: true },
    });
  },

  /**
   * @deprecated Use completeLessonAndAwardXp from @/lib/lessons/progress instead
   */
  async completeLesson(userId: string, lessonSlug: string) {
    // Import dynamically to avoid circular dependency
    const { completeLessonAndAwardXp } = await import("@/lib/lessons/progress");
    return completeLessonAndAwardXp({ userId, lessonSlug });
  },

  /**
   * Increment hints used for a lesson
   */
  async incrementHintsUsed(userId: string, lessonSlug: string) {
    await db.userLessonProgress.upsert({
      where: { userId_lessonSlug: { userId, lessonSlug } },
      create: {
        userId,
        lessonSlug,
        hintsUsed: 1,
      },
      update: {
        hintsUsed: { increment: 1 },
      },
    });
  },
};
