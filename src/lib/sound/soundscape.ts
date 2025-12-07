/**
 * Soundscape Configuration
 * 
 * Cathedral of Chess sound system - calm, precise feedback
 * Russian school dojo aesthetic: minimal, intentional audio
 * 
 * Phase 2.2: Initial implementation with placeholder sounds
 */

export type SoundId =
  | "ui_click"
  | "move_soft"
  | "answer_correct"
  | "answer_wrong"
  | "level_up"
  | "coach_foundation"
  | "coach_promotion";

export type SoundCategory = "fx" | "voice";

/**
 * Sound file mappings
 * Mahmood will replace placeholders with final AI-generated audio
 */
export const SOUND_FILES: Record<SoundId, string> = {
  ui_click: "/sounds/move.mp3", // Temporary: using existing move sound
  move_soft: "/sounds/move.mp3",
  answer_correct: "/sounds/success.mp3",
  answer_wrong: "/sounds/error.mp3",
  level_up: "/sounds/success.mp3", // Temporary: same as correct for now
  coach_foundation: "/sounds/coach-line-foundation.mp3", // Placeholder (silent)
  coach_promotion: "/sounds/coach-line-promotion.mp3", // Placeholder (silent)
};

/**
 * Category system for granular mute control
 */
export const SOUND_CATEGORY: Record<SoundId, SoundCategory> = {
  ui_click: "fx",
  move_soft: "fx",
  answer_correct: "fx",
  answer_wrong: "fx",
  level_up: "fx",
  coach_foundation: "voice",
  coach_promotion: "voice",
};

/**
 * Default preferences
 */
export const SOUND_DEFAULTS = {
  fxEnabled: true,
  voiceEnabled: true,
  masterVolume: 0.6, // Calm by default (0-1 range)
} as const;

/**
 * LocalStorage key for persistence
 */
export const STORAGE_KEY = "chessio_sound_prefs_v1";

/**
 * Volume multiplier for voice vs FX
 * Voice lines play slightly quieter to avoid jarring
 */
export const VOICE_VOLUME_MULTIPLIER = 0.8;
