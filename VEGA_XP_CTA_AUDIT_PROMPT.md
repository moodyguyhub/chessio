# 🧪 MEGA PROMPT – XP, Leveling & CTA Audit for Chessio

**You are Vega, my elite dev agent, working on the `chessio` project.**
Your job in this session: **audit and confirm** that:

1. **XP calculation** is correct and consistent across the codebase and UI.
2. **Leveling** behavior matches the Chessio XP model (Novice → Pawn → Knight → Bishop).
3. **CTA buttons** (especially in the **lesson completion flow** and **dashboard/goal panel**) show the right label, link, and state **for the right user state**.

Treat this as a **verification + test-hardening pass**, not a new feature sprint.

---

## 0. Context (What You Should Assume)

From recent work (already merged & deployed):

* We have a centralized XP config in
  `src/lib/gamification/config.ts`

  * `LEVELS` with cumulative thresholds:

    * Novice: 0 XP
    * Pawn: 75 XP
    * Knight: 200 XP
    * Bishop: 375 XP
  * XP rewards inferred from slug patterns:

    * `intro-*` → 10 XP
    * `concept-*` → 15 XP
    * `puzzle-*` → 20 XP
    * fallback / bonus → 5 XP
  * Helpers like `getXpForContentSlug()` and `getLevelForXp()`.

* Content map page at
  `src/app/(protected)/internal/content-map/page.tsx`
  shows lessons, their inferred content type, and XP.

* Lesson completion flow runs through:

  * `src/app/lessons/[slug]/actions.ts`
  * `src/lib/lessons/progress.ts`
  * `src/lib/lessons/next-step.ts`
  * `src/components/chess/LessonPlayer.tsx`
  * `src/components/ui/XpBreakdown.tsx`

* Retention / dashboard logic lives in:

  * `src/app/(protected)/app/page.tsx`
  * `src/lib/engagement/`
  * `src/lib/telemetry/`

There is also a script already created for sanity:
`/scripts/verify-xp-config.ts`

Use all of this; don't reinvent it.

---

## 1. Objective

**Your mission:**

1. **Verify** that XP and levels are calculated correctly and consistently:

   * Across all lessons & puzzle packs.
   * At the boundaries between levels (esp. 75, 200, 375 XP).

2. **Confirm** that UI components **display the correct XP + level info**:

   * Dashboard headers / XP bars.
   * Lesson pages / ProgressHeader.
   * XpBreakdown (completion modal/panel).

3. **Audit CTA buttons (labels + targets)** in:

   * Lesson completion screen (LessonPlayer).
   * "Next best step" logic / CTA.
   * Today's Goal / dashboard CTA, if it's using progression.

4. **Add or improve tests** to lock this behavior in:

   * Unit tests for XP + level helpers.
   * Minimal integration-style tests for CTA behavior (if feasible).
   * Keep scope small but meaningful.

Deliverable:
A **short report file** `XP_LEVELING_CTA_AUDIT.md` plus any test files/patches you add or adjust.

---

## 2. High-Level Tasks

Work in this order:

1. **Map the XP model (code-level).**
2. **Enumerate content XP totals & level thresholds (script-level).**
3. **Check how UI reads and displays XP/levels.**
4. **Trace CTA states and labels in completion & dashboard.**
5. **Add tests to lock in the correct behavior.**
6. **Summarize findings and any fixes in `XP_LEVELING_CTA_AUDIT.md`.**

---

## 3. Step-by-Step Instructions

### Step 1 – Quick Code Scan (XP & Leveling)

1. Open and read:

   * `src/lib/gamification/config.ts`
   * `src/lib/gamification/xp.ts`
   * `src/lib/gamification/index.ts`
   * `src/lib/lessons.ts` (esp. lesson/puzzle arrays)
   * `scripts/verify-xp-config.ts`

2. Confirm and write down (for the report):

   * Exact **LEVELS** array (XP thresholds + labels).
   * Exact **XP_REWARDS** mapping by content type.
   * Rules in `getContentTypeFromSlug()` and `getXpForContentSlug()`.

3. Check for any **duplicate or conflicting logic**, e.g.:

   * Old quadratic XP formulas still hanging around.
   * Any hard-coded XP constants elsewhere (e.g. "100 XP per level") that are now obsolete.

If you find conflicts, **note them** and propose a clean-up path in the report. Only refactor if it's small and safe.

---

### Step 2 – Verify XP Totals & Boundaries (Script-Level)

1. Run the existing script:

   ```bash
   npx tsx scripts/verify-xp-config.ts
   ```

