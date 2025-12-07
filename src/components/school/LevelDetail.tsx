'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LevelMeta } from '@/lib/school/levels';
import { Lesson } from '@/lib/school/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Play, Trophy, Target, Lock, ChevronRight } from 'lucide-react';
import { getPassedLevelExams, getCompletedLessons, isLevelMastered } from '@/lib/school/progress';

interface LevelDetailProps {
  level: LevelMeta;
  lessons: Lesson[];
  hasExam?: boolean;
}

export default function LevelDetail({ level, lessons, hasExam = false }: LevelDetailProps) {
  const [examPassed, setExamPassed] = useState(false);
  const [examUnlocked, setExamUnlocked] = useState(false);
  const [levelMastered, setLevelMastered] = useState(false);

  useEffect(() => {
    const passedExams = getPassedLevelExams();
    const completedLessons = getCompletedLessons();
    
    // Check if exam passed
    const passed = passedExams.includes(level.id);
    setExamPassed(passed);
    
    // Check if all lessons completed (to unlock exam)
    const lessonIds = lessons.map(l => l.id);
    const allComplete = lessonIds.every(id => completedLessons.includes(id));
    setExamUnlocked(allComplete);
    
    // Check if level mastered (all lessons + exam)
    const mastered = isLevelMastered(level.id, lessonIds);
    setLevelMastered(mastered);
  }, [level.id, lessons]);

  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link href="/school">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to School
        </Button>
      </Link>

      {/* Level header */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-3 flex-1">
            <h1 className="text-4xl font-bold tracking-tight">
              {level.title}
            </h1>
            <p className="text-lg text-slate-400">
              {level.subtitle}
            </p>
          </div>
          
          {levelMastered && (
            <Badge variant="success" className="text-base px-4 py-2">
              Mastered ✅
            </Badge>
          )}
        </div>
        
        {levelMastered && (
          <Card className="border-green-500/30 bg-green-500/5">
            <CardContent className="pt-4">
              <p className="text-slate-300 italic">
                {level.id === 1 && (
                  <>&ldquo;You understand checks, mates, and the tragedy of stalemate. Good. Now we can speak of tactics.&rdquo;</>
                )}
                {level.id === 2 && (
                  <>&ldquo;You see forks, pins, and skewers. Now you are ready to suffer and to make others suffer tactically.&rdquo;</>
                )}
                {level.id === 3 && (
                  <>&ldquo;You can race pawns, take opposition, and convert King + pawn vs King. From here, we only refine.&rdquo;</>
                )}
                {level.id >= 4 && (
                  <>&ldquo;Well done. You have mastered this level.&rdquo;</>
                )}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lessons list */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Lessons</h2>
        
        {lessons.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-slate-400 text-center">
                No lessons available yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          lessons.map((lesson) => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              levelId={level.id}
            />
          ))
        )}
      </div>

      {/* Exam section */}
      {hasExam && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Final Exam</h2>
          <Card className={examUnlocked ? "border-yellow-500/30 bg-yellow-500/5" : "border-slate-700/50 bg-slate-800/30"}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {examUnlocked ? (
                      <Target className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Lock className="h-5 w-5 text-slate-500" />
                    )}
                    Level {level.id} Boss Fight
                  </CardTitle>
                  <CardDescription className="text-base">
                    {examUnlocked 
                      ? "Test your mastery of this level with challenging puzzles."
                      : "Complete all lessons to unlock this challenge."}
                  </CardDescription>
                </div>
                
                {examPassed && (
                  <Badge variant="success" className="ml-4 flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    Passed
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {!examUnlocked && (
                <p className="text-sm text-slate-400 italic">
                  &ldquo;First complete all lessons of this level. Then you may face the final exam.&rdquo;
                </p>
              )}
              
              <Link href={`/school/level/${level.id}/exam`}>
                <Button 
                  className="w-full gap-2" 
                  disabled={!examUnlocked}
                  variant={examUnlocked ? "primary" : "outline"}
                >
                  {examUnlocked ? (
                    <>
                      <Target className="h-4 w-4" />
                      {examPassed ? 'Retake Exam' : 'Take Exam'}
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Locked
                    </>
                  )}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Level 1 → Level 2 Transition CTA */}
      {level.id === 1 && levelMastered && (
        <div className="space-y-4">
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader>
              <CardTitle className="text-xl">Ready for the Next Challenge?</CardTitle>
              <CardDescription className="text-base">
                You have mastered the fundamentals. Now learn to attack the pieces themselves.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 italic mb-4">
                &ldquo;Good. You can see checks, mates, and stalemates. Now we teach you to attack the pieces themselves.&rdquo;
              </p>
              <Link href="/school/level/2">
                <Button className="w-full gap-2" size="lg">
                  <ChevronRight className="h-5 w-5" />
                  Advance to Level 2 – The Tactical Eye
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Level 2 → Level 3 Transition CTA */}
      {level.id === 2 && levelMastered && (
        <div className="space-y-4">
          <Card className="border-emerald-500/30 bg-emerald-500/5">
            <CardHeader>
              <CardTitle className="text-xl">The Truth Awaits</CardTitle>
              <CardDescription className="text-base">
                You have mastered tactics. Now learn the endgame—the truth of chess.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 italic mb-4">
                &ldquo;Capablanca said: learn the endgame first. You are ready now. This is where the truth lives.&rdquo;
              </p>
              <Link href="/school/level/3">
                <Button className="w-full gap-2" size="lg">
                  <ChevronRight className="h-5 w-5" />
                  Advance to Level 3 – The Truth
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface LessonCardProps {
  lesson: Lesson;
  levelId: number;
}

function LessonCard({ lesson, levelId }: LessonCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl">
              {lesson.title}
            </CardTitle>
            <CardDescription className="text-base">
              {lesson.summary}
            </CardDescription>
          </div>
          
          <Badge variant="secondary" className="ml-4 flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            {lesson.XP} XP
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Link href={`/school/level/${levelId}/lesson/${lesson.slug}`}>
          <Button className="w-full gap-2">
            <Play className="h-4 w-4" />
            Start Lesson
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
