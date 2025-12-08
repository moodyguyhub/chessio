/**
 * API route to mark club preview as attempted
 */

import { auth } from "@/lib/auth";
import { markClubPreviewAttempted } from "@/lib/progression/graduation";
import { withErrorHandling, apiSuccess } from "@/lib/api-errors";

export const runtime = "nodejs";

export const POST = withErrorHandling(async (req) => {
  const session = await auth();
  
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  await markClubPreviewAttempted(session.user.id);

  return apiSuccess({ success: true });
}, "mark-preview-attempted");
