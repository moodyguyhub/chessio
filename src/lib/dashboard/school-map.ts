/**
 * School Map Data Helper
 * 
 * Provides comprehensive school progress data for the CampaignMap component.
 * Consolidates placement status, Pre-School completion, and School level progress.
 */

import type { ChessioProfile } from "./profile";
import { getCompletedLessons, getPassedLevelExams, isLevelMastered } from "@/lib/school/progress";

// Level lesson IDs (from SchoolDashboard)
const LEVEL_1_LESSON_IDS = [
  'level-1-lesson-1-check',
  'level-1-lesson-2-checkmate',
  'level-1-lesson-3-stalemate'
];

const LEVEL_2_LESSON_IDS = [
  'level-2-lesson-1-pin',
  'level-2-lesson-2-skewer',
  'level-2-lesson-3-fork'
];

const LEVEL_3_LESSON_IDS = [
  'level-3-lesson-1-smothered-mate',
  'level-3-lesson-2-back-rank-mate',
  'level-3-lesson-3-discovered-attack'
];

export interface SchoolMapData {
  hasPassedPlacement: boolean;
  isPreSchoolComplete: boolean;
  currentLevel: number | null;  // null if not in School yet
  levelsCompleted: number[];     // e.g. [1, 2]
  totalLevels: number;           // e.g. 15 for full curriculum vision
}

/**
 * Calculate school progress data for CampaignMap
 */
export async function getSchoolMapData(profile: ChessioProfile): Promise<SchoolMapData> {
  const hasPassedPlacement = profile.placementStatus === "passed";
  const isPreSchoolComplete = profile.preSchoolStatus === "completed";
  
  // Determine if user has access to School (client-side localStorage check happens in component)
  const hasSchoolAccess = profile.schoolAccess === "unlocked";
  
  if (!hasSchoolAccess) {
    // User hasn't unlocked School yet
    return {
      hasPassedPlacement,
      isPreSchoolComplete,
      currentLevel: null,
      levelsCompleted: [],
      totalLevels: 15, // Full curriculum vision
    };
  }

  // School is unlocked - check progress via localStorage
  const completedLessons = typeof window !== 'undefined' ? getCompletedLessons() : [];
  const passedExams = typeof window !== 'undefined' ? getPassedLevelExams() : [];
  
  // Determine completed levels (all lessons + exam passed)
  const levelsCompleted: number[] = [];
  
  if (isLevelMastered(1, LEVEL_1_LESSON_IDS)) {
    levelsCompleted.push(1);
  }
  
  if (isLevelMastered(2, LEVEL_2_LESSON_IDS)) {
    levelsCompleted.push(2);
  }
  
  if (isLevelMastered(3, LEVEL_3_LESSON_IDS)) {
    levelsCompleted.push(3);
  }

  // Determine current level (first unlocked level that's not mastered)
  let currentLevel: number | null = null;
  
  // Level 1 is always available once School unlocks
  if (!levelsCompleted.includes(1)) {
    currentLevel = 1;
  }
  // Level 2 unlocks when Level 1 is mastered
  else if (levelsCompleted.includes(1) && !levelsCompleted.includes(2)) {
    currentLevel = 2;
  }
  // Level 3 unlocks when Level 2 is mastered
  else if (levelsCompleted.includes(2) && !levelsCompleted.includes(3)) {
    currentLevel = 3;
  }
  // If all current levels mastered, no current level (ready for Level 4 when it exists)
  else if (levelsCompleted.includes(3)) {
    currentLevel = null; // All available levels complete
  }

  return {
    hasPassedPlacement,
    isPreSchoolComplete,
    currentLevel,
    levelsCompleted,
    totalLevels: 15,
  };
}

/**
 * Server-safe version that returns basic structure without localStorage
 * Use this for SSR, then hydrate with client-side localStorage in component
 */
export async function getSchoolMapDataServer(profile: ChessioProfile): Promise<SchoolMapData> {
  const hasPassedPlacement = profile.placementStatus === "passed";
  const isPreSchoolComplete = profile.preSchoolStatus === "completed";
  const hasSchoolAccess = profile.schoolAccess === "unlocked";
  
  return {
    hasPassedPlacement,
    isPreSchoolComplete,
    currentLevel: hasSchoolAccess ? 1 : null, // Default to Level 1 if unlocked
    levelsCompleted: [],
    totalLevels: 15,
  };
}
