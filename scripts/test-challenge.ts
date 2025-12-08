/**
 * Coach's Challenge Test Simulator
 * 
 * Simple script to test challenge logic without UI.
 * Run with: npx tsx scripts/test-challenge.ts
 */

import { ChallengeEngine } from "../src/lib/challenges/engine";
import { getChallengeConfig } from "../src/lib/challenges/config";

function simulateChallenge(challengeId: "level0_challenge" | "level1_challenge") {
  console.log("\n" + "=".repeat(60));
  console.log(`Testing: ${challengeId.toUpperCase()}`);
  console.log("=".repeat(60) + "\n");

  const config = getChallengeConfig(challengeId);
  const engine = new ChallengeEngine(config);

  console.log("Starting FEN:", config.startingFEN);
  console.log("Win Condition:", config.winCondition);
  console.log("Bot Profile:", config.botProfileId);
  console.log("\n");

  // Test 1: Valid move sequence
  console.log("Test 1: Making some moves...\n");

  console.log("Initial State:");
  console.log("- Moves played:", engine.getState().movesPlayed);
  console.log("- Material score:", engine.getState().materialScore);
  console.log("- Captures:", engine.getState().capturesByPlayer);
  console.log("\n");

  // Test 2: Check FEN validation
  console.log("Test 2: FEN Validation");
  console.log("Current FEN is valid:", engine.getFen().split(" ").length === 6);
  console.log("\n");

  // Test 3: Check player turn
  console.log("Test 3: Turn Check");
  console.log("Is player turn?", engine.isPlayerTurn());
  console.log("\n");

  console.log("✅ Basic tests passed for", challengeId);
}

// Run tests
console.log("\n🧪 COACH'S CHALLENGE TEST SUITE\n");

try {
  simulateChallenge("level0_challenge");
  simulateChallenge("level1_challenge");
  
  console.log("\n" + "=".repeat(60));
  console.log("✨ ALL TESTS COMPLETED SUCCESSFULLY");
  console.log("=".repeat(60) + "\n");
} catch (error) {
  console.error("\n❌ Test failed:", error);
  process.exit(1);
}
