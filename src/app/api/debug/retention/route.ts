/**
 * Retention Telemetry Debug Endpoint
 * 
 * Sprint 03: Return Journey & Retention
 * 
 * DEV-ONLY endpoint to inspect retention events.
 * Returns recent events from the in-memory buffer.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { 
  getRecentEvents, 
  getEventSummary,
  type RetentionEvent 
} from "@/lib/telemetry";

export const runtime = "nodejs";

interface DebugResponse {
  status: "ok" | "error";
  environment: string;
  eventCount: number;
  summary: Record<string, number>;
  recentEvents: RetentionEvent[];
  note: string;
}

export async function GET(): Promise<NextResponse<DebugResponse | { error: string }>> {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Debug endpoint only available in development" },
      { status: 403 }
    );
  }

  // Require authentication
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const recentEvents = getRecentEvents(50);
  const summary = getEventSummary();

  return NextResponse.json({
    status: "ok",
    environment: process.env.NODE_ENV,
    eventCount: recentEvents.length,
    summary,
    recentEvents,
    note: "Events are stored in memory and will be lost on server restart.",
  });
}
