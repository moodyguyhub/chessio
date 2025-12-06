"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import {
  completeLessonAndAwardXp,
  getCompletedLessonSlugs,
  type CompleteLessonResult,
} from "@/lib/lessons/progress";
import { getNextBestStep, type NextStep } from "@/lib/lessons/next-step";

export type CompleteLessonActionResult = CompleteLessonResult & {
  nextStep: NextStep;
};

/**
 * Server action to complete a lesson and award XP.
 * 
 * Called from LessonPlayer when the user finishes the last task.
 * Returns XP info for UI feedback plus next step recommendation.
 */
export async function completeLessonAction(
  lessonSlug: string
): Promise<CompleteLessonActionResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Complete lesson and award XP
  const result = await completeLessonAndAwardXp({
    userId: session.user.id,
    lessonSlug,
  });

  // Get all completed lessons (including the one just completed)
  const completedSlugs = await getCompletedLessonSlugs(session.user.id);

  // Compute next best step
  const nextStep = getNextBestStep(completedSlugs, lessonSlug);

  // Revalidate dashboard cache so Today's Goal updates (Sprint 04)
  revalidatePath("/(protected)/app", "page");

  return {
    ...result,
    nextStep,
  };
}
