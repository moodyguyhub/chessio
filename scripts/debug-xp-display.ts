/**
 * Debug XP Display Issue
 * Test what getLevelForXp(110) actually returns
 */

import { getLevelForXp, LEVELS } from "../src/lib/gamification/config";

const testXp = 110;

console.log("\n🔍 Testing XP Display for 110 XP:\n");

const levelProgress = getLevelForXp(testXp);

console.log("Level Progress Object:");
console.log(JSON.stringify(levelProgress, null, 2));

console.log("\n📊 Dashboard Display Calculation:");

const nextLevel = levelProgress.level < LEVELS.length - 1 ? LEVELS[levelProgress.level + 1] : null;

if (nextLevel) {
  const currentLevelThreshold = LEVELS[levelProgress.level].cumulativeXpRequired;
  const nextLevelThreshold = nextLevel.cumulativeXpRequired;
  const xpRange = nextLevelThreshold - currentLevelThreshold;
  
  console.log(`Current Level Index: ${levelProgress.level}`);
  console.log(`Current Level Def: ${JSON.stringify(LEVELS[levelProgress.level])}`);
  console.log(`Next Level Def: ${JSON.stringify(nextLevel)}`);
  console.log(`XP Into Level: ${levelProgress.xpIntoLevel}`);
  console.log(`XP Range: ${xpRange}`);
  console.log(`Display String: ${levelProgress.xpIntoLevel}/${xpRange} XP`);
}

console.log("\n✅ Expected: 35/125 XP");
console.log(`🔍 Actual: ${levelProgress.xpIntoLevel}/${nextLevel ? nextLevel.cumulativeXpRequired - LEVELS[levelProgress.level].cumulativeXpRequired : 'N/A'} XP\n`);
