import Link from "next/link";
import type { Metadata } from "next";
import { Chessboard } from "@/components/chess";
import { ChessioLogo } from "@/components/brand/ChessioLogo";
import { db } from "@/lib/db";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, GraduationCap, Users, Lock } from "lucide-react";

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

export default function LandingPage() {
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
              className="text-sm font-medium text-neutral-300 hover:text-neutral-50 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-chessio-primary px-4 py-2 text-sm font-semibold text-slate-900 shadow-md hover:bg-chessio-primary-dark hover:shadow-lg transition"
            >
              Start Learning
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-50">
              <span className="block">Learn chess calmly.</span>
              <span className="block text-amber-200">One confident move at a time.</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-xl">
              Short, guided sessions that start from zero. No timers, no pressure — just you, the board, and one simple idea per lesson.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-medium text-neutral-950 shadow-md hover:bg-amber-200 hover:shadow-lg transition"
              >
                Start your first lesson
              </Link>
              <Link
                href="#how-it-works"
                className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                See how Chessio works →
              </Link>
            </div>
          </div>

          {/* Right: Hero Board */}
          <div className="relative mx-auto w-full max-w-[400px] lg:max-w-none">
            {/* Decorative glow blob */}
            <div className="absolute -inset-4 bg-amber-400/10 blur-3xl rounded-full" />
            
            <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl shadow-lg p-4">
              <Chessboard 
                fen="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
                state={{ isDisabled: true }}
                highlights={{ "e4": "success", "e2": "hint" }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Education ladder choice */}
      <section className="py-16 bg-neutral-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-50 mb-2 font-[family-name:var(--font-nunito)]">
            Choose your starting point
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mb-8 max-w-2xl">
            New to chess? Start in Pre-School. Played before or serious about improving? Jump straight into Chess School.
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {/* Pre-School */}
            <Card className="flex flex-col border-neutral-800 bg-neutral-900/80">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <div className="rounded-full bg-amber-400/10 p-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-sm sm:text-base">Pre-School</CardTitle>
                  <CardDescription className="text-xs sm:text-[13px]">
                    Absolute beginners, kids, and sandbox play.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-2">
                <ul className="space-y-1.5 text-xs sm:text-[13px] text-neutral-400">
                  <li>• Learn how the pieces move</li>
                  <li>• Simple mates & board familiarity</li>
                  <li>• Zero pressure, just exploration</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/app" className="w-full">
                  <Button size="sm" variant="outline" className="w-full justify-center">
                    Enter Pre-School
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Chess School */}
            <Card className="flex flex-col border-amber-400/40 bg-neutral-900/90 shadow-md shadow-amber-400/10">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <div className="rounded-full bg-amber-400/10 p-2">
                  <GraduationCap className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <CardTitle className="text-sm sm:text-base">Chess School</CardTitle>
                  <CardDescription className="text-xs sm:text-[13px]">
                    Structured levels, exams & Russian-style coaching.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-2">
                <ul className="space-y-1.5 text-xs sm:text-[13px] text-neutral-400">
                  <li>• Levels 1–3: checks, tactics, endgames</li>
                  <li>• XP, exams & secret rule cards</li>
                  <li>• Built-in AI Coach for questions</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Link href="/school" className="w-full">
                  <Button size="sm" className="w-full justify-center">
                    Enter Chess School
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Club – coming soon */}
            <Card className="flex flex-col border-dashed border-neutral-800 bg-neutral-900/60 opacity-80">
              <CardHeader className="flex flex-row items-center gap-2 pb-2">
                <div className="rounded-full bg-neutral-700/10 p-2">
                  <Users className="h-5 w-5 text-neutral-500" />
                </div>
                <div>
                  <CardTitle className="text-sm sm:text-base">
                    Chessio Club
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-[13px]">
                    Coming soon – your training dojo.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-2">
                <ul className="space-y-1.5 text-xs sm:text-[13px] text-neutral-500">
                  <li>• Study groups & live events</li>
                  <li>• Sparring games & reviews</li>
                  <li>• Seasonal challenges & rankings</li>
                </ul>
                <p className="text-[11px] text-neutral-600 mt-3">
                  Want early access? Mention &apos;Club&apos; in any feedback box – we&apos;ll prioritize you.
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  size="sm"
                  variant="outline"
                  disabled
                  className="w-full justify-center cursor-not-allowed opacity-60"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Coming soon
                </Button>
              </CardFooter>
            </Card>
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
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-full bg-amber-300 px-6 py-3 text-sm font-medium text-neutral-950 shadow-md hover:bg-amber-200 hover:shadow-lg transition"
          >
            Get Started Free
          </Link>
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
