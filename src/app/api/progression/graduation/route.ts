/**
 * API route to mark school graduation as seen
 */

import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { markSchoolGraduationSeen } from "@/lib/progression/graduation";
import { withErrorHandling, apiSuccess } from "@/lib/api-errors";

export const runtime = "nodejs";

export const POST = withErrorHandling(async (req: NextRequest) => {
  const session = await auth();
  
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await markSchoolGraduationSeen(session.user.id);

  return apiSuccess({ success: true });
}, "mark-graduation-seen");
