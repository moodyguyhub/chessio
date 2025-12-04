# Chessio – Vega Phase 1 (Level 0 MVP)

**Owner:** Vega  
**Reviewers:** Nova (product), Orion (risk)  
**Scope:** Make Level 0 **playable** – a beginner can log in, start a lesson, make moves on the board, finish the lesson, and see XP rewarded once.

---

## 1. Context & Goal

Level 0 is the **"first taste"** of Chessio for absolute beginners:
- No theory wall.
- No complex UI.
- Just: _"Click, move a rook/bishop, get feedback, complete a lesson."_

Phase 1 is about **one thing only**:

> **Deliver a smooth lesson loop:** Login → choose lesson → make correct moves → finish lesson → earn XP.

Everything else (leaderboards, advanced UX, AI hints, admin tools) is **explicitly out of scope** for this phase.

---

## 2. Non-Negotiable Decisions (Phase 1)

### 2.1 Lesson Data – Source of Truth

- **Single source of truth for Level 0:**  
  `src/lib/lessons.ts`
- For this phase:
  - ✅ Read lesson definitions **only** from `lessons.ts`.
  - ❌ Do **not** query DB for lesson content.
- Existing DB lesson tables / `seed.ts`:
  - Can stay as **legacy/placeholder**, but are unused.
- Add a clear TODO at the top of `lessons.ts`:
  ```ts
  // TODO (Phase 2+): Migrate to DB-driven lessons or generate this file from admin tooling.
  ```

**Orion Notes (Lesson Data)**

* Static file is zero-failure and perfect for a small Level 0 set.
* Risk appears only when lesson count explodes – not our problem in P0.
* If you see any leftover DB-based lesson queries, **rip them out** rather than "keeping options open".

---

### 2.2 Board Component – Custom Only

* Official board for Chessio:
  ✅ `src/components/chess/Chessboard.tsx` (custom SVG)
* For this phase:

  * Use **only** the custom board.
  * `react-chessboard` stays **unused**.
* Add a comment near its dependency in `package.json`:

  ```jsonc
  // "react-chessboard": "x.y.z", // Unused for MVP; evaluate removal after Level 0.
  ```

**Required board props (minimum shape):**

```ts
type ChessboardProps = {
  position: string; // FEN or equivalent representation
  onSquareClick?: (square: string) => void;
  highlights?: {
    [square: string]: "selected" | "target" | "error" | "hint";
  };
  state?: {
    isError?: boolean;
    isCorrect?: boolean;
    isDisabled?: boolean;
  };
};
```

**Orion Notes (Board)**

* Custom SVG gives us full control for beginner cues (glows, error states, hints) without fighting a third-party API.
* Watch mobile performance if you stack lots of overlays; test at least once on a small device.
* Keep the board as a **pure UI primitive**: no hidden game logic inside. Logic lives in `lib/chess.ts` / `lib/lessons/`.

---

### 2.3 XP Flow – When to Reward

* XP is awarded on **first full lesson completion only**.
* Each Level 0 lesson has a fixed XP reward (e.g. `10 XP`) defined in `lessons.ts` or a small helper map.
* On the **first time** a user completes **all tasks** in a given lesson:

  * Increment `user.xp` by lesson XP.
  * Record lesson as `completed`.

**Data model (minimal, example):**

```ts
// Example table idea, adapt to actual schema
UserLessonProgress {
  id         String @id @default(cuid())
  userId     String
  lessonSlug String
  completedAt DateTime
  @@unique([userId, lessonSlug])
}
```

**Service API (pseudo):**

```ts
// src/lib/gamification/lessons.ts
export async function awardLessonXp(params: {
  userId: string;
  lessonSlug: string;
}) {
  // 1) Check if already completed (UserLessonProgress)
  // 2) If not: create progress record + increment User.xp in a single transaction
}
```

* `LessonPlayer` should:

  * Call `awardLessonXp` **only once**, when the last task is completed successfully.

**Orion Notes (XP)**

* This is intentionally **stingy but clean** – no grind abuse, no complex math.
* Minor risk: beginners who replay might feel unrewarded. That's a Phase 2 design question, not a Phase 1 blocker.
* Use one atomic DB transaction if possible to avoid double XP from multi-tabs; okay if we accept tiny risk for MVP.

---

### 2.4 Tests – Strategy for P0

* **No formal test suite required** for Phase 1.
* Priority is a clean architecture that is **easy to test later**:

  * Extract pure logic into `src/lib/lessons/` and `src/lib/chess.ts`.
  * React components should mainly manage view and wiring.

**Suggested functional shapes:**

```ts
// src/lib/lessons/engine.ts
export type LessonTaskState = {
  fen: string;
  expectedMove: { from: string; to: string };
  // + whatever minimal metadata is needed
};

export function validateTaskMove(params: {
  currentFen: string;
  move: { from: string; to: string };
  expectedMove: { from: string; to: string };
}): {
  isCorrect: boolean;
  nextFen: string;
  isLessonCompleted: boolean;
} {
  // Use chess.js under the hood
}
```

**Manual QA (required):**

* Login / register flow works.
* Start each Level 0 lesson.
* For each lesson:

  * Make a correct move → progresses to next task.
  * Make an incorrect move → error feedback but no crash or soft-lock.
  * Complete final task → XP is awarded once; UI reflects completion.

**Orion Notes (Tests)**

* Biggest risk is logic bugs in progression and validation. Make manual QA passes systematic.
* Add JSDoc comments on core logic functions now; future tests will snap onto those signatures easily.

