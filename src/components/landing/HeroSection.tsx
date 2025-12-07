"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeInUpGentle, staggerContainer, buttonHover, buttonTap } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
      {/* Left: Text Content with entrance animation */}
      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={shouldReduceMotion ? undefined : fadeInUpGentle}
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-50">
          Stop Playing Random Moves.
        </h1>
        <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed">
          A structured, 15-level chess academy that takes you from absolute beginner to advanced club player. One path. No noise.
        </p>
        <p className="text-sm text-neutral-400">
          Guided by an AI coach who explains ideas, not just lines.
        </p>
        <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
          <motion.div
            whileHover={shouldReduceMotion ? undefined : buttonHover}
            whileTap={shouldReduceMotion ? undefined : buttonTap}
          >
            <Link
              href={isLoggedIn ? "/school/placement" : "/login?redirect=/school/placement"}
              className="inline-flex items-center justify-center rounded-lg bg-chessio-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-chessio-primary/90 hover:shadow-xl transition-all"
              data-testid="landing-cta-evaluation"
            >
              Start Evaluation
            </Link>
          </motion.div>
          <Link
            href={isLoggedIn ? "/app" : "/login?redirect=/app"}
            className="inline-flex items-center justify-center text-sm text-neutral-400 hover:text-neutral-200 transition-colors underline-offset-4 hover:underline"
          >
            I don&apos;t know the rules yet →
          </Link>
        </div>
      </motion.div>

      {/* Right: Academy Ladder Visual with delayed entrance */}
      <motion.div
        className="relative mx-auto w-full max-w-[400px] md:max-w-none"
        initial="hidden"
        animate="visible"
        variants={
          shouldReduceMotion
            ? undefined
            : {
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
                },
              }
        }
      >
        {/* Decorative glow */}
        <div className="absolute -inset-4 bg-chessio-primary/10 blur-3xl rounded-full" />

        {/* Academy Ladder Image Container */}
        <div className="relative overflow-hidden rounded-3xl border border-chessio-border-dark/40 bg-chessio-card-dark shadow-2xl aspect-[4/5]">
          <Image
            src="/academy/academy-ladder.jpg"
            alt="Chess pieces ascending a carved staircase toward the king, representing the path to mastery"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 40vw, 90vw"
          />
          {/* Dark gradient overlay for depth and text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          
          {/* Overlay text */}
          <div className="absolute bottom-0 left-0 right-0 p-6 space-y-2">
            <div className="text-sm text-chessio-primary font-bold tracking-wide uppercase">
              The Ascent
            </div>
            <div className="text-xs text-neutral-300 max-w-[280px]">
              15 levels. One curriculum. From beginner to advanced.
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
