/**
 * ActiveDutyCard - The Singular Focal Point
 * 
 * Design Principle: "Always one clear mission, always contextualized."
 * 
 * This card eliminates decision fatigue by presenting exactly one action
 * the user must take. It anchors the Dashboard as a war room, not a waiting room.
 * 
 * Phase 2.2: Enhanced with depth gradient and tracking for cinematic feel
 * Phase 2.3: Added cathedral backdrop for sacred academy atmosphere
 */

"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { motion, useReducedMotion } from "framer-motion";
import { buttonHover, buttonTap } from "@/lib/motion";
import Image from "next/image";

export type DutyStatus =
  | 'new_user'          // No progress
  | 'placement_failed'  // Needs Pre-School
  | 'placement_passed'  // Ready for Lvl 1
  | 'student_active'    // In middle of lesson
  | 'level_complete'    // Ready for next level
  | 'gate_blocked';     // Needs PvP/Rating (Future)

export interface ActiveDutyCardProps {
  status: DutyStatus;
  userProfile: {
    name: string;
    tier: 'preschool' | 'foundation' | 'candidate';
  };
  currentMission?: {
    level: number;
    title: string;
    description?: string;
    progressPercent: number;
    lessonSlug?: string;
  };
  actions: {
    onPrimary: () => void;
    onSecondary?: () => void;
    primaryLabel: string;
    secondaryLabel?: string;
  };
  className?: string;
}

interface StateConfig {
  eyebrow: string;
  headline: string;
  body: string;
  colorScheme: {
    background: string;
    border: string;
    eyebrowText: string;
  };
  showProgress?: boolean;
}

/**
 * Get state configuration using Russian School voice
 */
function getStateConfig(
  status: DutyStatus,
  currentMission?: ActiveDutyCardProps['currentMission']
): StateConfig {
  switch (status) {
    case 'new_user':
      return {
        eyebrow: 'CURRENT MISSION',
        headline: "Let's find your starting point.",
        body: "To build your curriculum, we need to know what you see on the board. Solve 5 positions. Score 4/5 to unlock the Academy immediately.",
        colorScheme: {
          background: 'bg-slate-900',
          border: 'border-blue-500/20',
          eyebrowText: 'text-blue-400',
        },
      };

    case 'placement_failed':
      return {
        eyebrow: 'FOUNDATION REQUIRED',
        headline: 'The Academy is Locked.',
        body: "You have potential, but your foundation is cracked. We cannot build heavy tactics on a weak base. Master the movements in the Sandbox first.",
        colorScheme: {
          background: 'bg-red-950/20',
          border: 'border-red-500/20',
          eyebrowText: 'text-red-400',
        },
      };

    case 'placement_passed':
      return {
        eyebrow: 'CURRENT MISSION',
        headline: 'Welcome to the Academy.',
        body: "You have proven your basics. Pre-School is now optional. We begin your formal training at Level 1: The King's Fate.",
        colorScheme: {
          background: 'bg-slate-900',
          border: 'border-blue-500/20',
          eyebrowText: 'text-blue-400',
        },
      };

    case 'student_active':
      return {
        eyebrow: 'CURRENT MISSION',
        headline: currentMission?.title || 'Continue Your Training',
        body: currentMission?.description || 
          "Do not just find the move. Understand why the piece cannot move.",
        colorScheme: {
          background: 'bg-slate-900',
          border: 'border-blue-500/20',
          eyebrowText: 'text-blue-400',
        },
        showProgress: true,
      };

    case 'level_complete':
      return {
        eyebrow: 'CURRENT MISSION',
        headline: `Level ${currentMission?.level || '?'} Mastered. You are ready to climb.`,
        body: "You have proven your knowledge. The next step of the ladder awaits. The opposition will be tougher.",
        colorScheme: {
          background: 'bg-slate-900',
          border: 'border-blue-500/20',
          eyebrowText: 'text-blue-400',
        },
      };

    case 'gate_blocked':
      return {
        eyebrow: 'FINAL EVALUATION',
        headline: 'Rating Required',
        body: "You must prove yourself in battle. Win your matches to proceed.",
        colorScheme: {
          background: 'bg-slate-900',
          border: 'border-yellow-500/20',
          eyebrowText: 'text-yellow-400',
        },
      };
  }
}

/**
 * Get tier badge configuration
 */
function getTierBadge(tier: 'preschool' | 'foundation' | 'candidate') {
  switch (tier) {
    case 'preschool':
      return {
        label: 'Sandbox',
        className: 'bg-orange-950/50 text-orange-400 border-orange-500/20',
      };
    case 'foundation':
      return {
        label: 'Foundation Tier',
        className: 'bg-blue-950/50 text-blue-400 border-blue-500/20',
      };
    case 'candidate':
      return {
        label: 'Candidate Master',
        className: 'bg-purple-950/50 text-purple-400 border-purple-500/20',
      };
  }
}

/**
 * ActiveDutyCard - The War Room Focal Point
 */
