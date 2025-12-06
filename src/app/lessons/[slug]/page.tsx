import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { LessonPlayer } from "@/components/chess/LessonPlayer";
import { getLessonBySlug, getPreviousLesson, lessons } from "@/lib/lessons";
import { isLessonCompleted } from "@/lib/lessons/progress";
import { getUserXpStats } from "@/lib/gamification";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressHeader } from "@/components/ui/ProgressHeader";
import { ChessioLogo } from "@/components/brand/ChessioLogo";

export const runtime = "nodejs";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Generate dynamic metadata for each lesson page
 */
export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);
  
  if (!lesson) {
    return {
      title: "Lesson Not Found | Chessio",
    };
  }

  return {
    title: `${lesson.title} | Chessio`,
    description: lesson.description,
    openGraph: {
      title: `${lesson.title} | Chessio`,
      description: lesson.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${lesson.title} | Chessio`,
      description: lesson.description,
    },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get lesson from static lessons.ts (source of truth for Level 0)
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  // Fetch user XP stats for progress header
  const xpStats = await getUserXpStats(session.user.id);

  // Check lesson locking
  const previousLesson = getPreviousLesson(slug);
  let isLocked = false;

  if (previousLesson) {
    const previousCompleted = await isLessonCompleted(session.user.id, previousLesson.slug);
    isLocked = !previousCompleted;
  }

  // Show locked message if trying to access a locked lesson
  if (isLocked && previousLesson) {
    return (
      <div className="min-h-dvh flex flex-col bg-slate-950">
        {/* Header */}
        <header className="glass-panel border-b border-white/10">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link 
              href="/app" 
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
            
            <ChessioLogo variant="horizontal" className="h-8" />

            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Locked Message */}
        <main className="container mx-auto px-4 py-8 max-w-lg">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Lesson Locked
                </h3>
                <p className="text-slate-400">
                  Complete &quot;{previousLesson.title}&quot; first to unlock this lesson.
                </p>
                <div className="flex flex-col gap-3 pt-4">
                  <Link href={`/lessons/${previousLesson.slug}`}>
                    <Button variant="primary" size="lg" className="w-full">
                      Go to {previousLesson.title}
                    </Button>
                  </Link>
                  <Link href="/app">
                    <Button variant="ghost" className="w-full">
                      Back to Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-slate-950">
      {/* Header */}
      <header className="glass-panel border-b border-white/10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <Link 
              href="/app" 
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
            </Link>
            
            <ChessioLogo variant="horizontal" className="h-8" />

            <div className="w-16 sm:w-24" /> {/* Spacer for centering */}
          </div>
          
          {/* Progress Header */}
          <ProgressHeader 
            level={xpStats.level}
            currentXp={xpStats.currentLevelXp}
            nextLevelXp={xpStats.xpForNextLevel}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 pb-safe max-w-7xl">
        <LessonPlayer lesson={lesson} initialXpStats={xpStats} />
      </main>
    </div>
  );
}

/**
 * Generate static params for all Level 0 lessons
 */
export function generateStaticParams() {
  return lessons.map((lesson) => ({
    slug: lesson.slug,
  }));
}
