import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLevelForXp, LEVELS } from "@/lib/gamification";

export const runtime = "nodejs";

/**
 * Internal Playtest Overview Page (Sprint 04)
 * 
 * Shows Mahmood player progression and feedback data
 * Read-only, developer-facing dashboard
 */
export default async function PlaytestPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Get all users with their XP
  const users = await db.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      xp: true,
      createdAt: true,
      feedbackGiven: true,
    },
    orderBy: { xp: "desc" },
  });

  // Calculate level distribution
  const levelDistribution = LEVELS.map((level) => {
    const count = users.filter((user) => {
      const userLevel = getLevelForXp(user.xp);
      return userLevel.level === level.level;
    }).length;
    
    return {
      level: level.level,
      label: level.label,
      count,
    };
  });

  // Get recent feedback (last 20 entries)
  const recentFeedback = await db.feedback.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      text: true,
      category: true,
      createdAt: true,
      levelAtTime: true,
      lessonSlug: true,
      User: {
        select: {
          email: true,
          name: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                🧪 Playtest Overview
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Internal dashboard for monitoring player progression & feedback
              </p>
            </div>
            <a
              href="/app"
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* User Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Player Summary
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Users */}
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-sm text-emerald-700 font-medium">
                Total Registered Users
              </p>
              <p className="text-3xl font-bold text-emerald-900 mt-1">
                {users.length}
              </p>
            </div>

            {/* Feedback Given */}
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-amber-700 font-medium">
                Users Who Gave Feedback
              </p>
              <p className="text-3xl font-bold text-amber-900 mt-1">
                {users.filter((u) => u.feedbackGiven).length}
              </p>
            </div>
          </div>

          {/* Level Distribution */}
          <div className="mt-6">
            <h3 className="text-md font-semibold text-slate-800 mb-3">
              Level Distribution
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {levelDistribution.map((level) => (
                <div
                  key={level.level}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center"
                >
                  <p className="text-xs text-slate-600 font-medium uppercase">
                    {level.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {level.count}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {users.length > 0
                      ? `${Math.round((level.count / users.length) * 100)}%`
                      : "0%"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Feedback Table */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Recent Feedback
          </h2>
          
          {recentFeedback.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500">No feedback submitted yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      User
                    </th>
                    <th className="text-center py-3 px-4 font-semibold text-slate-700">
                      Level
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Lesson
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Message
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentFeedback.map((feedback) => {
                    const level = LEVELS.find((l) => l.level === feedback.levelAtTime);
                    
                    return (
                      <tr
                        key={feedback.id}
                        className="border-b border-slate-100 hover:bg-slate-50"
                      >
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="py-3 px-4 text-slate-900 font-medium">
                          {feedback.User.name || feedback.User.email}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                            {level?.label || `L${feedback.levelAtTime}`}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              feedback.category === "bug"
                                ? "bg-red-100 text-red-800"
                                : feedback.category === "suggestion"
                                ? "bg-blue-100 text-blue-800"
                                : feedback.category === "praise"
                                ? "bg-pink-100 text-pink-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {feedback.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">
                          {feedback.lessonSlug ? (
                            <code className="bg-slate-100 px-1.5 py-0.5 rounded">
                              {feedback.lessonSlug}
                            </code>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-700">
                          <div className="max-w-md overflow-hidden text-ellipsis">
                            {feedback.text.length > 100
                              ? `${feedback.text.substring(0, 100)}...`
                              : feedback.text}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
