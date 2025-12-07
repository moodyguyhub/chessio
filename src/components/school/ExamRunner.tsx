'use client';

import { useState } from 'react';
import { ExamPuzzle, FailPattern } from '@/lib/school/types';
import { Chessboard } from '@/components/chess/Chessboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { ArrowLeft, Trophy, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { markLevelExamPassed } from '@/lib/school/progress';
import { ExamFeedback } from '@/components/feedback/ExamFeedback';
import { useVoice } from '@/hooks/useVoice';
import { logVoiceEvent } from '@/lib/voice';

interface ExamRunnerProps {
  level: number;
  levelTitle: string;
  puzzles: ExamPuzzle[];
  failPatterns: Record<string, FailPattern>;
}

type FeedbackType = 'success' | 'error' | 'idle';

export default function ExamRunner({ level, levelTitle, puzzles, failPatterns }: ExamRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string }>({
    type: 'idle',
    message: '',
  });
  const [isFinished, setIsFinished] = useState(false);

  const currentPuzzle = puzzles[currentIndex];
  const isLastPuzzle = currentIndex === puzzles.length - 1;

  const handleSquareClick = (square: string) => {
    if (!currentPuzzle || feedback.type !== 'idle') return;

    if (!selectedSquare) {
      setSelectedSquare(square);
    } else {
      const from = selectedSquare;
      const to = square;
      const moveUCI = from + to;

      const isCorrect = currentPuzzle.correctMoves.some(
        (correctMove) => correctMove.toLowerCase() === moveUCI.toLowerCase()
      );

      if (isCorrect) {
        setCorrectCount(prev => prev + 1);
        const successMsg = currentPuzzle.coachOnSuccess || 'Excellent.';
        setFeedback({ type: 'success', message: successMsg });
        setSelectedSquare(null);

        setTimeout(() => {
          if (isLastPuzzle) {
            handleExamComplete();
          } else {
            setCurrentIndex(prev => prev + 1);
            setFeedback({ type: 'idle', message: '' });
          }
        }, 2500);
      } else {
        // Fail - check for specific failure hint
        let errorMessage = "That's not the best move here. Think again.";
        
        if (currentPuzzle.failureHints && currentPuzzle.failureHints.length > 0) {
          const hint = currentPuzzle.failureHints.find(h => h.move.toLowerCase() === moveUCI.toLowerCase());
          if (hint && failPatterns[hint.failPatternId]) {
            errorMessage = failPatterns[hint.failPatternId].coachMessage;
          }
        }

        setFeedback({
          type: 'error',
          message: errorMessage,
        });
        setSelectedSquare(null);
        
        setTimeout(() => {
          setFeedback({ type: 'idle', message: '' });
        }, 2000);
      }
    }
  };

  const handleExamComplete = () => {
    markLevelExamPassed(level);
    setIsFinished(true);
  };

  if (isFinished) {
    return <ExamComplete level={level} levelTitle={levelTitle} correctCount={correctCount} totalCount={puzzles.length} />;
  }

  const highlights: Record<string, "selected" | "target"> = {};
  if (selectedSquare) {
    highlights[selectedSquare] = "selected";
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/school/level/${level}`}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {levelTitle}
          </Button>
        </Link>

        <Badge variant="secondary">
          Puzzle {currentIndex + 1} of {puzzles.length}
        </Badge>
      </div>

      {/* Exam title */}
      <div className="text-center">
        <h1 className="text-3xl font-bold">Level {level} Exam</h1>
        <p className="text-slate-400 mt-2">Prove your mastery.</p>
      </div>

      {/* Puzzle area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chessboard */}
        <Card>
          <CardContent className="pt-6 flex justify-center">
            <Chessboard
              fen={currentPuzzle.fen}
              onSquareClick={handleSquareClick}
              highlights={highlights}
              state={{ isDisabled: feedback.type !== 'idle' }}
            />
          </CardContent>
        </Card>

        {/* Prompt & Feedback */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Challenge</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{currentPuzzle.prompt}</p>
            </CardContent>
          </Card>

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

// Voice constants for exam verdicts
const EXAM_PASS_VOICE = "Good. The board agrees with you. You are ready to advance. Remember what you saw here: patterns, not moves.";
const EXAM_FAIL_VOICE = "The board is honest. You missed patterns that you must see quickly. Review the study units, then try again.";

interface ExamCompleteProps {
  level: number;
  levelTitle: string;
  correctCount: number;
  totalCount: number;
}

function ExamComplete({ level, levelTitle, correctCount, totalCount }: ExamCompleteProps) {
  const isPerfect = correctCount === totalCount;
  const { canUseVoice, isSpeaking, play, stop } = useVoice();

  // Select voice text based on pass/fail (passing is not getting a perfect score, just completing)
  const verdictVoiceText = isPerfect ? EXAM_PASS_VOICE : EXAM_FAIL_VOICE;

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      stop();
      logVoiceEvent('exam_verdict', { action: 'stop', level, isPerfect, correctCount, totalCount });
    } else {
      play(verdictVoiceText, { rate: 0.95, pitch: 0.95 });
      logVoiceEvent('exam_verdict', { action: 'play', level, isPerfect, correctCount, totalCount });
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Success header */}
      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Trophy className="h-16 w-16 text-yellow-500" />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Level {level} Exam Complete</h1>
              <p className="text-lg text-slate-400">
                You solved <span className="text-white font-semibold">{correctCount}</span> out of <span className="text-white font-semibold">{totalCount}</span> puzzles.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coach message */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-lg">The Coach says...</CardTitle>
            {canUseVoice && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleVoiceToggle}
                aria-label={isSpeaking ? "Stop voice coach" : "Play voice coach"}
                className="h-8 w-8 shrink-0 p-0"
                data-testid="exam-voice-toggle"
              >
                <Volume2 className={isSpeaking ? "h-5 w-5 text-emerald-400" : "h-5 w-5 text-neutral-400"} />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="italic text-slate-400">
            {isPerfect 
              ? "Excellent. You did not guess; you understood."
              : "Good work. Review the level again and come back for a perfect score."
            }
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Link href={`/school/level/${level}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Back to {levelTitle}
          </Button>
        </Link>
        <Link href="/school" className="flex-1">
          <Button className="w-full">
            Continue to School
          </Button>
        </Link>
      </div>

      {/* Exam Feedback */}
      <ExamFeedback level={level} />
    </div>
  );
}
