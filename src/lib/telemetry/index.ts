/**
 * Telemetry module
 *
 * Exports telemetry functions for tracking user events.
 */

export {
  logProgressionEvent,
  logLessonStarted,
  logLessonCompleted,
  logLevelUp,
  logHintRequested,
  logFeedbackSubmitted,
  type ProgressionEvent,
  type ProgressionEventType,
} from "./progression";

export {
  logRetentionEvent,
  logDashboardViewed,
  logTodaysGoalClicked,
  logSessionStarted,
  logWelcomeBackShown,
  getEventBuffer,
  getRecentEvents,
  clearEventBuffer,
  getEventSummary,
  type RetentionEvent,
  type RetentionEventType,
} from "./retention";