---

### 2.5 Responsive Strategy – Desktop First, Mobile Safe

* **Priority:** Desktop experience is clean and obvious.
* Mobile must be **usable and not broken**, but not pixel-perfect.
* Layout pattern for main lesson screen:

  * Mobile (`< md`): `flex-col` (board and text stacked).
  * Desktop (`md+`): `md:flex-row` with board + task panel side-by-side.

**Orion Notes (Responsive)**

* Check actual touch interactions on a real device if you can; fat-finger misclicks on squares are a real UX risk.
* Visual "ugly but working" is acceptable for Phase 1; "can't tap squares reliably" is not.

---

## 3. Phase Breakdown

### 3.1 Phase 1 – P0 (Must-Have Gameplay Loop)

> **Goal:** A beginner can complete a Level 0 lesson from start to finish and earn XP.

#### P0.1 – Wire `LessonPlayer` to `lessons.ts`

* Implement a small service layer in `src/lib/lessons/`:

  ```ts
  export function getLessonBySlug(slug: string): Lesson | null;
  export function getFirstTask(lesson: Lesson): LessonTask;
  export function getNextTask(lesson: Lesson, currentIndex: number): LessonTask | null;
  ```
* `LessonPlayer`:

  * Reads lesson via slug from the route.
  * Loads lesson from `lessons.ts` using the service functions.
  * Renders:

    * Lesson title, short description.
    * Current task prompt.
    * Board position from task definition.

#### P0.2 – Board Interactions (Custom Board)

* `Chessboard` uses click-to-select, click-to-move:

  * First click: select origin square.
  * Second click: attempt move.
* Move handling:

  * Delegate to pure function in `lib/chess.ts` / `lib/lessons/engine.ts`.
  * If:

    * Move is legal AND matches expected → success.
    * Else → error state.
* Visual:

  * Highlight selected square.
  * Optionally highlight legal target or expected target.

#### P0.3 – Task Progression

* On a correct move:

  * Show brief success feedback (e.g., checkmark / glow).
  * Move from task `n` → `n+1`.
* On incorrect move:

  * Show error state (e.g., shake / red outline).
  * Do **not** advance task.
* On completing the last task:

  * Mark lesson as completed in local UI state.
  * Trigger XP award (P0.4).

#### P0.4 – XP Award & Completion State

* On final task success:

  * Call `awardLessonXp({ userId, lessonSlug })` on the server.
  * Avoid blocking UI on slow network – okay to show loading only on the final CTA.
* UI for completion in P0:

  * Minimal, no fancy modal required:

    * A simple completion panel inline on the lesson screen:

      * "Lesson complete!"
      * "You earned +10 XP"
      * Buttons:

        * "Back to dashboard"
        * "Retry lesson" (no extra XP)

---

### 3.2 Phase 1 – P1 (Should-Have Product Feel)

After P0 is stable:

1. **Dashboard Improvements**

   * Render Level 0 lessons as cards:

     * Title
     * Short description
     * Status: Locked / Unlocked / Completed.

2. **Lesson Locking**

   * Lesson 1: Always unlocked.
   * Lesson 2: Unlocked only once Lesson 1 completed.
   * Lesson 3: Unlocked only once Lesson 2 completed.
   * (Optional adjustment later: for Level 0, we may choose to keep all unlocked based on UX feedback.)

3. **Completion Dialog (Using `<Dialog />`)**

   * On full lesson completion:

     * Show modal with:

       * Title: "Lesson Complete"
       * Subtitle: "+10 XP earned"
       * Primary button: "Next lesson"
       * Secondary: "Back to dashboard"

---

### 3.3 Phase 1 – P2 (Nice-to-Have Polish)

* Dark mode toggle (UI tokens are ready).
* Hint usage + tracking:

  * Show a "Need a hint?" button per task.
  * Track hints used per lesson in memory or DB.
* First round of tests:

  * Unit tests for lesson logic + XP service.
  * Minimal integration test for the lesson flow.

---

## 4. Implementation Guidelines for Vega

* **Keep logic and UI separate:**

  * Lesson progression & move validation → `src/lib/lessons/`, `src/lib/chess.ts`.
  * React components → orchestrate state and render UI.
* **State management:**

  * Prefer a small `useReducer` or clear state machine inside `LessonPlayer` over scattered `useState` calls.
* **Naming:**

  * Be consistent with existing patterns in `VEGA_HANDOFF.md` and `INFRA_NOTES.md`.
* **Comments & TODOs:**

  * Use TODOs for anything Phase 2+. Don't "half-implement" future features.

---

## 5. Definition of Done (Phase 1 / P0)

- [ ] `lessons.ts` is the only source of lesson data for Level 0.
- [ ] A user can:
  - [ ] Register or log in.
  - [ ] Open any Level 0 lesson.
  - [ ] See the board + prompt + current task.
  - [ ] Make correct moves and progress through tasks.
  - [ ] Make an incorrect move and see clear feedback.
  - [ ] Finish the lesson and see a completion state.
  - [ ] Have their XP increased on first completion.
- [ ] Experience is clean on desktop and **functional** on mobile (board tappable, no layout breakage).

---

## 6. Execution Order

**Start with P0.1 → P0.2 → P0.3 → P0.4 in order.**

Ping Nova/Orion only if something blocks the core loop.

---

**If anything in this file conflicts with older docs (`VEGA_HANDOFF.md`, etc.), this file wins for Phase 1.**
