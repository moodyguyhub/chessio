"use client";

/**
 * XP Breakdown Component
 *
 * Displays a detailed breakdown of XP earned after lesson completion.
 * Shows base XP with room for future bonuses (no hints, perfect run, etc.)
 */

import { Badge } from "@/components/ui/Badge";

interface XpBreakdownItem {
  label: string;
  amount: number;
  isBonus?: boolean;
}

interface XpBreakdownProps {
  totalXpEarned: number;
  breakdown?: XpBreakdownItem[];
  newTotalXp: number;
  previousTotalXp?: number;
  leveledUp?: boolean;
  newLevel?: number;
  alreadyCompleted?: boolean;
}

export function XpBreakdown({
  totalXpEarned,
  breakdown,
  newTotalXp,
  previousTotalXp,
  leveledUp,
  newLevel,
  alreadyCompleted,
}: XpBreakdownProps) {
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
      : [{ label: "Lesson Complete", amount: totalXpEarned }];

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
      {leveledUp && newLevel && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg p-3 border border-amber-500/30">
          <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400">
            <span className="text-lg">🎖️</span>
            <span className="font-semibold">Level Up!</span>
            <span className="text-lg">🎖️</span>
          </div>
          <p className="text-center text-sm text-amber-700 dark:text-amber-300 mt-1">
            You reached Level {newLevel}!
          </p>
        </div>
      )}

      {/* XP Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-chessio-muted dark:text-chessio-muted-dark">
          <span>Total XP</span>
          <span>
            {previousTotalXp !== undefined && previousTotalXp !== newTotalXp && (
              <span className="text-chessio-muted/60 line-through mr-1">
                {previousTotalXp}
              </span>
            )}
            <span className="text-chessio-text dark:text-chessio-text-dark font-medium">
              {newTotalXp}
            </span>
          </span>
        </div>
        <div className="h-2 bg-chessio-surface dark:bg-chessio-surface-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700 ease-out"
            style={{
              width: `${Math.min((newTotalXp % 100) / 100 * 100, 100)}%`,
            }}
          />
        </div>
        <p className="text-xs text-center text-chessio-muted dark:text-chessio-muted-dark">
          {100 - (newTotalXp % 100)} XP to next level
        </p>
      </div>
    </div>
  );
}
