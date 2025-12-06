/**
 * User Engagement & Session Tracking
 * 
 * Sprint 03: Return Journey & Retention
 * 
 * Tracks user engagement patterns to support:
 * - Welcome back messaging
 * - Today's Goal recommendations
 * - Session continuity display
 * 
 * A "session" is defined as a unique calendar day (UTC) on which
 * the user visits the dashboard. Multiple visits on the same day
 * count as one session.
 */

import { db } from "@/lib/db";

export interface EngagementStats {
  lastActiveAt: Date | null;
  sessionCount: number;
  isReturningUser: boolean;
  isReturningToday: boolean;
  daysSinceLastVisit: number | null;
}

/**
 * Get engagement statistics for a user.
 */
export async function getUserEngagementStats(userId: string): Promise<EngagementStats> {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      lastActiveAt: true,
      sessionCount: true,
    },
  });

  if (!user) {
    return {
      lastActiveAt: null,
      sessionCount: 0,
      isReturningUser: false,
      isReturningToday: false,
      daysSinceLastVisit: null,
    };
  }

  const now = new Date();
  const lastActiveAt = user.lastActiveAt;
  const sessionCount = user.sessionCount;

  // Calculate if returning user (has visited before)
  const isReturningUser = sessionCount > 0;

  // Calculate if returning today (visited earlier today)
  let isReturningToday = false;
  let daysSinceLastVisit: number | null = null;

  if (lastActiveAt) {
    const lastActiveDay = getUTCDateString(lastActiveAt);
    const todayString = getUTCDateString(now);
    isReturningToday = lastActiveDay === todayString;
    
    // Calculate days since last visit
    const diffTime = now.getTime() - lastActiveAt.getTime();
    daysSinceLastVisit = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  return {
    lastActiveAt,
    sessionCount,
    isReturningUser,
    isReturningToday,
    daysSinceLastVisit,
  };
}

/**
 * Record a dashboard visit and update session count if it's a new day.
 * 
 * Returns the updated engagement stats.
 */
export async function recordDashboardVisit(userId: string): Promise<EngagementStats> {
  const now = new Date();
  const todayString = getUTCDateString(now);

  // Get current user state
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      lastActiveAt: true,
      sessionCount: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Check if this is a new session (different day from last visit)
  const lastActiveDay = user.lastActiveAt 
    ? getUTCDateString(user.lastActiveAt) 
    : null;
  const isNewSession = lastActiveDay !== todayString;

  // Update user record
  const updatedUser = await db.user.update({
    where: { id: userId },
    data: {
      lastActiveAt: now,
      // Only increment sessionCount if it's a new day
      sessionCount: isNewSession 
        ? { increment: 1 } 
        : user.sessionCount,
    },
    select: {
      lastActiveAt: true,
      sessionCount: true,
    },
  });

  // Return updated stats
  return {
    lastActiveAt: updatedUser.lastActiveAt,
    sessionCount: updatedUser.sessionCount,
    isReturningUser: updatedUser.sessionCount > 1,
    isReturningToday: !isNewSession,
    daysSinceLastVisit: isNewSession && user.lastActiveAt 
      ? Math.floor((now.getTime() - user.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24))
      : 0,
  };
}

/**
 * Get UTC date string for comparison (YYYY-MM-DD format).
 */
function getUTCDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

/**
 * Get a friendly description of when the user was last active.
 */
export function getLastActiveDescription(daysSinceLastVisit: number | null): string {
  if (daysSinceLastVisit === null) {
    return "This is your first visit!";
  }
  if (daysSinceLastVisit === 0) {
    return "You were here earlier today";
  }
  if (daysSinceLastVisit === 1) {
    return "You were here yesterday";
  }
  if (daysSinceLastVisit < 7) {
    return `You were here ${daysSinceLastVisit} days ago`;
  }
  if (daysSinceLastVisit < 14) {
    return "You were here about a week ago";
  }
  if (daysSinceLastVisit < 30) {
    return "You were here a few weeks ago";
  }
  return "Welcome back! It's been a while";
}
