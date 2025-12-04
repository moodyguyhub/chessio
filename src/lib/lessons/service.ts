import { db } from "@/lib/db";
import { LessonStatus } from "@prisma/client";

/**
 * Lesson service - handles lesson-related database operations
 * Simplified for Level 0 MVP
 */
export const lessonService = {
  /**
   * Get all lessons in order
   */
  async getAll() {
    return db.lesson.findMany({
      orderBy: { order: "asc" },
      include: { tasks: { orderBy: { index: "asc" } } },
    });
  },

  /**
   * Get a single lesson by slug with tasks
   */
  async getBySlug(slug: string) {
    return db.lesson.findUnique({
      where: { slug },
      include: { tasks: { orderBy: { index: "asc" } } },
    });
  },

  /**
   * Get user's progress for a specific lesson
   */
  async getUserProgress(userId: string, lessonId: string) {
    return db.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });
  },

  /**
   * Get all lessons with user progress
   */
  async getLessonsWithProgress(userId: string) {
    return db.lesson.findMany({
      orderBy: { order: "asc" },
      include: {
        userProgress: {
          where: { userId },
        },
      },
    });
  },

  /**
   * Complete a lesson and award XP
   */
  async completeLesson(userId: string, lessonId: string) {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) throw new Error("Lesson not found");

    // Mark as completed
    await db.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        status: LessonStatus.COMPLETED,
      },
      update: {
        status: LessonStatus.COMPLETED,
      },
    });

    // Award XP
    await db.user.update({
      where: { id: userId },
      data: { xp: { increment: lesson.xpReward } },
    });

    // Unlock next lesson
    const nextLesson = await db.lesson.findFirst({
      where: { order: lesson.order + 1 },
    });

    if (nextLesson) {
      await db.userLessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId: nextLesson.id } },
        create: {
          userId,
          lessonId: nextLesson.id,
          status: LessonStatus.AVAILABLE,
        },
        update: {
          status: LessonStatus.AVAILABLE,
        },
      });
    }

    return lesson.xpReward;
  },

  /**
   * Increment hints used for a lesson
   */
  async incrementHintsUsed(userId: string, lessonId: string) {
    await db.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        hintsUsed: 1,
      },
      update: {
        hintsUsed: { increment: 1 },
      },
    });
  },
};
