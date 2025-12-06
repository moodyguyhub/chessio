/**
 * Unit tests for XP & Level calculation system
 * Tests boundary behavior and core helpers
 */

import { describe, it, expect } from "@jest/globals";
import {
  getLevelForXp,
  getXpForContentSlug,
  getContentTypeFromSlug,
  wouldLevelUp,
  LEVELS,
  XP_REWARDS,
} from "./config";

describe("getLevelForXp - Level Boundaries", () => {
  it("returns Novice at 0 XP", () => {
    const result = getLevelForXp(0);
    expect(result.level).toBe(0);
    expect(result.label).toBe("Novice");
    expect(result.id).toBe("novice");
    expect(result.xpIntoLevel).toBe(0);
    expect(result.xpToNextLevel).toBe(75);
  });

  it("returns Novice at 74 XP (just before Pawn)", () => {
    const result = getLevelForXp(74);
    expect(result.level).toBe(0);
    expect(result.label).toBe("Novice");
    expect(result.xpIntoLevel).toBe(74);
    expect(result.xpToNextLevel).toBe(1);
  });

  it("returns Pawn at exactly 75 XP", () => {
    const result = getLevelForXp(75);
    expect(result.level).toBe(1);
    expect(result.label).toBe("Pawn");
    expect(result.id).toBe("pawn");
    expect(result.xpIntoLevel).toBe(0);
    expect(result.xpToNextLevel).toBe(125); // 200 - 75
  });

  it("returns Pawn at 199 XP (just before Knight)", () => {
    const result = getLevelForXp(199);
    expect(result.level).toBe(1);
    expect(result.label).toBe("Pawn");
    expect(result.xpIntoLevel).toBe(124); // 199 - 75
    expect(result.xpToNextLevel).toBe(1);
  });

  it("returns Knight at exactly 200 XP", () => {
    const result = getLevelForXp(200);
    expect(result.level).toBe(2);
    expect(result.label).toBe("Knight");
    expect(result.id).toBe("knight");
    expect(result.xpIntoLevel).toBe(0);
    expect(result.xpToNextLevel).toBe(175); // 375 - 200
  });

  it("returns Knight at 374 XP (just before Bishop)", () => {
    const result = getLevelForXp(374);
    expect(result.level).toBe(2);
    expect(result.label).toBe("Knight");
    expect(result.xpIntoLevel).toBe(174); // 374 - 200
    expect(result.xpToNextLevel).toBe(1);
  });

  it("returns Bishop at exactly 375 XP", () => {
    const result = getLevelForXp(375);
    expect(result.level).toBe(3);
    expect(result.label).toBe("Bishop");
    expect(result.id).toBe("bishop");
    expect(result.xpIntoLevel).toBe(0);
    expect(result.xpToNextLevel).toBeNull(); // Max level
    expect(result.nextLevelXpRequired).toBeNull();
  });

  it("returns Bishop at 1000 XP (beyond max)", () => {
    const result = getLevelForXp(1000);
    expect(result.level).toBe(3);
    expect(result.label).toBe("Bishop");
    expect(result.xpIntoLevel).toBe(625); // 1000 - 375
    expect(result.xpToNextLevel).toBeNull();
  });
});

describe("getLevelForXp - Progress Percent", () => {
  it("calculates 0% progress at level start", () => {
    const result = getLevelForXp(75); // Start of Pawn
    expect(result.progressPercent).toBe(0);
  });

  it("calculates ~50% progress at level midpoint", () => {
    const result = getLevelForXp(137); // 75 + 62, roughly middle of Pawn (75-200)
    expect(result.progressPercent).toBeGreaterThanOrEqual(49);
    expect(result.progressPercent).toBeLessThanOrEqual(50);
  });

  it("calculates 100% progress at max level", () => {
    const result = getLevelForXp(375); // Bishop
    expect(result.progressPercent).toBe(100);
  });
});

