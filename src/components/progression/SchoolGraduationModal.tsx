"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { GraduationCap } from "lucide-react";

interface SchoolGraduationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaimBadge: () => void;
}

/**
 * SchoolGraduationModal - Celebrates completing Level 3 (School)
 * 
 * Shows celebration message and offers to claim graduation badge,
 * which leads to the Club preview CTA.
 */
export function SchoolGraduationModal({
  isOpen,
  onClose,
  onClaimBadge,
}: SchoolGraduationModalProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="School Complete">
      <div className="space-y-6 text-center max-w-md mx-auto p-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-chessio-primary to-purple-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Headline */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">
            Chessio School Complete! 🎓
          </h2>
          <p className="text-lg text-chessio-primary font-medium">
            You went from knowing nothing to playing a real game. That is huge.
          </p>
        </div>

        {/* Body */}
        <div className="space-y-3 text-chessio-muted-dark">
          <p className="text-base leading-relaxed">
            You now know how the pieces move, how to capture, and how to checkmate.
          </p>
          <p className="text-base font-semibold text-white">
            You are officially a Chess Player.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={onClaimBadge}
            className="w-full"
          >
            Claim Graduation Badge
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={onClose}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
