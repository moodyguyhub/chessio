"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface FeedbackButtonProps {
  /** Whether user has already given feedback (hides bounty message) */
  hasGivenFeedback?: boolean;
  /** Optional lesson/puzzle context for this feedback */
  lessonSlug?: string;
}

export function FeedbackButton({ hasGivenFeedback = false, lessonSlug }: FeedbackButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
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
        body: JSON.stringify({ text, category: "general", lessonSlug }),
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
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg transition-all hover:scale-[1.02]"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <div 
            className="bg-slate-900/50 border border-white/10 rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {result ? (
              // Result State
              <div className="text-center space-y-4">
                <div className="text-5xl">
                  {result.success ? "🎉" : "😕"}
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {result.success ? "Thank You" : "Oops"}
                </h3>
                <p className="text-slate-300">
                  {result.message}
                </p>
                {result.xpAwarded && result.xpAwarded > 0 && (
                  <div className="inline-block px-4 py-2 bg-amber-900/30 text-amber-300 rounded-full font-medium">
                    +{result.xpAwarded} XP Earned
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
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Send Feedback
                  </h3>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {!hasGivenFeedback && (
                  <div className="bg-amber-900/20 border border-amber-500/20 rounded-lg p-3">
                    <p className="text-sm text-amber-300">
                      🎁 <strong>Founder&apos;s Bonus:</strong> Submit your first feedback and earn <strong>+15 XP</strong>
                    </p>
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your thoughts: bugs, ideas, or just say hi..."
                  className="w-full h-32 px-4 py-3 rounded-lg border border-white/10 bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none"
                  maxLength={2000}
                />

                <div className="flex items-center justify-between text-sm text-slate-400">
                  <span>{text.length}/2000</span>
                  <span className={text.length < 10 ? "text-amber-400" : "text-amber-400"}>
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
