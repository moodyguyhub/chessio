import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getChessioProfile } from "@/lib/dashboard/profile";
import { getUserXp } from "@/lib/lessons/progress";
import { getLevelForXp } from "@/lib/gamification";
import { calculateDutyState } from "@/lib/dashboard/duty-state";
import { getSchoolMapDataServer } from "@/lib/dashboard/school-map";
import { ActiveDutyCardClient } from "@/components/dashboard/ActiveDutyCardClient";
import { CampaignMap } from "@/components/dashboard/CampaignMap";
import { ChessioLogo } from "@/components/brand/ChessioLogo";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login?redirect=/dashboard");
  }

  const userId = session.user.id;
  const userName = session.user.name || "Player";

  // Get user profile, XP, and duty state
  const [profile, userXp] = await Promise.all([
    getChessioProfile(userId),
    getUserXp(userId),
  ]);

  const levelProgress = getLevelForXp(userXp);
  
  // Calculate duty state for ActiveDutyCard
  const dutyState = await calculateDutyState(userId, profile);
  
  // Get school map data for CampaignMap
  const schoolMapData = await getSchoolMapDataServer(profile);

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
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Header */}
          <header className="space-y-2">
            <p className="text-sm text-chessio-muted">
              Welcome back, {userName}
            </p>
            <h1 className="text-3xl font-bold text-chessio-text tracking-tight">
              Your Chess Journey
            </h1>
          </header>

          {/* SECTION 1: Active Duty (The Focal Point) */}
          <section data-testid="dashboard-hero">
            <ActiveDutyCardClient
              status={dutyState.status}
              userProfile={{ name: userName, tier: dutyState.tier }}
              currentMission={dutyState.currentMission}
              actions={dutyState.actions}
            />
          </section>

          {/* SECTION 2: Campaign Map (The Context) */}
          <section data-testid="dashboard-map" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold tracking-tight text-chessio-text">
                Your Curriculum
              </h2>
              <span className="text-sm text-chessio-muted">
                {schoolMapData.currentLevel
                  ? `Level ${schoolMapData.currentLevel} of ${schoolMapData.totalLevels}`
                  : `0 of ${schoolMapData.totalLevels} levels started`}
              </span>
            </div>

            <CampaignMap userProgress={schoolMapData} />
          </section>

          {/* Footer note */}
          <div className="text-center pt-6">
            <p className="text-xs text-chessio-muted">
              Your progress is automatically saved. Focus on your current mission above.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
