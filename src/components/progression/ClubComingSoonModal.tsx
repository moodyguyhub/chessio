"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { TIER_COPY } from "@/lib/gamification/client";
import { Construction, Home } from "lucide-react";

interface ClubComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  puzzleCompleted: boolean;
}

/**
 * ClubComingSoonModal - Shows after user attempts the Club preview puzzle
 * 
 * Regardless of success/failure, shows "Coming Soon" message and
 * encourages them to keep their streak alive in School.
 */
export function ClubComingSoonModal({
  isOpen,
  onClose,
  puzzleCompleted,
}: ClubComingSoonModalProps) {
  const clubCopy = TIER_COPY.club;

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Coming Soon">
      <div className="space-y-6 max-w-md mx-auto p-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
            <Construction className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-white">
            Welcome to the Club (Coming Soon)
          </h2>
          {puzzleCompleted && (
            <p className="text-sm text-green-400 font-medium">
              ✓ You solved it! Nice work.
            </p>
          )}
        </div>

        {/* Body */}
        <div className="space-y-4 text-chessio-muted-dark">
          <p className="text-base leading-relaxed">
            That was a taste of {clubCopy.range}. In{" "}
            <span className="text-chessio-primary font-semibold">{clubCopy.name}</span>,
            you&apos;ll stop blundering and start seeing tactical shots.
          </p>
          <p className="text-base leading-relaxed">
            We are building these levels right now. Keep your streak alive in School—we&apos;ll
            notify you the moment the Club doors open.
          </p>
        </div>

        {/* Action */}
        <div className="pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onClose}
            className="w-full group"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
