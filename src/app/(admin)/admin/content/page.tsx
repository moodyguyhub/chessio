import { db } from "@/lib/db";
import { updateArticleStatus } from "./actions";

export const runtime = "nodejs";

const STATUS_COLORS = {
  DRAFT: "bg-slate-700 text-slate-300",
  OUTLINED: "bg-blue-900/30 text-blue-400 border-blue-500/30",
  WRITING: "bg-amber-900/30 text-amber-400 border-amber-500/30",
  LIVE: "bg-green-900/30 text-green-400 border-green-500/30",
};

export default async function ContentAdminPage() {
  const ideas = await db.articleIdea.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white">Content · Season 02 Pipeline</h1>
        <p className="text-sm text-slate-400 mt-1">
          Article ideas that act as magnets for our calm adult archetypes.
        </p>
      </header>

      <div className="space-y-4">
        {ideas.map((idea) => (
          <div
            key={idea.id}
            className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{idea.title}</h3>
                <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                  {idea.targetKeyword && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">🔍</span>
                      <span>{idea.targetKeyword}</span>
                    </div>
                  )}
                  {idea.archetype && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">👤</span>
                      <span>{idea.archetype}</span>
                    </div>
                  )}
                  {idea.slug && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500">🔗</span>
                      <span className="font-mono">/{idea.slug}</span>
                    </div>
                  )}
                </div>
              </div>

              <form action={updateArticleStatus} className="flex items-center gap-2">
                <input type="hidden" name="id" value={idea.id} />
                <select
                  name="status"
                  defaultValue={idea.status}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                    STATUS_COLORS[idea.status as keyof typeof STATUS_COLORS]
                  }`}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="OUTLINED">Outlined</option>
                  <option value="WRITING">Writing</option>
                  <option value="LIVE">Live</option>
                </select>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Save
                </button>
              </form>
            </div>

            {idea.notes && (
              <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                <div className="text-xs font-medium text-slate-400 mb-2">Notes:</div>
                <div className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
                  {idea.notes}
                </div>
              </div>
            )}
          </div>
        ))}

        {ideas.length === 0 && (
          <div className="bg-slate-900/50 border border-white/10 rounded-xl p-12 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-slate-400">No article ideas yet. Run the seed script to populate initial ideas.</p>
          </div>
        )}
      </div>
    </div>
  );
}
