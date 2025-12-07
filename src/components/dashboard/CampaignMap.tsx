/**
 * CampaignMap - The Context Layer
 * 
 * Visual hierarchy that supports (not competes with) ActiveDutyCard.
 * Shows the full curriculum ladder with tiers and levels.
 * 
 * Design Principle: "Know your place on the ladder"
 */

"use client";

import { useEffect, useState } from "react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/Accordion";
import { CheckCircle2, PlayCircle, Lock, Circle } from "lucide-react";
import type { SchoolMapData } from "@/lib/dashboard/school-map";
import { getCompletedLessons, getPassedLevelExams, isLevelMastered } from "@/lib/school/progress";
import { getPlacementResult } from "@/lib/placement/storage";

export interface CampaignMapProps {
  userProgress: SchoolMapData;
}

// Level metadata (subset for v1 - Levels 1-3)
const SCHOOL_LEVELS = [
  { id: 1, title: "The King's Fate", subtitle: "Check & Checkmate" },
  { id: 2, title: "The Tactical Eye", subtitle: "Pin, Skewer, Fork" },
  { id: 3, title: "The Mating Net", subtitle: "Classic Checkmate Patterns" },
];

const LEVEL_LESSON_IDS: Record<number, string[]> = {
  1: ['level-1-lesson-1-check', 'level-1-lesson-2-checkmate', 'level-1-lesson-3-stalemate'],
  2: ['level-2-lesson-1-pin', 'level-2-lesson-2-skewer', 'level-2-lesson-3-fork'],
  3: ['level-3-lesson-1-smothered-mate', 'level-3-lesson-2-back-rank-mate', 'level-3-lesson-3-discovered-attack'],
};

/**
 * CampaignMap - Shows full curriculum hierarchy
 */
export function CampaignMap({ userProgress: serverProgress }: CampaignMapProps) {
  // Client-side state (hydrate with localStorage)
  const [hasPassedPlacement, setHasPassedPlacement] = useState(serverProgress.hasPassedPlacement);
  const [currentLevel, setCurrentLevel] = useState<number | null>(serverProgress.currentLevel);
  const [levelsCompleted, setLevelsCompleted] = useState<number[]>(serverProgress.levelsCompleted);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate with localStorage on mount
  useEffect(() => {
    // Check placement
    const placementResult = getPlacementResult();
    if (placementResult?.status === "passed") {
      setHasPassedPlacement(true);
    }

    // Check School progress
    const completedLessons = getCompletedLessons();
    const passedExams = getPassedLevelExams();
    
    const completed: number[] = [];
    
    [1, 2, 3].forEach(levelId => {
      const lessonIds = LEVEL_LESSON_IDS[levelId];
      if (lessonIds && isLevelMastered(levelId, lessonIds)) {
        completed.push(levelId);
      }
    });

    setLevelsCompleted(completed);
    
    // Determine current level
    if (completed.includes(3)) {
      setCurrentLevel(null); // All levels complete
    } else if (completed.includes(2)) {
      setCurrentLevel(3);
    } else if (completed.includes(1)) {
      setCurrentLevel(2);
    } else if (serverProgress.isPreSchoolComplete || hasPassedPlacement) {
      setCurrentLevel(1);
    }

    setIsHydrated(true);
  }, [serverProgress, hasPassedPlacement]);

  // Determine which tier should be expanded by default
  const defaultExpandedTier = (() => {
    if (currentLevel && currentLevel >= 1 && currentLevel <= 5) {
      return "foundation";
    }
    if (currentLevel && currentLevel >= 6 && currentLevel <= 10) {
      return "candidate";
    }
    if (currentLevel && currentLevel >= 11 && currentLevel <= 15) {
      return "mastery";
    }
    // Default: Pre-School for new users
    return "preschool";
  })();

  const { isPreSchoolComplete } = serverProgress;
  const hasSchoolAccess = isPreSchoolComplete || hasPassedPlacement;

  return (
    <div data-testid="campaign-map-container" className="w-full max-w-4xl mx-auto">
      <Accordion type="single" collapsible defaultValue={defaultExpandedTier}>
        
        {/* TIER 0: Pre-School (The Sandbox) */}
        <AccordionItem 
          value="preschool" 
          data-testid="tier-accordion-item-preschool"
          className="border-l-4 border-amber-500/80 bg-chessio-card/40"
        >
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-2">
              <div className="flex items-center gap-3">
                {isPreSchoolComplete ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-orange-400" />
                )}
                <div>
                  <div className="text-base font-semibold text-foreground">The Sandbox</div>
                  <div className="text-xs text-muted-foreground">Mechanics & Movement</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {isPreSchoolComplete ? (
                  <span className="text-emerald-400 font-medium">Completed</span>
                ) : hasPassedPlacement ? (
                  <span className="text-blue-400">Optional</span>
                ) : (
                  <span className="text-orange-400">Required</span>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <p className="text-sm text-muted-foreground leading-relaxed">
                Learn how each piece moves and basic board mechanics. Perfect for absolute beginners.
              </p>
              {isPreSchoolComplete ? (
                <div className="text-sm text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>All lessons mastered. Youre ready for the Academy.</span>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {hasPassedPlacement ? (
                    <span>You passed the placement test. Pre-School is optional but available for review.</span>
                  ) : (
                    <span>Complete these basics to unlock the Academy, or take the placement test to skip ahead.</span>
                  )}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* TIER 1: Foundation (Levels 1-5) */}
        <AccordionItem 
          value="foundation" 
          data-testid="tier-accordion-item-foundation"
          className={hasSchoolAccess ? "border-l-4 border-blue-500/80 bg-chessio-card/40" : "border-l-4 border-slate-600/80 bg-chessio-card/20 opacity-60"}
        >
          <AccordionTrigger disabled={!hasSchoolAccess}>
            <div className="flex items-center justify-between w-full pr-2">
              <div className="flex items-center gap-3">
                {!hasSchoolAccess ? (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                ) : currentLevel && currentLevel >= 1 && currentLevel <= 5 ? (
                  <PlayCircle className="h-5 w-5 text-chessio-primary" />
                ) : levelsCompleted.filter(l => l >= 1 && l <= 5).length === 5 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-blue-400" />
                )}
                <div>
                  <div className="text-base font-semibold text-foreground">The Foundation</div>
                  <div className="text-xs text-muted-foreground">The Truth of the Board</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {!hasSchoolAccess ? (
                  <span className="text-muted-foreground">Locked</span>
                ) : (
                  <span>
                    {levelsCompleted.filter(l => l >= 1 && l <= 5).length}/5 Levels
                  </span>
                )}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {!hasSchoolAccess ? (
                <p className="text-sm text-muted-foreground">
                  {hasPassedPlacement ? 
                    "Complete Pre-School to unlock the Academy." : 
                    "Pass the placement test or complete Pre-School to unlock Level 1."}
                </p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    Master the fundamental tactics and patterns. Levels 1–3 available now.
                  </p>
                  <div className="space-y-1.5">
                    {SCHOOL_LEVELS.map(level => {
                      const isCompleted = levelsCompleted.includes(level.id);
                      const isCurrent = currentLevel === level.id;
                      const isLocked = level.id > 1 && !levelsCompleted.includes(level.id - 1);

                      return (
                        <LevelRow
                          key={level.id}
                          levelId={level.id}
                          title={level.title}
                          subtitle={level.subtitle}
                          status={
                            isCompleted ? "mastered" : 
                            isCurrent ? "in-progress" : 
                            isLocked ? "locked" : 
                            "available"
                          }
                        />
                      );
                    })}
                    {/* Placeholder for Levels 4-5 */}
                    <LevelRow
                      levelId={4}
                      title="Coming Soon"
                      subtitle="More levels in development"
                      status="locked"
                    />
                  </div>
                </>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* TIER 2: Candidate (Levels 6-10) */}
        <AccordionItem 
          value="candidate" 
          data-testid="tier-accordion-item-candidate"
          className="border-l-4 border-slate-600/80 bg-chessio-card/20 opacity-60"
        >
          <AccordionTrigger disabled>
            <div className="flex items-center justify-between w-full pr-2">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-base font-semibold text-foreground">The Candidate</div>
                  <div className="text-xs text-muted-foreground">Calculation & Combinations</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <span>Locked</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground pt-2">
              Advanced tactical patterns and deep calculation. Unlocks when Foundation tier is mastered.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* TIER 3: Mastery (Levels 11-15) */}
        <AccordionItem 
          value="mastery" 
          data-testid="tier-accordion-item-mastery"
          className="border-l-4 border-slate-600/80 bg-chessio-card/20 opacity-60"
        >
          <AccordionTrigger disabled>
            <div className="flex items-center justify-between w-full pr-2">
              <div className="flex items-center gap-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-base font-semibold text-foreground">The Master</div>
                  <div className="text-xs text-muted-foreground">Strategy & Sacrifice</div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                <span>Locked</span>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground pt-2">
              Positional understanding, strategic planning, and master-level concepts. The final tier.
            </p>
          </AccordionContent>
        </AccordionItem>

      </Accordion>
    </div>
  );
}

