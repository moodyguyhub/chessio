"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Chessboard, type HighlightsMap, type BoardState } from "./Chessboard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { XpBreakdown } from "@/components/ui/XpBreakdown";
import { BishopModal } from "@/components/ui/BishopModal";
import {
  type Lesson,
  type LessonTask,
  getTaskByIndex,
  isLastTask,
  getTaskMessage,
} from "@/lib/lessons";
import {
  handleSquareClick as engineHandleClick,
  getInitialInteractionState,
  type LessonInteractionState,
} from "@/lib/lessons/engine";
import { completeLessonAction, type CompleteLessonActionResult } from "@/app/lessons/[slug]/actions";
import { useChessAudio } from "@/hooks/useChessAudio";
import type { NextStep } from "@/lib/lessons/next-step";

// ============================================
// TYPES
// ============================================

type FeedbackState = "idle" | "correct" | "error";

interface XpStats {
  totalXp: number;
  level: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPercent: number;
}

interface LessonPlayerProps {
  lesson: Lesson;
  initialXpStats?: XpStats;
}

interface TaskPlayerProps {
  task: LessonTask;
  taskIndex: number;
  totalTasks: number;
  onComplete: (isCorrect: boolean) => void;
  isLast: boolean;
  playSound: (type: "move" | "capture" | "success" | "error") => void;
}

// ============================================
// HELPERS
// ============================================

/**
 * Build highlights map based on current state
 */
function buildHighlights(
  task: LessonTask,
  interactionState: LessonInteractionState,
  feedback: FeedbackState
): HighlightsMap {
  const highlights: HighlightsMap = {};

  if (task.kind === "select-square") {
    // For select-square, show target on success
    if (feedback === "correct") {
      highlights[task.targetSquare] = "success";
    }
  } else {
    // move-piece
    const { selectedSquare } = interactionState;

    if (feedback === "correct") {
      // Show success on the target square
      highlights[task.expectedMove.to] = "success";
      highlights[task.expectedMove.from] = "hint";
    } else if (feedback === "error" && selectedSquare) {
      // Show warning on incorrect attempt
      highlights[selectedSquare] = "warning";
    } else if (selectedSquare) {
      // Show selected square and target hint
      highlights[selectedSquare] = "selected";
      highlights[task.expectedMove.to] = "target";
    }
  }

  return highlights;
}

// ============================================
// TASK PLAYER COMPONENT (handles single task state)
// ============================================

