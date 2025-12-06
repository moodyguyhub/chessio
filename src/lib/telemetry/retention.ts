/**
 * Retention Telemetry
 * 
 * Sprint 03: Return Journey & Retention
 * 
 * Tracks retention-related events to understand return behavior.
 * Events are stored in memory for debugging and can be extended
 * to persist to a database or analytics service.
 */

// Event types for retention tracking
export type RetentionEventType =
  | "dashboard_viewed"
  | "todays_goal_clicked"
  | "session_started"
  | "welcome_back_shown";

export interface RetentionEvent {
  type: RetentionEventType;
  timestamp: string;
  userId: string;
  // User context at time of event
  sessionCount: number;
  currentLevel: number;
  currentLevelLabel: string;
  totalXp: number;
  // Event-specific data
  metadata?: Record<string, unknown>;
}

// In-memory event buffer for debugging
// In production, this would be replaced with proper persistence
const eventBuffer: RetentionEvent[] = [];
const MAX_BUFFER_SIZE = 100;

// Development mode check
const isDev = process.env.NODE_ENV === "development";

/**
 * Log a retention event
 */
export function logRetentionEvent(event: Omit<RetentionEvent, "timestamp">): void {
  const timestamp = new Date().toISOString();
  const eventWithTime: RetentionEvent = { ...event, timestamp };

  // Add to buffer (ring buffer - remove oldest when full)
  if (eventBuffer.length >= MAX_BUFFER_SIZE) {
    eventBuffer.shift();
  }
  eventBuffer.push(eventWithTime);

  if (isDev) {
    const icon = getEventIcon(event.type);
    console.log(
      `\n${icon} [Retention] ${event.type}`,
      JSON.stringify(eventWithTime, null, 2)
    );
  }

  // TODO: In production, send to analytics service
}

/**
 * Get emoji icon for event type
 */
function getEventIcon(type: RetentionEventType): string {
  switch (type) {
    case "dashboard_viewed":
      return "🏠";
    case "todays_goal_clicked":
      return "🎯";
    case "session_started":
      return "🚀";
    case "welcome_back_shown":
      return "👋";
    default:
      return "📊";
  }
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Log dashboard viewed event
 */
export function logDashboardViewed(params: {
  userId: string;
  sessionCount: number;
  currentLevel: number;
  currentLevelLabel: string;
  totalXp: number;
  isNewSession: boolean;
  daysSinceLastVisit: number | null;
}): void {
  logRetentionEvent({
    type: "dashboard_viewed",
    userId: params.userId,
    sessionCount: params.sessionCount,
    currentLevel: params.currentLevel,
    currentLevelLabel: params.currentLevelLabel,
    totalXp: params.totalXp,
    metadata: {
      isNewSession: params.isNewSession,
      daysSinceLastVisit: params.daysSinceLastVisit,
    },
  });
}

/**
 * Log today's goal clicked event
 */
export function logTodaysGoalClicked(params: {
  userId: string;
  sessionCount: number;
  currentLevel: number;
  currentLevelLabel: string;
  totalXp: number;
  goalTitle: string;
  goalActionType: string;
  targetSlug?: string;
}): void {
  logRetentionEvent({
    type: "todays_goal_clicked",
    userId: params.userId,
    sessionCount: params.sessionCount,
    currentLevel: params.currentLevel,
    currentLevelLabel: params.currentLevelLabel,
    totalXp: params.totalXp,
    metadata: {
      goalTitle: params.goalTitle,
      goalActionType: params.goalActionType,
      targetSlug: params.targetSlug,
    },
  });
}

/**
 * Log session started event
 */
export function logSessionStarted(params: {
  userId: string;
  sessionCount: number;
  currentLevel: number;
  currentLevelLabel: string;
  totalXp: number;
  daysSinceLastVisit: number | null;
}): void {
  logRetentionEvent({
    type: "session_started",
    userId: params.userId,
    sessionCount: params.sessionCount,
    currentLevel: params.currentLevel,
    currentLevelLabel: params.currentLevelLabel,
    totalXp: params.totalXp,
    metadata: {
      daysSinceLastVisit: params.daysSinceLastVisit,
    },
  });
}

/**
 * Log welcome back shown event
 */
export function logWelcomeBackShown(params: {
  userId: string;
  sessionCount: number;
  currentLevel: number;
  currentLevelLabel: string;
  totalXp: number;
  welcomeType: "new_user" | "returning_user";
}): void {
  logRetentionEvent({
    type: "welcome_back_shown",
    userId: params.userId,
    sessionCount: params.sessionCount,
    currentLevel: params.currentLevel,
    currentLevelLabel: params.currentLevelLabel,
    totalXp: params.totalXp,
    metadata: {
      welcomeType: params.welcomeType,
    },
  });
}

// ============================================
// DEBUG FUNCTIONS (Dev Only)
// ============================================

/**
 * Get all events in the buffer (for debugging)
 */
export function getEventBuffer(): RetentionEvent[] {
  return [...eventBuffer];
}

/**
 * Get recent events (for debug endpoint)
 */
export function getRecentEvents(limit: number = 20): RetentionEvent[] {
  return eventBuffer.slice(-limit);
}

/**
 * Clear the event buffer (for testing)
 */
export function clearEventBuffer(): void {
  eventBuffer.length = 0;
}

/**
 * Get event summary by type (for debugging)
 */
export function getEventSummary(): Record<RetentionEventType, number> {
  const summary: Record<string, number> = {};
  for (const event of eventBuffer) {
    summary[event.type] = (summary[event.type] || 0) + 1;
  }
  return summary as Record<RetentionEventType, number>;
}
