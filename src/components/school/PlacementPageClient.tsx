'use client';

import { useState, useEffect } from 'react';
import { PlacementResult } from '@/lib/placement/types';
import { getPlacementResult } from '@/lib/placement/storage';
import { trackPlacementStarted, trackPlacementRetake } from '@/lib/placement/telemetry';
import { PlacementRunner, PlacementResultScreen } from '@/components/school/PlacementRunner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Trophy } from 'lucide-react';

interface PlacementPageClientProps {
  exam: {
    title: string;
    description: string;
    passingScore: number;
    puzzles: any[];
  };
}

export function PlacementPageClient({ exam }: PlacementPageClientProps) {
  const [hasStarted, setHasStarted] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);

  useEffect(() => {
    // Check if user has already completed the test
    const stored = getPlacementResult();
    if (stored && stored.status !== "not_taken") {
      setResult(stored as PlacementResult);
    }
  }, []);

  const handleComplete = (completedResult: PlacementResult) => {
    setResult(completedResult);
  };

  const handleRetake = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("chessio_placement_v1");
    }
    trackPlacementRetake();
    setResult(null);
    setHasStarted(false);
  };

  // Show result screen if already taken
  if (result) {
    return (
      <div className="min-h-screen bg-chessio-bg-dark py-10" data-testid="placement-result">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          <PlacementResultScreen result={result} />

          {/* Retake option */}
          <div className="mt-6 text-center">
            <button
              onClick={handleRetake}
              className="text-sm text-neutral-500 hover:text-neutral-300 transition-colors underline"
              data-testid="placement-retake"
            >
              Retake the test (resets your placement)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show intro screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-chessio-bg-dark py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>

          {/* Intro card */}
          <Card className="border-neutral-800 bg-neutral-900/80">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mx-auto">
                <Trophy className="h-8 w-8 text-amber-400" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold text-neutral-50">
                  {exam.title}
                </CardTitle>
                <p className="text-lg text-neutral-400">
                  {exam.description}
                </p>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Explanation */}
              <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 px-5 py-4">
                <p className="text-neutral-300 leading-relaxed">
                  5 positions. 5 minutes.
                  <br />
                  <br />
                  If you score 4 or 5, Pre-School is optional — we unlock the Chess School immediately.
                  <br />
                  If you score 3 or less, we start by rebuilding your foundation.
                </p>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <p className="text-sm text-neutral-500">What you need:</p>
                <ul className="space-y-2 text-sm text-neutral-400">
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">•</span>
                    Pass {exam.passingScore} out of {exam.puzzles.length} puzzles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">•</span>
                    Understand basic piece movement and tactics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-amber-400">•</span>
                    Recognize simple checkmates
                  </li>
                </ul>
              </div>

              {/* Action */}
              <Button 
                size="lg" 
                className="w-full"
                onClick={() => {
                  trackPlacementStarted();
                  setHasStarted(true);
                }}
                data-testid="placement-begin"
              >
                Begin Test
              </Button>

              <p className="text-xs text-center text-neutral-500">
                You can retake this test later if needed
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Show runner
  return (
    <div className="min-h-screen bg-chessio-bg-dark py-10" data-testid="placement-running">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-50 mb-2">
            {exam.title}
          </h1>
          <p className="text-sm text-neutral-400">
            Answer each puzzle to the best of your ability
          </p>
        </div>

        <PlacementRunner
          puzzles={exam.puzzles}
          passingScore={exam.passingScore}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
