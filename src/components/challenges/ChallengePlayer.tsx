/**
 * Challenge Player Component
 * 
 * Client-side component for playing Coach's Challenges.
 * Handles all game state, move validation, and UI feedback.
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Square } from "chess.js";
import { Chessboard, type HighlightsMap } from "@/components/chess/Chessboard";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ChallengeEngine, type ChallengeState, type FailReason } from "@/lib/challenges/engine";
import { CoachChallengeConfig } from "@/lib/challenges/config";
import { useChessAudio } from "@/hooks/useChessAudio";

// ============================================
// TYPES
// ============================================

type ChallengeScreen = "intro" | "playing" | "result";

interface ChallengePlayerProps {
  config: CoachChallengeConfig;
  onExit?: () => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export function ChallengePlayer({ config, onExit }: ChallengePlayerProps) {
  const router = useRouter();
  const [screen, setScreen] = useState<ChallengeScreen>("intro");
  const [engine] = useState(() => new ChallengeEngine(config));
  const [fen, setFen] = useState(config.startingFEN);
  const [state, setState] = useState<ChallengeState>(engine.getState());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [highlights, setHighlights] = useState<HighlightsMap>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const audio = useChessAudio();

  // Handle square click
  const handleSquareClick = useCallback(
    (square: string) => {
      if (isAnimating || state.isFinished) return;

      // If no piece selected, try to select this square
      if (!selectedSquare) {
        const moves = engine.getLegalMoves(square as Square);
        if (moves.length > 0) {
          setSelectedSquare(square as Square);
          setHighlights({ [square]: "selected" });
          audio.play("move");
        }
        return;
      }

      // If clicking same square, deselect
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setHighlights({});
        return;
      }

      // Try to move
      setIsAnimating(true);
      const result = engine.attemptMove(selectedSquare, square as Square);

      if (result.success) {
        audio.play(result.move?.captured ? "capture" : "move");
        setFen(result.newFen!);
        setSelectedSquare(null);

        // Show move animation, then bot move
        setTimeout(() => {
          if (result.botMove && result.botMoveFen) {
            audio.play(result.botMove.captured ? "capture" : "move");
            setFen(result.botMoveFen);
          }

          setState(result.state);
          setHighlights({});
          setIsAnimating(false);

          // Check if finished
          if (result.state.isFinished) {
            if (result.state.pass) {
              audio.play("success");
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
            } else {
              audio.play("error");
            }

            setTimeout(() => {
              setScreen("result");
            }, 800);
          }
        }, 400);
      } else {
        // Invalid move
        audio.play("error");
        setSelectedSquare(null);
        setHighlights({});
        setIsAnimating(false);
      }
    },
    [engine, selectedSquare, isAnimating, state.isFinished, audio]
  );

  // Handle start challenge
  const handleStart = () => {
    setScreen("playing");
  };

  // Handle exit
  const handleExit = () => {
    if (onExit) {
      onExit();
    } else {
      router.push("/school");
    }
  };

  // Handle retry
  const handleRetry = () => {
    // Reload the page to reset all state
    router.refresh();
  };

  // Handle continue after success
  const handleContinue = () => {
    // TODO: Unlock next level, award badge, etc.
    router.push("/school");
  };

  // Render appropriate screen
  if (screen === "intro") {
    return <IntroScreen config={config} onStart={handleStart} onExit={handleExit} />;
  }

  if (screen === "result") {
    return (
      <ResultScreen
        config={config}
        state={state}
        onRetry={handleRetry}
        onContinue={handleContinue}
        onExit={handleExit}
      />
    );
  }

  // Playing screen
  return (
    <div className="min-h-screen bg-chessio-bg flex flex-col">
      {/* Header */}
      <div className="bg-chessio-surface-dark border-b border-chessio-border-dark px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-chessio-primary flex items-center justify-center text-2xl">
          🤖
        </div>
        <div className="flex-1">
          <h1 className="text-white font-bold text-sm">{config.title}</h1>
          <p className="text-slate-400 text-xs">{config.subtitle}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={handleExit}>
          Exit
        </Button>
      </div>

      {/* Board */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Chessboard
            fen={fen}
            onSquareClick={handleSquareClick}
            highlights={highlights}
            orientation={config.playerColor}
            state={{ isDisabled: isAnimating || state.isFinished }}
          />
        </div>
      </div>

      {/* HUD */}
      <div className="bg-chessio-surface-dark border-t border-chessio-border-dark px-4 py-4">
        <ChallengeHUD config={config} state={state} />
      </div>
    </div>
  );
}

// ============================================
// INTRO SCREEN
// ============================================

