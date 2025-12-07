'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LevelMeta } from '@/lib/school/levels';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Lock, ChevronRight, BookOpen, Trophy } from 'lucide-react';
import { isLevelMastered, getCompletedLessons } from '@/lib/school/progress';
import { AlphaNoticeBanner } from '@/components/feedback/AlphaNoticeBanner';

interface SchoolDashboardProps {
  levels: LevelMeta[];
  unlockedLevels: number[];
}

// Hardcoded lesson IDs for mastery calculation
const LEVEL_1_LESSON_IDS = [
  'level-1-lesson-1-check',
  'level-1-lesson-2-checkmate', 
  'level-1-lesson-3-stalemate'
];

const LEVEL_2_LESSON_IDS = [
  'level-2-lesson-1-fork',
  'level-2-lesson-2-pin',
  'level-2-lesson-3-skewer'
];

const LEVEL_3_LESSON_IDS = [
  'level-3-lesson-1-pawn-square',
  'level-3-lesson-2-opposition',
  'level-3-lesson-3-king-and-pawn'
];

export default function SchoolDashboard({ levels, unlockedLevels }: SchoolDashboardProps) {
  const [masteredLevels, setMasteredLevels] = useState<Set<number>>(new Set());
  const [inProgressLevels, setInProgressLevels] = useState<Set<number>>(new Set());
  const [actuallyUnlockedLevels, setActuallyUnlockedLevels] = useState<Set<number>>(new Set());

  useEffect(() => {
    const mastered = new Set<number>();
    const inProgress = new Set<number>();
    const unlocked = new Set<number>();
    const completedLessons = getCompletedLessons();

    // Level 1: Always unlocked
    unlocked.add(1);
    
    // Check Level 1 status
    if (isLevelMastered(1, LEVEL_1_LESSON_IDS)) {
      mastered.add(1);
      // Level 2: Unlocks when Level 1 is mastered
      unlocked.add(2);
    } else if (LEVEL_1_LESSON_IDS.some(id => completedLessons.includes(id))) {
      inProgress.add(1);
    }
    
    // Check Level 2 status (only if unlocked)
    if (unlocked.has(2)) {
      if (isLevelMastered(2, LEVEL_2_LESSON_IDS)) {
        mastered.add(2);
        // Level 3: Unlocks when Level 2 is mastered
        unlocked.add(3);
      } else if (LEVEL_2_LESSON_IDS.some(id => completedLessons.includes(id))) {
        inProgress.add(2);
      }
    }
    
    // Check Level 3 status (only if unlocked)
    if (unlocked.has(3)) {
      if (isLevelMastered(3, LEVEL_3_LESSON_IDS)) {
        mastered.add(3);
      } else if (LEVEL_3_LESSON_IDS.some(id => completedLessons.includes(id))) {
        inProgress.add(3);
      }
    }

    setMasteredLevels(mastered);
    setInProgressLevels(inProgress);
    setActuallyUnlockedLevels(unlocked);
  }, [unlockedLevels]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Chessio School
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          &ldquo;We do not start with openings. We start with the truth.&rdquo;
        </p>
      </div>

      {/* Notebook Link */}
      <div className="flex justify-center">
        <Link href="/school/notebook">
          <Button variant="outline" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Coach&apos;s Notebook
          </Button>
        </Link>
      </div>

      {/* Alpha Notice */}
      <AlphaNoticeBanner />

      {/* Level List */}
      <div className="space-y-4">
        {levels.map((level) => {
          const isUnlocked = actuallyUnlockedLevels.has(level.id);
          const isMastered = masteredLevels.has(level.id);
          const isInProgress = inProgressLevels.has(level.id);
          
          return (
            <LevelCard
              key={level.id}
              level={level}
              isUnlocked={isUnlocked}
              isMastered={isMastered}
              isInProgress={isInProgress}
            />
          );
        })}
      </div>
    </div>
  );
}

interface LevelCardProps {
  level: LevelMeta;
  isUnlocked: boolean;
  isMastered: boolean;
  isInProgress: boolean;
}

function LevelCard({ level, isUnlocked, isMastered, isInProgress }: LevelCardProps) {
  if (!isUnlocked) {
    return (
      <Card 
        className="
          transition-all duration-200
          opacity-60 cursor-not-allowed
        "
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">
                {level.title}
              </CardTitle>
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Locked
              </Badge>
            </div>
            <CardDescription className="text-base">
              {level.subtitle}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Link href={`/school/level/${level.id}`}>
      <Card 
        className="
          transition-all duration-200
          hover:shadow-lg hover:border-emerald-500/30 cursor-pointer
        "
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">
                {level.title}
              </CardTitle>
              {isMastered ? (
                <Badge variant="success" className="text-xs flex items-center gap-1">
                  <Trophy className="h-3 w-3" />
                  Mastered
                </Badge>
              ) : isInProgress ? (
                <Badge variant="secondary" className="text-xs">
                  In Progress
                </Badge>
              ) : (
                <Badge variant="default" className="text-xs">
                  Unlocked
                </Badge>
              )}
            </div>
            <CardDescription className="text-base">
              {level.subtitle}
            </CardDescription>
          </div>
          
          <ChevronRight className="h-6 w-6 text-slate-400" />
        </CardHeader>
      </Card>
    </Link>
  );
}
