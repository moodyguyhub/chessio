/**
 * Challenge Card Component
 * 
 * Entry point for Coach's Challenge mini-games.
 * Shows on dashboard after completing all lessons in a level.
 */

import Link from "next/link";
import { CoachChallengeId } from "@/lib/challenges/config";

interface ChallengeCardProps {
  challengeId: CoachChallengeId;
  level: 0 | 1;
  isUnlocked: boolean;
  isCompleted?: boolean;
}

export function ChallengeCard({ challengeId, level, isUnlocked, isCompleted = false }: ChallengeCardProps) {
  const levelColors = {
    0: {
      borderGlow: "border-amber-500/30",
      bg: "bg-slate-900/50",
      bgCompleted: "bg-amber-950/30",
      borderCompleted: "border-amber-700/30",
      text: "text-amber-400",
      icon: "🎓",
      accentColor: "text-amber-400",
    },
    1: {
      borderGlow: "border-blue-500/30",
      bg: "bg-slate-900/50",
      bgCompleted: "bg-blue-950/30",
      borderCompleted: "border-blue-700/30",
      text: "text-blue-400",
      icon: "🎓",
      accentColor: "text-blue-400",
    },
  };

  const colors = levelColors[level];
  const chipEmoji = "🤖";

  return (
    <div className="mt-4 pt-4 border-t border-chessio-border-dark/50">
      <div
        className={`relative overflow-hidden rounded-xl border transition-all ${
          isCompleted
            ? `${colors.bgCompleted} ${colors.borderCompleted}`
            : isUnlocked
            ? `${colors.bg} ${colors.borderGlow} hover:border-amber-500/50`
            : "bg-slate-800/30 border-white/5 opacity-60"
        }`}
      >
        {/* Subtle glow effect when unlocked */}
        {isUnlocked && !isCompleted && (
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-amber-500/20 to-transparent" />
          </div>
        )}

        <div className="relative p-6">
          <div className="flex items-start gap-4">
            {/* Chip Avatar */}
            <div
              className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center text-3xl border ${
                isCompleted
                  ? "bg-amber-950/50 border-amber-700/40 text-amber-400"
                  : isUnlocked
                  ? "bg-slate-800/50 border-amber-500/30"
                  : "bg-slate-700 border-slate-600"
              }`}
            >
              {isCompleted ? colors.icon : isUnlocked ? chipEmoji : "🔒"}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3
                  className={`text-lg font-bold tracking-tight ${
                    isUnlocked ? "text-white" : "text-slate-500"
                  }`}
                >
                  Level {level} Challenge
                </h3>
                {isCompleted && (
                  <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full font-medium">
                    Passed
                  </span>
                )}
              </div>
              <p
                className={`text-sm mb-3 ${
                  isUnlocked ? "text-white/90" : "text-slate-600"
                }`}
              >
                {isCompleted
                  ? "You've proven your skills! Well done."
                  : isUnlocked
                  ? "Prove you're ready! Face Coach Chip in a friendly challenge."
                  : "Complete all lessons first"}
              </p>

              {/* Mission bullets - only show if unlocked and not completed */}
              {isUnlocked && !isCompleted && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {level === 0 ? (
                    <>
                      <span className="text-xs px-2 py-1 bg-slate-800/60 border border-amber-500/20 text-amber-100 rounded">
                        ⚔️ Capture 3 pieces
                      </span>
                      <span className="text-xs px-2 py-1 bg-slate-800/60 border border-amber-500/20 text-amber-100 rounded">
                        👑 Keep your Queen safe
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs px-2 py-1 bg-slate-800/60 border border-blue-500/20 text-blue-100 rounded">
                        📊 Get a 3-point lead
                      </span>
                      <span className="text-xs px-2 py-1 bg-slate-800/60 border border-blue-500/20 text-blue-100 rounded">
                        ⚡ Don&apos;t blunder
                      </span>
                    </>
                  )}
                </div>
              )}

              {/* Action button */}
              {isUnlocked ? (
                <Link
                  href={`/challenge/${challengeId}`}
                  className={`inline-block px-5 py-2.5 text-sm font-bold rounded-lg transition-all hover:scale-[1.02] shadow-lg ${
                    isCompleted
                      ? "bg-amber-900/30 text-amber-400 hover:bg-amber-900/40 border border-amber-700/30"
                      : "bg-orange-500 text-white hover:bg-orange-600 shadow-orange-500/20"
                  }`}
                >
                  {isCompleted ? "Play Again" : "Start Challenge"}
                </Link>
              ) : (
                <span className="inline-block px-4 py-2 text-sm text-slate-500">
                  Complete all lessons first
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
