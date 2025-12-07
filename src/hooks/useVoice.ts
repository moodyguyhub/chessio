/**
 * useVoice - React hook for Web Speech API
 * 
 * Provides a simple interface for text-to-speech in components.
 * Handles client-side hydration, cleanup, and state management.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  isVoiceAvailable,
  speakText,
  stopSpeaking,
  VoiceOptions,
} from '@/lib/voice';

export interface UseVoiceResult {
  canUseVoice: boolean;
  isSpeaking: boolean;
  play(text: string, options?: VoiceOptions): void;
  stop(): void;
}

export function useVoice(): UseVoiceResult {
  const [canUseVoice, setCanUseVoice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Check voice availability on client (after hydration)
  useEffect(() => {
    setCanUseVoice(isVoiceAvailable());
  }, []);

  // Play text with optional configuration
  const play = useCallback(
    (text: string, options?: VoiceOptions) => {
      if (!canUseVoice) {
        return;
      }

      setIsSpeaking(true);
      speakText(text, options);

      // Set up listener to detect when speech ends
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        // Check speaking state periodically
        const checkInterval = setInterval(() => {
          if (!window.speechSynthesis.speaking) {
            setIsSpeaking(false);
            clearInterval(checkInterval);
          }
        }, 100);

        // Cleanup interval after max duration (safety)
        setTimeout(() => {
          clearInterval(checkInterval);
          setIsSpeaking(false);
        }, 30000); // 30 seconds max
      }
    },
    [canUseVoice]
  );

  // Stop playback
  const stop = useCallback(() => {
    stopSpeaking();
    setIsSpeaking(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  return {
    canUseVoice,
    isSpeaking,
    play,
    stop,
  };
}
