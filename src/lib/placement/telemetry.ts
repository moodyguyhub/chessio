/**
 * Placement Test Telemetry (v1 stub)
 * 
 * For now, just console logs. In v2, wire to API endpoint or analytics service.
 */

export interface PlacementTelemetryEvent {
  userId?: string;
  event: "placement_started" | "placement_completed" | "placement_retake";
  score?: number;
  total?: number;
  status?: "passed" | "failed";
  timestamp: string;
}

/**
 * Log placement test event (v1: console only)
 */
export function logPlacementEvent(event: PlacementTelemetryEvent): void {
  if (process.env.NODE_ENV === "development") {
    console.log("[Placement Telemetry]", event);
  }

  // TODO v2: Send to API
  // await fetch("/api/telemetry/placement", {
  //   method: "POST",
  //   body: JSON.stringify(event),
  // });
}

/**
 * Track placement test started
 */
export function trackPlacementStarted(userId?: string): void {
  logPlacementEvent({
    userId,
    event: "placement_started",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track placement test completed
 */
export function trackPlacementCompleted(
  score: number,
  total: number,
  status: "passed" | "failed",
  userId?: string
): void {
  logPlacementEvent({
    userId,
    event: "placement_completed",
    score,
    total,
    status,
    timestamp: new Date().toISOString(),
  });
}

/**
 * Track placement test retake
 */
export function trackPlacementRetake(userId?: string): void {
  logPlacementEvent({
    userId,
    event: "placement_retake",
    timestamp: new Date().toISOString(),
  });
}
