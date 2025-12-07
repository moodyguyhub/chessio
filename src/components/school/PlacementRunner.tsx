'use client';

import { useState } from 'react';
import { PlacementPuzzle, PlacementResult } from '@/lib/placement/types';
import { Chessboard } from '@/components/chess/Chessboard';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Alert, AlertDescription } from '@/components/ui/Alert';
import { savePlacementResult } from '@/lib/placement/storage';
import { trackPlacementCompleted } from '@/lib/placement/telemetry';
import { useVoice } from '@/hooks/useVoice';
import { logVoiceEvent } from '@/lib/voice';
import { Volume2 } from 'lucide-react';
import Link from 'next/link';
import { useSoundscape } from '@/lib/sound/SoundProvider';

interface PlacementRunnerProps {
  puzzles: PlacementPuzzle[];
  passingScore: number;
  onComplete: (result: PlacementResult) => void;
}

type FeedbackType = 'success' | 'error' | 'idle';

export function PlacementRunner({ puzzles, passingScore, onComplete }: PlacementRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string }>({
    type: 'idle',
    message: '',
  });
  const { play } = useSoundscape();

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

      const isCorrect = currentPuzzle.correctUci.toLowerCase() === moveUCI.toLowerCase();

      if (isCorrect) {
        play("answer_correct");
        setCorrectCount(prev => prev + 1);
        setFeedback({ 
          type: 'success', 
          message: 'Good. This is how a player answers.' 
        });
        setSelectedSquare(null);

        setTimeout(() => {
          if (isLastPuzzle) {
            handleComplete();
          } else {
            setCurrentIndex(prev => prev + 1);
            setFeedback({ type: 'idle', message: '' });
          }
        }, 1800);
      } else {
        play("answer_wrong");
        // Check for specific fail state
        const failState = currentPuzzle.failStates.find(
          f => f.wrongUci.toLowerCase() === moveUCI.toLowerCase()
        );

        const errorMessage = failState 
          ? failState.message
          : "Not quite. Look again at the King and the pieces around him.";

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

  const handleComplete = () => {
    const score = correctCount;
    const total = puzzles.length;
    const status = score >= passingScore ? "passed" : "failed";
    
    // Play completion sounds
    if (status === "passed") {
      play("level_up");
      // Coach voice plays after level_up
      setTimeout(() => {
        play("coach_foundation");
      }, 800);
    }
    
    const result: PlacementResult = {
      status,
      score,
      total,
      takenAt: new Date().toISOString(),
    };

    savePlacementResult(result);
    trackPlacementCompleted(score, total, status);
    onComplete(result);
  };

  const highlights: Record<string, "selected" | "target"> = {};
  if (selectedSquare) {
    highlights[selectedSquare] = "selected";
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between text-sm text-neutral-400">
        <span>Puzzle {currentIndex + 1} of {puzzles.length}</span>
        <span>Score: {correctCount}/{puzzles.length}</span>
      </div>

      {/* Puzzle card */}
      <Card className="border-neutral-800 bg-neutral-900/80">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {currentPuzzle.category}
            </Badge>
            <span className="text-xs text-neutral-500">{currentPuzzle.title}</span>
          </div>
          <h3 className="text-lg font-medium text-neutral-50">
            {currentPuzzle.question}
          </h3>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Board */}
          <div className="mx-auto max-w-md">
            <Chessboard
              fen={currentPuzzle.fen}
              onSquareClick={handleSquareClick}
              highlights={highlights}
            />
          </div>

          {/* Feedback */}
          {feedback.type !== 'idle' && (
            <Alert variant={feedback.type === 'success' ? 'default' : 'destructive'}>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>
          )}

          {/* Coach hint */}
          {feedback.type === 'idle' && (
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-4 py-3">
              <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1">
                Coach Hint
              </p>
              <p className="text-sm text-neutral-400">
                {currentPuzzle.coachHint}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Voice Coach verdicts for Placement Test
const PLACEMENT_PASS_VOICE = `
Good. You know how the pieces fight.
Pre-School would bore you.
Welcome to the Academy. Now the real work begins.
`.trim();

const PLACEMENT_FAIL_VOICE = `
Stop.
You have potential, but your foundation is cracked.
If we throw you into the advanced class now, you will just memorize moves without understanding.
Go to Pre-School. Build your hands. Then come back and conquer.
`.trim();

interface ResultScreenProps {
  result: PlacementResult;
}

export function PlacementResultScreen({ result }: ResultScreenProps) {
  const passed = result.status === "passed";
  const { canUseVoice, isSpeaking, play, stop } = useVoice();
  
  const verdictVoiceText = passed ? PLACEMENT_PASS_VOICE : PLACEMENT_FAIL_VOICE;

  const handleVoiceToggle = () => {
    if (isSpeaking) {
      stop();
    } else {
      play(verdictVoiceText, {
        rate: 0.95,
        pitch: 0.95,
        lang: 'en-US',
      });
      logVoiceEvent('placement_verdict', { result: passed ? 'pass' : 'fail' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Result card */}
      <Card className={`border-2 ${
        passed 
          ? "border-green-500/30 bg-green-500/5" 
          : "border-amber-500/30 bg-amber-500/5"
      }`}>
        <CardHeader className="text-center space-y-4 pb-6">
          <div className={`text-5xl ${passed ? "text-green-400" : "text-amber-400"}`}>
            {passed ? "✓" : "○"}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-2xl font-bold text-neutral-50">
                {passed ? "You passed." : "Not yet."}
              </h2>
              {canUseVoice && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={handleVoiceToggle}
                  aria-label={isSpeaking ? "Stop coach voice" : "Hear the coach verdict"}
                  data-testid="placement-voice-toggle"
                >
                  <Volume2 className={`h-4 w-4 ${isSpeaking ? 'text-emerald-400' : 'text-neutral-400'}`} />
                </Button>
              )}
            </div>
            <p className="text-sm text-neutral-400">
              You solved {result.score} of {result.total}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Coach message */}
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 px-5 py-4">
            <p className="text-neutral-300 leading-relaxed whitespace-pre-line">
              {passed ? (
                `Good.\nYou know how the pieces fight.\nPre-School would bore you.\n\nWelcome to the Academy. Now the real work begins.`
              ) : (
                `Stop.\nYou have potential, but your foundation is cracked.\nIf we throw you into the advanced class now, you will just memorize moves without understanding.\n\nGo to Pre-School. Build your hands. Then come back and conquer.`
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href={passed ? "/school" : "/app"} className="w-full">
              <Button size="lg" className="w-full">
                {passed ? "Enter Chess School" : "Start in Chessio Pre-School"}
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full">
              <Button size="lg" variant="outline" className="w-full">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
