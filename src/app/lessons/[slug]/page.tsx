import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { LessonPlayer } from "@/components/chess/LessonPlayer";
import { getLessonBySlug, getPreviousLesson, lessons } from "@/lib/lessons";
import { isLessonCompleted } from "@/lib/lessons/progress";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const runtime = "nodejs";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
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
      <div className="min-h-screen bg-chessio-bg dark:bg-chessio-bg-dark">
        {/* Header */}
        <header className="bg-chessio-card dark:bg-chessio-card-dark border-b border-chessio-border dark:border-chessio-border-dark">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link 
              href="/app" 
              className="flex items-center gap-2 text-chessio-muted hover:text-chessio-text dark:hover:text-chessio-text-dark transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Back to Dashboard</span>
            </Link>
            
            <div className="flex items-center gap-2">
              <span className="text-2xl">♟️</span>
              <span className="text-lg font-bold text-chessio-text dark:text-chessio-text-dark">Chessio</span>
            </div>

            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Locked Message */}
        <main className="container mx-auto px-4 py-8 max-w-lg">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4 py-8">
                <div className="text-5xl mb-4">🔒</div>
                <h3 className="text-xl font-bold text-chessio-text dark:text-chessio-text-dark">
                  Lesson Locked
                </h3>
                <p className="text-chessio-muted dark:text-chessio-muted-dark">
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
    <div className="min-h-screen bg-chessio-bg dark:bg-chessio-bg-dark">
      {/* Header */}
      <header className="bg-chessio-card dark:bg-chessio-card-dark border-b border-chessio-border dark:border-chessio-border-dark">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link 
            href="/app" 
            className="flex items-center gap-2 text-chessio-muted hover:text-chessio-text dark:hover:text-chessio-text-dark transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl">♟️</span>
            <span className="text-lg font-bold text-chessio-text dark:text-chessio-text-dark">Chessio</span>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <LessonPlayer lesson={lesson} />
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