2. Confirm:

   * Total count of lessons/puzzles.
   * Total XP available (should currently be ~380 XP).
   * Distribution per level (Level 0, 1, 2, puzzles, etc.).

3. If the script output is not **clear and human-friendly**, improve it:

   * Group by `level_index`.
   * Show for each lesson: `slug`, `content_type`, `xp`.
   * Show total XP per level and overall.
   * Show a small section listing the **XP needed between levels**:

     * Novice → Pawn: 75 XP
     * Pawn → Knight: 125 XP (200-75)
     * Knight → Bishop: 175 XP (375-200)

4. Add simple **assertions** in the script (or a unit test) for sanity:

   * Total XP is `>= 375` (Bishop is reachable).
   * No lesson/puzzle yields XP = 0.
   * No unknown content type returns a weird XP value.

If you prefer, you can move some of this logic into a Jest test file instead of assertions in the script — up to you.

---

### Step 3 – Unit Tests for XP & Level Helpers

Create or update a test file, for example:

* `src/lib/gamification/config.test.ts`
  or
* `src/lib/gamification/xp.test.ts`

Add unit tests for:

1. **`getLevelForXp()` boundary behavior:**

   * XP = 0 → level = Novice.
   * XP = 74 → still Novice.
   * XP = 75 → Pawn.
   * XP = 199 → Pawn.
   * XP = 200 → Knight.
   * XP = 374 → Knight.
   * XP = 375 → Bishop.

   Also verify the `progress` fields (if any) are correct (e.g. 0–1 within the current level).

2. **`getXpForContentSlug()` examples:**

   * A few `intro-` slugs → 10 XP.
   * A few `concept-` slugs → 15 XP.
   * A few `puzzle-` slugs → 20 XP.
   * A fallback slug → 5 XP.

3. **`getContentTypeFromSlug()`**:

   * Slugs with `-intro-` in the middle are recognized as `intro`.
   * Slugs with `-concept-` in the middle are recognized as `core`.
   * Puzzle-set slugs recognized as `puzzle`.

Keep tests focused and readable; no need to test every slug, just representative cases.

---

### Step 4 – Check UI: XP & Level Display

Now confirm that XP + levels are **displayed correctly** in the UI.

Check:

1. **Dashboard header and XP card**

   * File: `src/app/(protected)/app/page.tsx`
   * Find where the current user's XP and level are fetched (likely via `getUserXpStats` or similar).
   * Confirm:

     * The level label matches `getLevelForXp()` output.
     * The progress bar uses the `progress` info generated from the XP helpers (not some old formula).
     * Session count display (if present) doesn't conflict with XP display.

2. **Lesson page header (ProgressHeader)**

   * Files:

     * `src/app/lessons/[slug]/page.tsx`
     * `src/components/ui/ProgressHeader.tsx`
   * Confirm:

     * Lessons pages use the same XP + level logic as the dashboard.
     * The XP bar / level label is consistent (no off-by-one level or different thresholds).

3. **XpBreakdown (completion UI)**

   * File: `src/components/ui/XpBreakdown.tsx`
   * Confirm:

     * It shows the correct XP gained for the just-completed content.
     * It uses the content type label correctly (e.g. "+15 XP – Core Lesson").
     * It shows the correct **old level → new level** transition when a level-up occurs.
     * The progress bar reflects the **post-completion XP** and level, using `getLevelForXp()` (or equivalent), not a duplicated custom calculation.

If you see any **manual / duplicated XP math**, note it and, if safe, refactor it to use the shared helpers from `config.ts`.

---

### Step 5 – Audit CTA Buttons & "Next Step" Logic

This is critical: **when lessons are completed, the CTAs must make sense**.

Focus on:

1. **Lesson completion CTA(s) – LessonPlayer**

   * File: `src/components/chess/LessonPlayer.tsx`
   * Find the completion UI block:

     * Where `XpBreakdown` is used.
     * Where `nextStep` result (from `completeLessonAction`) is consumed.
   * Confirm:

     * The CTA text and target are based on `nextStep` fields (from `getNextBestStep()` / progress logic).
     * No hard-coded weirdness or misaligned labels like "Go to Level 0" when user just finished Level 1.

   Derive and **document these scenarios** in the report:

   * **Case A – There is a clear next lesson in the same level:**

     * CTA label should be something like "Continue to Next Lesson".
     * Link points to that lesson's slug.

   * **Case B – Level complete, next step is puzzles:**

     * CTA label should point to puzzles (e.g. "Practice with Puzzles" or similar).
     * Ensure we're not sending them back to the start of the same level.

   * **Case C – Level 2 / Bishop reached / "end-of-season" content complete:**

     * CTA label should be more like "Back to Dashboard" / "View Progress".
     * Ensure we don't suggest non-existent lessons.

