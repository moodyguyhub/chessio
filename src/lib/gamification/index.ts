// Core XP functions (using centralized config)
export {
  calculateLevel,
  getLevelProgress,
  awardXp,
  getUserXpStats,
  calculateLessonXp,
} from "./xp";

// Centralized configuration
export {
  // Level definitions
  LEVELS,
  MAX_LEVEL,
  getLevelDef,
  getLevelForXp,
  
  // XP rewards
  XP_REWARDS,
  getXpForContentSlug,
  getContentTypeFromSlug,
  
  // Helpers
  wouldLevelUp,
  
  // Legacy compatibility
  calculateLevelFromXp,
  getXpProgress,
  xpToNextLevel,
  
  // Types
  type LevelDef,
  type LevelProgress,
  type ContentType,
  type XpStats,
} from "./config";
