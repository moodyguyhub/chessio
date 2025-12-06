import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import OpenAI from "openai";
import { selectModel, estimateCost, AI_ENABLED, AVERAGE_TOKENS } from "@/lib/ai-config";

export const runtime = "nodejs";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  // Check if AI is enabled
  if (!AI_ENABLED) {
    return NextResponse.json(
      { error: "AI features are currently disabled" },
      { status: 503 }
    );
  }

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

    // Select appropriate model based on scope
    // Select model based on scope (can force reasoning with { deep: true })
    const model = selectModel(scope);

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

    // Call OpenAI with intelligent model selection
    const completion = await openai.chat.completions.create({
      model, // Dynamically selected based on scope
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
    
    // Estimate cost for tracking
    const inputTokens = completion.usage?.prompt_tokens || AVERAGE_TOKENS.input;
    const outputTokens = completion.usage?.completion_tokens || AVERAGE_TOKENS.output;
    const estimatedCost = estimateCost(model, inputTokens, outputTokens);

    // Update task with output and metadata
    await db.aiTask.update({
      where: { id: task.id },
      data: { 
        output,
        // Store metadata as JSON in a text field if you want to track it
        // Or add new fields to the schema for model/cost tracking
      },
    });

    return NextResponse.json({
      success: true,
      taskId: task.id,
      output,
      model, // Show which model was used
      estimatedCost, // Show cost for transparency
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
