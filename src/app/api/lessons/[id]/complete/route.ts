import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LessonStatus } from "@prisma/client";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/lessons/[id]/complete
 * Mark a lesson as completed, award XP, and unlock the next lesson
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: lessonId } = await params;
    const userId = session.user.id;

    // Get the lesson
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Check if already completed
    const existingProgress = await db.userLessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    if (existingProgress?.status === LessonStatus.COMPLETED) {
      // Already completed, don't award XP again
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        xpAwarded: 0,
      });
    }

    // Mark lesson as completed
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

    return NextResponse.json({
      success: true,
      xpAwarded: lesson.xpReward,
      nextLessonUnlocked: nextLesson?.slug || null,
    });
  } catch (error) {
    console.error("Lesson completion error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