export function ActiveDutyCard({
  status,
  userProfile,
  currentMission,
  actions,
  className,
}: ActiveDutyCardProps) {
  const config = getStateConfig(status, currentMission);
  const tierBadge = getTierBadge(userProfile.tier);
  const shouldReduceMotion = useReducedMotion();

  return (
    <Card
      className={[
        // Base styling
        "relative overflow-hidden rounded-2xl border-2",
        "transition-all duration-300 ease-out",
        
        // Gradient background - subtle layered effect
        "bg-gradient-to-br from-chessio-card to-chessio-card/80",
        
        // Color scheme border from state
        config.colorScheme.border,
        
        // Hover effects - "heavy and physical"
        "hover:border-primary/30",
        "hover:shadow-[0_0_30px_-10px_rgba(79,70,229,0.3)]",
        
        className || "",
      ].join(" ")}
      data-testid="active-duty-card"
      data-status={status}
    >
      {/* Cathedral backdrop - desktop only, deeply subtle (Phase 2.3) */}
      <div className="hidden lg:block absolute inset-0 -z-10 pointer-events-none">
        <Image
          src="/academy/academy-cathedral-hero.jpg"
          alt=""
          fill
          aria-hidden="true"
          className="object-cover opacity-20 mix-blend-soft-light"
          sizes="(min-width: 1024px) 40vw, 0px"
        />
        {/* Strong dark overlay to maintain text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-slate-950/90 to-black/90" />
      </div>

      {/* Enhanced overlay gradient for cinematic depth (Phase 2.2) */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light bg-[radial-gradient(circle_at_top,_#4f46e5_0,_transparent_60%)]"
        aria-hidden="true"
      />
      
      {/* Subtle noise texture for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
      {/* Background decorative element - faint chess piece */}
      <div 
        className="absolute -right-8 -top-8 opacity-5 pointer-events-none"
        aria-hidden="true"
      >
        <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor">
          {/* Simple rook silhouette */}
          <path d="M3 3h2v2H3V3zm4 0h2v2H7V3zm4 0h2v2h-2V3zm4 0h2v2h-2V3zm4 0h2v2h-2V3zM5 5h14v2H5V5zm1 4h12l-1 10H7L6 9zm-1 12h14v2H5v-2z"/>
        </svg>
      </div>

      <CardContent className="relative z-10 p-5 lg:p-8">
        {/* Desktop: Two-column | Mobile: Stack */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
          
          {/* LEFT COLUMN - Context & Narrative (70%) */}
          <div className="flex-1 space-y-4">
            {/* Row 1: Eyebrow + Tier Badge (mobile) */}
            <div className="flex items-center justify-between gap-4">
              <div
                className={`text-[0.7rem] font-bold tracking-[0.2em] uppercase ${config.colorScheme.eyebrowText} transition-all duration-300 group-hover:tracking-[0.25em]`}
                data-testid="duty-eyebrow"
              >
                {config.eyebrow}
              </div>
              
              {/* Tier badge - mobile only */}
              <div className="lg:hidden">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${tierBadge.className}`}
                >
                  {tierBadge.label}
                </span>
              </div>
            </div>

            {/* Row 2: Headline */}
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight text-neutral-50"
              data-testid="duty-headline"
            >
              {config.headline}
            </h2>

            {/* Row 3: Body Text */}
            <p
              className="text-sm text-muted-foreground leading-relaxed max-w-[65ch]"
              data-testid="duty-body"
            >
              {config.body}
            </p>

            {/* Row 4: Progress Bar (if active lesson) */}
            {config.showProgress && currentMission && (
              <div className="space-y-2" data-testid="duty-progress">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>{currentMission.progressPercent}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${currentMission.progressPercent}%` }}
                  />
                </div>
              </div>
            )}

            {/* Row 5: Secondary Actions (desktop) */}
            {actions.secondaryLabel && (
              <div className="hidden lg:block">
                <button
                  onClick={actions.onSecondary}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  data-testid="duty-secondary-action"
                >
                  {actions.secondaryLabel}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN - Action & Status (30%) */}
          <div className="flex flex-col items-stretch lg:items-end gap-4 mt-6 lg:mt-0 lg:w-[280px]">
            {/* Tier Badge - desktop only */}
            <div className="hidden lg:block">
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium border ${tierBadge.className}`}
                data-testid="duty-tier-badge"
              >
                {tierBadge.label}
              </span>
            </div>

            {/* Primary CTA with micro-interactions */}
            <motion.div
              whileHover={shouldReduceMotion ? undefined : buttonHover}
              whileTap={shouldReduceMotion ? undefined : buttonTap}
            >
              <Button
                onClick={actions.onPrimary}
                variant="primary"
                size="lg"
                className="w-full h-11 lg:h-12 font-medium"
                data-testid="duty-primary-cta"
              >
                {actions.primaryLabel}
              </Button>
            </motion.div>

            {/* Secondary Action - mobile only */}
            {actions.secondaryLabel && (
              <div className="lg:hidden text-center">
                <button
                  onClick={actions.onSecondary}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  {actions.secondaryLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton state for loading
 * CRITICAL: Must match Desktop/Mobile split to prevent layout flash
 */
export function ActiveDutyCardSkeleton() {
  return (
    <Card className="relative overflow-hidden rounded-2xl border-2 border-border bg-slate-900">
      <CardContent className="p-5 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-8">
          {/* Left column */}
          <div className="flex-1 space-y-4">
            <div className="h-4 w-32 bg-muted/20 rounded animate-pulse" />
            <div className="h-8 w-3/4 bg-muted/20 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/20 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-muted/20 rounded animate-pulse" />
            </div>
          </div>
          
          {/* Right column */}
          <div className="flex flex-col gap-4 mt-6 lg:mt-0 lg:w-[280px]">
            <div className="h-8 w-32 bg-muted/20 rounded animate-pulse lg:self-end" />
            <div className="h-11 lg:h-12 w-full bg-muted/20 rounded animate-pulse" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
