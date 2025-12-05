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
