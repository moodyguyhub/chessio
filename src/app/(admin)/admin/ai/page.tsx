import { db } from "@/lib/db";
import { PromptCard } from "./PromptCard";

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

  const byRole = prompts.reduce<Record<string, typeof prompts>>((acc, p) => {
    acc[p.role] = acc[p.role] || [];
    acc[p.role].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-white">AI Prompts · Team of 5</h1>
        <p className="text-sm text-slate-400 mt-1">
          Canonical prompts for Nova & co. This is the source of truth each teammate copies into their AI tool.
        </p>
      </header>

      {/* Usage Instructions */}
      <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6">
        <h3 className="text-blue-300 font-semibold mb-2">
          📋 How to Use
        </h3>
        <ol className="text-sm text-slate-300 space-y-1.5 list-decimal list-inside">
          <li>Find your role below (Product, SEO, Writer, Designer, Dev)</li>
          <li>Click <strong className="text-white">"Copy Prompt"</strong> to copy the full system prompt</li>
          <li>Paste into ChatGPT, Claude, or your AI tool of choice</li>
          <li>Ask your question - the AI will respond as that role</li>
        </ol>
        <p className="text-xs text-slate-400 mt-3">
          💡 Tip: Start a new chat for each session to keep context clean.
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
