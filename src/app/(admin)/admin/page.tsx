import { MODEL_REASONING, MODEL_CHEAP } from "@/lib/ai-config";

export const runtime = "nodejs";

export default async function AdminDashboard() {
  // Static placeholders to avoid DB runtime issues in production
  const pageCount = 0;
  const keywordCount = 0;
  const articleCount = 0;
  const promptCount = 0;
  const totalTasks = 0;
  const acceptedTasks = 0;
  const acceptanceRate = totalTasks > 0 ? Math.round((acceptedTasks / totalTasks) * 100) : 0;
  
  // For now, estimate model mix (will be accurate once we log model in DB)
  // Assuming ~90% cheap, ~10% reasoning based on scope distribution
  const estimatedReasoning = Math.round(totalTasks * 0.1);
  const estimatedCheap = totalTasks - estimatedReasoning;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Calm Admin
        </h1>
        <p className="text-slate-400 mt-2">
          Internal control room for SEO, content, and AI operations. Calm, boring, predictable.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard label="SEO Pages" value={pageCount} sublabel="Home, Login, About" />
        <StatCard label="Keywords" value={keywordCount} sublabel="Blue Ocean targets" className="text-amber-400" />
        <StatCard label="Article Ideas" value={articleCount} sublabel="Season 02 ready" />
        <StatCard label="AI Prompts" value={promptCount} sublabel="Team of 5 ready" />
      </div>

      {/* AI Health (Last 7 Days) */}
      <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-2xl">🧠</div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              AI Health
            </h2>
            <p className="text-sm text-slate-400">
              Last 7 days · Dual-model system
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Tasks */}
          <div>
            <div className="text-sm text-slate-400 mb-1">Total Requests</div>
            <div className="text-3xl font-bold text-white">{totalTasks}</div>
            <div className="text-xs text-slate-500 mt-1">
              {totalTasks === 0 ? "No requests yet" : "Admin AI calls"}
            </div>
          </div>

          {/* Acceptance Rate */}
          <div>
            <div className="text-sm text-slate-400 mb-1">Acceptance Rate</div>
            <div className="text-3xl font-bold text-green-400">{acceptanceRate}%</div>
            <div className="text-xs text-slate-500 mt-1">
              {acceptedTasks} accepted, {totalTasks - acceptedTasks} rejected/pending
            </div>
          </div>

          {/* Model Mix */}
          <div>
            <div className="text-sm text-slate-400 mb-1">Model Mix</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-purple-400" title="gpt-4o (reasoning)">
                {estimatedReasoning}
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-xl font-bold text-blue-400" title="gpt-4o-mini (cheap)">
                {estimatedCheap}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Reasoning / Utility
            </div>
          </div>
        </div>

        {/* Cost Estimate */}
        {totalTasks > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="text-xs text-slate-400">
              Est. cost: <span className="text-white font-mono">${((estimatedReasoning * 0.01) + (estimatedCheap * 0.0003)).toFixed(4)}</span>
              {" · "}
              <span className="text-purple-400">{MODEL_REASONING}</span>
              {" + "}
              <span className="text-blue-400">{MODEL_CHEAP}</span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/seo"
            className="p-4 border border-white/10 rounded-lg hover:border-amber-500/30 hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🔍</div>
              <div>
                <div className="text-white font-medium group-hover:text-amber-300 transition-colors">
                  Manage SEO Pages
                </div>
                <div className="text-sm text-slate-400">
                  Edit metadata for public pages
                </div>
              </div>
            </div>
          </a>

          <a
            href="/admin/content"
            className="p-4 border border-white/10 rounded-lg hover:border-amber-500/30 hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">📝</div>
              <div>
                <div className="text-white font-medium group-hover:text-amber-300 transition-colors">
                  Plan Content
                </div>
                <div className="text-sm text-slate-400">
                  Season 02 article pipeline
                </div>
              </div>
            </div>
          </a>

          <a
            href="/admin/ai"
            className="p-4 border border-white/10 rounded-lg hover:border-amber-500/30 hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">🤖</div>
              <div>
                <div className="text-white font-medium group-hover:text-amber-300 transition-colors">
                  Use AI Workbench
                </div>
                <div className="text-sm text-slate-400">
                  Team prompts & playground
                </div>
              </div>
            </div>
          </a>

          <a
            href="/app"
            className="p-4 border border-white/10 rounded-lg hover:border-amber-500/30 hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">👤</div>
              <div>
                <div className="text-white font-medium group-hover:text-amber-300 transition-colors">
                  View as User
                </div>
                <div className="text-sm text-slate-400">
                  See the live app
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* Calm Principles Reminder */}
      <div className="bg-amber-900/10 border border-amber-500/20 rounded-xl p-6">
        <h3 className="text-amber-300 font-semibold mb-2">
          💭 Calm Admin Principles
        </h3>
        <ul className="text-sm text-slate-300 space-y-1">
          <li>→ Keep it simple: This admin exists to make ops boring</li>
          <li>→ Protect focus: Only add features that reduce mental load</li>
          <li>→ Quality over speed: Better to do less, done well</li>
          <li>→ User-first: Every change should make Chessio calmer</li>
        </ul>
      </div>
    </div>
  );
}

function StatCard({ 
  label, 
  value, 
  sublabel,
  className 
}: { 
  label: string; 
  value: number; 
  sublabel?: string;
  className?: string;
}) {
  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
      <div className="text-sm text-slate-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${className || 'text-white'}`}>{value}</div>
      {sublabel && <div className="text-xs text-slate-500 mt-1">{sublabel}</div>}
    </div>
  );
}
