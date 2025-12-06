/**
 * Test script for dual-model AI routing
 * 
 * Tests:
 * 1. Cheap model routing (freeform, seoPage, article, keyword)
 * 2. Reasoning model routing (strategy, protocol, architecture, planning)
 * 3. API response format (model, estimatedCost)
 * 4. Cost estimation accuracy
 */

import { config } from "dotenv";
config(); // Load .env file

import { db } from "../src/lib/db";

interface AiResponse {
  success: boolean;
  taskId: string;
  output: string;
  model: string;
  estimatedCost: number;
}

async function testAiRouting() {
  console.log("🧪 Testing Dual-Model AI Routing\n");

  // Get or create test admin user
  let testUser = await db.user.findFirst({
    where: { email: "test@chessio.com" },
  });

  if (!testUser) {
    testUser = await db.user.create({
      data: {
        email: "test@chessio.com",
        name: "Test Admin",
        role: "ADMIN",
      },
    });
    console.log("✅ Created test admin user\n");
  }

  const tests = [
    // Cheap model tests
    {
      name: "Freeform (cheap model)",
      role: "product",
      scope: "freeform",
      message: "What's a good name for a chess lesson about basic strategy?",
      expectedModel: "gpt-4o-mini",
      expectedCostRange: [0.0001, 0.001], // Very low cost
    },
    {
      name: "SEO Page (cheap model)",
      role: "seo",
      scope: "seoPage",
      message: "Suggest meta description for /lessons page",
      expectedModel: "gpt-4o-mini",
      expectedCostRange: [0.0001, 0.001],
    },
    {
      name: "Article (cheap model)",
      role: "writer",
      scope: "article",
      message: "Draft intro paragraph about chess anxiety",
      expectedModel: "gpt-4o-mini",
      expectedCostRange: [0.0001, 0.001],
    },
    {
      name: "Keyword (cheap model)",
      role: "seo",
      scope: "keyword",
      message: "Analyze keyword: 'learn chess for anxious adults'",
      expectedModel: "gpt-4o-mini",
      expectedCostRange: [0.0001, 0.001],
    },
    // Reasoning model tests
    {
      name: "Strategy (reasoning model)",
      role: "product",
      scope: "strategy",
      message: "Should we add multiplayer chess to Chessio? Consider our anxious beginner audience.",
      expectedModel: "gpt-4.1",
      expectedCostRange: [0.005, 0.02], // Higher cost
    },
    {
      name: "Protocol (reasoning model)",
      role: "developer",
      scope: "protocol",
      message: "Design API structure for lesson progress tracking",
      expectedModel: "gpt-4.1",
      expectedCostRange: [0.005, 0.02],
    },
    {
      name: "Architecture (reasoning model)",
      role: "developer",
      scope: "architecture",
      message: "How should we structure the database for user achievements?",
      expectedModel: "gpt-4.1",
      expectedCostRange: [0.005, 0.02],
    },
    {
      name: "Planning (reasoning model)",
      role: "product",
      scope: "planning",
      message: "Create roadmap for Season 02 features focusing on retention",
      expectedModel: "gpt-4.1",
      expectedCostRange: [0.005, 0.02],
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`\n📋 Test: ${test.name}`);
    console.log(`   Role: ${test.role}, Scope: ${test.scope}`);

    try {
      const response = await fetch("http://localhost:3000/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: test.role,
          scope: test.scope,
          message: test.message,
          userId: testUser.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`API error: ${error.error || response.statusText}`);
      }

      const data = (await response.json()) as AiResponse;

      // Validate response structure
      if (!data.success || !data.taskId || !data.output || !data.model || typeof data.estimatedCost !== "number") {
        throw new Error("Invalid response structure");
      }

      // Check model selection
      const modelMatch = data.model === test.expectedModel;
      console.log(`   Model: ${data.model} ${modelMatch ? "✅" : "❌ (expected " + test.expectedModel + ")"}`);

      // Check cost range
      const costInRange =
        data.estimatedCost >= test.expectedCostRange[0] &&
        data.estimatedCost <= test.expectedCostRange[1];
      console.log(`   Cost: $${data.estimatedCost.toFixed(6)} ${costInRange ? "✅" : "❌ (expected $" + test.expectedCostRange[0] + "-$" + test.expectedCostRange[1] + ")"}`);

      // Check output exists
      const hasOutput = data.output.length > 10;
      console.log(`   Output: ${data.output.length} chars ${hasOutput ? "✅" : "❌"}`);

      // Check task logged in database
      const task = await db.aiTask.findUnique({
        where: { id: data.taskId },
      });
      const taskLogged = task !== null;
      console.log(`   DB Log: ${taskLogged ? "✅" : "❌"}`);

      if (modelMatch && costInRange && hasOutput && taskLogged) {
        console.log(`   ✅ PASSED`);
        passed++;
      } else {
        console.log(`   ❌ FAILED`);
        failed++;
      }
    } catch (error: any) {
      console.log(`   ❌ ERROR: ${error.message}`);
      failed++;
    }

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log("\n" + "=".repeat(50));
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  console.log(`   Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%\n`);

  // Cleanup: Delete test tasks
  await db.aiTask.deleteMany({
    where: { createdById: testUser.id },
  });
  console.log("🧹 Cleaned up test data\n");

  // Note: Don't disconnect singleton db instance
  // await db.$disconnect();

  process.exit(failed > 0 ? 1 : 0);
}

testAiRouting().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
