#!/usr/bin/env npx tsx
/**
 * XP Configuration Verification Script
 * 
 * Verifies XP model v1 matches the spec and calculates totals.
 * No database connection required.
 */

import { allLessons, getLevel0Lessons, getLevel1Lessons, getPuzzles, getLevel2Lessons } from "../src/lib/lessons";
import { 
  getXpForContentSlug, 
  getContentTypeFromSlug, 
  getLevelForXp,
  LEVELS, 
  XP_REWARDS,
  type ContentType 
} from "../src/lib/gamification/config";

// Helper to get content type label
function getContentTypeLabel(type: ContentType): string {
  const labels: Record<ContentType, string> = {
    intro: "Intro Lesson",
    core: "Core Lesson",
    puzzle: "Puzzle",
    bonus: "Bonus",
  };
  return labels[type];
}

console.log("🔍 XP Model v1 Configuration Verification\n");
console.log("═".repeat(60));

// Display LEVELS config
console.log("\n📊 LEVELS Configuration:");
console.log("─".repeat(40));
for (const level of LEVELS) {
  console.log(`  Level ${level.level} (${level.id}): ${level.label} @ ${level.cumulativeXpRequired} XP`);
}

// Display XP_REWARDS
console.log("\n💰 XP_REWARDS Configuration:");
console.log("─".repeat(40));
for (const [type, xp] of Object.entries(XP_REWARDS) as [ContentType, number][]) {
  console.log(`  ${type}: ${xp} XP`);
}

// Group lessons by level and calculate XP
console.log("\n📚 Content Inventory:");
console.log("─".repeat(40));

const levels = [
  { name: "Level 0 – Foundations", lessons: getLevel0Lessons() },
  { name: "Level 1 – Tactics", lessons: getLevel1Lessons() },
  { name: "Puzzles", lessons: getPuzzles() },
  { name: "Level 2 – Advanced", lessons: getLevel2Lessons() },
];

let totalLessons = 0;
let totalXp = 0;
const contentTypeCounts: Record<ContentType, number> = { intro: 0, core: 0, puzzle: 0, bonus: 0 };

for (const level of levels) {
  if (level.lessons.length === 0) continue;
  
  const levelXp = level.lessons.reduce((sum, l) => sum + getXpForContentSlug(l.slug), 0);
  totalXp += levelXp;
  totalLessons += level.lessons.length;
  
  console.log(`\n  ${level.name} (${level.lessons.length} items, ${levelXp} XP):`);
  
  for (const lesson of level.lessons) {
    const type = getContentTypeFromSlug(lesson.slug);
    const xp = getXpForContentSlug(lesson.slug);
    const label = getContentTypeLabel(type);
    contentTypeCounts[type]++;
    
    console.log(`    • ${lesson.slug}`);
    console.log(`      → ${label} (${xp} XP)`);
  }
}

console.log("\n" + "═".repeat(60));
console.log(`📈 TOTALS: ${totalLessons} lessons, ${totalXp} XP available`);
console.log("─".repeat(40));
console.log("  By Content Type:");
for (const [type, count] of Object.entries(contentTypeCounts)) {
  if (count > 0) {
    const xp = XP_REWARDS[type as ContentType];
    console.log(`    ${type}: ${count} items (${count * xp} XP)`);
  }
}

// Level progression analysis
console.log("\n🎮 Level Progression Analysis:");
console.log("─".repeat(40));

let runningXp = 0;
for (const level of levels) {
  for (const lesson of level.lessons) {
    const xp = getXpForContentSlug(lesson.slug);
    const prevLevel = getLevelForXp(runningXp);
    runningXp += xp;
    const newLevel = getLevelForXp(runningXp);
    
    if (newLevel.level > prevLevel.level) {
      console.log(`  🎖️ LEVEL UP after "${lesson.slug}"`);
      console.log(`     ${prevLevel.label} → ${newLevel.label} (${runningXp} XP total)`);
    }
  }
}

console.log("\n✅ Verification complete!");
console.log("═".repeat(60));
