"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { PreSchoolMood } from "@/lib/feedback/types";

export function PreSchoolFeedbackStrip() {
  const pathname = usePathname();
  const [mood, setMood] = useState<PreSchoolMood | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async () => {
    if (!mood || status === "submitting") return;
    
    setStatus("submitting");
    
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "pre_school",
          mood,
          text: comment.trim() || undefined,
          path: pathname,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      setStatus("success");
      setComment("");
      setMood(null);
      
      // Reset success message after 3s
      setTimeout(() => {
        if (status === "success") setStatus("idle");
      }, 3000);
    } catch (err) {
      console.error("Pre-School feedback error:", err);
      setStatus("error");
    }
  };

  const moodButtons: Array<{ value: PreSchoolMood; emoji: string; label: string }> = [
    { value: "lost", emoji: "😕", label: "Lost" },
    { value: "okay", emoji: "🙂", label: "It's okay" },
    { value: "love", emoji: "🤩", label: "I love it" },
  ];

  return (
    <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4 opacity-90">
      <p className="text-sm font-medium text-slate-200 mb-3">
        How is this playground feeling so far?
      </p>

      {/* Mood buttons */}
      <div className="flex gap-2 mb-3">
        {moodButtons.map((btn) => (
          <button
            key={btn.value}
            type="button"
            onClick={() => setMood(btn.value)}
            disabled={status === "submitting" || status === "success"}
            className={`flex-1 flex flex-col items-center gap-1 px-3 py-2 rounded-md border transition-all text-sm ${
              mood === btn.value
                ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                : "border-slate-600 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:bg-slate-900"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <span className="text-xl">{btn.emoji}</span>
            <span className="text-xs">{btn.label}</span>
          </button>
        ))}
      </div>

      {/* Comment textarea */}
      <textarea
        className="w-full rounded-md border border-slate-600 bg-slate-900/50 p-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
        rows={2}
        placeholder="Anything confusing, boring, or fun here? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={status === "submitting" || status === "success"}
        maxLength={500}
      />

      {/* Submit button and status */}
      <div className="flex items-center justify-between gap-2 mt-3">
        <button
          onClick={handleSubmit}
          disabled={!mood || status === "submitting" || status === "success"}
          className="h-8 px-3 text-xs font-bold rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-yellow-500/50 disabled:opacity-50 disabled:pointer-events-none shadow-md hover:shadow-lg hover:scale-[1.02]"
          style={{
            backgroundColor: '#facc15',
            color: '#0f172a',
            border: '2px solid rgba(251, 191, 36, 0.5)'
          }}
        >
          {status === "submitting" ? "Sending..." : "Send feedback"}
        </button>
        
        {status === "success" && (
          <span className="text-xs text-emerald-400 font-medium">
            Thanks, got it 🙏
          </span>
        )}
        
        {status === "error" && (
          <span className="text-xs text-red-400">
            Error. Try again in a moment.
          </span>
        )}
      </div>
    </div>
  );
}
