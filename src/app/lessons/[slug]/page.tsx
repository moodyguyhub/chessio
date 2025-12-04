import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { LessonPlayer } from "@/components/chess/LessonPlayerNew";
import { getLessonBySlug, lessons } from "@/lib/lessons";

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

  // TODO (P0.4): Check lesson locking via UserLessonProgress in DB
  // For now, all Level 0 lessons are accessible

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
