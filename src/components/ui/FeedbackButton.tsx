"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type FeedbackCategory = "bug" | "suggestion" | "praise" | "general";

interface FeedbackButtonProps {
  /** Whether user has already given feedback (hides bounty message) */
  hasGivenFeedback?: boolean;
}

export function FeedbackButton({ hasGivenFeedback = false }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    xpAwarded?: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim().length < 10) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, category }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult({
          success: true,
          message: data.message,
          xpAwarded: data.xpAwarded,
        });
        setText("");
      } else {
        setResult({
          success: false,
          message: data.error || "Something went wrong",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setResult(null);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-all hover:scale-105"
        aria-label="Send feedback"
      >
        <span className="text-lg">💬</span>
        <span className="text-sm font-medium hidden sm:inline">
          {hasGivenFeedback ? "Feedback" : "Feedback (+15 XP)"}
        </span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={handleClose}
        >
          <div 
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            {result ? (
              // Result State
              <div className="text-center space-y-4">
                <div className="text-5xl">
                  {result.success ? "🎉" : "😕"}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {result.success ? "Thank You!" : "Oops"}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {result.message}
                </p>
                {result.xpAwarded && result.xpAwarded > 0 && (
                  <div className="inline-block px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full font-medium">
                    +{result.xpAwarded} XP Earned!
                  </div>
                )}
                <Button variant="primary" onClick={handleClose} className="w-full mt-4">
                  Close
                </Button>
              </div>
            ) : (
              // Form State
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Send Feedback
                  </h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    ✕
                  </button>
                </div>

                {!hasGivenFeedback && (
                  <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg p-3">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      🎁 <strong>Founder&apos;s Bonus:</strong> Submit your first feedback and earn <strong>+15 XP</strong>!
                    </p>
                  </div>
                )}

                {/* Category Selection */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "bug", label: "🐛 Bug" },
                    { value: "suggestion", label: "💡 Idea" },
                    { value: "praise", label: "❤️ Love it" },
                    { value: "general", label: "💬 General" },
                  ].map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setCategory(cat.value as FeedbackCategory)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        category === cat.value
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Textarea */}
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind? Bug reports, suggestions, or just say hi..."
                  className="w-full h-32 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  maxLength={2000}
                />

                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{text.length}/2000</span>
                  <span className={text.length < 10 ? "text-amber-500" : "text-emerald-500"}>
                    {text.length < 10 ? `${10 - text.length} more chars needed` : "✓ Ready"}
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={text.trim().length < 10 || isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Feedback"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
