"use server";

import { auth } from "@/lib/auth";
import {
  completeLessonAndAwardXp,
  type CompleteLessonResult,
} from "@/lib/lessons/progress";

/**
 * Server action to complete a lesson and award XP.
 * 
 * Called from LessonPlayerNew when the user finishes the last task.
 * Returns XP info for UI feedback.
 */
export async function completeLessonAction(
  lessonSlug: string
): Promise<CompleteLessonResult> {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  return await completeLessonAndAwardXp({
    userId: session.user.id,
    lessonSlug,
  });
}
