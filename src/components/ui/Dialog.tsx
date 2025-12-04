"use client";

import React, { useEffect, useRef } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Dialog = ({ isOpen, onClose, title, children }: DialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className="w-full max-w-lg scale-100 transform overflow-hidden rounded-2xl bg-chessio-card p-6 text-left align-middle shadow-xl transition-all dark:bg-chessio-card-dark border border-chessio-border dark:border-chessio-border-dark"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="dialog-title" className="text-lg font-medium leading-6 text-chessio-text dark:text-chessio-text-dark">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <span className="sr-only">Close</span>
            <svg className="w-5 h-5 text-chessio-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-2 text-chessio-text dark:text-chessio-text-dark">
          {children}
        </div>
      </div>
    </div>
  );
};
