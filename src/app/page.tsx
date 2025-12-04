import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">♟️</span>
            <span className="text-xl font-bold text-slate-900">Chessio</span>
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
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
            Learn Chess
            <span className="block text-emerald-600">the Fun Way</span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 md:text-xl">
            Master chess from zero with friendly, bite-sized lessons. 
            No pressure, no timers, no intimidation — just you and the board.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/register"
              className="w-full rounded-full bg-emerald-600 px-8 py-3 text-lg font-semibold text-white shadow-lg hover:bg-emerald-700 transition-colors sm:w-auto"
            >
              Start Learning — It&apos;s Free
            </Link>
          </div>
        </div>

        {/* Mini Board Illustration */}
        <div className="mt-16 flex justify-center">
          <div className="grid grid-cols-8 gap-0 rounded-lg overflow-hidden shadow-2xl">
            {Array.from({ length: 64 }).map((_, i) => {
              const row = Math.floor(i / 8);
              const col = i % 8;
              const isLight = (row + col) % 2 === 0;
              // Show a few pieces for visual interest
              const pieces: Record<number, string> = {
                3: "♜", 4: "♚", // Black rook and king
                27: "♗", // White bishop in center
                59: "♖", 60: "♔", // White rook and king
              };
              return (
                <div
                  key={i}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-xl md:text-2xl
                    ${isLight ? "bg-amber-100" : "bg-amber-700"}`}
                >
                  {pieces[i] || ""}
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-3xl font-bold text-slate-900 mb-12">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-3xl mb-4">
                🎯
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
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
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
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
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
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
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
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
      <footer className="border-t border-slate-200 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>♟️ Chessio — Learn chess, one move at a time.</p>
        </div>
      </footer>
    </div>
  );
}
