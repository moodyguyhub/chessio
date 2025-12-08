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
      gradient: "from-amber-500 to-orange-600",
      bg: "bg-amber-900/20",
      border: "border-amber-500/20",
      text: "text-amber-400",
      icon: "🎓",
    },
    1: {
      gradient: "from-blue-500 to-indigo-600",
      bg: "bg-blue-900/20",
      border: "border-blue-500/20",
      text: "text-blue-400",
      icon: "🎓",
    },
  };

  const colors = levelColors[level];
  const chipEmoji = "🤖";

  return (
    <div className="mt-4 pt-4 border-t border-chessio-border-dark/50">
      <div
        className={`relative overflow-hidden rounded-2xl border ${
          isCompleted
            ? `${colors.bg} ${colors.border}`
            : isUnlocked
            ? "bg-gradient-to-r " + colors.gradient
            : "bg-slate-800/30 border-white/5 opacity-60"
        }`}
      >
        {/* Background pattern */}
        {isUnlocked && !isCompleted && (
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "24px 24px",
            }} />
          </div>
        )}

        <div className="relative p-6">
          <div className="flex items-start gap-4">
            {/* Chip Avatar */}
            <div
              className={`w-16 h-16 shrink-0 rounded-full flex items-center justify-center text-3xl ${
                isCompleted
                  ? "bg-amber-500"
                  : isUnlocked
                  ? "bg-white/20 backdrop-blur-sm"
                  : "bg-slate-700"
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
                      <span className="text-xs px-2 py-1 bg-white/10 text-white/80 rounded">
                        ⚔️ Capture 3 pieces
                      </span>
                      <span className="text-xs px-2 py-1 bg-white/10 text-white/80 rounded">
                        👑 Keep your Queen safe
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-xs px-2 py-1 bg-white/10 text-white/80 rounded">
                        📊 Get a 3-point lead
                      </span>
                      <span className="text-xs px-2 py-1 bg-white/10 text-white/80 rounded">
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
                  className={`inline-block px-5 py-2.5 text-sm font-bold rounded-lg transition-all hover:scale-[1.02] ${
                    isCompleted
                      ? `${colors.text} hover:${colors.text}/80`
                      : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30"
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
