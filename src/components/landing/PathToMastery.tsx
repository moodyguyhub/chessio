"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/motion";
import { Sparkles, GraduationCap, Users } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function PathToMastery() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
          },
        },
      };

  const itemVariants = shouldReduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 12 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as any },
        },
      };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Section Header */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-50">The Path to Mastery</h2>
        <p className="text-sm text-neutral-400">Three stages. One curriculum.</p>
      </div>

      {/* Vertical Spine with 3 Nodes */}
      <motion.div
        className="relative border-l-2 border-chessio-border/40 pl-8 space-y-12 mt-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={containerVariants}
      >
        {/* Subtle spine glow (decorative) */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />

        {/* Node 1: Sandbox (Pre-School) */}
        <motion.div className="relative" variants={itemVariants}>
          <div className="absolute -left-[33px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 border-2 border-amber-500/40 motion-safe:shadow-[0_0_12px_rgba(251,191,36,0.3)]">
            <Sparkles className="h-4 w-4 text-amber-300" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-neutral-50">The Sandbox — Pre-School</h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Mechanics & safety. For total beginners. Learn how the pieces move in a stress-free
              environment.
            </p>
          </div>
        </motion.div>

        {/* Node 2: Academy (Levels 1-15) */}
        <motion.div className="relative" variants={itemVariants}>
          <div className="absolute -left-[33px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 border-2 border-indigo-500/40 motion-safe:shadow-[0_0_12px_rgba(99,102,241,0.3)]">
            <GraduationCap className="h-4 w-4 text-indigo-300" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-neutral-50">The Academy — Levels 1–15</h3>
              <Badge variant="secondary" className="text-xs">
                Current: Levels 1–3 live
              </Badge>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              The core curriculum. Tactics, endgames, strategy. You do not advance until you pass
              the evaluations.
            </p>
          </div>
        </motion.div>

        {/* Node 3: Club (Coming Soon) */}
        <motion.div className="relative" variants={itemVariants}>
          <div className="absolute -left-[33px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10 border-2 border-yellow-500/40">
            <Users className="h-4 w-4 text-yellow-300" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h3 className="text-xl font-semibold text-neutral-50">The Club — Coming Soon</h3>
              <Badge variant="secondary" className="text-xs text-neutral-500">
                Coming soon
              </Badge>
            </div>
            <p className="text-sm text-neutral-400 leading-relaxed">
              Sparring, tournaments, and study groups for proven students. Apply what you&apos;ve
              learned.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
