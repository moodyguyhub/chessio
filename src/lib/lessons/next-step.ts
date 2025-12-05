/**
 * Next Best Step Logic
 *
 * Determines the best next lesson/action for a user based on their progress.
 * Used on completion screens and dashboard to guide users.
 */

import { allLessons, type Lesson, getLevel0Lessons, getLevel1Lessons, getPuzzles, getLevel2Lessons } from "@/lib/lessons";

export type NextStepType = "lesson" | "level-complete" | "all-complete" | "review";

export interface NextStep {
  type: NextStepType;
  lesson?: Lesson;
  message: string;
  cta: string;
  href: string;
  levelJustCompleted?: number;
}

/**
 * Get the next best step for a user based on their completed lessons.
 *
 * Strategy:
 * 1. If there's an incomplete lesson in the current level, suggest it
 * 2. If current level is complete, celebrate and suggest next level
 * 3. If all lessons complete, suggest review/practice
 */
export function getNextBestStep(
  completedSlugs: string[],
  currentLessonSlug?: string
): NextStep {
  const completedSet = new Set(completedSlugs);
  
  // Get lessons by level
  const level0 = getLevel0Lessons();
  const level1 = getLevel1Lessons();
  const puzzles = getPuzzles();
  const level2 = getLevel2Lessons();

  // Calculate completion per level
  const level0Complete = level0.every((l) => completedSet.has(l.slug));
  const level1Complete = level1.every((l) => completedSet.has(l.slug));
  const puzzlesComplete = puzzles.every((l) => completedSet.has(l.slug));
  const level2Complete = level2.every((l) => completedSet.has(l.slug));

  // Find first incomplete lesson in each level
  const nextInLevel0 = level0.find((l) => !completedSet.has(l.slug));
  const nextInLevel1 = level1.find((l) => !completedSet.has(l.slug));
  const nextInPuzzles = puzzles.find((l) => !completedSet.has(l.slug));
  const nextInLevel2 = level2.find((l) => !completedSet.has(l.slug));

  // Determine current lesson's level context
  const currentLesson = currentLessonSlug
    ? allLessons.find((l) => l.slug === currentLessonSlug)
    : null;
  const currentLevel = currentLesson?.level ?? 0;

  // Check if we just completed a level
  if (currentLesson && completedSet.has(currentLesson.slug)) {
    // Did we just complete Level 0?
    if (currentLevel === 0 && level0Complete && !level1Complete && nextInLevel1) {
      return {
        type: "level-complete",
        lesson: nextInLevel1,
        message: "🎊 You've mastered the basics! Ready for the next challenge?",
        cta: `Start Level 1 → ${nextInLevel1.title}`,
        href: `/lessons/${nextInLevel1.slug}`,
        levelJustCompleted: 0,
      };
    }

    // Did we just complete Level 1?
    if (currentLevel === 1 && level1Complete && !puzzlesComplete && nextInPuzzles) {
      return {
        type: "level-complete",
        lesson: nextInPuzzles,
        message: "🧩 Great progress! Try some practice puzzles.",
        cta: `Start Puzzles → ${nextInPuzzles.title}`,
        href: `/lessons/${nextInPuzzles.slug}`,
        levelJustCompleted: 1,
      };
    }

    // Did we just complete puzzles?
    // Puzzles are level 2 in the data model
    if (currentLesson.level === 2 && puzzlesComplete && !level2Complete && nextInLevel2) {
      return {
        type: "level-complete",
        lesson: nextInLevel2,
        message: "🚀 You're on fire! Ready for advanced concepts?",
        cta: `Start Level 2 → ${nextInLevel2.title}`,
        href: `/lessons/${nextInLevel2.slug}`,
        levelJustCompleted: -1, // Puzzles don't have a display level number
      };
    }
  }

  // Default: Find the next available lesson in order
  if (nextInLevel0) {
    return {
      type: "lesson",
      lesson: nextInLevel0,
      message: "Continue your journey",
      cta: `Continue → ${nextInLevel0.title}`,
      href: `/lessons/${nextInLevel0.slug}`,
    };
  }

  if (nextInLevel1) {
    return {
      type: "lesson",
      lesson: nextInLevel1,
      message: "Continue Level 1",
      cta: `Continue → ${nextInLevel1.title}`,
      href: `/lessons/${nextInLevel1.slug}`,
    };
  }

  if (nextInPuzzles) {
    return {
      type: "lesson",
      lesson: nextInPuzzles,
      message: "Practice time",
      cta: `Continue → ${nextInPuzzles.title}`,
      href: `/lessons/${nextInPuzzles.slug}`,
    };
  }

  if (nextInLevel2) {
    return {
      type: "lesson",
      lesson: nextInLevel2,
      message: "Continue Level 2",
      cta: `Continue → ${nextInLevel2.title}`,
      href: `/lessons/${nextInLevel2.slug}`,
    };
  }

  // All lessons complete!
  if (level0Complete && level1Complete && puzzlesComplete && level2Complete) {
    return {
      type: "all-complete",
      message: "🎉 You've completed all lessons! Amazing work!",
      cta: "Review Lessons",
      href: "/app",
    };
  }

  // Fallback - shouldn't reach here
  return {
    type: "review",
    message: "Keep practicing!",
    cta: "Back to Dashboard",
    href: "/app",
  };
}

/**
 * Get a quick summary of what the user should do next (for dashboard hero)
 */
export function getDashboardNextAction(completedSlugs: string[]): {
  title: string;
  description: string;
  lesson?: Lesson;
  href: string;
} {
  const nextStep = getNextBestStep(completedSlugs);

  if (nextStep.type === "all-complete") {
    return {
      title: "All Caught Up! 🏆",
      description: "You've completed all available lessons. More coming soon!",
      href: "/app",
    };
  }

  if (nextStep.lesson) {
    return {
      title: "Continue Learning",
      description: `Next up: ${nextStep.lesson.title}`,
      lesson: nextStep.lesson,
      href: nextStep.href,
    };
  }

  return {
    title: "Keep Learning",
    description: "Check out the lessons below",
    href: "/app",
  };
}