function IntroScreen({
  config,
  onStart,
  onExit,
}: {
  config: CoachChallengeConfig;
  onStart: () => void;
  onExit: () => void;
}) {
  return (
    <div className="min-h-screen bg-chessio-bg flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 space-y-6">
        {/* Chip avatar */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-chessio-primary flex items-center justify-center text-5xl">
            🤖
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{config.introHeading}</h2>
            <p className="text-slate-400 mt-2">{config.introBody}</p>
          </div>
        </div>

        {/* Mission bullets */}
        <div className="bg-chessio-bg rounded-lg p-4 space-y-2">
          <h3 className="text-chessio-primary font-bold text-sm mb-3">Your Mission:</h3>
          {config.introBullets.map((bullet, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-chessio-primary/20 flex items-center justify-center text-chessio-primary text-xs font-bold">
                {i + 1}
              </div>
              <span className="text-white text-sm">{bullet}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button variant="primary" size="lg" onClick={onStart} className="w-full">
            {config.level === 0 ? "Let's Play!" : "Bring it on!"}
          </Button>
          <Button variant="ghost" size="md" onClick={onExit} className="w-full">
            Back
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// RESULT SCREEN
// ============================================

function ResultScreen({
  config,
  state,
  onRetry,
  onContinue,
  onExit,
}: {
  config: CoachChallengeConfig;
  state: ChallengeState;
  onRetry: () => void;
  onContinue: () => void;
  onExit: () => void;
}) {
  const isSuccess = state.pass === true;

  const heading = isSuccess
    ? config.successHeading
    : getFailureHeading(config, state.failReason);

  const body = isSuccess
    ? config.successBody
    : getFailureBody(config, state.failReason);

  return (
    <div className="min-h-screen bg-chessio-bg flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-6 space-y-6">
        {/* Chip avatar with emotion */}
        <div className="flex flex-col items-center gap-3">
          <div className="w-20 h-20 rounded-full bg-chessio-primary flex items-center justify-center text-5xl">
            {isSuccess ? "🎉" : "🤔"}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white">{heading}</h2>
            <p className="text-slate-400 mt-2">{body}</p>
          </div>
        </div>

        {/* Success: show badge */}
        {isSuccess && (
          <div className="bg-chessio-bg rounded-lg p-6 flex flex-col items-center gap-3">
            <div className="text-5xl">🏆</div>
            <div className="text-center">
              <h3 className="text-chessio-primary font-bold">Challenge Passed!</h3>
              <p className="text-slate-400 text-sm mt-1">You&apos;ve proven your skills</p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          {isSuccess ? (
            <Button variant="primary" size="lg" onClick={onContinue} className="w-full">
              Continue
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={onRetry} className="w-full">
              Try Again
            </Button>
          )}
          <Button variant="ghost" size="md" onClick={onExit} className="w-full">
            {isSuccess ? "Back to School" : "Review Lessons"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================
// HUD COMPONENT
// ============================================

function ChallengeHUD({ config, state }: { config: CoachChallengeConfig; state: ChallengeState }) {
  const movesLeft = config.winCondition.maxMoves - state.movesPlayed;
  const progress = (state.movesPlayed / config.winCondition.maxMoves) * 100;

  if (config.winCondition.type === "captures") {
    return (
      <div className="space-y-2">
        <p className="text-slate-300 text-sm text-center">
          Capture 3 pieces without losing your Queen
        </p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="text-center">
            <span className="text-chessio-primary font-bold text-lg">
              {state.capturesByPlayer}
            </span>
            <span className="text-slate-400"> / {config.winCondition.targetCaptures}</span>
            <div className="text-xs text-slate-500">Captures</div>
          </div>
          <div className="text-center">
            <span className="text-white font-bold text-lg">{movesLeft}</span>
            <div className="text-xs text-slate-500">Moves left</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-chessio-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  } else {
    // materialLead
    return (
      <div className="space-y-2">
        <p className="text-slate-300 text-sm text-center">Win more pieces than Chip</p>
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="text-center">
            <span
              className={`font-bold text-lg ${
                state.materialScore >= 0 ? "text-chessio-primary" : "text-red-400"
              }`}
            >
              {state.materialScore > 0 ? "+" : ""}
              {state.materialScore}
            </span>
            <div className="text-xs text-slate-500">Score</div>
          </div>
          <div className="text-center">
            <span className="text-white font-bold text-lg">{movesLeft}</span>
            <div className="text-xs text-slate-500">Moves left</div>
          </div>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-chessio-primary transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    );
  }
}

// ============================================
// HELPERS
// ============================================

function getFailureHeading(config: CoachChallengeConfig, reason: FailReason | null): string {
  if (!reason) return "Let's try again";
  return config.failureHeadings[reason] || "Let's try again";
}

function getFailureBody(config: CoachChallengeConfig, reason: FailReason | null): string {
  if (!reason) return "Keep practicing!";
  return config.failureBodies[reason] || "Keep practicing!";
}
