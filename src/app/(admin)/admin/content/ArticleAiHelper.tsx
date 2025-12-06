"use client";

import { useState } from "react";

interface ArticleData {
  id: string;
  title: string;
  targetKeyword: string | null;
  archetype: string | null;
}

type HelperType = "outline" | "intro";

export function ArticleAiHelper({ article }: { article: ArticleData }) {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [helperType, setHelperType] = useState<HelperType | null>(null);

  async function handleRequest(type: HelperType) {
    setLoading(true);
    setError(null);
    setResponse(null);
    setHelperType(type);

    const messages = {
      outline: `Create a calm, non-judgmental outline for this article. Target audience: anxious adult chess beginners (800-1100 Elo) who feel intimidated by competitive play. Use the Calm Dojo voice: supportive, specific, and anti-hype. Break down into 4-5 main sections with brief descriptions.`,
      intro: `Write a 3-paragraph intro for this article in the Calm Dojo voice. Address why the topic matters to anxious beginners, validate their feelings, and set expectations for what they'll learn. No hype, no promises of quick results. Tone: warm, specific, grounded.`,
    };

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "writer",
          scope: "article",
          targetId: article.id,
          message: messages[type],
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
    setHelperType(null);
  }

  return (
    <>
      <div className="flex gap-2">
        <button
          onClick={() => handleRequest("outline")}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm hover:bg-blue-500/20 transition-colors disabled:opacity-50"
        >
          {loading && helperType === "outline" ? "..." : "📝 Generate Outline"}
        </button>
        <button
          onClick={() => handleRequest("intro")}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm hover:bg-purple-500/20 transition-colors disabled:opacity-50"
        >
          {loading && helperType === "intro" ? "..." : "✍️ Draft Intro"}
        </button>
      </div>

      {/* Modal */}
      {(response || error) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-white/10 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {helperType === "outline" ? "Suggested Outline" : "Suggested Intro"}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">{article.title}</p>
                </div>
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
                    <strong>⚠️ Human review required:</strong> This is a starting point. Adapt the tone, add specifics, and ensure it matches Calm Dojo voice. Copy useful parts into the article notes field.
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
