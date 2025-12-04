import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/lessons/[id]/hint-used
 * Track when a user requests a hint
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: lessonId } = await params;
    const userId = session.user.id;

    // Increment hints used
    await db.userLessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        hintsUsed: 1,
      },
      update: {
        hintsUsed: { increment: 1 },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Hint tracking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
