"use client";

/**
 * SoundProvider - Global sound system for Chessio Academy
 * 
 * Features:
 * - LocalStorage persistence
 * - Separate FX and Voice controls
 * - In-memory Audio cache for performance
 * - Server-safe with graceful degradation
 * 
 * Phase 2.2: Cathedral soundscape implementation
 */

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import {
  SoundId,
  SOUND_FILES,
  SOUND_CATEGORY,
  SOUND_DEFAULTS,
  STORAGE_KEY,
  VOICE_VOLUME_MULTIPLIER,
} from "./soundscape";

interface SoundPreferences {
  fxEnabled: boolean;
  voiceEnabled: boolean;
  masterVolume: number;
}

interface SoundContextValue extends SoundPreferences {
  play: (id: SoundId) => void;
  setFxEnabled: (enabled: boolean) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  setMasterVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<SoundPreferences>(SOUND_DEFAULTS);
  const audioCache = useRef(new Map<SoundId, HTMLAudioElement>());
  const [isClient, setIsClient] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    
    if (typeof window === "undefined") return;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SoundPreferences;
        setPrefs({
          fxEnabled: parsed.fxEnabled ?? SOUND_DEFAULTS.fxEnabled,
          voiceEnabled: parsed.voiceEnabled ?? SOUND_DEFAULTS.voiceEnabled,
          masterVolume: parsed.masterVolume ?? SOUND_DEFAULTS.masterVolume,
        });
      }
    } catch (error) {
      console.warn("[SoundProvider] Failed to load preferences:", error);
    }
  }, []);

  // Persist preferences to localStorage whenever they change
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.warn("[SoundProvider] Failed to save preferences:", error);
    }
  }, [prefs, isClient]);

  /**
   * Play a sound by ID
   * Handles category-based muting and volume control
   */
  const play = useCallback(
    (id: SoundId) => {
      if (typeof window === "undefined") return;

      const category = SOUND_CATEGORY[id];
      
      // Check if category is enabled
      if (category === "fx" && !prefs.fxEnabled) return;
      if (category === "voice" && !prefs.voiceEnabled) return;

      try {
        // Get or create audio element
        let audio = audioCache.current.get(id);
        
        if (!audio) {
          audio = new Audio(SOUND_FILES[id]);
          audioCache.current.set(id, audio);
        }

        // Reset if already playing (for rapid clicks)
        if (!audio.paused) {
          audio.pause();
          audio.currentTime = 0;
        }

        // Set volume based on category
        const volumeMultiplier = category === "voice" ? VOICE_VOLUME_MULTIPLIER : 1;
        audio.volume = prefs.masterVolume * volumeMultiplier;

        // Play (catch and ignore errors for placeholder/missing files)
        audio.play().catch((error) => {
          console.warn(`[SoundProvider] Failed to play ${id}:`, error);
        });
      } catch (error) {
        console.warn(`[SoundProvider] Error playing ${id}:`, error);
      }
    },
    [prefs.fxEnabled, prefs.voiceEnabled, prefs.masterVolume]
  );

  const setFxEnabled = useCallback((enabled: boolean) => {
    setPrefs((prev) => ({ ...prev, fxEnabled: enabled }));
  }, []);

  const setVoiceEnabled = useCallback((enabled: boolean) => {
    setPrefs((prev) => ({ ...prev, voiceEnabled: enabled }));
  }, []);

  const setMasterVolume = useCallback((volume: number) => {
    const clamped = Math.max(0, Math.min(1, volume));
    setPrefs((prev) => ({ ...prev, masterVolume: clamped }));
  }, []);

  const value: SoundContextValue = {
    ...prefs,
    play,
    setFxEnabled,
    setVoiceEnabled,
    setMasterVolume,
  };

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

/**
 * Hook to access sound system
 * 
 * @example
 * const { play, fxEnabled } = useSoundscape();
 * 
 * const handleClick = () => {
 *   play("ui_click");
 *   // ... rest of logic
 * };
 */
export function useSoundscape(): SoundContextValue {
  const context = useContext(SoundContext);
  
  if (!context) {
    throw new Error("useSoundscape must be used within SoundProvider");
  }
  
  return context;
}
