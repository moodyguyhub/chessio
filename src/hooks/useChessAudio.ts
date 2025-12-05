"use client";

import { useCallback, useRef, useEffect } from "react";

export type SoundType = "move" | "capture" | "success" | "error";

/**
 * Custom hook for playing chess-related sound effects.
 * Uses HTML5 Audio for lightweight, dependency-free playback.
 * 
 * Sounds are loaded lazily on first user interaction to comply
 * with browser autoplay policies.
 */
export function useChessAudio() {
  // Use refs to hold audio objects so they persist across renders
  const sounds = useRef<Record<SoundType, HTMLAudioElement | null>>({
    move: null,
    capture: null,
    success: null,
    error: null,
  });

  const initialized = useRef(false);

  // Initialize audio objects (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined" && !initialized.current) {
      sounds.current.move = new Audio("/sounds/move.mp3");
      sounds.current.capture = new Audio("/sounds/capture.mp3");
      sounds.current.success = new Audio("/sounds/success.mp3");
      sounds.current.error = new Audio("/sounds/error.mp3");
      
      // Preload the audio files
      Object.values(sounds.current).forEach((audio) => {
        if (audio) {
          audio.preload = "auto";
          audio.volume = 0.5; // Default to 50% volume
        }
      });
      
      initialized.current = true;
    }
  }, []);

  const play = useCallback((type: SoundType) => {
    const audio = sounds.current[type];
    if (audio) {
      // Reset to start for rapid consecutive playback
      audio.currentTime = 0;
      audio.play().catch(() => {
        // Silently ignore autoplay blocks
        // (common until user interacts with page)
      });
    }
  }, []);

  return { play };
}
