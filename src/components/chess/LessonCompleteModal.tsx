"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface LessonCompleteModalProps {
  isOpen: boolean;
  xpEarned: number;
  headline: string;
  subline: string;
  nextLessonSlug?: string;
  nextLessonTitle?: string;
  onClose: () => void;
}

export function LessonCompleteModal({
  isOpen,
  xpEarned,
  headline,
  subline,
  nextLessonSlug,
  nextLessonTitle,
  onClose,
}: LessonCompleteModalProps) {
  const [animatedXp, setAnimatedXp] = useState(0);
  const [show, setShow] = useState(false);
  const wasOpenRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle open/close state changes
  useEffect(() => {
    if (isOpen && !wasOpenRef.current) {
      // Modal just opened
      wasOpenRef.current = true;
      
      // Small delay before showing for smoother transition
      const showTimer = setTimeout(() => setShow(true), 50);
      
      // Animate XP counter
      let current = 0;
      const increment = Math.ceil(xpEarned / 20);
      timerRef.current = setInterval(() => {
        current += increment;
        if (current >= xpEarned) {
          setAnimatedXp(xpEarned);
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setAnimatedXp(current);
        }
      }, 30);
      
      return () => {
        clearTimeout(showTimer);
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
    
    return undefined;
  }, [isOpen, xpEarned]);
  
  // Handle close separately to avoid the setState-in-effect warning
  useEffect(() => {
    if (!isOpen && wasOpenRef.current) {
      // Modal just closed - schedule cleanup for next tick
      wasOpenRef.current = false;
      const resetTimer = setTimeout(() => {
        setShow(false);
        setAnimatedXp(0);
      }, 0);
      return () => clearTimeout(resetTimer);
    }
    return undefined;
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-neutral-900 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center transform transition-all duration-300 ${
          show ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Success Icon */}
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto bg-amber-300/20 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-amber-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold text-white mb-2">{headline}</h2>
        <p className="text-neutral-400 mb-6">{subline}</p>

        {/* XP Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-300/20 rounded-full mb-8">
          <span className="text-amber-300 font-bold text-lg">+{animatedXp}</span>
          <span className="text-amber-300 font-medium">XP</span>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {nextLessonSlug ? (
            <Link
              href={`/app/lessons/${nextLessonSlug}`}
              className="block w-full py-3 px-4 rounded-lg bg-orange-700 text-white font-semibold hover:bg-orange-800 transition-colors"
            >
              Next Lesson: {nextLessonTitle}
            </Link>
          ) : (
            <Link
              href="/app"
              className="block w-full py-3 px-4 rounded-lg bg-orange-700 text-white font-semibold hover:bg-orange-800 transition-colors"
            >
              Continue
            </Link>
          )}
          
          <Link
            href="/app"
            className="block w-full py-3 px-4 rounded-lg border border-neutral-700 text-neutral-300 font-medium hover:bg-neutral-800 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LessonCompleteModal;