function TaskPlayer({ task, taskIndex, totalTasks, onComplete, isLast, playSound }: TaskPlayerProps) {
  // Task-local state - resets when component remounts (via key in parent)
  const [fen, setFen] = useState(task.initialFen);
  const [interactionState, setInteractionState] = useState<LessonInteractionState>(
    getInitialInteractionState()
  );
  const [feedback, setFeedback] = useState<FeedbackState>("idle");
  const [showHint, setShowHint] = useState(false);

  // Timer ref for cleanup
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Board state
  const isBoardLocked = feedback === "correct";
  const boardState: BoardState = {
    isDisabled: isBoardLocked,
    isCorrect: feedback === "correct",
    isError: feedback === "error",
  };

  // Build highlights
  const highlights = buildHighlights(task, interactionState, feedback);

  // Auto-clear error feedback after delay
  useEffect(() => {
    if (feedback === "error") {
      feedbackTimerRef.current = setTimeout(() => {
        setFeedback("idle");
      }, 1500);
    }
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, [feedback]);

  // Handle board click
  const handleBoardClick = useCallback(
    (square: string) => {
      if (isBoardLocked) return;

      const result = engineHandleClick({
        task,
        currentFen: fen,
        state: interactionState,
        clickedSquare: square,
      });

      // Update state
      setInteractionState(result.state);
      setFen(result.newFen);

      if (result.isAttemptComplete) {
        if (result.isCorrect) {
          // Check if this was a capture (FEN changed and destination had a piece)
          const wasCapture = result.newFen !== fen && task.kind === "move-piece";
          playSound(wasCapture ? "capture" : "move");
          setFeedback("correct");
          // Notify parent after brief delay for feedback
          setTimeout(() => onComplete(true), isLast ? 800 : 1000);
        } else {
          playSound("error");
          setFeedback("error");
        }
      } else if (result.state.selectedSquare && !interactionState.selectedSquare) {
        // Just selected a piece (first click)
        playSound("move");
      }
    },
    [task, fen, interactionState, isBoardLocked, onComplete, isLast, playSound]
  );

  // Handle hint request
  const handleRequestHint = useCallback(() => {
    setShowHint(true);
  }, []);

  // Get feedback messages
  const successMessage = getTaskMessage(task, "success");
  const failureMessage = getTaskMessage(task, "failure");
  const hintMessage = getTaskMessage(task, "hint");

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Task Panel - Left on desktop, bottom on mobile */}
      <div className="md:w-1/2 order-2 md:order-1">
        <Card className="h-full">
          <CardContent className="pt-6 space-y-4">
            {/* Progress */}
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-chessio-primary">
                Task {taskIndex + 1} of {totalTasks}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: totalTasks }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < taskIndex
                        ? "bg-chessio-success"
                        : i === taskIndex
                        ? "bg-chessio-primary"
                        : "bg-chessio-border dark:bg-chessio-border-dark"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Task Prompt */}
            <div className="bg-slate-800/30 border border-white/5 rounded-lg p-4">
              <p className="text-sm text-slate-400 mb-1">Your task</p>
              <p className="font-medium text-white tracking-tight">
                {task.prompt}
              </p>
            </div>

            {/* Feedback Area - Fixed height to prevent layout jump */}
            <div className="min-h-[48px] flex items-center">
              {feedback === "correct" && (
                <p className="text-sm text-teal-400 flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {successMessage}
                </p>
              )}
              {feedback === "error" && (
                <p className="text-sm text-amber-400 flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {failureMessage}
                </p>
              )}
            </div>

            {/* Hint Section */}
            <div className="pt-2 border-t border-white/5">
              {showHint ? (
                <p className="text-sm text-slate-400 italic">
                  💡 {hintMessage}
                </p>
              ) : (
                <Button variant="ghost" size="sm" onClick={handleRequestHint}>
                  Need a hint?
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Board - Right on desktop, top on mobile */}
      <div className="md:w-1/2 flex justify-center order-1 md:order-2">
        <div className="w-full max-w-[min(400px,100%)]">
          <Chessboard
            fen={fen}
            onSquareClick={handleBoardClick}
            highlights={highlights}
            state={boardState}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN LESSON PLAYER COMPONENT
// ============================================

export function LessonPlayer({ lesson, initialXpStats }: LessonPlayerProps) {
  const router = useRouter();
  const { play } = useChessAudio();

  // Lesson state - task index and completion
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // XP state for completion feedback
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [totalXp, setTotalXp] = useState<number | null>(initialXpStats?.totalXp ?? null);
  const [previousXp, setPreviousXp] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [leveledUp, setLeveledUp] = useState(false);
  const [newLevel, setNewLevel] = useState<number | null>(null);
  const [contentTypeLabel, setContentTypeLabel] = useState<string | null>(null);
  const [bishopAchieved, setBishopAchieved] = useState(false);
  const [showBishopModal, setShowBishopModal] = useState(false);

  // Next step recommendation (computed server-side after completion)
  const [nextStep, setNextStep] = useState<NextStep | null>(null);

  // Current task
  const currentTask = getTaskByIndex(lesson, currentTaskIndex);
  const totalTasks = lesson.tasks.length;
  const isLastTaskInLesson = isLastTask(lesson, currentTaskIndex);

  // Fire confetti and play success sound when lesson completes
  useEffect(() => {
    if (isLessonComplete) {
      // Play the "quiet triumph" chime
      play("success");
      
      // Fire confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10B981", "#6366F1", "#F59E0B"], // Emerald, Indigo, Amber
      });

      // Trigger modal animation after confetti pops
      const timer = setTimeout(() => setShowSuccess(true), 150);
      return () => clearTimeout(timer);
    } else {
      setShowSuccess(false);
    }
  }, [isLessonComplete, play]);

  // Show Bishop modal when bishopAchieved is true (after XP breakdown)
  useEffect(() => {
    if (bishopAchieved && isLessonComplete && !isSaving) {
      // Delay modal to let XP breakdown show first
      const timer = setTimeout(() => setShowBishopModal(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [bishopAchieved, isLessonComplete, isSaving]);

  // Handle task completion - advance to next or complete lesson
  const handleTaskComplete = useCallback(
    (isCorrect: boolean) => {
      if (isCorrect) {
        if (isLastTaskInLesson) {
          // Mark lesson as complete locally
          setIsLessonComplete(true);

          // Persist completion and award XP
          setIsSaving(true);
          completeLessonAction(lesson.slug)
            .then((result) => {
              setXpAwarded(result.xpAwarded);
              setTotalXp(result.totalXp);
              setPreviousXp(result.previousXp);
              setAlreadyCompleted(result.alreadyCompleted);
              setLeveledUp(result.leveledUp);
              setNewLevel(result.newLevel);
              setContentTypeLabel(result.contentTypeLabel);
              setBishopAchieved(result.bishopAchieved ?? false);
              setNextStep(result.nextStep);
            })
            .catch((err) => {
              console.error("Failed to complete lesson:", err);
              // Still show completion UI, just without XP info
            })
            .finally(() => {
              setIsSaving(false);
            });
        } else {
          setCurrentTaskIndex((prev) => prev + 1);
        }
      }
    },
    [isLastTaskInLesson, lesson.slug]
  );

  // Handle replay
  const handleReplay = useCallback(() => {
    setCurrentTaskIndex(0);
    setIsLessonComplete(false);
    // Reset XP state for replay (won't award again)
    setXpAwarded(null);
    setContentTypeLabel(null);
    setTotalXp(null);
    setPreviousXp(null);
    setLeveledUp(false);
    setNewLevel(null);
    setNextStep(null);
    setAlreadyCompleted(false);
  }, []);

  // Handle back to dashboard
  const handleBackToDashboard = useCallback(() => {
    router.push("/app");
  }, [router]);

  // Handle next step navigation
  const handleNextStep = useCallback(() => {
    if (nextStep?.href) {
      router.push(nextStep.href);
    }
  }, [router, nextStep]);

  // No task available
  if (!currentTask) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-400">No tasks found for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg text-white tracking-tight">
              {lesson.title}
            </h2>
            <Badge variant="default">
              Level {lesson.level}
            </Badge>
          </div>
          <p className="text-sm text-slate-400">
            {lesson.description}
          </p>
        </CardContent>
      </Card>

      {/* Lesson Complete State */}
      {isLessonComplete ? (
        <Card>
          <CardContent className="pt-6">
            <div 
              className={`
                text-center space-y-4 py-8
                transition-all duration-500 ease-out transform animate-slide-up
                ${showSuccess ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4"}
              `}
            >
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Lesson Complete
              </h3>
              <p className="text-slate-400">
                You&apos;ve finished &quot;{lesson.title}&quot;
              </p>

              {/* XP Breakdown */}
              {isSaving ? (
                <p className="text-sm text-slate-400 animate-pulse">
                  Saving your progress...
                </p>
              ) : xpAwarded !== null && totalXp !== null ? (
                <XpBreakdown
                  totalXpEarned={xpAwarded}
                  contentTypeLabel={contentTypeLabel ?? undefined}
                  newTotalXp={totalXp}
                  previousTotalXp={previousXp ?? undefined}
                  leveledUp={leveledUp}
                  newLevel={newLevel ?? undefined}
                  alreadyCompleted={alreadyCompleted}
                  bishopAchieved={bishopAchieved}
                />
              ) : (
                // Fallback if server call failed
                <Badge variant="success" className="text-sm px-3 py-1">
                  +{lesson.xpReward} XP
                </Badge>
              )}

              {/* Next Step Actions */}
              <div className="flex flex-col gap-3 pt-6">
                {nextStep ? (
                  <>
                    {/* Level completion celebration message */}
                    {nextStep.type === "level-complete" && (
                      <div className="text-sm text-teal-400 font-medium mb-2">
                        {nextStep.message}
                      </div>
                    )}
                    
                    {/* All complete message */}
                    {nextStep.type === "all-complete" && (
                      <div className="space-y-3">
                        <div className="text-sm text-teal-400 font-medium">
                          {nextStep.message}
                        </div>
                        <Button variant="primary" size="lg" onClick={handleBackToDashboard} className="w-full">
                          Back to Dashboard
                        </Button>
                      </div>
                    )}

                    {/* Primary CTA for next lesson/level */}
                    {nextStep.type !== "all-complete" && (
                      <Button variant="primary" size="lg" onClick={handleNextStep} className="w-full">
                        {nextStep.cta}
                      </Button>
                    )}

                    {/* Secondary actions */}
                    {nextStep.type !== "all-complete" && (
                      <>
                        <Button variant="secondary" onClick={handleReplay} className="w-full">
                          Replay Lesson
                        </Button>
                        <Button variant="ghost" onClick={handleBackToDashboard} className="w-full">
                          Back to Dashboard
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  // Fallback while loading or if no nextStep
                  <Button variant="primary" size="lg" onClick={handleBackToDashboard} className="w-full">
                    Back to Dashboard
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Active Task - key causes remount on task change, resetting TaskPlayer state
        <TaskPlayer
          key={`task-${currentTaskIndex}`}
          task={currentTask}
          taskIndex={currentTaskIndex}
          totalTasks={totalTasks}
          onComplete={handleTaskComplete}
          isLast={isLastTaskInLesson}
          playSound={play}
        />
      )}

      {/* Bishop Modal - Shows after completing lesson that crosses 375 XP threshold */}
      <BishopModal
        isOpen={showBishopModal}
        onClose={() => setShowBishopModal(false)}
      />
    </div>
  );
}

export default LessonPlayer;
