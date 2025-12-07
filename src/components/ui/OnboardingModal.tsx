"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

const ONBOARDING_KEY = "chessio_onboarding_seen";

interface OnboardingModalProps {
  /** Force show modal (for manual trigger) */
  forceOpen?: boolean;
  onClose?: () => void;
}

/**
 * First-time user onboarding modal.
 * Auto-shows once on first visit, can be manually reopened.
 */
export function OnboardingModal({ forceOpen = false, onClose }: OnboardingModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  // Check localStorage on mount
  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      setIsOpen(true);
    }
    setHasChecked(true);
  }, []);

  // Handle force open
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
    }
  }, [forceOpen]);

  const handleClose = () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setIsOpen(false);
    onClose?.();
  };

  // Don't render until we've checked localStorage (avoid flash)
  if (!hasChecked && !forceOpen) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-chessio-card-dark border border-chessio-border-dark rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">♟️</div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Welcome to Chessio!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Learn chess the fun way
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">1</span>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Complete lessons</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Learn one piece at a time with interactive tasks</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">2</span>
            </div>
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Earn XP</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Each lesson rewards you with experience points</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-chessio-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-chessio-primary font-bold text-sm">3</span>
            </div>
            <div>
              <p className="font-medium text-chessio-text-dark">Level up & unlock more</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Progress through levels to unlock puzzles and advanced content</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button variant="primary" size="lg" onClick={handleClose} className="w-full">
          Start Learning
        </Button>
      </div>
    </div>
  );
}

/**
 * Simple "How this works" link that opens the modal
 */
export function HowItWorksLink() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        How this works
      </button>
      <OnboardingModal forceOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}

export default OnboardingModal;
