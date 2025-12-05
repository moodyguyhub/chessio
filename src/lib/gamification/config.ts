/**
 * Centralized XP & Level Configuration
 * 
 * Single source of truth for the gamification system.
 * 
 * Design Philosophy:
 * - Fast Start: Level 0 feels like a quick, confidence-building warm-up (~5 actions)
 * - Steady Climb: Level 1+ requires more commitment (~7–10 actions per level)
 * - Clean Values: Multiples of 5. Puzzles reward slightly more XP than lessons.
 */

// ============================================
// LEVEL CONFIGURATION
// ============================================

/**
 * Level definitions with cumulative XP thresholds.
 * 
 * Players start at Level 0 (Novice) with 0 XP.
 * Each level requires progressively more XP to reach.
 */
export const LEVELS = [
  { level: 0, id: "novice",  label: "Novice",  cumulativeXpRequired: 0 },
  { level: 1, id: "pawn",    label: "Pawn",    cumulativeXpRequired: 75 },
  { level: 2, id: "knight",  label: "Knight",  cumulativeXpRequired: 200 },
  { level: 3, id: "bishop",  label: "Bishop",  cumulativeXpRequired: 375 },
] as const;

export type LevelDef = (typeof LEVELS)[number];

/**
 * Maximum level currently implemented
 */
export const MAX_LEVEL = LEVELS.length - 1;

// ============================================
// XP REWARDS BY CONTENT TYPE
// ============================================

/**
 * XP rewards based on content type (inferred from slug patterns).
 * 
 * - intro: Short, low-friction, more reading/observing than doing (10 XP)
 * - core: Teaches a concrete mechanic or pattern; requires understanding (15 XP)
 * - puzzle: Practice / solving; requires active calculation (20 XP)
 * - bonus: Trivial or micro actions (5 XP)
 */
export const XP_REWARDS = {
  intro: 10,   // Intro lessons (intro-* or level-0-lesson-1-*)
  core: 15,    // Core lessons (concept-* or level-X-lesson-*)
  puzzle: 20,  // Puzzle sets (puzzle-*)
  bonus: 5,    // Fallback for misc/trivial actions
} as const;

export type ContentType = keyof typeof XP_REWARDS;

// ============================================
// SLUG → CONTENT TYPE INFERENCE
// ============================================

/**
 * Infer content type from a slug.
 * 
 * Pattern matching rules:
 * - `intro-*` or `level-0-lesson-1-*` → "intro" (the first board lesson)
 * - `puzzle-*` → "puzzle"
 * - `concept-*` or `level-X-lesson-*` → "core"
 * - fallback → "bonus"
 */
export function getContentTypeFromSlug(slug: string): ContentType {
  // Explicit intro prefix
  if (slug.startsWith("intro-")) {
    return "intro";
  }
  
  // The first lesson (board basics) is an intro
  if (slug === "level-0-lesson-1-board") {
    return "intro";
  }
  
  // Puzzle sets
  if (slug.startsWith("puzzle-")) {
    return "puzzle";
  }
  
  // Concept prefix (future-proofing)
  if (slug.startsWith("concept-")) {
    return "core";
  }
  
  // Level-based lessons are core lessons
  if (slug.match(/^level-\d+-lesson-/)) {
    return "core";
  }
  
  // Fallback
  return "bonus";
}

/**
 * Get XP reward for a content slug.
 * Uses slug pattern matching to determine content type.
 */
export function getXpForContentSlug(slug: string): number {
  const contentType = getContentTypeFromSlug(slug);
  return XP_REWARDS[contentType];
}

// ============================================
// LEVEL CALCULATION HELPERS
// ============================================

/**
 * Get level info for a given total XP amount.
 * 
 * Returns:
 * - level: Current level number (0-3)
 * - label: Human-readable level name
 * - id: Level ID for programmatic use
 * - nextLevelXpRequired: XP needed to reach next level (null if max)
 * - xpIntoLevel: XP earned since reaching current level
 * - xpToNextLevel: XP still needed for next level (null if max)
 * - totalXp: The input XP for convenience
 */
export interface LevelProgress {
  level: number;
  label: string;
  id: string;
  nextLevelXpRequired: number | null;
  xpIntoLevel: number;
  xpToNextLevel: number | null;
  totalXp: number;
  progressPercent: number;
}

export function getLevelForXp(totalXp: number): LevelProgress {
  // Find the highest level the user qualifies for
  let currentLevelIdx = 0;
  
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVELS[i].cumulativeXpRequired) {
      currentLevelIdx = i;
      break;
    }
  }
  
  const currentLevelDef = LEVELS[currentLevelIdx];
  const currentLevel = currentLevelDef.level;
  const nextLevelDef = currentLevelIdx < LEVELS.length - 1 ? LEVELS[currentLevelIdx + 1] : null;
  
  const xpIntoLevel = totalXp - currentLevelDef.cumulativeXpRequired;
  const nextLevelXpRequired = nextLevelDef?.cumulativeXpRequired ?? null;
  
  let xpToNextLevel: number | null = null;
  let progressPercent = 100;
  
  if (nextLevelDef) {
    xpToNextLevel = nextLevelDef.cumulativeXpRequired - totalXp;
    const levelXpRange = nextLevelDef.cumulativeXpRequired - currentLevelDef.cumulativeXpRequired;
    progressPercent = Math.floor((xpIntoLevel / levelXpRange) * 100);
  }
  
  return {
    level: currentLevel,
    label: currentLevelDef.label,
    id: currentLevelDef.id,
    nextLevelXpRequired,
    xpIntoLevel,
    xpToNextLevel,
    totalXp,
    progressPercent,
  };
}

/**
 * Check if gaining XP would cause a level up.
 */
export function wouldLevelUp(currentXp: number, xpToAdd: number): boolean {
  const currentLevel = getLevelForXp(currentXp).level;
  const newLevel = getLevelForXp(currentXp + xpToAdd).level;
  return newLevel > currentLevel;
}

/**
 * Get level definition by level number.
 */
export function getLevelDef(level: number): LevelDef {
  const idx = Math.max(0, Math.min(level, LEVELS.length - 1));
  return LEVELS[idx];
}

// ============================================
// LEGACY COMPATIBILITY
// ============================================

/**
 * XP stats type for backwards compatibility with existing code.
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
 * Get XP progress stats (legacy format).
 * @deprecated Use getLevelForXp for new code
 */
export function getXpProgress(totalXp: number): XpStats {
  const progress = getLevelForXp(totalXp);
  const nextLevelDef = progress.level < MAX_LEVEL ? LEVELS[progress.level + 1] : null;
  const currentLevelDef = LEVELS[progress.level];
  
  const xpForNextLevel = nextLevelDef 
    ? nextLevelDef.cumulativeXpRequired - currentLevelDef.cumulativeXpRequired
    : 0;
  
  return {
    level: progress.level,
    levelLabel: progress.label,
    currentLevelXp: progress.xpIntoLevel,
    xpForNextLevel,
    progressPercent: progress.progressPercent,
    totalXp,
  };
}

/**
 * Calculate level from total XP (legacy).
 * @deprecated Use getLevelForXp for new code
 */
export function calculateLevelFromXp(totalXp: number): number {
  return getLevelForXp(totalXp).level;
}

/**
 * Calculate XP needed to reach next level (legacy).
 * @deprecated Use getLevelForXp for new code
 */
export function xpToNextLevel(totalXp: number): number {
  const progress = getLevelForXp(totalXp);
  return progress.xpToNextLevel ?? 0;
}
