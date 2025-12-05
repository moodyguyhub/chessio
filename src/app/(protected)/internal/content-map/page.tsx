import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { allLessons } from "@/lib/lessons";
import { 
  getXpForContentSlug, 
  getContentTypeFromSlug, 
  LEVELS,
  XP_REWARDS,
  type ContentType 
} from "@/lib/gamification";

export const runtime = "nodejs";

/**
 * Internal Content Map - shows all content with metadata.
 * Protected route for dev/admin use.
 */
export default async function ContentMapPage() {
  const session = await auth();

  // Basic protection - only allow logged in users
  // In production, you'd check for admin role
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Group lessons by level
  const lessonsByLevel = allLessons.reduce((acc, lesson) => {
    const level = lesson.level;
    if (!acc[level]) {
      acc[level] = [];
    }
    acc[level].push(lesson);
    return acc;
  }, {} as Record<number, typeof allLessons>);

  // Calculate totals using the centralized config
  const totalLessons = allLessons.length;
  const totalXp = allLessons.reduce((sum, l) => sum + getXpForContentSlug(l.slug), 0);

  // Level labels for display (aligned with config)
  const levelLabels: Record<number, { name: string; theme: string; type: string }> = {
    0: { name: "Level 0 – Foundations", theme: "bg-emerald-500", type: "Learning" },
    1: { name: "Level 1 – Tactics", theme: "bg-blue-500", type: "Learning" },
    2: { name: "Practice Zone", theme: "bg-purple-500", type: "Puzzles" },
    3: { name: "Level 2 – Advanced", theme: "bg-amber-500", type: "Learning" },
  };

  // Content type badge styles
  const contentTypeBadges: Record<ContentType, { bg: string; text: string; label: string }> = {
    intro: { bg: "bg-sky-100", text: "text-sky-700", label: "Intro" },
    core: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Core" },
    puzzle: { bg: "bg-purple-100", text: "text-purple-700", label: "Puzzle" },
    bonus: { bg: "bg-slate-100", text: "text-slate-700", label: "Bonus" },
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">📊 Content Map</h1>
          <p className="text-slate-500 mt-1">Internal view of all lessons and puzzles with XP config</p>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{totalLessons}</div>
              <div className="text-sm text-slate-500">Total Items</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">{totalXp}</div>
              <div className="text-sm text-slate-500">Total XP</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{Object.keys(lessonsByLevel).length}</div>
              <div className="text-sm text-slate-500">Levels</div>
            </div>
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {allLessons.filter(l => getContentTypeFromSlug(l.slug) === 'puzzle').length}
              </div>
              <div className="text-sm text-slate-500">Puzzle Sets</div>
            </div>
          </div>
        </div>

        {/* XP Rewards Config */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">XP Rewards (from config)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(Object.entries(XP_REWARDS) as [ContentType, number][]).map(([type, xp]) => {
              const badge = contentTypeBadges[type];
              return (
                <div key={type} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                    {badge.label}
                  </span>
                  <span className="font-bold text-emerald-600">+{xp} XP</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Level Thresholds */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Level Thresholds</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {LEVELS.map((level) => (
              <div key={level.id} className="p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎖️</span>
                  <span className="font-semibold text-slate-900">{level.label}</span>
                </div>
                <div className="text-sm text-slate-500">
                  Level {level.level} • {level.cumulativeXpRequired} XP
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content by Level */}
        {Object.entries(lessonsByLevel)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([level, lessons]) => {
            const levelNum = Number(level);
            const levelInfo = levelLabels[levelNum] || { 
              name: `Level ${level}`, 
              theme: "bg-slate-500",
              type: "Unknown" 
            };
            const levelXp = lessons.reduce((sum, l) => sum + getXpForContentSlug(l.slug), 0);

            return (
              <div key={level} className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
                {/* Level Header */}
                <div className={`${levelInfo.theme} text-white p-4`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold">{levelInfo.name}</h3>
                      <p className="text-sm opacity-90">{levelInfo.type} • {lessons.length} items</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{levelXp} XP</div>
                      <div className="text-sm opacity-90">Total</div>
                    </div>
                  </div>
                </div>

                {/* Lesson Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">#</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Slug</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Title</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Content Type</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">XP (config)</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">XP (hardcoded)</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">Tasks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {lessons.map((lesson, idx) => {
                        const contentType = getContentTypeFromSlug(lesson.slug);
                        const configXp = getXpForContentSlug(lesson.slug);
                        const badge = contentTypeBadges[contentType];
                        const xpMismatch = configXp !== lesson.xpReward;
                        
                        return (
                          <tr key={lesson.slug} className={`hover:bg-slate-50 ${xpMismatch ? 'bg-amber-50' : ''}`}>
                            <td className="px-4 py-3 text-sm text-slate-400">{idx + 1}</td>
                            <td className="px-4 py-3">
                              <code className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                {lesson.slug}
                              </code>
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-slate-900">
                              {lesson.title}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${badge.bg} ${badge.text}`}>
                                {badge.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right font-medium text-emerald-600">
                              +{configXp}
                            </td>
                            <td className={`px-4 py-3 text-sm text-right font-medium ${xpMismatch ? 'text-amber-600' : 'text-slate-400'}`}>
                              {xpMismatch ? `⚠️ ${lesson.xpReward}` : lesson.xpReward}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-slate-500">
                              {lesson.tasks.length}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}

        {/* Footer Notes */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          <strong>📝 Content Notes:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Level 0 (Foundations): 6 lessons → ~{allLessons.filter(l => l.level === 0).reduce((s, l) => s + getXpForContentSlug(l.slug), 0)} XP</li>
            <li>Level 1 (Tactics): 4 lessons → ~{allLessons.filter(l => l.level === 1).reduce((s, l) => s + getXpForContentSlug(l.slug), 0)} XP</li>
            <li>Practice Zone: puzzle sets → ~{allLessons.filter(l => l.level === 2).reduce((s, l) => s + getXpForContentSlug(l.slug), 0)} XP</li>
            <li>Level 2 (Advanced): 2 lessons → ~{allLessons.filter(l => l.level === 3).reduce((s, l) => s + getXpForContentSlug(l.slug), 0)} XP</li>
            <li><strong>⚠️ Rows highlighted</strong> = hardcoded XP differs from config-inferred XP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
