/**
 * API route to mark club preview as attempted
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { markClubPreviewAttempted } from "@/lib/progression/graduation";
import { withErrorHandling, apiSuccess } from "@/lib/api-errors";

export const runtime = "nodejs";

export const POST = withErrorHandling(async (req) => {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await markClubPreviewAttempted(session.user.id);

  return apiSuccess({ success: true });
}, "mark-preview-attempted");
