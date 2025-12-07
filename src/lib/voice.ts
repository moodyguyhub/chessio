/**
 * Voice Coach v1 - Web Speech API wrapper
 * 
 * Simple, SSR-safe text-to-speech utility for verdict moments.
 * Uses browser's native Web Speech API (no backend required).
 * 
 * Constraints:
 * - Client-side only (guards against server rendering)
 * - User-triggered only (never auto-play)
 * - Graceful degradation if TTS unavailable
 */

export interface VoiceOptions {
  rate?: number;    // 0.1–10 (default 1)
  pitch?: number;   // 0–2 (default 1)
  volume?: number;  // 0–1 (default 1)
  lang?: string;    // default "en-US"
}

/**
 * Check if voice synthesis is available in current environment
 */
export function isVoiceAvailable(): boolean {
  // Server-side: always false
  if (typeof window === 'undefined') {
    return false;
  }

  // Client-side: check for Web Speech API support
  return !!(
    window.speechSynthesis &&
    typeof window.SpeechSynthesisUtterance !== 'undefined'
  );
}

/**
 * Speak text using Web Speech API
 * 
 * @param text - Text to speak
 * @param options - Voice configuration
 */
export function speakText(
  text: string,
  options: VoiceOptions = {}
): void {
  // Bail early if not available or empty text
  if (!isVoiceAvailable() || !text.trim()) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create utterance with options
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Apply options with defaults
  utterance.rate = options.rate ?? 1;
  utterance.pitch = options.pitch ?? 1;
  utterance.volume = options.volume ?? 1;
  utterance.lang = options.lang ?? 'en-US';

  // Start speaking
  window.speechSynthesis.speak(utterance);
}

/**
 * Stop any ongoing speech
 */
export function stopSpeaking(): void {
  if (!isVoiceAvailable()) {
    return;
  }

  window.speechSynthesis.cancel();
}

/**
 * Log voice events (dev-only telemetry)
 */
export function logVoiceEvent(
  event: 'placement_verdict' | 'exam_verdict',
  meta?: Record<string, unknown>
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Voice Coach]', event, meta ?? {});
  }
}
