"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TIER_COPY } from "@/lib/gamification/client";
import { Lock, Construction } from "lucide-react";

interface TierProgressionCardProps {
  hasCompletedLevel3: boolean;
  onClick?: () => void;
}

/**
 * TierProgressionCard - Shows the "Path Ahead" after School levels.
 * 
 * Two states:
 * - State A: User hasn't completed Level 3 (locked preview)
 * - State B: User has completed Level 3 (graduated, shows "in development")
 */
export function TierProgressionCard({ hasCompletedLevel3, onClick }: TierProgressionCardProps) {
  const schoolCopy = TIER_COPY.school;
  const clubCopy = TIER_COPY.club;

  if (hasCompletedLevel3) {
    // State B: Graduated School
    return (
      <Card
        className="border-chessio-primary/30 bg-gradient-to-br from-chessio-primary/5 to-chessio-primary/10 hover:from-chessio-primary/10 hover:to-chessio-primary/15 transition-all cursor-pointer"
        onClick={onClick}
      >
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-white">
                  You&apos;ve Graduated School! 🎓
                </h3>
              </div>
              <p className="text-chessio-muted-dark text-sm leading-relaxed">
                You have mastered the basics. The developers are currently building{" "}
                <span className="text-chessio-primary font-semibold">{clubCopy.name}</span>{" "}
                ({clubCopy.range}) just for players like you. It will arrive in a future update.
              </p>
            </div>
            <Badge variant="warning" className="flex-shrink-0">
              <Construction className="w-3 h-3 mr-1" />
              In Development
            </Badge>
          </div>

          <div className="pt-4 border-t border-chessio-border-dark">
            <div className="text-xs text-chessio-muted-dark space-y-1">
              <p>
                <span className="text-white font-medium">{clubCopy.name}:</span> {clubCopy.tagline}
              </p>
              <p className="text-[11px] opacity-75">{clubCopy.description}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // State A: Not yet completed Level 3
  return (
    <Card className="border-chessio-border-dark/50 bg-slate-900/30 hover:bg-slate-900/40 transition-all">
      <div className="p-6 space-y-4 opacity-75">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">
                The Road to Mastery
              </h3>
            </div>
            <p className="text-chessio-muted-dark text-sm leading-relaxed">
              You are currently in{" "}
              <span className="text-white font-semibold">{schoolCopy.name}</span>.
              Master the basics here to unlock{" "}
              <span className="text-chessio-primary font-semibold">{clubCopy.name}</span>{" "}
              (tactics & plans) and eventually{" "}
              <span className="text-purple-400 font-semibold">{TIER_COPY.college.name}</span>{" "}
              (strategy).
            </p>
          </div>
          <Badge variant="secondary" className="flex-shrink-0">
            <Lock className="w-3 h-3 mr-1" />
            Complete Level 3 to unlock
          </Badge>
        </div>

        <div className="pt-4 border-t border-chessio-border-dark/30 space-y-2">
          <div className="text-xs text-chessio-muted-dark">
            <p>
              <span className="text-white/80 font-medium">{clubCopy.name}:</span> {clubCopy.tagline}
            </p>
          </div>
          <div className="text-xs text-chessio-muted-dark">
            <p>
              <span className="text-purple-300/80 font-medium">{TIER_COPY.college.name}:</span> {TIER_COPY.college.tagline}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
