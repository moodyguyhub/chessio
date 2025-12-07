import Link from "next/link";
import type { Metadata } from "next";
import { ChessioLogo } from "@/components/brand/ChessioLogo";
import { db } from "@/lib/db";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { auth } from "@/lib/auth";
import { HeroSection } from "@/components/landing/HeroSection";
import { PathToMastery } from "@/components/landing/PathToMastery";

export const runtime = "nodejs";

export async function generateMetadata(): Promise<Metadata> {
  // Default metadata (used if table doesn't exist or no data found)
  const defaultMeta = {
    title: "Chessio – Learn chess calmly",
    description: "Learn chess from zero with short, guided lessons. No timers, no pressure—just clear guidance and one idea per lesson."
  };

  try {
    const seo = await db.seoPage.findUnique({ where: { slug: "home" } });
    
    if (!seo) {
      return defaultMeta;
    }

    return {
      title: seo.title,
      description: seo.description,
      openGraph: {
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
      },
      twitter: {
        title: seo.ogTitle || seo.title,
        description: seo.ogDescription || seo.description,
      }
    };
  } catch (error) {
    // Table doesn't exist yet (before migration) - use defaults
    return defaultMeta;
  }
}

export default async function LandingPage() {
  // Check if user is logged in
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-chessio-bg-dark">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <ChessioLogo variant="horizontal" className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-50 hover:text-amber-200 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md hover:bg-amber-300 hover:shadow-lg transition-all"
            >
              Start Learning
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <HeroSection isLoggedIn={isLoggedIn} />
      </main>

      {/* Path to Mastery - Vertical Ladder */}
      <section id="path-to-mastery" className="py-16 bg-neutral-900/50">
        <div className="container mx-auto px-4">
          <PathToMastery />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-neutral-900/30 backdrop-blur-sm py-20 border-y border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-neutral-50 mb-12 font-[family-name:var(--font-nunito)]">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-900/20 flex items-center justify-center text-3xl mb-4">
                🎯
              </div>
              <h3 className="text-lg font-medium text-neutral-50 mb-2 font-[family-name:var(--font-nunito)]">
                1. Learn One Piece at a Time
              </h3>
              <p className="text-neutral-400">
                Start with the basics. Each lesson focuses on one piece or concept, so you never feel overwhelmed.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-900/20 flex items-center justify-center text-3xl mb-4">
                ✨
              </div>
              <h3 className="text-lg font-medium text-neutral-50 mb-2 font-[family-name:var(--font-nunito)]">
                2. Practice with Instant Feedback
              </h3>
              <p className="text-neutral-400">
                Make moves on an interactive board. Get friendly hints when stuck, never harsh judgments.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-amber-900/20 flex items-center justify-center text-3xl mb-4">
                🏆
              </div>
              <h3 className="text-lg font-medium text-neutral-50 mb-2 font-[family-name:var(--font-nunito)]">
                3. Earn XP & Level Up
              </h3>
              <p className="text-neutral-400">
                Complete lessons to earn experience points. Watch your skills grow lesson by lesson.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-neutral-50 mb-4 font-[family-name:var(--font-nunito)]">
            Ready to make your first move?
          </h2>
          <p className="text-neutral-300 mb-8">
            Join thousands of beginners learning chess the stress-free way.
          </p>
          <LandingCTA isLoggedIn={isLoggedIn} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 bg-neutral-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-neutral-400">
          <p>♟️ Chessio — Learn chess, one move at a time.</p>
        </div>
      </footer>
    </div>
  );
}
