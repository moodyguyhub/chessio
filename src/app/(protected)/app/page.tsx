import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { allLessons, getPreviousLesson, getLevel0Lessons, getLevel1Lessons, getPuzzles, getLevel2Lessons } from "@/lib/lessons";
import { getCompletedLessonSlugs, getUserXp, hasUserGivenFeedback } from "@/lib/lessons/progress";
import { getLevelForXp, LEVELS } from "@/lib/gamification";
import { FeedbackButton } from "@/components/ui/FeedbackButton";
import { AlphaBanner } from "@/components/ui/AlphaBanner";
import { OnboardingModal, HowItWorksLink } from "@/components/ui/OnboardingModal";
import { recordDashboardVisit, getLastActiveDescription } from "@/lib/engagement";
import { getTodaysGoalForUser } from "@/lib/engagement/todays-goal";
import { logDashboardViewed, logWelcomeBackShown, logSessionStarted } from "@/lib/telemetry";
import { ChessioLogo } from "@/components/brand/ChessioLogo";
import { Sparkles, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PreSchoolFeedbackStrip } from "@/components/feedback/PreSchoolFeedbackStrip";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Get user's XP and completed lessons from progress.ts
  const [userXp, completedSlugs, feedbackGiven] = await Promise.all([
    getUserXp(userId),
    getCompletedLessonSlugs(userId),
    hasUserGivenFeedback(userId),
  ]);

  // Record dashboard visit and get engagement stats (Sprint 03)
  const engagementStats = await recordDashboardVisit(userId);
  const completedSet = new Set(completedSlugs);

  // Get level info for telemetry
  const levelProgress = getLevelForXp(userXp);
  
  // Log session_started ONLY if this is a new session (Sprint 04: once per day)
  if (!engagementStats.isReturningToday) {
    logSessionStarted({
      userId,
      sessionCount: engagementStats.sessionCount,
      currentLevel: levelProgress.level,
      currentLevelLabel: levelProgress.label,
      totalXp: userXp,
      daysSinceLastVisit: engagementStats.daysSinceLastVisit,
    });
  }
  
  // Log dashboard viewed event (Sprint 03 telemetry)
  logDashboardViewed({
    userId,
    sessionCount: engagementStats.sessionCount,
    currentLevel: levelProgress.level,
    currentLevelLabel: levelProgress.label,
    totalXp: userXp,
    isNewSession: !engagementStats.isReturningToday,
    daysSinceLastVisit: engagementStats.daysSinceLastVisit,
  });

  // Log welcome state shown
  logWelcomeBackShown({
    userId,
    sessionCount: engagementStats.sessionCount,
    currentLevel: levelProgress.level,
    currentLevelLabel: levelProgress.label,
    totalXp: userXp,
    welcomeType: engagementStats.isReturningUser ? "returning_user" : "new_user",
  });

  // Get today's goal (Sprint 03)
  const todaysGoal = getTodaysGoalForUser({
    completedSlugs,
    totalXp: userXp,
  });

  // Get progress summary (Sprint 03) - for future use
  // const progressSummary = getProgressSummary(completedSlugs);

  // Get lessons by level from lessons.ts (source of truth)
  const level0Lessons = getLevel0Lessons();
  const level1Lessons = getLevel1Lessons();
  const puzzles = getPuzzles();
  const level2Lessons = getLevel2Lessons();

  // Helper to determine lesson status
  const getLessonStatus = (lesson: typeof allLessons[0]) => {
    const isCompleted = completedSet.has(lesson.slug);
    const previousLesson = getPreviousLesson(lesson.slug);
    // First lesson is always available, others require previous completion
    const isLocked = previousLesson !== null && !completedSet.has(previousLesson.slug);
    const isAvailable = !isLocked && !isCompleted;
    return { isCompleted, isAvailable, isLocked };
  };

  // Map Level 0 lessons with status
  const level0WithStatus = level0Lessons.map((lesson) => ({
    ...lesson,
    ...getLessonStatus(lesson),
  }));

  // Map Level 1 lessons with status
  const level1WithStatus = level1Lessons.map((lesson) => ({
    ...lesson,
    ...getLessonStatus(lesson),
  }));

  // Map Puzzles with status
  const puzzlesWithStatus = puzzles.map((lesson) => ({
    ...lesson,
    ...getLessonStatus(lesson),
  }));

  // Map Level 2 lessons with status
  const level2WithStatus = level2Lessons.map((lesson) => ({
    ...lesson,
    ...getLessonStatus(lesson),
  }));

  // Next level for progress display (levelProgress already defined above)
  const nextLevel = levelProgress.level < LEVELS.length - 1 ? LEVELS[levelProgress.level + 1] : null;
  
  // Calculate level 0 progress
  const level0CompletedCount = level0WithStatus.filter((l) => l.isCompleted).length;
  const level0TotalLessons = level0WithStatus.length;
  const level0ProgressPercent = level0TotalLessons > 0 ? Math.round((level0CompletedCount / level0TotalLessons) * 100) : 0;
  const level0Complete = level0CompletedCount === level0TotalLessons;

  // Calculate level 1 progress
  const level1CompletedCount = level1WithStatus.filter((l) => l.isCompleted).length;
  const level1TotalLessons = level1WithStatus.length;
  const level1ProgressPercent = level1TotalLessons > 0 ? Math.round((level1CompletedCount / level1TotalLessons) * 100) : 0;
  const level1Complete = level1CompletedCount === level1TotalLessons;

  // Calculate puzzles progress
  const puzzlesCompletedCount = puzzlesWithStatus.filter((l) => l.isCompleted).length;
  const puzzlesTotalLessons = puzzlesWithStatus.length;
  const puzzlesProgressPercent = puzzlesTotalLessons > 0 ? Math.round((puzzlesCompletedCount / puzzlesTotalLessons) * 100) : 0;
  const puzzlesComplete = puzzlesCompletedCount === puzzlesTotalLessons;

  // Calculate Level 2 progress
  const level2CompletedCount = level2WithStatus.filter((l) => l.isCompleted).length;
  const level2TotalLessons = level2WithStatus.length;
  const level2ProgressPercent = level2TotalLessons > 0 ? Math.round((level2CompletedCount / level2TotalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-chessio-bg-dark">
      {/* Header - Sticky Glassmorphism */}
      <header className="sticky top-0 z-50 glass-panel border-b border-chessio-border-dark">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ChessioLogo variant="horizontal" className="h-8" />
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Dashboard Link */}
            <Link
              href="/dashboard"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>

            {/* XP Display */}
            <div className="hidden sm:flex items-center gap-2 text-sm">\n              <span className="px-2.5 py-1 bg-chessio-primary/20 text-chessio-primary rounded-full font-medium text-xs tracking-tight">{levelProgress.label}</span>
              <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-chessio-primary transition-all duration-500"
                  style={{ width: `${levelProgress.progressPercent}%` }}
                />
              </div>
              <span className="text-chessio-muted-dark text-xs">
                {nextLevel ? (
                  <span title={`${levelProgress.xpToNextLevel} XP to reach ${nextLevel.label}`}>
                    {levelProgress.xpIntoLevel}/{nextLevel.cumulativeXpRequired - LEVELS[levelProgress.level].cumulativeXpRequired} XP
                  </span>
                ) : (
                  `${userXp} XP`
                )}
              </span>
            </div>

            {/* Sign Out */}
            <form
              action={async () => {
                "use server";
                await signOut();
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
      <main className="container mx-auto px-4 py-8">
        {/* Chessio Pre-School banner */}
        <section className="mb-6 rounded-2xl border border-chessio-border bg-chessio-card/80 px-4 py-4 sm:px-6 sm:py-5 shadow-sm flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="mt-1 rounded-full bg-chessio-primary/10 p-2">
              <Sparkles className="h-5 w-5 text-chessio-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-chessio-text">
                  Chessio Pre-School
                </h2>
                <Badge variant="secondary" className="text-[11px]">
                  Board basics & sandbox
                </Badge>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-chessio-muted max-w-xl">
                You&apos;re in the <span className="font-medium">Pre-School playground</span> –
                perfect for learning the board, piece moves, and simple mates.
                When you&apos;re ready to train seriously, jump into the{" "}
                <span className="font-medium">Chess School</span> with levels,
                exams, and a personal Coach.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-chessio-muted">
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  School: live now
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                  Club:{" "}
                  <span className="font-medium">coming soon</span> — study groups &
                  tournaments
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <Link href="/school">
              <Button size="sm" className="inline-flex items-center gap-1 w-full">
                Enter Chess School
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              disabled
              className="inline-flex items-center gap-1 opacity-70 cursor-not-allowed"
            >
              <Users className="h-4 w-4" />
              Club mode · coming soon
            </Button>
            <p className="text-xs text-chessio-muted mt-1">
              Want early access to Chessio Club? After any lesson or exam, use the feedback box and mention &apos;Club&apos; – we&apos;ll read them all.
            </p>
          </div>
        </section>
        
        {/* Pre-School Feedback Strip */}
        <PreSchoolFeedbackStrip />
        
        {/* Alpha Banner (Sprint 04) */}
        <AlphaBanner />
        
        {/* Welcome Back State (Sprint 03) */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              {engagementStats.isReturningUser ? (
                <>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Welcome back, {session.user.name || "Learner"}
                  </h1>
                  <p className="text-slate-400 mt-1">
                    {getLastActiveDescription(engagementStats.daysSinceLastVisit)}
                    {" · "}
                    <span className="text-orange-400 font-medium">{levelProgress.label}</span>
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Welcome to Chessio, {session.user.name || "Learner"}
                  </h1>
                  <p className="text-slate-400 mt-1">
                    Start your chess journey with bite-sized lessons
                  </p>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {/* Session Counter (Sprint 03) */}
              {engagementStats.sessionCount > 0 && (
                <div className="hidden sm:block text-right">
                  <p className="text-xs text-slate-500">Sessions</p>
                  <p className="text-lg font-semibold text-slate-300">{engagementStats.sessionCount}</p>
                </div>
              )}
              <HowItWorksLink />
            </div>
          </div>
        </div>

        {/* Today's Goal Card (Sprint 03) - Premium Hero */}
        <div className="mb-8 bg-chessio-surface-dark border border-chessio-border-dark border-t-4 border-t-chessio-primary rounded-2xl p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-chessio-primary">🎯</span>
                <h2 className="text-xs font-semibold text-chessio-primary uppercase tracking-wide">
                  Today&apos;s Goal
                </h2>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                {todaysGoal.title}
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                {todaysGoal.description}
              </p>
              {todaysGoal.progress && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                    <span>{todaysGoal.progress.label}</span>
                    <span>{todaysGoal.progress.completed}/{todaysGoal.progress.total}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-700 transition-all duration-500"
                      style={{ width: `${(todaysGoal.progress.completed / todaysGoal.progress.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="shrink-0">
              <Link
                href={todaysGoal.action.href}
                className="block px-5 py-2.5 bg-orange-700 hover:bg-orange-800 text-white font-medium rounded-lg transition-all hover:scale-[1.02] text-sm tracking-tight"
              >
                {todaysGoal.action.label}
              </Link>
              {todaysGoal.action.hint && (
                <p className="text-xs text-slate-500 mt-2 text-right">
                  {todaysGoal.action.hint}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* First-time Onboarding Modal */}
        <OnboardingModal />

        {/* Mobile XP & Session Display */}
        <div className="sm:hidden mb-6 p-4 bg-chessio-surface-dark border border-chessio-border-dark rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2.5 py-1 bg-orange-950/40 text-orange-300 rounded-full font-medium text-xs">{levelProgress.label}</span>
            <div className="flex items-center gap-3">
              {engagementStats.sessionCount > 0 && (
                <span className="text-xs text-slate-500">{engagementStats.sessionCount} sessions</span>
              )}
              <span className="text-sm text-slate-400">{userXp} XP</span>
            </div>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-700 transition-all duration-500"
              style={{ width: `${levelProgress.progressPercent}%` }}
            />
          </div>
          {nextLevel ? (
            <p className="text-xs text-slate-500 mt-1.5">
              {levelProgress.xpIntoLevel}/{nextLevel.cumulativeXpRequired - LEVELS[levelProgress.level].cumulativeXpRequired} XP • {levelProgress.xpToNextLevel} to {nextLevel.label}
            </p>
          ) : (
            <p className="text-xs text-orange-400 mt-1.5">Max level reached! 🏆</p>
          )}
        </div>

        {/* Level 0 Card - Always Visible */}
        <div className="bg-chessio-surface-dark border border-chessio-border-dark rounded-2xl overflow-hidden">
          {/* Card Header */}
          <div className="p-6 bg-gradient-to-r from-chessio-primary-dark to-chessio-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Level 0</p>
                <h2 className="text-2xl font-bold text-white tracking-tight mt-1">Learn the Pieces</h2>
                <p className="text-amber-100/80 text-xs mt-1">Start here if you're new or rusty. {level0Lessons.length} snack-sized lessons.</p>
              </div>
              <div className="text-right">
                <p className="text-amber-100 text-sm">Progress</p>
                <p className="text-2xl font-bold text-white">{level0ProgressPercent}%</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 w-full h-2 bg-orange-900/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${level0ProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Lesson List */}
          <div className="p-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Lessons
            </h3>
            <div className="space-y-3">
              {level0WithStatus.map((lesson) => {
                const { isCompleted, isAvailable, isLocked } = lesson;

                return (
                  <div
                    key={lesson.slug}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? "bg-orange-950/40 border-orange-700/20"
                        : isAvailable
                        ? "bg-slate-800/50 border-white/5 hover:border-orange-700/20 hover:scale-[1.01]"
                        : "bg-slate-800/30 border-white/5 opacity-60"
                    }`}
                  >
                    {/* Status Icon */}
                    <div
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg ${
                        isCompleted
                          ? "bg-orange-700 text-white"
                          : isAvailable
                          ? "bg-orange-950/40 text-orange-400"
                          : "bg-slate-700 text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : isLocked ? "🔒" : "▶"}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium tracking-tight ${
                        isLocked ? "text-slate-500" : "text-white"
                      }`}>
                        {lesson.title}
                      </h4>
                      <p className={`text-sm ${
                        isLocked ? "text-slate-600" : "text-orange-400"
                      }`}>
                        +{lesson.xpReward} XP
                      </p>
                    </div>

                    {/* Action */}
                    {isCompleted ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="shrink-0 px-3 py-2 text-sm font-medium text-orange-400 hover:text-amber-300 transition-colors"
                      >
                        Replay
                      </Link>
                    ) : isAvailable ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="shrink-0 px-4 py-2 text-sm font-medium bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-all hover:scale-[1.02]"
                      >
                        Start
                      </Link>
                    ) : (
                      <span className="shrink-0 px-3 py-2 text-sm text-slate-500">
                        Locked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Level 1 Card - Blinders: Only show if user has XP > 0 */}
        {userXp > 0 && (
        <div className={`mt-8 bg-chessio-surface-dark border border-chessio-border-dark rounded-2xl overflow-hidden ${!level0Complete ? "opacity-75" : ""}`}>
          {/* Card Header */}
          <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Level 1</p>
                <h2 className="text-2xl font-bold text-white mt-1">Advanced Moves</h2>
              </div>
              <div className="text-right">
                <p className="text-blue-100 text-sm">Progress</p>
                <p className="text-2xl font-bold text-white">{level1ProgressPercent}%</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 w-full h-2 bg-blue-400/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${level1ProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Lesson List */}
          <div className="p-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Lessons
            </h3>
            <div className="space-y-3">
              {level1WithStatus.map((lesson) => {
                const { isCompleted, isAvailable, isLocked } = lesson;

                return (
                  <div
                    key={lesson.slug}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? "bg-blue-900/20 border-blue-500/20"
                        : isAvailable
                        ? "bg-slate-800/50 border-white/5 hover:border-blue-500/20 hover:scale-[1.01]"
                        : "bg-slate-800/30 border-white/5 opacity-60"
                    }`}
                  >
                    {/* Status Icon */}
                    <div
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg ${
                        isCompleted
                          ? "bg-blue-500 text-white"
                          : isAvailable
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-slate-700 text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : isLocked ? "🔒" : "▶"}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium tracking-tight ${
                        isLocked ? "text-slate-500" : "text-white"
                      }`}>
                        {lesson.title}
                      </h4>
                      <p className={`text-sm ${
                        isLocked ? "text-slate-600" : "text-blue-400"
                      }`}>
                        +{lesson.xpReward} XP
                      </p>
                    </div>

                    {/* Action */}
                    {isCompleted ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="shrink-0 px-3 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Replay
                      </Link>
                    ) : isAvailable ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="shrink-0 px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all hover:scale-[1.02]"
                      >
                        Start
                      </Link>
                    ) : (
                      <span className="shrink-0 px-3 py-2 text-sm text-slate-500">
                        Locked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        )}

        {/* Puzzles Card - Blinders: Only show if Level 0 complete */}
        {level0Complete && (
        <div className={`mt-8 bg-chessio-surface-dark border border-chessio-border-dark rounded-2xl overflow-hidden ${!level1Complete ? "opacity-75" : ""}`}>
          {/* Card Header */}
          <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Practice</p>
                <h2 className="text-2xl font-bold text-white mt-1">Puzzles</h2>
              </div>
              <div className="text-right">
                <p className="text-purple-100 text-sm">Progress</p>
                <p className="text-2xl font-bold text-white">{puzzlesProgressPercent}%</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 w-full h-2 bg-purple-400/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${puzzlesProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Puzzle List */}
          <div className="p-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Puzzle Sets
            </h3>
            <div className="space-y-3">
              {puzzlesWithStatus.map((lesson) => {
                const { isCompleted, isAvailable, isLocked } = lesson;

                return (
                  <div
                    key={lesson.slug}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? "bg-purple-900/20 border-purple-500/20"
                        : isAvailable
                        ? "bg-slate-800/50 border-white/5 hover:border-purple-500/20 hover:scale-[1.01]"
                        : "bg-slate-800/30 border-white/5 opacity-60"
                    }`}
                  >
                    {/* Status Icon */}
                    <div
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg ${
                        isCompleted
                          ? "bg-purple-500 text-white"
                          : isAvailable
                          ? "bg-purple-900/30 text-purple-400"
                          : "bg-slate-700 text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : isLocked ? "🔒" : "🧩"}
                    </div>

                    {/* Puzzle Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium tracking-tight ${
                        isLocked ? "text-slate-500" : "text-white"
                      }`}>
                        {lesson.title}
                      </h4>
                      <p className={`text-sm ${
                        isLocked ? "text-slate-600" : "text-purple-400"
                      }`}>
                        +{lesson.xpReward} XP
                      </p>
                    </div>

                    {/* Action */}
                    {isCompleted ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="shrink-0 px-3 py-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        Replay
                      </Link>
                    ) : isAvailable ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="shrink-0 px-4 py-2 text-sm font-medium bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all hover:scale-[1.02]"
                      >
                        Start
                      </Link>
                    ) : (
                      <span className="shrink-0 px-3 py-2 text-sm text-slate-500">
                        Locked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        )}

        {/* Level 2 Card - Blinders: Only show if Level 1 complete */}
        {level1Complete && (
        <div className={`mt-8 bg-chessio-surface-dark border border-chessio-border-dark rounded-2xl overflow-hidden ${!puzzlesComplete ? "opacity-75" : ""}`}>
          {/* Card Header */}
          <div className="p-6 bg-gradient-to-r from-orange-700 to-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Level 2</p>
                <h2 className="text-2xl font-bold text-white mt-1">Edge Cases</h2>
              </div>
              <div className="text-right">
                <p className="text-amber-100 text-sm">Progress</p>
                <p className="text-2xl font-bold text-white">{level2ProgressPercent}%</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 w-full h-2 bg-orange-900/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${level2ProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Level 2 Lessons */}
          <div className="p-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
              Special Rules
            </h3>
            <div className="space-y-3">
              {level2WithStatus.map((lesson) => {
                const { isCompleted, isAvailable, isLocked } = lesson;

                return (
                  <div
                    key={lesson.slug}
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? "bg-orange-950/40 border-orange-700/20"
                        : isAvailable
                        ? "bg-slate-800/50 border-white/5 hover:border-orange-700/20 hover:scale-[1.01]"
                        : "bg-slate-800/30 border-white/5 opacity-60"
                    }`}
                  >
                    {/* Status Icon */}
                    <div
                      className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-lg ${
                        isCompleted
                          ? "bg-orange-700 text-white"
                          : isAvailable
                          ? "bg-orange-950/40 text-orange-400"
                          : "bg-slate-700 text-slate-500"
                      }`}
                    >
                      {isCompleted ? "✓" : isLocked ? "🔒" : lesson.slug.includes("en-passant") ? "♟" : "½"}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium tracking-tight ${
                        isLocked ? "text-slate-500" : "text-white"
                      }`}>
                        {lesson.title}
                      </h4>
                      <p className={`text-sm ${
                        isLocked ? "text-slate-600" : "text-orange-400"
                      }`}>
                        +{lesson.xpReward} XP
                      </p>
                    </div>

                    {/* Action */}
                    {isCompleted ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="shrink-0 px-3 py-2 text-sm font-medium text-orange-400 hover:text-amber-300 transition-colors"
                      >
                        Replay
                      </Link>
                    ) : isAvailable ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="shrink-0 px-4 py-2 text-sm font-medium bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition-all hover:scale-[1.02]"
                      >
                        Start
                      </Link>
                    ) : (
                      <span className="shrink-0 px-3 py-2 text-sm text-slate-500">
                        Locked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        )}
      </main>

      {/* Floating Feedback Button */}
      <FeedbackButton hasGivenFeedback={feedbackGiven} />
    </div>
  );
}
