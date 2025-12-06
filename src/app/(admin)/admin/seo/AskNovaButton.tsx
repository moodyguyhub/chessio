"use client";

import { useState } from "react";

interface SeoPageData {
  id: string;
  slug: string;
  title: string;
  description: string;
}

export function AskNovaButton({ page }: { page: SeoPageData }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk() {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "seo",
          scope: "seoPage",
          targetId: page.id,
          message: `Suggest a calm, non-hype title and meta description for the "${page.slug}" page. Keep title under 60 chars, description under 160 chars. Target anxious adult chess beginners who feel intimidated by competitive play. Avoid promises of quick results or aggressive language.`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to get suggestion");
      }

      setResponse(data.output);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setResponse(null);
    setError(null);
  }

  return (
    <>
      <button
        onClick={handleAsk}
        disabled={loading}
        className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors disabled:opacity-50"
      >
        {loading ? "Thinking..." : "✨ Ask Nova"}
      </button>

      {/* Modal */}
      {(response || error) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  Nova's SEO Suggestion
                </h3>
                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 text-rose-400 text-sm">
                  {error}
                </div>
              )}

              {response && (
                <>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
                    <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
                      {response}
                    </pre>
                  </div>

                  <div className="bg-amber-900/10 border border-amber-500/20 rounded-lg p-4 text-sm text-amber-200">
                    <strong>⚠️ Human review required:</strong> Copy the parts you like into the form above. Adapt the tone to match Calm Dojo voice. Never auto-apply AI suggestions.
                  </div>
                </>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
