import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getChessioProfile } from "@/lib/dashboard/profile";
import { getUserXp } from "@/lib/lessons/progress";
import { getLevelForXp } from "@/lib/gamification";
import { PreSchoolCard } from "@/components/dashboard/PreSchoolCard";
import { SchoolCard } from "@/components/dashboard/SchoolCard";
import { ClubCard } from "@/components/dashboard/ClubCard";
import { ChessioLogo } from "@/components/brand/ChessioLogo";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login?redirect=/dashboard");
  }

  const userId = session.user.id;
  const userName = session.user.name || "Player";

  // Get user profile and XP
  const [profile, userXp] = await Promise.all([
    getChessioProfile(userId),
    getUserXp(userId),
  ]);

  const levelProgress = getLevelForXp(userXp);

  return (
    <div className="min-h-screen bg-chessio-bg-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-chessio-border-dark">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ChessioLogo variant="horizontal" className="h-8" />
          </Link>
          
          <div className="flex items-center gap-4">
            {/* XP Display */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="px-2.5 py-1 bg-chessio-primary/20 text-chessio-primary rounded-full font-medium text-xs tracking-tight">
                {levelProgress.label}
              </span>
              <span className="text-chessio-muted-dark text-xs">
                {userXp} XP
              </span>
            </div>

            {/* Sign Out */}
            <form
              action={async () => {
                "use server";
                await auth().then(s => s && import("@/lib/auth").then(m => m.signOut()));
              }}
            >
              <button
                type="submit"
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Welcome Header */}
          <header className="space-y-2">
            <p className="text-sm text-chessio-muted">
              Welcome back, {userName}
            </p>
            <h1 className="text-3xl font-bold text-chessio-text tracking-tight">
              Your Chess Journey
            </h1>
            <p className="text-sm text-chessio-muted max-w-2xl">
              Start in the playground, unlock the School, and later join the Club. Choose your path below.
            </p>
          </header>

          {/* Next Step Suggestion (if available) */}
          {profile.nextStep && (
            <div className="rounded-lg border border-chessio-border bg-chessio-card/50 px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-chessio-muted uppercase tracking-wide font-medium mb-1">
                  Recommended Next Step
                </p>
                <p className="text-sm font-medium text-chessio-text">
                  {profile.nextStep.label}
                </p>
              </div>
              <Link
                href={profile.nextStep.href}
                className="flex items-center gap-1 text-sm font-medium text-chessio-primary hover:text-chessio-primary-dark transition-colors"
              >
                Go
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}

          {/* Track Cards */}
          <section className="grid gap-5 md:grid-cols-3">
            <PreSchoolCard profile={profile} />
            <SchoolCard profile={profile} />
            <ClubCard profile={profile} />
          </section>

          {/* Footer note */}
          <div className="text-center pt-6">
            <p className="text-xs text-chessio-muted">
              Your progress is automatically saved. You can switch between tracks anytime.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
