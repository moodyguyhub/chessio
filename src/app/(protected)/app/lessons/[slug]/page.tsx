import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LessonPlayer } from "@/components/chess";

// Temporary local type until full migration to lessons.ts
const LessonStatus = { LOCKED: "LOCKED", AVAILABLE: "AVAILABLE", COMPLETED: "COMPLETED" } as const;

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch lesson with tasks
  const lesson = await db.lesson.findUnique({
    where: { slug },
    include: {
      tasks: {
        orderBy: { index: "asc" },
      },
    },
  });

  if (!lesson) {
    notFound();
  }

  // TODO: Check lesson locking via new UserLessonProgress model
  // For now, all lessons are accessible in Level 0

  // Get next lesson for completion modal
  const nextLesson = await db.lesson.findFirst({
    where: { order: lesson.order + 1 },
    select: { slug: true, title: true },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">♟️</span>
            <span className="text-lg font-bold text-slate-900">Chessio</span>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <LessonPlayer
          lesson={{
            id: lesson.id,
            slug: lesson.slug,
            title: lesson.title,
            pieceType: lesson.pieceType,
            introText: lesson.introText,
            xpReward: lesson.xpReward,
            tasks: lesson.tasks.map((task) => ({
              id: task.id,
              index: task.index,
              instruction: task.instruction,
              startingFen: task.startingFen,
              goalType: task.goalType,
              targetSquare: task.targetSquare,
              startSquare: task.startSquare,
              validMoves: task.validMoves,
              successMessage: task.successMessage,
              failureDefault: task.failureDefault,
              failureSpecific: task.failureSpecific,
              hintMessage: task.hintMessage,
            })),
          }}
          nextLesson={nextLesson}
        />
      </main>
    </div>
  );
}
