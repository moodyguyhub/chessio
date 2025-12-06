/**
 * Today's Goal Logic
 * 
 * Sprint 03: Return Journey & Retention
 * 
 * Provides a single, soft recommendation for what the user should do next.
 * This is a gentler, more contextual version of getNextBestStep.
 */

import { 
  allLessons, 
  getLevel0Lessons, 
  getLevel1Lessons, 
  getPuzzles, 
  getLevel2Lessons,
  type Lesson 
} from "@/lib/lessons";
import { getLevelForXp } from "@/lib/gamification/config";

export type GoalActionType = "lesson" | "puzzle" | "review" | "celebrate";

export interface TodaysGoal {
  title: string;
  description: string;
  action: {
    type: GoalActionType;
    targetSlug?: string;
    label: string;
    href: string;
  };
  progress?: {
    completed: number;
    total: number;
    label: string;
  };
}

interface UserProgressContext {
  completedSlugs: string[];
  totalXp: number;
}

/**
 * Get today's recommended goal for a user based on their progress.
 * 
 * Rules (in priority order):
 * 1. If user hasn't finished Level 0 → finish foundations
 * 2. If user is in Level 1 → continue Level 1
 * 3. If puzzles are available → practice with puzzles
 * 4. If Level 2 content available → tackle advanced topics
 * 5. If everything done → celebrate and review
 */
export function getTodaysGoalForUser(progress: UserProgressContext): TodaysGoal {
  const { completedSlugs, totalXp } = progress;
  const completedSet = new Set(completedSlugs);
  const levelInfo = getLevelForXp(totalXp);

  // Get lessons by category
  const level0 = getLevel0Lessons();
  const level1 = getLevel1Lessons();
  const puzzles = getPuzzles();
  const level2 = getLevel2Lessons();

  // Calculate completion
  const level0Completed = level0.filter(l => completedSet.has(l.slug)).length;
  const level1Completed = level1.filter(l => completedSet.has(l.slug)).length;
  const puzzlesCompleted = puzzles.filter(l => completedSet.has(l.slug)).length;
  const level2Completed = level2.filter(l => completedSet.has(l.slug)).length;

  // Find next lessons in each category
  const nextLevel0 = level0.find(l => !completedSet.has(l.slug));
  const nextLevel1 = level1.find(l => !completedSet.has(l.slug));
  const nextPuzzle = puzzles.find(l => !completedSet.has(l.slug));
  const nextLevel2 = level2.find(l => !completedSet.has(l.slug));

  // Rule 1: Still in Level 0
  if (nextLevel0) {
    return {
      title: "Complete the Foundations",
      description: level0Completed === 0
        ? "Start your chess journey by learning how the pieces move."
        : `You're ${level0Completed} of ${level0.length} lessons into the basics. Keep going!`,
      action: {
        type: "lesson",
        targetSlug: nextLevel0.slug,
        label: `Continue: ${nextLevel0.title}`,
        href: `/lessons/${nextLevel0.slug}`,
      },
      progress: {
        completed: level0Completed,
        total: level0.length,
        label: "Level 0 Progress",
      },
    };
  }

  // Rule 2: Level 0 done, Level 1 available
  if (nextLevel1) {
    return {
      title: "Strengthen Your Fundamentals",
      description: level1Completed === 0
        ? "You've mastered the basics! Time to learn some real chess skills."
        : `Level 1 progress: ${level1Completed}/${level1.length}. You're building solid foundations.`,
      action: {
        type: "lesson",
        targetSlug: nextLevel1.slug,
        label: `Continue: ${nextLevel1.title}`,
        href: `/lessons/${nextLevel1.slug}`,
      },
      progress: {
        completed: level1Completed,
        total: level1.length,
        label: "Level 1 Progress",
      },
    };
  }

  // Rule 3: Lessons done, puzzles available
  if (nextPuzzle) {
    return {
      title: "Practice with Puzzles",
      description: puzzlesCompleted === 0
        ? "Put your skills to the test with tactical puzzles."
        : `${puzzlesCompleted}/${puzzles.length} puzzle packs completed. Keep sharpening your tactics!`,
      action: {
        type: "puzzle",
        targetSlug: nextPuzzle.slug,
        label: `Try: ${nextPuzzle.title}`,
        href: `/lessons/${nextPuzzle.slug}`,
      },
      progress: {
        completed: puzzlesCompleted,
        total: puzzles.length,
        label: "Puzzle Progress",
      },
    };
  }

  // Rule 4: Level 2 content available
  if (nextLevel2) {
    return {
      title: "Explore Advanced Concepts",
      description: level2Completed === 0
        ? "Ready for the next level? Let's tackle some advanced chess ideas."
        : `${level2Completed}/${level2.length} advanced lessons done. You're becoming a real player!`,
      action: {
        type: "lesson",
        targetSlug: nextLevel2.slug,
        label: `Continue: ${nextLevel2.title}`,
        href: `/lessons/${nextLevel2.slug}`,
      },
      progress: {
        completed: level2Completed,
        total: level2.length,
        label: "Level 2 Progress",
      },
    };
  }

  // Rule 5: Everything completed!
  const totalCompleted = completedSlugs.length;
  const totalLessons = allLessons.length;

  return {
    title: "You've Completed Everything! 🎉",
    description: `Amazing! You've finished all ${totalLessons} lessons and puzzles. You're now a ${levelInfo.label}!`,
    action: {
      type: "celebrate",
      label: "Review Your Journey",
      href: "/app",
    },
    progress: {
      completed: totalCompleted,
      total: totalLessons,
      label: "Total Progress",
    },
  };
}

/**
 * Get a simple summary of overall progress for the dashboard.
 */
export function getProgressSummary(completedSlugs: string[]): {
  totalCompleted: number;
  totalAvailable: number;
  percentComplete: number;
  nextMilestone: string;
} {
  const completedSet = new Set(completedSlugs);
  const totalCompleted = completedSlugs.length;
  const totalAvailable = allLessons.length;
  const percentComplete = Math.round((totalCompleted / totalAvailable) * 100);

  // Determine next milestone
  let nextMilestone = "Start your first lesson";
  if (totalCompleted > 0) {
    const level0 = getLevel0Lessons();
    const level0Done = level0.every(l => completedSet.has(l.slug));
    
    if (!level0Done) {
      nextMilestone = "Complete Level 0";
    } else {
      const level1 = getLevel1Lessons();
      const level1Done = level1.every(l => completedSet.has(l.slug));
      
      if (!level1Done) {
        nextMilestone = "Complete Level 1";
      } else {
        const puzzles = getPuzzles();
        const puzzlesDone = puzzles.every(l => completedSet.has(l.slug));
        
        if (!puzzlesDone) {
          nextMilestone = "Complete all puzzles";
        } else {
          nextMilestone = totalCompleted === totalAvailable 
            ? "All content complete!" 
            : "Complete advanced lessons";
        }
      }
    }
  }

  return {
    totalCompleted,
    totalAvailable,
    percentComplete,
    nextMilestone,
  };
}
