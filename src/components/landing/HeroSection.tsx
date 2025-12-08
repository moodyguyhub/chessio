"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeInUpGentle, staggerContainer, buttonHover, buttonTap } from "@/lib/motion";
import Link from "next/link";
import Image from "next/image";
import { useSoundscape } from "@/lib/sound/SoundProvider";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const { play } = useSoundscape();

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
              onClick={() => play("ui_click")}
              className="inline-flex items-center justify-center rounded-lg px-8 py-3.5 text-base font-bold shadow-lg hover:shadow-xl transition-all border-2"
              style={{
                backgroundColor: '#facc15',
                color: '#0f172a',
                borderColor: 'rgba(251, 191, 36, 0.5)',
              }}
              data-testid="landing-cta-evaluation"
            >
              Start Evaluation
            </Link>
          </motion.div>
          <Link
            href={isLoggedIn ? "/app" : "/login?redirect=/app"}
            onClick={() => play("ui_click")}
            className="inline-flex items-center justify-center text-sm text-neutral-400 hover:text-neutral-200 transition-colors underline-offset-4 hover:underline"
          >
            I don&apos;t know the rules yet →
          </Link>
        </div>
      </motion.div>

      {/* Right: Academy Ladder Visual with delayed entrance + sacred artifact glow */}
      <motion.div
        className="relative mx-auto w-full max-w-[400px] md:max-w-none"
        initial="hidden"
        animate="visible"
        variants={
          shouldReduceMotion
            ? undefined
            : {
                hidden: { opacity: 0, y: 16, scale: 1.02 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] },
                },
              }
        }
      >
        {/* Decorative outer glow - warm candlelight */}
        <div className="absolute -inset-4 bg-amber-400/8 blur-3xl rounded-full" />

        {/* Academy Ladder Image Container with sacred artifact glow */}
        <motion.div 
          className="relative overflow-hidden rounded-3xl border border-amber-200/15 shadow-2xl aspect-[4/5]"
          style={{
            background: "linear-gradient(to bottom, #020617, #000000, #020617)",
            boxShadow: "0 0 60px rgba(251, 191, 36, 0.12)",
          }}
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  boxShadow: [
                    "0 0 40px rgba(251, 191, 36, 0.10)",
                    "0 0 60px rgba(251, 191, 36, 0.18)",
                    "0 0 40px rgba(251, 191, 36, 0.10)",
                  ],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  boxShadow: {
                    duration: 5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  },
                }
          }
        >
          <Image
            src="/academy/academy-ladder.jpg"
            alt="Chess pieces ascending a carved staircase toward the king, representing the path to mastery"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 768px) 40vw, 90vw"
          />
          
          {/* Golden glow emanating from the top (king/staircase) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background: "radial-gradient(circle at 50% 10%, rgba(252, 211, 77, 0.35), transparent 55%)",
              mixBlendMode: "screen",
            }}
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
        </motion.div>
      </motion.div>
    </div>
  );
}
