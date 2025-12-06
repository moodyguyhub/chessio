import { db } from "@/lib/db";
import { PromptCard } from "./PromptCard";
import { AiWorkbench } from "./AiWorkbench";

export const runtime = "nodejs";

const ROLE_LABELS: Record<string, string> = {
  product: "Product / Strategy",
  seo: "SEO Specialist",
  writer: "Content Writer",
  designer: "Designer",
  dev: "Developer / Analytics",
};

const ROLE_DESCRIPTIONS: Record<string, string> = {
  product: "Guides product decisions with a calm, anti-hype mindset",
  seo: "Drives organic growth through Blue Ocean keywords and calm content",
  writer: "Writes guides and copy that feels safe and supportive",
  designer: "Maintains Ink & Ivory design system and creates calm interfaces",
  dev: "Provides technical guidance aligned with Calm Dojo principles",
};

export default async function AiAdminPage() {
  const prompts = await db.aiPromptTemplate.findMany({
    orderBy: { role: "asc" },
  });

  // Get recent AI tasks
  const recentTasks = await db.aiTask.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: { name: true, email: true },
      },
    },
  });

  const byRole = prompts.reduce<Record<string, typeof prompts>>((acc, p) => {
    acc[p.role] = acc[p.role] || [];
    acc[p.role].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-white">AI Workbench · Calm Admin</h1>
        <p className="text-sm text-slate-400 mt-1">
          Get AI assistance from Nova with full human-in-the-loop review. All interactions are logged and auditable.
        </p>
      </header>

      {/* AI Workbench */}
      <AiWorkbench />

      {/* Recent Tasks */}
      {recentTasks.length > 0 && (
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent AI Tasks</h3>
          <div className="space-y-3">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-amber-400 uppercase">
                      {task.role}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-500">{task.scope}</span>
                    <span className="text-xs text-slate-500">·</span>
                    <span
                      className={`text-xs font-medium ${
                        task.status === "ACCEPTED"
                          ? "text-emerald-400"
                          : task.status === "REJECTED"
                          ? "text-slate-500"
                          : "text-amber-400"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-300 line-clamp-2">{task.input}</p>
                {task.output && (
                  <p className="text-xs text-slate-400 mt-2 line-clamp-1">
                    → {task.output}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-white/10" />

      {/* Prompt Library Header */}
      <header>
        <h2 className="text-xl font-bold text-white">Prompt Library · Team of 5</h2>
        <p className="text-sm text-slate-400 mt-1">
          Canonical prompts for external AI tools. Copy these into ChatGPT, Claude, etc.
        </p>
      </header>

      {/* Usage Instructions */}
      <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-blue-300 font-semibold mb-2">
          📋 How to Use Prompts Externally
        </h3>
        <ol className="text-sm text-slate-300 space-y-1.5 list-decimal list-inside">
          <li>Find your role below (Product, SEO, Writer, Designer, Dev)</li>
          <li>Click <strong className="text-white">"Copy Prompt"</strong> to copy the full system prompt</li>
          <li>Paste into ChatGPT, Claude, or your AI tool of choice</li>
          <li>Ask your question - the AI will respond as that role</li>
        </ol>
        <p className="text-xs text-slate-400 mt-3">
          💡 Tip: Use "Ask Nova" above for quick internal requests with auto-logging.
        </p>
      </div>

      {/* Prompts by Role */}
      <div className="space-y-8">
        {Object.entries(byRole).map(([role, templates]) => (
          <section key={role} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {ROLE_LABELS[role] ?? role}
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {ROLE_DESCRIPTIONS[role]}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              {templates.map((t) => (
                <PromptCard
                  key={t.id}
                  role={ROLE_LABELS[role] ?? role}
                  name={t.name}
                  content={t.content}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      {prompts.length === 0 && (
        <div className="bg-slate-900/50 border border-white/10 rounded-xl p-12 text-center">
          <div className="text-4xl mb-3">🤖</div>
          <p className="text-slate-400">No AI prompts yet. Run the seed script to populate initial prompts.</p>
        </div>
      )}
    </div>
  );
}
