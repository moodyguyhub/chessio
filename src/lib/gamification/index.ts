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
  LEVELS,
  XP_PER_LEVEL,
  MAX_LEVEL,
  XP_REWARDS,
  calculateLevelFromXp,
  getXpProgress,
  xpToNextLevel,
  wouldLevelUp,
  getLevelInfo,
  type LevelInfo,
  type XpRewardType,
  type XpStats,
} from "./config";
