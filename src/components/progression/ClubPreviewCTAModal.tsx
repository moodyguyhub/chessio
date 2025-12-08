"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { TIER_COPY } from "@/lib/gamification/client";
import { Sparkles, ArrowRight } from "lucide-react";

interface ClubPreviewCTAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTryChallenge: () => void;
}

/**
 * ClubPreviewCTAModal - Offers to try a Club-level preview puzzle
 * 
 * Shows after claiming graduation badge, invites user to test their skills
 * with a harder puzzle to preview Club difficulty.
 */
export function ClubPreviewCTAModal({
  isOpen,
  onClose,
  onTryChallenge,
}: ClubPreviewCTAModalProps) {
  const clubCopy = TIER_COPY.club;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Club Preview">
      <div className="space-y-6 max-w-md mx-auto p-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-chessio-primary flex items-center justify-center shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-white">
            Want a taste of the big leagues?
          </h2>
        </div>

        {/* Body */}
        <div className="space-y-4 text-chessio-muted-dark">
          <p className="text-base leading-relaxed">
            <span className="text-chessio-primary font-semibold">{clubCopy.name}</span> is the next step.
            It&apos;s about spotting traps and winning games.
          </p>
          <p className="text-base leading-relaxed">
            Try one &ldquo;Club Level&rdquo; puzzle right now to see if you&apos;re ready.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onTryChallenge}
            className="w-full group"
          >
            Try the Challenge (Hard)
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            className="w-full text-sm"
          >
            Maybe later
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
