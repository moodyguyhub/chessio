/**
 * Feedback logging helper
 * Logs feedback to console and optional webhook (Slack, etc)
 */

import { FeedbackPayload, FeedbackStored } from "./types";

const FEEDBACK_WEBHOOK_URL =
  process.env.FEEDBACK_WEBHOOK_URL || process.env.FEEDBACK_SLACK_WEBHOOK;

export async function logFeedback(
  payload: FeedbackPayload,
  opts?: { userId?: string; sessionId?: string }
): Promise<FeedbackStored> {
  const entry: FeedbackStored = {
    ...payload,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    userId: opts?.userId,
    sessionId: opts?.sessionId,
  };

  // 1) Always log to server console for now
  console.log("[Feedback]", JSON.stringify(entry, null, 2));

  // 2) Optional webhook (Slack, etc)
  if (FEEDBACK_WEBHOOK_URL) {
    try {
      await fetch(FEEDBACK_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
    } catch (err) {
      console.error("[Feedback webhook error]", err);
      // Don't throw - we still want to return the entry
    }
  }

  return entry;
}
