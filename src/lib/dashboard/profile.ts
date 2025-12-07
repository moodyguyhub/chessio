/**
 * Dashboard Profile & Gating Logic
 * 
 * Calculates user's status across three tracks (Pre-School, School, Club)
 * and determines access/gating for structured learning paths.
 */

import { db } from "@/lib/db";
import { getLevel0Lessons, getLevel1Lessons } from "@/lib/lessons";
import { getCompletedLessonSlugs } from "@/lib/lessons/progress";

// ============================================
// TYPES
// ============================================

export type TrackStatus = "not_started" | "in_progress" | "completed";
export type SchoolAccess = "locked" | "unlocked";
export type PlacementStatus = "not_taken" | "passed" | "failed";

export interface ChessioProfile {
  preSchoolStatus: TrackStatus;
  preSchoolProgress: {
    completed: number;
    total: number;
    percent: number;
  };
  schoolAccess: SchoolAccess;
  schoolStatus: TrackStatus;
  placementStatus: PlacementStatus;
  clubStatus: "coming_soon";
  nextStep?: {
    label: string;
    href: string;
  };
}

// ============================================
// MAIN FUNCTION
// ============================================

/**
 * Get comprehensive profile for dashboard gating and display.
 * 
 * Rules:
 * - Pre-School: Always accessible. Status based on Level 0 + Level 1 completion.
 * - School Access: Unlocked if Pre-School completed OR placement passed.
 * - Club: Always "coming soon" for v1.
 */
export async function getChessioProfile(userId: string): Promise<ChessioProfile> {
  // Get completed lessons
  const completedSlugs = await getCompletedLessonSlugs(userId);
  const completedSet = new Set(completedSlugs);

  // Get Pre-School lessons (Level 0 + Level 1 from old /app)
  const level0Lessons = getLevel0Lessons();
  const level1Lessons = getLevel1Lessons();
  const preSchoolLessons = [...level0Lessons, ...level1Lessons];

  // Calculate Pre-School progress
  const preSchoolCompleted = preSchoolLessons.filter(lesson => 
    completedSet.has(lesson.slug)
  ).length;
  const preSchoolTotal = preSchoolLessons.length;
  const preSchoolPercent = preSchoolTotal > 0 
    ? Math.round((preSchoolCompleted / preSchoolTotal) * 100) 
    : 0;

  // Determine Pre-School status
  let preSchoolStatus: TrackStatus = "not_started";
  if (preSchoolCompleted > 0 && preSchoolCompleted < preSchoolTotal) {
    preSchoolStatus = "in_progress";
  } else if (preSchoolCompleted === preSchoolTotal) {
    preSchoolStatus = "completed";
  }

  // Check placement test status (v1: stub as "not_taken", can expand later)
  const placementStatus: PlacementStatus = "not_taken";

  // Determine School access (for v1, only Pre-School completion unlocks School)
  // In future: placementStatus === "passed" will also unlock
  const schoolAccess: SchoolAccess = 
    preSchoolStatus === "completed"
      ? "unlocked"
      : "locked";

  // School status (v1: simple heuristic based on localStorage or stub)
  // For now, mark as "not_started" - can expand with School progress tracking
  const schoolStatus: TrackStatus = "not_started";

  // Determine next recommended step
  let nextStep: { label: string; href: string } | undefined;
  if (preSchoolStatus === "not_started") {
    nextStep = {
      label: "Start Pre-School",
      href: "/app",
    };
  } else if (preSchoolStatus === "in_progress") {
    nextStep = {
      label: "Continue Pre-School",
      href: "/app",
    };
  } else if (schoolAccess === "unlocked") {
    nextStep = {
      label: "Enter Chess School",
      href: "/school",
    };
  }

  return {
    preSchoolStatus,
    preSchoolProgress: {
      completed: preSchoolCompleted,
      total: preSchoolTotal,
      percent: preSchoolPercent,
    },
    schoolAccess,
    schoolStatus,
    placementStatus,
    clubStatus: "coming_soon",
    nextStep,
  };
}

/**
 * Check if user has admin/coach role (bypasses gating).
 * For v1, just checks if user exists - can expand with role field later.
 */
export async function canBypassGating(userId: string): Promise<boolean> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    // For now, env admin always bypasses
    if (user?.email === process.env.ADMIN_EMAIL) {
      return true;
    }

    // Future: check user.role === "admin" | "coach"
    return false;
  } catch {
    return false;
  }
}
