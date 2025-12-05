"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Chessboard, type HighlightsMap, type BoardState } from "./Chessboard";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  type Lesson,
  type LessonTask,
  getTaskByIndex,
  isLastTask,
  getTaskMessage,
  getNextLesson,
} from "@/lib/lessons";
import {
  handleSquareClick as engineHandleClick,
  getInitialInteractionState,
  type LessonInteractionState,
} from "@/lib/lessons/engine";
import { completeLessonAction } from "@/app/lessons/[slug]/actions";
import { useChessAudio } from "@/hooks/useChessAudio";

// ============================================
// TYPES
// ============================================

type FeedbackState = "idle" | "correct" | "error";

interface LessonPlayerProps {
  lesson: Lesson;
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
            <div className="bg-chessio-bg dark:bg-chessio-bg-dark rounded-lg p-4">
              <p className="font-medium text-chessio-text dark:text-chessio-text-dark">
                {task.prompt}
              </p>
            </div>

            {/* Feedback Area - Fixed height to prevent layout jump */}
            <div className="min-h-[48px] flex items-center">
              {feedback === "correct" && (
                <p className="text-sm text-chessio-success flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {successMessage}
                </p>
              )}
              {feedback === "error" && (
                <p className="text-sm text-chessio-warning flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {failureMessage}
                </p>
              )}
            </div>

            {/* Hint Section */}
            <div className="pt-2 border-t border-chessio-border dark:border-chessio-border-dark">
              {showHint ? (
                <p className="text-sm text-chessio-muted dark:text-chessio-muted-dark italic">
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
        <div className="w-full max-w-[400px] pl-6">
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

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const router = useRouter();
  const { play } = useChessAudio();

  // Lesson state - task index and completion
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [isLessonComplete, setIsLessonComplete] = useState(false);

  // XP state for completion feedback
  const [xpAwarded, setXpAwarded] = useState<number | null>(null);
  const [totalXp, setTotalXp] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  // Current task
  const currentTask = getTaskByIndex(lesson, currentTaskIndex);
  const totalTasks = lesson.tasks.length;
  const isLastTaskInLesson = isLastTask(lesson, currentTaskIndex);

  // Get next lesson for navigation (null if this is the last lesson)
  const nextLesson = getNextLesson(lesson.slug);

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
    }
  }, [isLessonComplete, play]);

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
              setAlreadyCompleted(result.alreadyCompleted);
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
    setTotalXp(null);
    setAlreadyCompleted(false);
  }, []);

  // Handle back to dashboard
  const handleBackToDashboard = useCallback(() => {
    router.push("/app");
  }, [router]);

  // Handle next lesson
  const handleNextLesson = useCallback(() => {
    if (nextLesson) {
      router.push(`/lessons/${nextLesson.slug}`);
    }
  }, [router, nextLesson]);

  // No task available
  if (!currentTask) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-chessio-muted">No tasks found for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-lg text-chessio-text dark:text-chessio-text-dark">
              {lesson.title}
            </h2>
            <Badge variant="default">
              Level {lesson.level}
            </Badge>
          </div>
          <p className="text-sm text-chessio-muted dark:text-chessio-muted-dark">
            {lesson.description}
          </p>
        </CardContent>
      </Card>

      {/* Lesson Complete State */}
      {isLessonComplete ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4 py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-chessio-text dark:text-chessio-text-dark">
                Lesson Complete!
              </h3>
              <p className="text-chessio-muted dark:text-chessio-muted-dark">
                You&apos;ve finished &quot;{lesson.title}&quot;
              </p>

              {/* XP Feedback */}
              {isSaving ? (
                <p className="text-sm text-chessio-muted dark:text-chessio-muted-dark animate-pulse">
                  Saving your progress...
                </p>
              ) : xpAwarded !== null ? (
                <div className="space-y-2">
                  {xpAwarded > 0 ? (
                    <>
                      <Badge variant="success" className="text-sm px-3 py-1">
                        +{xpAwarded} XP earned!
                      </Badge>
                      <p className="text-sm text-chessio-muted dark:text-chessio-muted-dark">
                        Total XP: {totalXp}
                      </p>
                    </>
                  ) : alreadyCompleted ? (
                    <>
                      <Badge variant="default" className="text-sm px-3 py-1">
                        Already Completed
                      </Badge>
                      <p className="text-xs text-chessio-muted dark:text-chessio-muted-dark">
                        Nice practice! Your total XP: {totalXp}
                      </p>
                    </>
                  ) : null}
                </div>
              ) : (
                // Fallback if server call failed
                <Badge variant="success" className="text-sm px-3 py-1">
                  +{lesson.xpReward} XP
                </Badge>
              )}

              <div className="flex flex-col gap-3 pt-4">
                {nextLesson ? (
                  <Button variant="primary" size="lg" onClick={handleNextLesson}>
                    Next: {nextLesson.title}
                  </Button>
                ) : (
                  <div className="text-sm text-chessio-success font-medium mb-2">
                    🎊 Level 0 Complete!
                  </div>
                )}
                <Button variant="secondary" onClick={handleReplay}>
                  Replay Lesson
                </Button>
                <Button variant="ghost" onClick={handleBackToDashboard}>
                  Back to Dashboard
                </Button>
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
    </div>
  );
}

export default LessonPlayer;
