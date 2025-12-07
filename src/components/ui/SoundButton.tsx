"use client";

/**
 * SoundButton - Button wrapper with integrated sound feedback
 * 
 * Plays ui_click sound on press, wraps existing button components
 * Phase 2.2: Cathedral soundscape integration
 */

import { useSoundscape } from "@/lib/sound/SoundProvider";
import { Button as BaseButton } from "@/components/ui/Button";
import { forwardRef, type ComponentProps } from "react";

type ButtonProps = ComponentProps<typeof BaseButton> & {
  soundId?: "ui_click" | "none";
};

export const SoundButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ onClick, soundId = "ui_click", ...props }, ref) => {
    const { play } = useSoundscape();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (soundId !== "none") {
        play(soundId);
      }
      onClick?.(e);
    };

    return <BaseButton ref={ref} onClick={handleClick} {...props} />;
  }
);

SoundButton.displayName = "SoundButton";
