"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { breathe, scaleIn } from "@/lib/motion";

interface TodaysGoalCardProps {
  children: ReactNode;
}

/**
 * Today's Goal Card with subtle breathing effect
 * Phase 2.2: Adds very gentle shadow pulse animation
 */
export function TodaysGoalCard({ children }: TodaysGoalCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="mb-8 bg-chessio-surface-dark border border-chessio-border-dark border-t-4 border-t-chessio-primary rounded-2xl p-6"
      initial="initial"
      animate={
        shouldReduceMotion
          ? undefined
          : {
              boxShadow: [
                "0 0 0 0 rgba(79, 70, 229, 0)",
                "0 0 20px 2px rgba(79, 70, 229, 0.1)",
                "0 0 0 0 rgba(79, 70, 229, 0)",
              ],
              transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}

interface AcademyGateCardProps {
  children: ReactNode;
  isUnlocked: boolean;
}

/**
 * Academy Gate Card with unlock animation
 * Phase 2.2: Scale + glow when unlocked
 */
export function AcademyGateCard({ children, isUnlocked }: AcademyGateCardProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="mt-12 mb-6 max-w-2xl mx-auto"
      initial={isUnlocked && !shouldReduceMotion ? "hidden" : false}
      animate={isUnlocked && !shouldReduceMotion ? "visible" : undefined}
      variants={scaleIn}
    >
      <div
        className={`rounded-2xl border-2 ${
          isUnlocked ? "border-emerald-500/40" : "border-blue-500/30"
        } bg-gradient-to-br from-slate-900 ${
          isUnlocked ? "to-emerald-950/20" : "to-blue-950/20"
        } p-6 shadow-lg transition-all duration-500`}
      >
        {children}
      </div>
    </motion.div>
  );
}
