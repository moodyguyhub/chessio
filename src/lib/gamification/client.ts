/**
 * Client-safe gamification exports
 * This file ONLY exports constants and types, no database-touching functions
 */

// Centralized configuration (constants only, no DB functions)
export {
  // Level definitions
  LEVELS,
  MAX_LEVEL,
  MAX_PLAYABLE_LEVEL,
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
  type Tier,
} from "./config";

// Tier identity and copy
export {
  TIER_COPY,
  getTierCopy,
  type TierCopy,
} from "./tiers";
