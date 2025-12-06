/**
 * Tests for Next Best Step logic
 * Ensures CTAs show correctly for different user progression states
 */

import { describe, it, expect } from "@jest/globals";
import { getNextBestStep, getDashboardNextAction } from "./next-step";
import { getLevel0Lessons, getLevel1Lessons, getPuzzles, getLevel2Lessons } from "@/lib/lessons";

describe("getNextBestStep - CTA Logic", () => {
  const level0 = getLevel0Lessons();
  const level1 = getLevel1Lessons();
  const puzzles = getPuzzles();
  const level2 = getLevel2Lessons();

  describe("Early User (only Level 0 partially complete)", () => {
    it("suggests next Level 0 lesson when some completed", () => {
      // Complete first 2 lessons
      const completed = [level0[0].slug, level0[1].slug];
      const result = getNextBestStep(completed);

      expect(result.type).toBe("lesson");
      expect(result.lesson?.slug).toBe(level0[2].slug);
      expect(result.cta).toContain("Continue");
      expect(result.href).toBe(`/lessons/${level0[2].slug}`);
    });

    it("suggests first lesson when nothing completed", () => {
      const result = getNextBestStep([]);

      expect(result.type).toBe("lesson");
      expect(result.lesson?.slug).toBe(level0[0].slug);
      expect(result.href).toBe(`/lessons/${level0[0].slug}`);
    });
  });

  describe("Mid User (Level 0 complete, moving into Level 1)", () => {
    it("shows level-complete celebration when just finished Level 0", () => {
      const allLevel0 = level0.map((l) => l.slug);
      const currentLesson = level0[level0.length - 1].slug;

      const result = getNextBestStep(allLevel0, currentLesson);

      expect(result.type).toBe("level-complete");
      expect(result.levelJustCompleted).toBe(0);
      expect(result.lesson?.slug).toBe(level1[0].slug);
      expect(result.cta).toContain("Start Level 1");
      expect(result.message).toContain("mastered the basics");
    });

    it("suggests next Level 1 lesson when in progress", () => {
      const allLevel0 = level0.map((l) => l.slug);
      const someLevel1 = [level1[0].slug, level1[1].slug];
      const completed = [...allLevel0, ...someLevel1];

      const result = getNextBestStep(completed);

      expect(result.type).toBe("lesson");
      expect(result.lesson?.slug).toBe(level1[2].slug);
      expect(result.cta).toContain("Continue");
      expect(result.href).toBe(`/lessons/${level1[2].slug}`);
    });
  });

  describe("Mid-Late User (Level 0 & 1 complete, puzzles available)", () => {
    it("shows level-complete for Level 1 and suggests puzzles", () => {
      const allLevel0 = level0.map((l) => l.slug);
      const allLevel1 = level1.map((l) => l.slug);
      const currentLesson = level1[level1.length - 1].slug;
      const completed = [...allLevel0, ...allLevel1];

      const result = getNextBestStep(completed, currentLesson);

      expect(result.type).toBe("level-complete");
      expect(result.levelJustCompleted).toBe(1);
      expect(result.lesson?.slug).toBe(puzzles[0].slug);
      expect(result.cta).toContain("Puzzles");
      expect(result.message).toContain("practice puzzles");
    });

    it("suggests next puzzle when some completed", () => {
      const allLevel0 = level0.map((l) => l.slug);
      const allLevel1 = level1.map((l) => l.slug);
      const somePuzzles = [puzzles[0].slug, puzzles[1].slug];
      const completed = [...allLevel0, ...allLevel1, ...somePuzzles];

      const result = getNextBestStep(completed);

      expect(result.type).toBe("lesson");
      expect(result.lesson?.slug).toBe(puzzles[2].slug);
      expect(result.href).toBe(`/lessons/${puzzles[2].slug}`);
    });
  });

  describe("Late User (near/all content complete)", () => {
    it("suggests Level 2 after puzzles complete", () => {
      const allLevel0 = level0.map((l) => l.slug);
      const allLevel1 = level1.map((l) => l.slug);
      const allPuzzles = puzzles.map((l) => l.slug);
      const completed = [...allLevel0, ...allLevel1, ...allPuzzles];

      const result = getNextBestStep(completed);

      expect(result.type).toBe("lesson");
      expect(result.lesson?.slug).toBe(level2[0].slug);
      expect(result.cta).toContain("Continue");
      expect(result.href).toBe(`/lessons/${level2[0].slug}`);
    });

    it("shows all-complete when everything done", () => {
      const allLevel0 = level0.map((l) => l.slug);
      const allLevel1 = level1.map((l) => l.slug);
      const allPuzzles = puzzles.map((l) => l.slug);
      const allLevel2 = level2.map((l) => l.slug);
      const completed = [...allLevel0, ...allLevel1, ...allPuzzles, ...allLevel2];

      const result = getNextBestStep(completed);

      expect(result.type).toBe("all-complete");
      expect(result.cta).toContain("Review");
      expect(result.href).toBe("/app");
      expect(result.message).toContain("completed all lessons");
    });
  });
});

describe("getDashboardNextAction", () => {
  it("returns correct action for new user", () => {
    const result = getDashboardNextAction([]);

    expect(result.title).toContain("Continue Learning");
    expect(result.lesson).toBeDefined();
    expect(result.href).toContain("/lessons/");
  });

  it("returns all-caught-up when everything complete", () => {
    const level0 = getLevel0Lessons();
    const level1 = getLevel1Lessons();
    const puzzles = getPuzzles();
    const level2 = getLevel2Lessons();

    const allCompleted = [
      ...level0.map((l) => l.slug),
      ...level1.map((l) => l.slug),
      ...puzzles.map((l) => l.slug),
      ...level2.map((l) => l.slug),
    ];

    const result = getDashboardNextAction(allCompleted);

    expect(result.title).toContain("All Caught Up");
    expect(result.href).toBe("/app");
  });
});
