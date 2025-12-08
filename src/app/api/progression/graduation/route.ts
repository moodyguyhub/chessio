/**
 * API route to mark school graduation as seen
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { markSchoolGraduationSeen } from "@/lib/progression/graduation";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await markSchoolGraduationSeen(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[graduation] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
