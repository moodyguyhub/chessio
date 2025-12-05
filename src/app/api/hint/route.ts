import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { logHintRequested } from "@/lib/telemetry";

const hintRequestSchema = z.object({
  fen: z.string().describe("Current board position in FEN notation"),
  lessonSlug: z.string().optional().describe("Current lesson slug for context"),
  taskIndex: z.number().optional().describe("Current task index for context"),
  lessonId: z.string().optional().describe("Current lesson ID for context"),
  taskId: z.string().optional().describe("Current task ID for context"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
});

export type HintRequest = z.infer<typeof hintRequestSchema>;

export interface HintResponse {
  hint: string;
  suggestedSquares?: string[];
  explanation?: string;
}

/**
 * POST /api/hint
 * Get an AI-powered hint for the current chess position
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = hintRequestSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { fen, difficulty, lessonSlug, taskIndex } = result.data;

    // Log telemetry for hint request
    if (lessonSlug) {
      logHintRequested({
        userId: session.user.id,
        lessonSlug,
        taskIndex: taskIndex ?? 0,
      });
    }

    // TODO: Replace with actual AI integration (OpenAI, Anthropic, etc.)
    // For now, return a mocked hint based on position analysis
    const hint = await generateMockedHint(fen, difficulty);

    return NextResponse.json<HintResponse>(hint);
  } catch (error) {
    console.error("Hint API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Mocked hint generator - replace with actual AI call
 */
async function generateMockedHint(
  fen: string,
  difficulty: string
): Promise<HintResponse> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Basic position analysis for mocked hints
  const isWhiteToMove = fen.split(" ")[1] === "w";
  const turn = isWhiteToMove ? "White" : "Black";

  // Different hint levels based on difficulty
  const hints: Record<string, HintResponse> = {
    beginner: {
      hint: `It's ${turn}'s turn. Look for pieces that can attack or defend.`,
      explanation: "Start by identifying which of your pieces can move safely.",
    },
    intermediate: {
      hint: `Consider ${turn}'s piece activity and central control.`,
      suggestedSquares: ["e4", "d4", "e5", "d5"],
      explanation: "Focus on controlling the center and developing your pieces.",
    },
    advanced: {
      hint: `Analyze tactical patterns and piece coordination for ${turn}.`,
      explanation: "Look for pins, forks, skewers, or discovered attacks.",
    },
  };

  return hints[difficulty] || hints.beginner;
}