/**
 * LevelRow - Individual level within a tier
 */
interface LevelRowProps {
  levelId: number;
  title: string;
  subtitle: string;
  status: "mastered" | "in-progress" | "available" | "locked";
}

function LevelRow({ levelId, title, subtitle, status }: LevelRowProps) {
  const statusConfig = {
    mastered: {
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
      chipBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
      chipText: "Mastered",
      borderClass: "border-l-2 border-emerald-500/50",
      showPulse: false,
    },
    "in-progress": {
      icon: <PlayCircle className="h-4 w-4 text-chessio-primary" />,
      chipBg: "bg-chessio-primary/10 border-chessio-primary/20 text-chessio-primary",
      chipText: "In Progress",
      borderClass: "border-l-2 border-chessio-primary/80",
      showPulse: true,
    },
    available: {
      icon: <Circle className="h-4 w-4 text-blue-400" />,
      chipBg: "bg-blue-500/10 border-blue-500/20 text-blue-400",
      chipText: "Available",
      borderClass: "",
      showPulse: false,
    },
    locked: {
      icon: <Lock className="h-4 w-4 text-muted-foreground" />,
      chipBg: "bg-muted/10 border-border text-muted-foreground",
      chipText: "Locked",
      borderClass: "",
      showPulse: false,
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
        status === "in-progress" 
          ? "bg-chessio-card/70 " + config.borderClass
          : "bg-chessio-surface-dark/30 " + config.borderClass
      } ${
        status === "locked" ? "opacity-70 cursor-default" : ""
      }`}
      data-testid={`level-row-${levelId}`}
    >
      {/* Left: Level badge */}
      <div className="flex-shrink-0">
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300">
          LVL {levelId}
        </span>
      </div>

      {/* Center: Title & subtitle */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground truncate">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
      </div>

      {/* Right: Status chip with optional pulse dot */}
      <div className="flex items-center gap-2">
        {config.showPulse && (
          <span className="inline-flex h-2 w-2 rounded-full bg-chessio-primary animate-pulse" />
        )}
        {config.icon}
        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${config.chipBg}`}>
          {config.chipText}
        </span>
      </div>
    </div>
  );
}
