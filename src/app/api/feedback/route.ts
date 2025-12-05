import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

const FEEDBACK_BOUNTY_XP = 50;

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Please sign in to submit feedback" },
        { status: 401 }
      );
    }

    const userId = session.user.id; // Store for TypeScript narrowing

    const { text, category = "general" } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide at least 10 characters of feedback" },
        { status: 400 }
      );
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { error: "Feedback must be under 2000 characters" },
        { status: 400 }
      );
    }

    const validCategories = ["bug", "suggestion", "praise", "general"];
    const safeCategory = validCategories.includes(category) ? category : "general";

    // Check if user has already given feedback (for bounty)
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { feedbackGiven: true, xp: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const isFirstFeedback = !user.feedbackGiven;

    // Use transaction to ensure atomicity
    const result = await db.$transaction(async (tx) => {
      // Create feedback
      await tx.feedback.create({
        data: {
          userId,
          text: text.trim(),
          category: safeCategory,
        },
      });

      // Award XP bounty on first feedback
      if (isFirstFeedback) {
        const updatedUser = await tx.user.update({
          where: { id: userId },
          data: {
            xp: { increment: FEEDBACK_BOUNTY_XP },
            feedbackGiven: true,
          },
          select: { xp: true },
        });

        return {
          xpAwarded: FEEDBACK_BOUNTY_XP,
          totalXp: updatedUser.xp,
          isFirstFeedback: true,
        };
      }

      return {
        xpAwarded: 0,
        totalXp: user.xp,
        isFirstFeedback: false,
      };
    });

    return NextResponse.json({
      success: true,
      message: isFirstFeedback 
        ? "Thank you! You earned the Founder's Bonus!" 
        : "Thank you for your feedback!",
      ...result,
    });

  } catch (error) {
    console.error("[Feedback API Error]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
