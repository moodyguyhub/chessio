/**
 * Centralized XP & Level Configuration
 * 
 * All XP values and level thresholds are defined here.
 * This is the single source of truth for the gamification system.
 */

// ============================================
// LEVEL CONFIGURATION
// ============================================

/**
 * Level definitions with XP thresholds.
 * Using simple linear progression: 100 XP per level.
 * 
 * Note: We use cumulative XP (total XP to reach level).
 * Level 1 starts at 0 XP, Level 2 at 100 XP, etc.
 */
export const LEVELS = [
  { level: 1, label: "Beginner", xpRequired: 0, xpToNextLevel: 100 },
  { level: 2, label: "Novice", xpRequired: 100, xpToNextLevel: 100 },
  { level: 3, label: "Student", xpRequired: 200, xpToNextLevel: 100 },
  { level: 4, label: "Learner", xpRequired: 300, xpToNextLevel: 100 },
  { level: 5, label: "Apprentice", xpRequired: 400, xpToNextLevel: 100 },
  { level: 6, label: "Player", xpRequired: 500, xpToNextLevel: 100 },
  { level: 7, label: "Competitor", xpRequired: 600, xpToNextLevel: 100 },
  { level: 8, label: "Strategist", xpRequired: 700, xpToNextLevel: 100 },
  { level: 9, label: "Tactician", xpRequired: 800, xpToNextLevel: 100 },
  { level: 10, label: "Master", xpRequired: 900, xpToNextLevel: 100 },
] as const;

export type LevelInfo = (typeof LEVELS)[number];

/**
 * XP required per level (simple linear: 100 XP each)
 */
export const XP_PER_LEVEL = 100;

/**
 * Maximum level cap
 */
export const MAX_LEVEL = 10;

// ============================================
// XP REWARDS BY CONTENT TYPE
// ============================================

/**
 * Default XP rewards for different content types.
 * Individual lessons can override these in their definition.
 */
export const XP_REWARDS = {
  // Lessons
  introLesson: 10,      // Short intro lessons (e.g., "Meet the Board")
  coreLesson: 15,       // Standard piece lessons
  advancedLesson: 20,   // Complex concept lessons (Knight, Castling)
  masteryLesson: 25,    // Challenge/mastery lessons (Checkmate)
  
  // Puzzles
  puzzleSet: 30,        // Completing a puzzle set
  puzzleBonus: 5,       // Bonus for perfect solve (future)
  
  // Special
  feedbackBounty: 15,   // First feedback submission
  dailyStreak: 10,      // Daily login streak (future)
} as const;

export type XpRewardType = keyof typeof XP_REWARDS;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate level from total XP
 */
export function calculateLevelFromXp(totalXp: number): number {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  return Math.min(level, MAX_LEVEL);
}

/**
 * XP progress stats type
 */
export interface XpStats {
  level: number;
  levelLabel: string;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
  totalXp: number;
}

/**
 * Get XP progress within current level
 */
export function getXpProgress(totalXp: number): XpStats {
  const level = calculateLevelFromXp(totalXp);
  const levelDef = LEVELS[level - 1] || LEVELS[LEVELS.length - 1];
  const currentLevelXp = totalXp % XP_PER_LEVEL;
  const xpForNextLevel = level >= MAX_LEVEL ? XP_PER_LEVEL : XP_PER_LEVEL;
  const progressPercent = Math.floor((currentLevelXp / xpForNextLevel) * 100);

  return {
    level,
    levelLabel: levelDef.label,
    currentLevelXp,
    xpForNextLevel,
    progressPercent,
    totalXp,
  };
}

/**
 * Calculate XP needed to reach next level
 */
export function xpToNextLevel(totalXp: number): number {
  const level = calculateLevelFromXp(totalXp);
  if (level >= MAX_LEVEL) return 0;
  const xpForCurrentLevel = (level - 1) * XP_PER_LEVEL;
  return (level * XP_PER_LEVEL) - totalXp;
}

/**
 * Check if XP amount would cause a level up
 */
export function wouldLevelUp(currentXp: number, xpToAdd: number): boolean {
  const currentLevel = calculateLevelFromXp(currentXp);
  const newLevel = calculateLevelFromXp(currentXp + xpToAdd);
  return newLevel > currentLevel;
}

/**
 * Get level info by level number
 */
export function getLevelInfo(level: number): LevelInfo {
  const idx = Math.max(0, Math.min(level - 1, LEVELS.length - 1));
  return LEVELS[idx];
}
