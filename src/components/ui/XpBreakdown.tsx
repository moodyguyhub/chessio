"use client";

/**
 * XP Breakdown Component
 *
 * Displays a detailed breakdown of XP earned after lesson completion.
 * Shows base XP with room for future bonuses (no hints, perfect run, etc.)
 */

import { Badge } from "@/components/ui/Badge";
import { getLevelForXp, LEVELS } from "@/lib/gamification/config";

interface XpBreakdownItem {
  label: string;
  amount: number;
  isBonus?: boolean;
}

interface XpBreakdownProps {
  totalXpEarned: number;
  contentTypeLabel?: string; // e.g., "Core Lesson", "Puzzle Set"
  breakdown?: XpBreakdownItem[];
  newTotalXp: number;
  previousTotalXp?: number;
  leveledUp?: boolean;
  newLevel?: number;
  alreadyCompleted?: boolean;
  bishopAchieved?: boolean; // Sprint 04: First time reaching Bishop
}

export function XpBreakdown({
  totalXpEarned,
  contentTypeLabel,
  breakdown,
  newTotalXp,
  previousTotalXp,
  leveledUp,
  newLevel,
  alreadyCompleted,
  bishopAchieved,
}: XpBreakdownProps) {
  // Calculate level progress using centralized config
  const levelProgress = getLevelForXp(newTotalXp);
  const nextLevel = levelProgress.level < LEVELS.length - 1 
    ? LEVELS[levelProgress.level + 1] 
    : null;
  
  // Already completed - show simple message
  if (alreadyCompleted) {
    return (
      <div className="space-y-2">
        <Badge variant="default" className="text-sm px-3 py-1">
          Already Completed
        </Badge>
        <p className="text-xs text-chessio-muted dark:text-chessio-muted-dark">
          Nice practice! Your total XP: {newTotalXp}
        </p>
      </div>
    );
  }

  // Default breakdown if not provided
  const items: XpBreakdownItem[] =
    breakdown && breakdown.length > 0
      ? breakdown
      : [{ label: contentTypeLabel || "Complete", amount: totalXpEarned }];

  return (
    <div className="space-y-3">
      {/* Main XP Badge */}
      <div className="flex items-center justify-center gap-2">
        <Badge variant="success" className="text-base px-4 py-1.5">
          +{totalXpEarned} XP
        </Badge>
      </div>

      {/* Breakdown List (only show if multiple items or bonus) */}
      {items.length > 1 && (
        <div className="bg-chessio-surface/50 dark:bg-chessio-surface-dark/50 rounded-lg p-3 space-y-1.5">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <span
                className={
                  item.isBonus
                    ? "text-chessio-success dark:text-chessio-success-dark"
                    : "text-chessio-muted dark:text-chessio-muted-dark"
                }
              >
                {item.isBonus && "✨ "}
                {item.label}
              </span>
              <span
                className={
                  item.isBonus
                    ? "text-chessio-success font-medium"
                    : "text-chessio-text dark:text-chessio-text-dark"
                }
              >
                +{item.amount}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Level Up Celebration */}
      {leveledUp && newLevel !== undefined && (
        <div className="bg-gradient-to-r from-orange-900/20 to-orange-800/20 rounded-lg p-3 border border-orange-700/30">
          <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-orange-400">
            <span className="text-lg">🎖️</span>
            <span className="font-semibold">Level Up!</span>
            <span className="text-lg">🎖️</span>
          </div>
          <p className="text-center text-sm text-amber-700 dark:text-amber-300 mt-1">
            You reached {levelProgress.label}!
          </p>
        </div>
      )}

      {/* Bishop Achievement Celebration (Sprint 04) */}
      {bishopAchieved && (
        <div className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-lg p-4 border-2 border-purple-500/50">
          <div className="text-center space-y-2">
            <div className="text-4xl">♗</div>
            <h3 className="font-bold text-lg text-purple-900 dark:text-purple-100">
              Bishop Achieved!
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              You&apos;ve completed the current Chessio learning arc!
            </p>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
              Review key lessons or replay tactics you enjoyed.
            </p>
          </div>
        </div>
      )}

      {/* XP Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-chessio-muted dark:text-chessio-muted-dark">
          <span>{levelProgress.label}</span>
          <span>
            {previousTotalXp !== undefined && previousTotalXp !== newTotalXp && (
              <span className="text-chessio-muted/60 line-through mr-1">
                {previousTotalXp}
              </span>
            )}
            <span className="text-chessio-text dark:text-chessio-text-dark font-medium">
              {newTotalXp} XP
            </span>
          </span>
        </div>
        <div className="h-2 bg-chessio-surface dark:bg-chessio-surface-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-300 dark:bg-amber-300 transition-all duration-700 ease-out"
            style={{
              width: `${levelProgress.progressPercent}%`,
            }}
          />
        </div>
        {nextLevel ? (
          <p className="text-xs text-center text-chessio-muted dark:text-chessio-muted-dark">
            {levelProgress.xpToNextLevel} XP to {nextLevel.label}
          </p>
        ) : (
          <p className="text-xs text-center text-chessio-success">
            Max level reached! 🏆
          </p>
        )}
      </div>
    </div>
  );
}