describe("getContentTypeFromSlug", () => {
  it("recognizes intro- prefix as intro", () => {
    expect(getContentTypeFromSlug("intro-board-basics")).toBe("intro");
  });

  it("recognizes -intro- in middle as intro", () => {
    expect(getContentTypeFromSlug("level-1-intro-tactics")).toBe("intro");
  });

  it("recognizes level-0-lesson-1-board as intro (special case)", () => {
    expect(getContentTypeFromSlug("level-0-lesson-1-board")).toBe("intro");
  });

  it("recognizes puzzle- prefix as puzzle", () => {
    expect(getContentTypeFromSlug("puzzle-set-1-mate")).toBe("puzzle");
    expect(getContentTypeFromSlug("puzzle-forks")).toBe("puzzle");
  });

  it("recognizes concept- prefix as core", () => {
    expect(getContentTypeFromSlug("concept-forks")).toBe("core");
  });

  it("recognizes -concept- in middle as core", () => {
    expect(getContentTypeFromSlug("level-2-concept-pins")).toBe("core");
  });

  it("recognizes level-X-lesson- pattern as core", () => {
    expect(getContentTypeFromSlug("level-0-lesson-2-rook")).toBe("core");
    expect(getContentTypeFromSlug("level-1-lesson-3-check")).toBe("core");
    expect(getContentTypeFromSlug("level-2-lesson-5-concept-pins")).toBe("core");
  });

  it("returns bonus for unknown patterns", () => {
    expect(getContentTypeFromSlug("random-content")).toBe("bonus");
    expect(getContentTypeFromSlug("something-else")).toBe("bonus");
  });
});

describe("getXpForContentSlug", () => {
  it("returns 10 XP for intro lessons", () => {
    expect(getXpForContentSlug("intro-board")).toBe(10);
    expect(getXpForContentSlug("level-1-intro-tactics")).toBe(10);
    expect(getXpForContentSlug("level-0-lesson-1-board")).toBe(10);
  });

  it("returns 15 XP for core lessons", () => {
    expect(getXpForContentSlug("level-0-lesson-2-rook")).toBe(15);
    expect(getXpForContentSlug("concept-forks")).toBe(15);
    expect(getXpForContentSlug("level-2-concept-pins")).toBe(15);
  });

  it("returns 20 XP for puzzles", () => {
    expect(getXpForContentSlug("puzzle-set-1")).toBe(20);
    expect(getXpForContentSlug("puzzle-mate-in-one")).toBe(20);
  });

  it("returns 5 XP for bonus/fallback content", () => {
    expect(getXpForContentSlug("random-thing")).toBe(5);
  });
});

describe("wouldLevelUp", () => {
  it("returns true when crossing level boundary", () => {
    expect(wouldLevelUp(74, 1)).toBe(true); // 74 + 1 = 75 (Novice → Pawn)
    expect(wouldLevelUp(199, 1)).toBe(true); // 199 + 1 = 200 (Pawn → Knight)
    expect(wouldLevelUp(374, 1)).toBe(true); // 374 + 1 = 375 (Knight → Bishop)
  });

  it("returns false when staying within same level", () => {
    expect(wouldLevelUp(0, 10)).toBe(false); // 0 + 10 = 10 (still Novice)
    expect(wouldLevelUp(100, 20)).toBe(false); // 100 + 20 = 120 (still Pawn)
    expect(wouldLevelUp(300, 50)).toBe(false); // 300 + 50 = 350 (still Knight)
  });

  it("returns true when jumping multiple levels", () => {
    expect(wouldLevelUp(0, 200)).toBe(true); // 0 + 200 = 200 (Novice → Knight)
    expect(wouldLevelUp(0, 375)).toBe(true); // 0 + 375 = 375 (Novice → Bishop)
  });

  it("returns false at max level", () => {
    expect(wouldLevelUp(375, 100)).toBe(false); // Already at Bishop
    expect(wouldLevelUp(1000, 500)).toBe(false); // Way beyond Bishop
  });
});

describe("XP Model Invariants", () => {
  it("has 4 levels defined", () => {
    expect(LEVELS).toHaveLength(4);
  });

  it("has cumulative XP thresholds in ascending order", () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].cumulativeXpRequired).toBeGreaterThan(
        LEVELS[i - 1].cumulativeXpRequired
      );
    }
  });

  it("has Novice starting at 0 XP", () => {
    expect(LEVELS[0].cumulativeXpRequired).toBe(0);
  });

  it("has all XP rewards as positive multiples of 5", () => {
    Object.values(XP_REWARDS).forEach((xp) => {
      expect(xp).toBeGreaterThan(0);
      expect(xp % 5).toBe(0);
    });
  });
});
