/**
 * API route to mark school graduation as seen
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { markSchoolGraduationSeen } from "@/lib/progression/graduation";
import { withErrorHandling, apiSuccess } from "@/lib/api-errors";

export const runtime = "nodejs";

export const POST = withErrorHandling(async (req) => {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await markSchoolGraduationSeen(session.user.id);

  return apiSuccess({ success: true });
}, "mark-graduation-seen");
