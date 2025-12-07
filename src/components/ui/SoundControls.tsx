"use client";

/**
 * SoundControls - Global sound toggle buttons for header
 * 
 * Two independent toggles:
 * - FX: UI sounds, chimes, level-up
 * - Voice: Coach voice lines
 * 
 * Phase 2.2: Cathedral soundscape controls
 */

import { Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import { useSoundscape } from "@/lib/sound/SoundProvider";

export function SoundControls() {
  const { fxEnabled, voiceEnabled, setFxEnabled, setVoiceEnabled } = useSoundscape();

  return (
    <div className="flex items-center gap-2">
      {/* FX Toggle */}
      <button
        onClick={() => setFxEnabled(!fxEnabled)}
        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
        aria-label={fxEnabled ? "Mute sound effects" : "Enable sound effects"}
        title={fxEnabled ? "Mute sound effects" : "Enable sound effects"}
        data-testid="toggle-fx-sound"
      >
        {fxEnabled ? (
          <Volume2 className="h-4 w-4" />
        ) : (
          <VolumeX className="h-4 w-4" />
        )}
      </button>

      {/* Voice Toggle */}
      <button
        onClick={() => setVoiceEnabled(!voiceEnabled)}
        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all"
        aria-label={voiceEnabled ? "Mute coach voice" : "Enable coach voice"}
        title={voiceEnabled ? "Mute coach voice" : "Enable coach voice"}
        data-testid="toggle-voice-sound"
      >
        {voiceEnabled ? (
          <Mic className="h-4 w-4" />
        ) : (
          <MicOff className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
