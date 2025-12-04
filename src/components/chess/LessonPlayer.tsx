"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Chessboard } from "./Chessboard";
import { TaskBox } from "./TaskBox";
import { LessonCompleteModal } from "./LessonCompleteModal";

interface Task {
  id: number;
  index: number;
  instruction: string;
  startingFen: string;
  goalType: string;
  targetSquare: string;
  startSquare: string | null;
  validMoves: string;
  successMessage: string;
  failureDefault: string;
  failureSpecific: string | null;
  hintMessage: string;
}

interface Lesson {
  id: string;
  slug: string;
  title: string;
  pieceType: string;
  introText: string;
  xpReward: number;
  tasks: Task[];
}

interface LessonPlayerProps {
  lesson: Lesson;
  nextLesson?: { slug: string; title: string } | null;
}

// Parse FEN and update it after a move
function makeMove(fen: string, from: string, to: string): string {
  // Simple FEN manipulation for Level 0 (single piece moves on mostly empty board)
  const parts = fen.split(" ");
  const rows = parts[0].split("/");
  
  // Convert square to row/col
  const fromCol = from.charCodeAt(0) - 97;
  const fromRow = 8 - parseInt(from[1]);
  const toCol = to.charCodeAt(0) - 97;
  const toRow = 8 - parseInt(to[1]);
  
  // Expand the FEN rows to arrays
  const expandRow = (row: string): string[] => {
    const result: string[] = [];
    for (const char of row) {
      if (/\d/.test(char)) {
        for (let i = 0; i < parseInt(char); i++) {
          result.push("");
        }
      } else {
        result.push(char);
      }
    }
    return result;
  };
  
  const board = rows.map(expandRow);
  
  // Get the piece and make the move
  const piece = board[fromRow][fromCol];
  board[fromRow][fromCol] = "";
  board[toRow][toCol] = piece;
  
  // Collapse back to FEN
  const compressRow = (row: string[]): string => {
    let result = "";
    let emptyCount = 0;
    for (const cell of row) {
      if (cell === "") {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          result += emptyCount;
          emptyCount = 0;
        }
        result += cell;
      }
    }
    if (emptyCount > 0) {
      result += emptyCount;
    }
    return result || "8";
  };
  
  const newPosition = board.map(compressRow).join("/");
  return `${newPosition} ${parts.slice(1).join(" ")}`;
}

