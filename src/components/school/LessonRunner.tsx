'use client';

import { useState } from 'react';
import { Lesson, FailPattern } from '@/lib/school/types';
import { Chessboard } from '@/components/chess/Chessboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { unlockSecretCard } from '@/lib/school/progress';
import LessonComplete from './LessonComplete';

interface LessonRunnerProps {
  lesson: Lesson;
  levelTitle: string;
  failPatterns: Record<string, FailPattern>;
  nextAction?: {
    href: string;
    label: string;
  };
}

type FeedbackType = 'success' | 'error' | 'idle';

export default function LessonRunner({ lesson, levelTitle, failPatterns, nextAction }: LessonRunnerProps) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string }>({
    type: 'idle',
    message: '',
  });
  const [isComplete, setIsComplete] = useState(false);

  const currentTask = lesson.tasks[taskIndex];
  const isLastTask = taskIndex === lesson.tasks.length - 1;

  const handleSquareClick = (square: string) => {
    if (!currentTask) return;

    if (!selectedSquare) {
      // First click - select piece
      setSelectedSquare(square);
    } else {
      // Second click - attempt move
      const from = selectedSquare;
      const to = square;
      const moveUCI = from + to;

      // Check if move is correct
      const isCorrect = currentTask.correctMoves.some(
        (correctMove) => correctMove.toLowerCase() === moveUCI.toLowerCase()
      );

      if (isCorrect) {
        // Success!
        const successMsg = currentTask.successMessage || 'Excellent. Move to the next task.';
        setFeedback({ type: 'success', message: successMsg });
        setSelectedSquare(null);

        // Move to next task after a short delay
        setTimeout(() => {
          if (isLastTask) {
            handleLessonComplete();
          } else {
            setTaskIndex((prev) => prev + 1);
            setFeedback({ type: 'idle', message: '' });
          }
        }, 2000);
      } else {
        // Fail - check for specific failure hint
        let errorMessage = 'Not quite. Try again.';
        
        if (currentTask.failureHints && currentTask.failureHints.length > 0) {
          const hint = currentTask.failureHints.find(h => h.move.toLowerCase() === moveUCI.toLowerCase());
          if (hint && failPatterns[hint.failPatternId]) {
            errorMessage = failPatterns[hint.failPatternId].coachMessage;
          }
        }

        setFeedback({
          type: 'error',
          message: errorMessage,
        });
        setSelectedSquare(null);
        
        // Clear error after delay
        setTimeout(() => {
          setFeedback({ type: 'idle', message: '' });
        }, 2000);
      }
    }
  };

  const handleLessonComplete = () => {
    // Unlock secret card if exists
    if (lesson.secretCardId) {
      unlockSecretCard(lesson.secretCardId);
    }
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <LessonComplete
        lesson={lesson}
        levelTitle={levelTitle}
        nextAction={nextAction}
      />
    );
  }

  // Build highlights for the board
  const highlights: Record<string, "selected" | "target"> = {};
  if (selectedSquare) {
    highlights[selectedSquare] = "selected";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/school/level/${lesson.level}`}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {levelTitle}
          </Button>
        </Link>

        <Badge variant="secondary">
          Task {taskIndex + 1} of {lesson.tasks.length}
        </Badge>
      </div>

      {/* Lesson intro (only on first task) */}
      {taskIndex === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{lesson.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 italic">
              &ldquo;{lesson.coachIntro}&rdquo;
            </p>
          </CardContent>
        </Card>
      )}

      {/* Task area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chessboard */}
        <Card>
          <CardContent className="pt-6 flex justify-center">
            <Chessboard
              fen={currentTask.fen}
              onSquareClick={handleSquareClick}
              highlights={highlights}
              state={{ isDisabled: feedback.type !== 'idle' }}
            />
          </CardContent>
        </Card>

        {/* Instructions & Feedback */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Task</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{currentTask.prompt}</p>
            </CardContent>
          </Card>

          {/* Feedback */}
          {feedback.type !== 'idle' && (
            <Alert variant={feedback.type === 'success' ? 'default' : 'destructive'}>
              <AlertDescription className="text-base">
                {feedback.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
