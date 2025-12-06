import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import OpenAI from "openai";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  // Auth check: admin only
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin role
  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { role, scope, targetId, message } = await req.json();

    // Validate inputs
    if (!role || !scope || !message) {
      return NextResponse.json(
        { error: "Missing required fields: role, scope, message" },
        { status: 400 }
      );
    }

    // Get the prompt template for this role
    const template = await db.aiPromptTemplate.findFirst({
      where: { role }
    });

    if (!template) {
      return NextResponse.json(
        { error: `No prompt template found for role: ${role}` },
        { status: 400 }
      );
    }

    // Build context from target if provided
    let contextSnippet = "";

    if (scope === "seoPage" && targetId) {
      const page = await db.seoPage.findUnique({ where: { id: targetId } });
      if (page) {
        contextSnippet = `Current SEO entry:\nSlug: ${page.slug}\nTitle: ${page.title}\nDescription: ${page.description}\nOG Title: ${page.ogTitle || "(not set)"}\nOG Description: ${page.ogDescription || "(not set)"}\n\n`;
      }
    }

    if (scope === "article" && targetId) {
      const article = await db.articleIdea.findUnique({ where: { id: targetId } });
      if (article) {
        contextSnippet = `Article idea:\nTitle: ${article.title}\nKeyword: ${article.targetKeyword || "(not set)"}\nArchetype: ${article.archetype || "(not set)"}\nStatus: ${article.status}\nCurrent notes:\n${article.notes || "(empty)"}\n\n`;
      }
    }

    if (scope === "keyword" && targetId) {
      const keyword = await db.seoKeyword.findUnique({ where: { id: targetId } });
      if (keyword) {
        contextSnippet = `Keyword:\nPhrase: ${keyword.phrase}\nIntent: ${keyword.intent || "(not set)"}\nArchetype: ${keyword.archetype || "(not set)"}\nPriority: ${keyword.priority}\nNotes: ${keyword.notes || "(empty)"}\n\n`;
      }
    }

    // Create AiTask record (pending)
    const task = await db.aiTask.create({
      data: {
        role,
        scope,
        targetId: targetId || null,
        input: message,
        createdById: session.user.id,
        status: "PENDING",
      },
    });

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using gpt-4o-mini for cost efficiency (you can change to gpt-4o for better quality)
      messages: [
        {
          role: "system",
          content: template.content,
        },
        {
          role: "user",
          content: `${contextSnippet}User request:\n${message}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const output = completion.choices[0]?.message?.content || "";

    // Update task with output
    await db.aiTask.update({
      where: { id: task.id },
      data: { output },
    });

    return NextResponse.json({
      success: true,
      taskId: task.id,
      output,
    });

  } catch (error: any) {
    console.error("AI API error:", error);
    
    // Handle OpenAI API errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: "OpenAI API key not configured or invalid" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error?.message || "Failed to process AI request" },
      { status: 500 }
    );
  }
}
