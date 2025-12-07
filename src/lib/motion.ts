/**
 * Motion utilities for Chessio Phase 2.2 - Cinematic Micro-Interactions
 * 
 * Common animation variants for consistent feel across the app.
 * All animations respect prefers-reduced-motion.
 */

import { Variants, Transition } from "framer-motion";

// Base easing for cinematic feel (cubic bezier)
export const cinematicEase = [0.22, 1, 0.36, 1] as const;

// Common transition presets
export const transitions = {
  quick: { duration: 0.2, ease: cinematicEase as any } as Transition,
  smooth: { duration: 0.35, ease: cinematicEase as any } as Transition,
  gentle: { duration: 0.5, ease: cinematicEase as any } as Transition,
  breathe: { duration: 0.7, ease: cinematicEase as any } as Transition,
} as const;

// Fade & Rise (entrance animations)
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.smooth,
  },
};

export const fadeInUpGentle: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.gentle,
  },
};

// Subtle scale entrance (for cards)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: transitions.smooth,
  },
};

// Slide up (for panels, modals)
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: transitions.smooth,
  },
};

// Stagger children (for list-like elements)
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

// Micro-interactions for buttons/CTAs
export const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.15 },
};

export const buttonTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// Pulse for current mission indicator
export const pulseGlow: Variants = {
  initial: { opacity: 0.6 },
  animate: {
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Breathing effect (very subtle, for passive elements)
export const breathe: Variants = {
  initial: { opacity: 1 },
  animate: {
    opacity: [1, 0.85, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Gentle nudge (for coach button)
export const gentleNudge: Variants = {
  initial: { scale: 1 },
  nudge: {
    scale: [1, 1.08, 1],
    transition: {
      duration: 0.6,
      times: [0, 0.5, 1],
      ease: cinematicEase,
    },
  },
};

// Collapse in (for feedback forms)
export const collapseIn: Variants = {
  hidden: { 
    opacity: 0, 
    height: 0,
    overflow: "hidden",
  },
  visible: { 
    opacity: 1, 
    height: "auto",
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
};
