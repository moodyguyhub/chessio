import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import { lessons, getPreviousLesson } from "@/lib/lessons";
import { getCompletedLessonSlugs, getUserXp } from "@/lib/lessons/progress";

// XP level calculation (simple: 100 XP per level)
function getLevel(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  const level = Math.floor(xp / 100) + 1;
  const currentXp = xp % 100;
  const nextLevelXp = 100;
  return { level, currentXp, nextLevelXp };
}

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Get user's XP and completed lessons from progress.ts
  const [userXp, completedSlugs] = await Promise.all([
    getUserXp(userId),
    getCompletedLessonSlugs(userId),
  ]);

  const completedSet = new Set(completedSlugs);

  // Get Level 0 lessons from lessons.ts (source of truth)
  const level0Lessons = lessons.filter((l) => l.level === 0);

  // Map lessons with completion and locking status
  const lessonsWithStatus = level0Lessons.map((lesson) => {
    const isCompleted = completedSet.has(lesson.slug);
    const previousLesson = getPreviousLesson(lesson.slug);
    // First lesson is always available, others require previous completion
    const isLocked = previousLesson !== null && !completedSet.has(previousLesson.slug);
    const isAvailable = !isLocked && !isCompleted;

    return {
      ...lesson,
      isCompleted,
      isAvailable,
      isLocked,
    };
  });

  const { level, currentXp, nextLevelXp } = getLevel(userXp);
  
  // Calculate level 0 progress
  const completedCount = lessonsWithStatus.filter((l) => l.isCompleted).length;
  const totalLessons = lessonsWithStatus.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/app" className="flex items-center gap-2">
            <span className="text-2xl">♟️</span>
            <span className="text-xl font-bold text-slate-900">Chessio</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {/* XP Display */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              <span className="font-medium text-slate-900">Level {level}</span>
              <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${(currentXp / nextLevelXp) * 100}%` }}
                />
              </div>
              <span className="text-slate-500">{currentXp}/{nextLevelXp} XP</span>
            </div>

            {/* Sign Out */}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Hi, {session.user.name || "Learner"} 👋
          </h1>
          <p className="text-slate-600 mt-1">Ready to learn some chess?</p>
        </div>

        {/* Mobile XP Display */}
        <div className="sm:hidden mb-6 p-4 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-slate-900">Level {level}</span>
            <span className="text-sm text-slate-500">{userXp} XP total</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${(currentXp / nextLevelXp) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">{currentXp}/{nextLevelXp} XP to next level</p>
        </div>

        {/* Level 0 Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Level 0</p>
                <h2 className="text-2xl font-bold text-white mt-1">Learn the Pieces</h2>
              </div>
              <div className="text-right">
                <p className="text-emerald-100 text-sm">Progress</p>
                <p className="text-2xl font-bold text-white">{progressPercent}%</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-4 w-full h-2 bg-emerald-400/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Lesson List */}
          <div className="p-6">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide mb-4">
              Lessons
            </h3>
            <div className="space-y-3">
              {lessonsWithStatus.map((lesson) => {
                const { isCompleted, isAvailable, isLocked } = lesson;

                return (
                  <div
                    key={lesson.slug}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                      isCompleted
                        ? "bg-emerald-50 border-emerald-200"
                        : isAvailable
                        ? "bg-white border-slate-200 hover:border-emerald-300 hover:shadow-sm"
                        : "bg-slate-50 border-slate-200 opacity-60"
                    }`}
                  >
                    {/* Status Icon */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                        isCompleted
                          ? "bg-emerald-500 text-white"
                          : isAvailable
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-slate-200 text-slate-400"
                      }`}
                    >
                      {isCompleted ? "✓" : isLocked ? "🔒" : "▶"}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${
                        isLocked ? "text-slate-400" : "text-slate-900"
                      }`}>
                        {lesson.title}
                      </h4>
                      <p className={`text-sm truncate ${
                        isLocked ? "text-slate-400" : "text-slate-500"
                      }`}>
                        {lesson.description}
                      </p>
                    </div>

                    {/* XP Badge */}
                    <div className={`text-sm font-medium ${
                      isCompleted ? "text-emerald-600" : isLocked ? "text-slate-400" : "text-slate-500"
                    }`}>
                      +{lesson.xpReward} XP
                    </div>

                    {/* Action */}
                    {isCompleted ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="px-4 py-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        Replay
                      </Link>
                    ) : isAvailable ? (
                      <Link
                        href={`/lessons/${lesson.slug}`}
                        className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                      >
                        Start
                      </Link>
                    ) : (
                      <span className="px-4 py-2 text-sm text-slate-400">
                        Locked
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