2. **Today's Goal / Dashboard CTA (if progression-aware)**

   * File: `src/lib/engagement/todays-goal.ts`
   * File: `src/app/(protected)/app/page.tsx` (where the "Today's Goal" panel is rendered).
   * Confirm:

     * The goal logic respects actual XP and level.
     * Example: if user has finished Level 0 but not Level 1, Today's Goal should push Level 1 content, not Level 0 again.
     * After Level 2 completion / near Bishop, the goal should reflect that (e.g. "Finish remaining puzzles", "You're basically at Bishop").

   For each main user segment, capture in the report:

   * New user (0 XP)
   * Mid-level user (~100–150 XP)
   * Late user (~350+ XP)

   What Today's Goal CTA label and target do they see?

---

### Step 6 – Tests for CTA Behavior (Minimal but Useful)

If feasible without overcomplicating:

1. Add a few **unit or integration tests** around `getNextBestStep()`:

   * Inputs simulating:

     * Only Level 0 done.
     * Levels 0 and 1 done.
     * Most content done, near Bishop.
   * Expected output:

     * `nextStep.kind` (lesson / puzzle / dashboard).
     * `nextStep.slug` where relevant.

2. Optionally, a basic **React Testing Library** test for `LessonPlayer` or a smaller extracted completion component:

   * Mock `completeLessonAction` response.
   * Render the completion UI.
   * Assert that:

     * The CTA button text matches expectation for the scenario.
     * The URL/route matches the correct next step.

Don't go overboard; we only need a few high-signal tests.

---

### Step 7 – Report: `XP_LEVELING_CTA_AUDIT.md`

Create a Markdown report in the repo root (or `/docs/` if that's more consistent):

`XP_LEVELING_CTA_AUDIT.md`

Structure:

```markdown
# XP, Leveling & CTA Audit – Chessio

## 1. XP & Level Model (As Implemented)

- LEVELS:
  - Novice: 0 XP
  - Pawn: 75 XP
  - Knight: 200 XP
  - Bishop: 375 XP

- XP rewards:
  - intro: 10 XP
  - core: 15 XP
  - puzzle: 20 XP
  - bonus/fallback: 5 XP

- Helpers used:
  - getLevelForXp()
  - getXpForContentSlug()
  - getContentTypeFromSlug()
  - (list any others)

## 2. Content & XP Summary

- Total items: X lessons / Y puzzle packs
- Total XP: Z XP
- Level coverage:
  - Level 0: ... XP
  - Level 1: ... XP
  - Level 2: ... XP
  - Puzzles: ... XP
- Bishop reachable: yes/no (should be yes, with margin)

## 3. UI Behavior – XP & Levels

- Dashboard:
  - Level display source: ...
  - Progress bar logic: ...
- Lesson page:
  - ProgressHeader uses: ...
- XpBreakdown:
  - XP gained display: ...
  - Level-up handling: ...

## 4. CTA Behavior – Scenarios

### 4.1 Lesson Completion CTA

- Case A (early user: only Level 0 partially complete):
  - CTA label: ...
  - Target: ...
- Case B (Level 0 complete, moving into Level 1 / Puzzles):
  - CTA label: ...
  - Target: ...
- Case C (late user: near/all content complete):
  - CTA label: ...
  - Target: ...

### 4.2 Today's Goal (Dashboard)

- 0 XP user: ...
- ~100–150 XP user: ...
- ~350+ XP user: ...

## 5. Tests Added/Updated

- XP helpers:
  - ...
- Level boundaries:
  - ...
- Next step logic:
  - ...
- (Any UI tests)

## 6. Issues Found & Fixes

- Issue 1: ...
  - Fix: ...
- Issue 2: ...
  - Fix: ...

## 7. Recommendations / TODO (Optional)

- Any small follow-ups you suggest.
```

Keep the report factual and concise. No fluff, just what matters for confidence.

---

## 4. Constraints & Style

* **Do NOT** change the XP model or level thresholds unless you see a hard bug.

  * If you think something should change, write it in the report under "Recommendations".
* **Prefer tests + tiny refactors** over big rewrites.
* **No scope creep**: stick to XP, levels, and CTAs connected to progression.

At the end of your work, summarize in your reply:

1. Files you added/modified.
2. Key behavior confirmed.
3. Any discrepancies you had to fix (or recommend to fix).

---

Use this as your full brief.
