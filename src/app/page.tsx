import Link from "next/link";
import { Chessboard } from "@/components/chess";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-indigo-50/30">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♟️</span>
            <span className="text-xl font-bold text-slate-900 font-[family-name:var(--font-nunito)]">Chessio</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
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
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl font-[family-name:var(--font-nunito)]">
              Learn Chess
              <span className="block text-emerald-600">the Fun Way</span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 md:text-xl">
              Master chess from zero with friendly, bite-sized lessons. 
              No pressure, no timers, no intimidation — just you and the board.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center">
              <Link
                href="/register"
                className="w-full rounded-full bg-emerald-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-emerald-700 transition-colors sm:w-auto"
              >
                Start Learning — It&apos;s Free
              </Link>
            </div>
          </div>

          {/* Right: Hero Board */}
          <div className="relative mx-auto w-full max-w-[400px] lg:max-w-none">
            {/* Decorative glow blob */}
            <div className="absolute -inset-4 bg-indigo-500/20 blur-2xl rounded-full" />
            
            <div className="relative shadow-2xl rounded-lg overflow-hidden border border-gray-200">
              <Chessboard 
                fen="rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
                state={{ isDisabled: true }}
                highlights={{ "e4": "success", "e2": "hint" }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* How It Works */}
      <section className="bg-white/80 backdrop-blur-sm py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900 mb-12 font-[family-name:var(--font-nunito)]">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl mb-4">
                🎯
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 font-[family-name:var(--font-nunito)]">
                1. Learn One Piece at a Time
              </h3>
              <p className="text-slate-600">
                Start with the basics. Each lesson focuses on one piece or concept, so you never feel overwhelmed.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl mb-4">
                ✨
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 font-[family-name:var(--font-nunito)]">
                2. Practice with Instant Feedback
              </h3>
              <p className="text-slate-600">
                Make moves on an interactive board. Get friendly hints when stuck, never harsh judgments.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl mb-4">
                🏆
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2 font-[family-name:var(--font-nunito)]">
                3. Earn XP & Level Up
              </h3>
              <p className="text-slate-600">
                Complete lessons to earn experience points. Watch your skills grow lesson by lesson.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4 font-[family-name:var(--font-nunito)]">
            Ready to make your first move?
          </h2>
          <p className="text-slate-600 mb-8">
            Join thousands of beginners learning chess the stress-free way.
          </p>
          <Link
            href="/register"
            className="inline-block rounded-full bg-emerald-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-emerald-700 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 py-8 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>♟️ Chessio — Learn chess, one move at a time.</p>
        </div>
      </footer>
    </div>
  );
}
