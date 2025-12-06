"use client";

import { useState } from "react";

const ROLES = [
  { value: "product", label: "Product / Strategy" },
  { value: "seo", label: "SEO Copilot" },
  { value: "writer", label: "Content Writer" },
  { value: "designer", label: "Design Copilot" },
  { value: "dev", label: "Developer Assistant" },
];

const SCOPES = [
  { value: "freeform", label: "Freeform (General)" },
  { value: "seoPage", label: "SEO Page Context" },
  { value: "article", label: "Article Idea Context" },
  { value: "keyword", label: "Keyword Context" },
];

export function AiWorkbench() {
  const [role, setRole] = useState("product");
  const [scope, setScope] = useState("freeform");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{ taskId: string; output: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, scope, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setResponse(data);
      setMessage(""); // Clear input after success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function markAs(status: "ACCEPTED" | "REJECTED") {
    if (!response?.taskId) return;

    try {
      // You'll create this endpoint next
      await fetch("/api/ai/task", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId: response.taskId, status }),
      });

      setResponse(null); // Clear after marking
    } catch (err: any) {
      console.error("Failed to mark task:", err);
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Request Form */}
      <div className="bg-slate-900/50 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ask Nova</h3>
        <p className="text-sm text-slate-400 mb-6">
          Get AI assistance for your role. All responses are logged and require human review before use.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Scope
              </label>
              <select
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none"
              >
                {SCOPES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Your Request
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="e.g., 'Suggest a calm, non-hype title for the home page that speaks to anxious beginners...'"
              className="w-full px-3 py-2 rounded-lg border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="w-full py-3 px-4 rounded-full bg-amber-500 text-neutral-950 font-semibold hover:bg-amber-600 focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Thinking..." : "Ask Nova"}
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-4 text-rose-400 text-sm">
          {error}
        </div>
      )}

      {/* AI Response */}
      {response && (
        <div className="bg-slate-900/50 border border-white/10 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Nova's Response</h3>
            <span className="text-xs text-slate-500">Task ID: {response.taskId.slice(0, 8)}</span>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
            <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans">
              {response.output}
            </pre>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => markAs("ACCEPTED")}
              className="flex-1 py-2 px-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            >
              ✓ Mark as Used
            </button>
            <button
              onClick={() => markAs("REJECTED")}
              className="flex-1 py-2 px-4 rounded-lg bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Dismiss
            </button>
          </div>

          <p className="text-xs text-slate-500 mt-3 text-center">
            Remember: Review and adapt AI suggestions to match Calm Dojo voice
          </p>
        </div>
      )}
    </div>
  );
}
