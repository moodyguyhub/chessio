/**
 * Progression Telemetry
 *
 * Logs user progression events for analytics and debugging.
 * Currently logs to console in dev, can be extended to send to
 * analytics services (Vercel Analytics, Mixpanel, etc.)
 */

// Event types for progression tracking
export type ProgressionEventType =
  | "lesson_started"
  | "lesson_completed"
  | "task_completed"
  | "level_up"
  | "hint_requested"
  | "lesson_replayed"
  | "feedback_submitted";

export interface ProgressionEvent {
  type: ProgressionEventType;
  timestamp: string;
  // User context
  userId?: string;
  // Lesson context
  lessonSlug?: string;
  lessonTitle?: string;
  lessonLevel?: number;
  taskIndex?: number;
  // XP context
  xpAwarded?: number;
  totalXp?: number;
  newLevel?: number;
  // Extra metadata
  metadata?: Record<string, unknown>;
}

// Development mode check
const isDev = process.env.NODE_ENV === "development";

/**
 * Log a progression event
 * In dev, logs to console. In prod, can send to analytics.
 */
export function logProgressionEvent(event: ProgressionEvent): void {
  const timestamp = new Date().toISOString();
  const eventWithTime = { ...event, timestamp };

  if (isDev) {
    // Pretty console logging in development
    const icon = getEventIcon(event.type);
    console.log(
      `\n${icon} [Telemetry] ${event.type}`,
      JSON.stringify(eventWithTime, null, 2)
    );
  }

  // TODO: In production, send to analytics service
  // Examples:
  // - Vercel Analytics: track(event.type, eventWithTime)
  // - Mixpanel: mixpanel.track(event.type, eventWithTime)
  // - PostHog: posthog.capture(event.type, eventWithTime)
}

/**
 * Helper to get emoji icon for event type
 */
function getEventIcon(type: ProgressionEventType): string {
  switch (type) {
    case "lesson_started":
      return "📖";
    case "lesson_completed":
      return "✅";
    case "task_completed":
      return "☑️";
    case "level_up":
      return "🎖️";
    case "hint_requested":
      return "💡";
    case "lesson_replayed":
      return "🔄";
    case "feedback_submitted":
      return "📝";
    default:
      return "📊";
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Log lesson started event
 */
export function logLessonStarted(params: {
  userId?: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonLevel: number;
}): void {
  logProgressionEvent({
    type: "lesson_started",
    timestamp: new Date().toISOString(),
    ...params,
  });
}

/**
 * Log lesson completed event
 */
export function logLessonCompleted(params: {
  userId?: string;
  lessonSlug: string;
  lessonTitle: string;
  lessonLevel: number;
  xpAwarded: number;
  totalXp: number;
  alreadyCompleted: boolean;
}): void {
  logProgressionEvent({
    type: "lesson_completed",
    timestamp: new Date().toISOString(),
    ...params,
    metadata: { alreadyCompleted: params.alreadyCompleted },
  });
}

/**
 * Log level up event
 */
export function logLevelUp(params: {
  userId?: string;
  newLevel: number;
  totalXp: number;
}): void {
  logProgressionEvent({
    type: "level_up",
    timestamp: new Date().toISOString(),
    ...params,
  });
}

/**
 * Log hint requested event
 */
export function logHintRequested(params: {
  userId?: string;
  lessonSlug: string;
  taskIndex: number;
}): void {
  logProgressionEvent({
    type: "hint_requested",
    timestamp: new Date().toISOString(),
    ...params,
  });
}

/**
 * Log feedback submitted event
 */
export function logFeedbackSubmitted(params: {
  userId?: string;
  sentiment?: string;
}): void {
  logProgressionEvent({
    type: "feedback_submitted",
    timestamp: new Date().toISOString(),
    ...params,
    metadata: { sentiment: params.sentiment },
  });
}
