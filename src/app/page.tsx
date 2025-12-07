import Link from "next/link";
import type { Metadata } from "next";
import { ChessioLogo } from "@/components/brand/ChessioLogo";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, GraduationCap, Users } from "lucide-react";
import { LandingCTA } from "@/components/landing/LandingCTA";
import { auth } from "@/lib/auth";

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
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-50">
              Stop Playing Random Moves.
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 leading-relaxed">
              A structured, 15-level chess academy that takes you from absolute beginner to advanced club player. One path. No noise.
            </p>
            <p className="text-sm text-neutral-400">
              Guided by an AI coach who explains ideas, not just lines.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
              <Link
                href={isLoggedIn ? "/school/placement" : "/login?redirect=/school/placement"}
                className="inline-flex items-center justify-center rounded-lg bg-chessio-primary px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-chessio-primary/90 transition-all"
                data-testid="landing-cta-evaluation"
              >
                Start Evaluation
              </Link>
              <Link
                href={isLoggedIn ? "/app" : "/login?redirect=/app"}
                className="inline-flex items-center justify-center text-sm text-neutral-400 hover:text-neutral-200 transition-colors underline-offset-4 hover:underline"
              >
                I don&apos;t know the rules yet →
              </Link>
            </div>
          </div>

          {/* Right: Ascent Visual Placeholder */}
          <div className="relative mx-auto w-full max-w-[400px] md:max-w-none">
            {/* Decorative glow */}
            <div className="absolute -inset-4 bg-blue-500/10 blur-3xl rounded-full" />
            
            {/* Placeholder container for "Ascent" visual - ladder/steps motif */}
            <div className="relative bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/30 border border-slate-800 rounded-2xl shadow-2xl p-8 min-h-[400px] flex items-center justify-center">
              <div className="space-y-4 text-center">
                <div className="text-6xl">🏔️</div>
                <div className="text-sm text-slate-400 font-medium tracking-wide">THE ASCENT</div>
                <div className="text-xs text-slate-500 max-w-[200px] mx-auto">15 levels. One curriculum. From beginner to advanced.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Path to Mastery - Vertical Ladder */}
      <section id="path-to-mastery" className="py-16 bg-neutral-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Section Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-neutral-50">
                The Path to Mastery
              </h2>
              <p className="text-sm text-neutral-400">
                Three stages. One curriculum.
              </p>
            </div>

            {/* Vertical Spine with 3 Nodes */}
            <div className="relative border-l-2 border-chessio-border/40 pl-8 space-y-12 mt-12">
              
              {/* Node 1: Sandbox (Pre-School) */}
              <div className="relative">
                <div className="absolute -left-[33px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 border-2 border-amber-500/40">
                  <Sparkles className="h-4 w-4 text-amber-300" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-neutral-50">
                    The Sandbox — Pre-School
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Mechanics & safety. For total beginners. Learn how the pieces move in a stress-free environment.
                  </p>
                </div>
              </div>

              {/* Node 2: Academy (Levels 1-15) */}
              <div className="relative">
                <div className="absolute -left-[33px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 border-2 border-indigo-500/40">
                  <GraduationCap className="h-4 w-4 text-indigo-300" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-neutral-50">
                      The Academy — Levels 1–15
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      Current: Levels 1–3 live
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    The core curriculum. Tactics, endgames, strategy. You do not advance until you pass the evaluations.
                  </p>
                </div>
              </div>

              {/* Node 3: Club (Coming Soon) */}
              <div className="relative">
                <div className="absolute -left-[33px] top-0 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10 border-2 border-yellow-500/40">
                  <Users className="h-4 w-4 text-yellow-300" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold text-neutral-50">
                      The Club — Coming Soon
                    </h3>
                    <Badge variant="secondary" className="text-xs text-neutral-500">
                      Coming soon
                    </Badge>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Sparring, tournaments, and study groups for proven students. Apply what you&apos;ve learned.
                  </p>
                </div>
              </div>

            </div>
          </div>
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
