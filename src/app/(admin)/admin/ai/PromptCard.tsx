"use client";

import { useState } from "react";

export function PromptCard({
  name,
  role,
  content,
}: {
  name: string;
  role: string;
  content: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-xs text-slate-400 mt-1">{role}</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            copied
              ? "bg-green-900/30 text-green-400 border border-green-500/30"
              : "bg-amber-500 hover:bg-amber-600 text-white"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy Prompt"}
        </button>
      </div>

      <pre className="text-xs whitespace-pre-wrap bg-slate-800/50 rounded-lg p-4 max-h-64 overflow-auto text-slate-300 leading-relaxed border border-white/5">
        {content}
      </pre>
    </div>
  );
}
