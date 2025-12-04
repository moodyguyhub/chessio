import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/lessons/[id]/complete
 * 
 * @deprecated This route is deprecated. Use the server action in
 * src/app/lessons/[slug]/actions.ts instead (completeLessonAction).
 * 
 * This old route used the DB-based Lesson model. We've migrated to
 * lessons.ts as source of truth with lessonSlug-based progress tracking.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(
    { 
      error: "Deprecated. Use completeLessonAction server action instead.",
      hint: "Import from @/app/lessons/[slug]/actions" 
    }, 
    { status: 410 } // Gone
  );
}
