"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "chessio-alpha-banner-dismissed";

/**
 * Alpha Frame Banner (Sprint 04)
 * 
 * - Shows on dashboard to set alpha expectations
 * - Dismissible per day (reappears on next day)
 * - Provides quick access to feedback via floating button
 */
export function AlphaBanner() {
  // Start with true to avoid hydration mismatch, then check localStorage
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const dismissedDate = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();
    setIsVisible(dismissedDate !== today);
  }, []);

  const handleDismiss = () => {
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEY, today);
    setIsVisible(false);
  };

  const handleOpenFeedback = () => {
    // Find and click the floating feedback button
    const feedbackBtn = document.querySelector('[aria-label="Send feedback"]') as HTMLButtonElement;
    if (feedbackBtn) {
      feedbackBtn.click();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 px-4 py-3 rounded-lg shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex-1">
          <div className="flex items-start gap-2">
            <span className="text-xl shrink-0" role="img" aria-label="Alpha badge">
              🚧
            </span>
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                Chessio is in early alpha
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200 mt-0.5">
                Expect rough edges and please share your feedback to help us improve.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={handleOpenFeedback}
            variant="secondary"
            size="sm"
            className="text-xs bg-amber-100 hover:bg-amber-200 dark:bg-amber-800 dark:hover:bg-amber-700 text-amber-900 dark:text-amber-100 border-amber-300 dark:border-amber-600"
          >
            Share Feedback
          </Button>
          <button
            onClick={handleDismiss}
            className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-200 text-sm px-2 py-1 rounded hover:bg-amber-100 dark:hover:bg-amber-800/30 transition-colors"
            aria-label="Dismiss banner"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
