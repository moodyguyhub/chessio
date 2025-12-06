import { db } from "@/lib/db";
import { updateSeoPage, createSeoKeyword } from "./actions";
import { AskNovaButton } from "./AskNovaButton";

export const runtime = "nodejs";

export default async function SeoAdminPage() {
  const [pages, keywords] = await Promise.all([
    db.seoPage.findMany({ orderBy: { slug: "asc" } }),
    db.seoKeyword.findMany({ orderBy: { priority: "asc" } }),
  ]);

  return (
    <div className="space-y-8">
      {/* Page Metadata Section */}
      <section>
        <h1 className="text-2xl font-bold text-white">SEO · Page Metadata</h1>
        <p className="text-sm text-slate-400 mt-1">
          Titles and descriptions for public pages. Changes reflect immediately.
        </p>

        <div className="mt-6 space-y-4">
          {pages.map((page) => (
            <form
              key={page.id}
              action={updateSeoPage}
              className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4"
            >
              <input type="hidden" name="slug" value={page.slug} />

              <div className="flex items-center justify-between">
                <div className="text-xs font-medium uppercase tracking-wide text-amber-400">
                  {page.slug}
                </div>
                <div className="flex items-center gap-2">
                  <AskNovaButton page={page} />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                <label className="block">
                  <span className="text-xs font-medium text-slate-300 mb-1.5 block">
                    Title
                  </span>
                  <input
                    name="title"
                    defaultValue={page.title}
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                    placeholder="Page title"
                  />
                </label>

                <label className="block">
                  <span className="text-xs font-medium text-slate-300 mb-1.5 block">
                    Meta Description
                  </span>
                  <textarea
                    name="description"
                    defaultValue={page.description ?? ""}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                    placeholder="Brief description for search engines"
                  />
                </label>

                <div className="grid md:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-medium text-slate-300 mb-1.5 block">
                      OG Title (optional)
                    </span>
                    <input
                      name="ogTitle"
                      defaultValue={page.ogTitle ?? ""}
                      className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      placeholder="Social share title"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-slate-300 mb-1.5 block">
                      OG Description (optional)
                    </span>
                    <input
                      name="ogDescription"
                      defaultValue={page.ogDescription ?? ""}
                      className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
                      placeholder="Social share description"
                    />
                  </label>
                </div>
              </div>
            </form>
          ))}
        </div>
      </section>

      {/* Keywords Section */}
      <section>
        <h2 className="text-xl font-semibold text-white">Blue Ocean Keywords</h2>
        <p className="text-sm text-slate-400 mt-1">
          Long-tail search phrases aligned with anxious, busy, or quiet adults.
        </p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* Keyword List */}
          <div className="bg-slate-900/50 border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/50 border-b border-white/10">
                  <tr className="text-xs text-slate-400">
                    <th className="text-left py-3 px-4 font-medium">Phrase</th>
                    <th className="text-left py-3 px-4 font-medium">Intent</th>
                    <th className="text-left py-3 px-4 font-medium">Archetype</th>
                    <th className="text-center py-3 px-4 font-medium">Priority</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {keywords.map((kw) => (
                    <tr key={kw.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white font-medium">{kw.phrase}</td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {kw.intent || "—"}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {kw.archetype || "—"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                          kw.priority === 1 
                            ? "bg-amber-500/20 text-amber-400" 
                            : kw.priority === 2
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-slate-700 text-slate-400"
                        }`}>
                          {kw.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Keyword Form */}
          <form
            action={createSeoKeyword}
            className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4 h-fit"
          >
            <h3 className="text-sm font-semibold text-white">Add Keyword</h3>

            <label className="block">
              <span className="text-xs font-medium text-slate-300 mb-1.5 block">
                Phrase
              </span>
              <input
                name="phrase"
                required
                placeholder="chess for anxious beginners"
                className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-300 mb-1.5 block">
                Intent
              </span>
              <input
                name="intent"
                placeholder="emotional safety / anxiety"
                className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-300 mb-1.5 block">
                Archetype
              </span>
              <select
                name="archetype"
                className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="">Select...</option>
                <option value="True Beginner">True Beginner</option>
                <option value="Returning Adult">Returning Adult</option>
                <option value="Quiet Worker">Quiet Worker</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-300 mb-1.5 block">
                Priority
              </span>
              <select
                name="priority"
                defaultValue="2"
                className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              >
                <option value="1">1 - High</option>
                <option value="2">2 - Medium</option>
                <option value="3">3 - Low</option>
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-slate-300 mb-1.5 block">
                Notes (optional)
              </span>
              <textarea
                name="notes"
                rows={2}
                placeholder="Additional context or research"
                className="w-full rounded-lg border border-white/10 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
              />
            </label>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Add Keyword
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