export function LessonPlayer({ lesson, nextLesson }: LessonPlayerProps) {
  const router = useRouter();
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | null; message: string | null }>({
    type: null,
    message: null,
  });
  const [showHint, setShowHint] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  
  // Use ref to track completion state to avoid stale closures
  const isCompletingRef = useRef(false);
  
  // Store the current FEN - derived from current task or modified by moves
  const [fenOverride, setFenOverride] = useState<string | null>(null);

  const currentTask = lesson.tasks[currentTaskIndex];
  const totalTasks = lesson.tasks.length;
  
  // Get the current FEN - use override if set, otherwise use task's starting FEN
  const currentFen = fenOverride ?? currentTask?.startingFen ?? "8/8/8/8/8/8/8/8 w - - 0 1";

  // Function to advance to next task - resets all task-specific state
  const advanceToNextTask = useCallback(() => {
    setCurrentTaskIndex((prev) => prev + 1);
    setFenOverride(null);
    setSelectedSquare(null);
    setFeedback({ type: null, message: null });
    setShowHint(false);
  }, []);

  // Lesson completion handler - defined first to avoid hook order issues
  const handleLessonComplete = useCallback(async () => {
    if (isCompletingRef.current) return;
    isCompletingRef.current = true;

    try {
      const res = await fetch(`/api/lessons/${lesson.id}/complete`, {
        method: "POST",
      });

      if (res.ok) {
        setShowCompleteModal(true);
      } else {
        // Still show modal even if API fails
        setShowCompleteModal(true);
      }
    } catch {
      // Show modal anyway
      setShowCompleteModal(true);
    }
  }, [lesson.id]);

  const handleSquareClick = useCallback((square: string) => {
    if (!currentTask) return;

    // For "select" tasks, check if this is the target square
    if (currentTask.goalType === "select") {
      const validMoves = JSON.parse(currentTask.validMoves) as string[];
      
      if (validMoves.includes(square)) {
        setFeedback({ type: "success", message: currentTask.successMessage });
        setSelectedSquare(square);
        
        // Move to next task after a delay
        setTimeout(() => {
          if (currentTaskIndex < totalTasks - 1) {
            advanceToNextTask();
          } else {
            handleLessonComplete();
          }
        }, 1500);
      } else {
        setFeedback({ type: "error", message: currentTask.failureDefault });
        setTimeout(() => setFeedback({ type: null, message: null }), 2000);
      }
      return;
    }

    // For move/capture tasks, handle piece selection
    if (selectedSquare === square) {
      setSelectedSquare(null);
    } else if (!selectedSquare) {
      // Select this square if it has a piece
      setSelectedSquare(square);
    }
  }, [currentTask, currentTaskIndex, totalTasks, selectedSquare, handleLessonComplete, advanceToNextTask]);

  const handleMove = useCallback((from: string, to: string) => {
    if (!currentTask || currentTask.goalType === "select") return;

    const moveStr = `${from}-${to}`;
    const validMoves = JSON.parse(currentTask.validMoves) as string[];

    if (validMoves.includes(moveStr)) {
      // Valid move!
      const newFen = makeMove(currentFen, from, to);
      setFenOverride(newFen);
      setSelectedSquare(null);
      setFeedback({ type: "success", message: currentTask.successMessage });

      // Move to next task after a delay
      setTimeout(() => {
        if (currentTaskIndex < totalTasks - 1) {
          advanceToNextTask();
        } else {
          handleLessonComplete();
        }
      }, 1500);
    } else {
      // Invalid move - check for specific failure message
      let errorMessage = currentTask.failureDefault;
      
      if (currentTask.failureSpecific) {
        try {
          const specific = JSON.parse(currentTask.failureSpecific) as Record<string, string>;
          if (specific[moveStr]) {
            errorMessage = specific[moveStr];
          }
        } catch {
          // Use default message
        }
      }

      setFeedback({ type: "error", message: errorMessage });
      setSelectedSquare(null);
      setTimeout(() => setFeedback({ type: null, message: null }), 3000);
    }
  }, [currentTask, currentFen, currentTaskIndex, totalTasks, handleLessonComplete, advanceToNextTask]);

  const handleRequestHint = useCallback(() => {
    setShowHint(true);
    
    // Track hint usage
    fetch(`/api/lessons/${lesson.id}/hint-used`, {
      method: "POST",
    }).catch(() => {
      // Silently fail
    });
  }, [lesson.id]);

  // Determine highlight squares
  const highlightSquares: string[] = [];
  if (currentTask) {
    if (currentTask.goalType === "select") {
      // For select tasks, optionally highlight target after hint
      if (showHint) {
        highlightSquares.push(currentTask.targetSquare);
      }
    } else if (selectedSquare === currentTask.startSquare) {
      // Show valid target squares when piece is selected
      highlightSquares.push(currentTask.targetSquare);
    }
  }

  // Build highlights map for new Chessboard API
  const highlights: Record<string, "selected" | "target" | "warning" | "hint"> = {};
  if (selectedSquare) {
    highlights[selectedSquare] = "selected";
  }
  highlightSquares.forEach((sq) => {
    if (sq !== selectedSquare) {
      highlights[sq] = "target";
    }
  });

  if (!currentTask) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">No tasks found for this lesson.</p>
      </div>
    );
  }

  // Wrapper to handle both click and "move" via two clicks
  const handleBoardClick = (square: string) => {
    if (selectedSquare && selectedSquare !== square) {
      // Second click - treat as move attempt
      handleMove(selectedSquare, square);
    } else {
      handleSquareClick(square);
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Info */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h2 className="font-semibold text-slate-900">{lesson.title}</h2>
        <p className="text-sm text-slate-600 mt-1">{lesson.introText}</p>
      </div>

      {/* Layout: Board + TaskBox */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Board */}
        <div className="flex justify-center lg:order-2">
          <Chessboard
            fen={currentFen}
            onSquareClick={handleBoardClick}
            highlights={highlights}
          />
        </div>

        {/* TaskBox */}
        <div className="lg:order-1">
          <TaskBox
            taskNumber={currentTaskIndex + 1}
            totalTasks={totalTasks}
            instruction={currentTask.instruction}
            hintMessage={currentTask.hintMessage}
            feedback={feedback}
            showHint={showHint}
            onRequestHint={handleRequestHint}
          />
        </div>
      </div>

      {/* Completion Modal */}
      <LessonCompleteModal
        isOpen={showCompleteModal}
        xpEarned={lesson.xpReward}
        headline="Lesson Complete!"
        subline={`You now know how the ${lesson.pieceType} works.`}
        nextLessonSlug={nextLesson?.slug}
        nextLessonTitle={nextLesson?.title}
        onClose={() => {
          setShowCompleteModal(false);
          router.push("/app");
        }}
      />
    </div>
  );
}

export default LessonPlayer;
