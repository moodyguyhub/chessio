/**
 * Duty State Logic - Determines user's current mission
 * 
 * This is the "Russian School" state machine that decides what
 * the user should focus on next.
 */

import type { DutyStatus } from "@/components/dashboard/ActiveDutyCard";
import type { ChessioProfile } from "./profile";
import { getLevel0Lessons, getLevel1Lessons, allLessons } from "@/lib/lessons";
import { getCompletedLessonSlugs } from "@/lib/lessons/progress";

interface DutyState {
  status: DutyStatus;
  tier: 'preschool' | 'foundation' | 'candidate';
  currentMission?: {
    level: number;
    title: string;
    description?: string;
    progressPercent: number;
    lessonSlug?: string;
  };
  actions: {
    onPrimaryHref: string;
    onSecondaryHref?: string;
    primaryLabel: string;
    secondaryLabel?: string;
  };
}

/**
 * Calculate duty state from profile and lesson progress
 */
export async function calculateDutyState(
  userId: string,
  profile: ChessioProfile
): Promise<DutyState> {
  const completedSlugs = await getCompletedLessonSlugs(userId);
  const completedSet = new Set(completedSlugs);

  // Get Pre-School lessons
  const level0Lessons = getLevel0Lessons();
  const level1Lessons = getLevel1Lessons();
  const preSchoolLessons = [...level0Lessons, ...level1Lessons];

  // Find first incomplete Pre-School lesson
  const firstIncomplete = preSchoolLessons.find(
    lesson => !completedSet.has(lesson.slug)
  );

  // Determine tier (for v1, everyone is either preschool or foundation)
  const tier: DutyState['tier'] = 
    profile.schoolAccess === 'unlocked' ? 'foundation' : 'preschool';

  // ========================================
  // STATE MACHINE
  // ========================================

  // NEW USER - No progress, no placement
  if (profile.preSchoolStatus === 'not_started' && profile.placementStatus === 'not_taken') {
    return {
      status: 'new_user',
      tier: 'preschool',
      actions: {
        onPrimaryHref: '/school/placement',
        onSecondaryHref: '/app',
        primaryLabel: 'Start Evaluation',
        secondaryLabel: 'I am an absolute beginner (Pre-School)',
      },
    };
  }

  // PLACEMENT FAILED - Must do Pre-School
  if (profile.placementStatus === 'failed' && profile.schoolAccess === 'locked') {
    return {
      status: 'placement_failed',
      tier: 'preschool',
      actions: {
        onPrimaryHref: '/app',
        onSecondaryHref: '/school/placement',
        primaryLabel: 'Enter Pre-School',
        secondaryLabel: 'Retake Evaluation',
      },
    };
  }

  // PLACEMENT PASSED - Ready for School
  if (profile.placementStatus === 'passed' && profile.schoolAccess === 'unlocked') {
    return {
      status: 'placement_passed',
      tier: 'foundation',
      actions: {
        onPrimaryHref: '/school',
        onSecondaryHref: '/app',
        primaryLabel: 'Begin Level 1',
        secondaryLabel: 'Visit Pre-School (Optional)',
      },
    };
  }

  // ACTIVE STUDENT - In progress
  if (profile.preSchoolStatus === 'in_progress' && firstIncomplete) {
    const progress = profile.preSchoolProgress;
    
    return {
      status: 'student_active',
      tier,
      currentMission: {
        level: 0, // Pre-School is Level 0
        title: firstIncomplete.title,
        description: firstIncomplete.description,
        progressPercent: progress.percent,
        lessonSlug: firstIncomplete.slug,
      },
      actions: {
        onPrimaryHref: `/lessons/${firstIncomplete.slug}`,
        onSecondaryHref: '/app',
        primaryLabel: 'Resume Mission',
        secondaryLabel: 'View Lesson Map',
      },
    };
  }

  // LEVEL COMPLETE - Pre-School done, School unlocked
  if (profile.preSchoolStatus === 'completed' && profile.schoolAccess === 'unlocked') {
    return {
      status: 'level_complete',
      tier: 'foundation',
      currentMission: {
        level: 0,
        title: 'Pre-School',
        progressPercent: 100,
      },
      actions: {
        onPrimaryHref: '/school',
        onSecondaryHref: '/app',
        primaryLabel: 'Begin Level 1',
        secondaryLabel: 'Review Pre-School',
      },
    };
  }

  // DEFAULT FALLBACK - Return to Pre-School
  return {
    status: 'student_active',
    tier: 'preschool',
    actions: {
      onPrimaryHref: '/app',
      primaryLabel: 'Continue Training',
    },
  };
}
