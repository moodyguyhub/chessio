# Chessio School v1 - Manual QA Walkthrough

**Date**: December 7, 2024  
**Status**: Initial System Complete  
**Test Duration**: ~10-15 minutes  
**Goal**: Experience the complete School journey as a new student

---

## Pre-Test Setup

### 1. Start Local Dev Server
```bash
npm run dev
# Server should start at http://localhost:3000
```

### 2. Create Test Account (or use existing)
- Navigate to `/register`
- Create account: `testschool@chessio.dev` / `password123`
- Login at `/login`

### 3. Clear Progress (for fresh experience)
Open browser DevTools Console and run:
```javascript
localStorage.removeItem('chessio_unlocked_cards');
localStorage.removeItem('chessio_completed_lessons');
localStorage.removeItem('chessio_passed_exams');
```

---

## Test Journey

### Phase 1: School Dashboard (`/school`)

#### Visual Check
- [ ] Header: "Chessio School" with coach quote
- [ ] "Coach's Notebook" button visible (outline variant, not overwhelming)
- [ ] Level 1 card appears unlocked with "The King's Fate" title
- [ ] Level 2-11 cards appear locked with lock icon
- [ ] Level cards have hover states

#### Interaction
- [ ] Click "Coach's Notebook" → navigates to `/school/notebook`
- [ ] Back to School
- [ ] Click Level 1 card → navigates to `/school/level/1`

**Expected Feel**: School entrance feels deliberate, not cluttered. The Notebook is discoverable but doesn't steal focus from starting lessons.

---

### Phase 2: Level 1 Detail (`/school/level/1`)

#### Visual Check
- [ ] Level title: "Level 1: The King's Fate"
- [ ] Description visible
- [ ] Three lesson cards visible:
  1. Check (The Warning) - `check-the-warning`
  2. Checkmate (The Execution) - `checkmate-the-execution`
  3. Stalemate (The Accident) - `stalemate-the-accident`
- [ ] Each lesson shows: Title, Description, XP badge (20 XP)
- [ ] "Take Exam" button visible at bottom
- [ ] No "Exam Passed" badge (first visit)

#### Interaction
- [ ] Click "Check (The Warning)" → navigates to lesson player

---

### Phase 3: Lesson 1 - Check (`/school/level/1/lesson/check-the-warning`)

#### Initial Load
- [ ] Board renders with starting FEN: `8/8/8/8/8/8/3k4/3K4 w - - 0 1`
- [ ] Sees two kings facing each other
- [ ] Coach intro card shows: "The King is attacked! He must run, block, or fight..."
- [ ] Task prompt visible: "The King is attacked. Move him to a safe square."
- [ ] Badge shows "Task 1 of X"
- [ ] "Back to Level 1" button visible

#### Test: Correct Move
1. Click White King (d1)
   - [ ] Square highlights (selection visual)
2. Click c2 or e2
   - [ ] Success message appears: "Run, little King! Live to fight another day."
   - [ ] Green alert shows
   - [ ] After ~2 seconds, moves to next task OR completion screen

#### Test: Wrong Move (Generic)
1. Click White King (d1)
2. Click c1 (incorrect square)
   - [ ] Error message appears: "Not quite. Try again."
   - [ ] Red alert shows
   - [ ] Board resets, can try again

#### Test: Wrong Move (With FailPattern)
1. Click White King (d1)
2. Click d2 (the "coward's move" we mapped)
   - [ ] **CRITICAL**: Should show tailored message from `cowards_exit` pattern
   - [ ] Example: "Why do you run? You have a sword—capture him!"
   - [ ] Red alert shows
   - [ ] Board resets

**Note**: If you only have 1 task, skip to completion. If multiple tasks, verify progression through them.

#### Lesson Complete Screen
- [ ] Green success card with checkmark icon
- [ ] "Lesson Complete!" header
- [ ] Summary text visible
- [ ] "+20 XP" badge shown
- [ ] **Secret Card unlock** card appears:
  - [ ] Yellow/gold styling
  - [ ] Sparkles icon
  - [ ] "Secret Rule Unlocked"
  - [ ] Card title: "The Shield of CPR"
  - [ ] Card text: "When the King is attacked, remember CPR..."
  - [ ] **"View Collection"** button visible
- [ ] Coach message card with quote
- [ ] Two buttons: "Back to Lessons" + "Continue"

#### Test Secret Card Link
- [ ] Click "View Collection" → navigates to `/school/notebook`
- [ ] Verify card now shows as unlocked in Notebook
- [ ] Navigate back to School

---

### Phase 4: Coach's Notebook (`/school/notebook`)

#### Visual Check
- [ ] Header: "Coach's Notebook"
- [ ] Tagline: "Every lesson teaches a truth. Collect them all."
- [ ] Progress card shows: "1 / 3 Cards" (after completing 1 lesson)
- [ ] Sparkles icon in progress card

#### Card Grid
**Unlocked Card (CPR)**:
- [ ] Golden/yellow border + bg tint
- [ ] Sparkles badge
- [ ] Title visible: "The Shield of CPR"
- [ ] Full rule text visible
- [ ] "Level 1" shown

**Locked Cards (2 remaining)**:
- [ ] Gray border, dimmed appearance
- [ ] Lock icon badge
- [ ] Title shows "???"
- [ ] Text: "Complete lessons to unlock this secret..."
- [ ] Lock icon + "Locked" text at bottom

#### Interaction
- [ ] "Back to School" button at bottom works

**Expected Feel**: Collection should feel like a treasure hunt. Locked cards create curiosity. Unlocked card feels like a reward.

---

### Phase 5: Level 1 Exam (`/school/level/1/exam`)

**Prerequisites**: Complete at least 1-2 lessons first to feel progression.

#### Initial Load
- [ ] "Level 1 Exam" header
- [ ] "Prove your mastery." tagline
- [ ] Badge shows "Puzzle 1 of 2" (or however many exam puzzles exist)
- [ ] First puzzle board renders
- [ ] Challenge prompt visible
- [ ] "Back to Level 1" button visible

#### Test: Solve Puzzle Correctly
1. Identify correct move from puzzle
2. Make the move
   - [ ] Success message from `coachOnSuccess` field
   - [ ] Green alert
   - [ ] After ~2.5 seconds, moves to next puzzle

#### Test: Wrong Move (With FailPattern)
1. Make an incorrect move that has a failureHint
   - [ ] Tailored coach message appears (e.g., from `suffocator` pattern)
   - [ ] Red alert
   - [ ] Board resets, can retry

#### Exam Complete Screen
- [ ] Trophy icon
- [ ] "Level 1 Exam Complete" header
- [ ] Score shown: "X out of Y puzzles"
- [ ] Coach message card:
  - If perfect: "Excellent. You did not guess; you understood."
  - If not perfect: "Good work. Review the level..."
- [ ] Two buttons: "Back to Level 1" + "Continue to School"

#### Verify Exam Status Persists
1. Click "Back to Level 1"
2. Check Level Detail page
   - [ ] **"Exam Passed"** badge now appears next to "Take Exam" button
   - [ ] Badge is green/success colored

---

## Critical Features to Verify

### ✅ FailPattern Integration
- [ ] Wrong moves with `failureHints` show **specific** coach messages
- [ ] Wrong moves without hints show **generic** error
- [ ] Works in both LessonRunner and ExamRunner

### ✅ Progress Tracking
- [ ] Unlocked cards persist across page refreshes
- [ ] Completed lessons tracked
- [ ] Exam passed status persists
- [ ] localStorage keys exist:
  ```javascript
  localStorage.getItem('chessio_unlocked_cards') // ["card_cpr"]
  localStorage.getItem('chessio_passed_exams') // [1]
  ```

### ✅ Navigation Flow
```
School → Level → Lesson → Complete → Notebook
                       ↘ Exam → Complete → Back to Level (with badge)
```

### ✅ UX Polish
- [ ] All transitions feel smooth (~2s delays appropriate)
- [ ] Error states clear quickly
- [ ] Success states feel rewarding
- [ ] No jarring flashes or layout shifts
- [ ] Icons enhance meaning (not decorative noise)

---

## Issues to Log

Use this section to track any bugs or polish opportunities:

### Bugs
- [ ] Bug 1: _____
- [ ] Bug 2: _____

### Polish Opportunities
- [ ] Polish 1: _____
- [ ] Polish 2: _____

### Content Gaps
- [ ] Only 1 task per lesson? (Feels too short)
- [ ] Need more exam puzzles?
- [ ] More failureHints needed?

---

## Emotional Check-In

After completing the walkthrough, answer these:

1. **Does it feel like a school?**
   - Not just a puzzle menu, but a structured learning path?

2. **Is the coach voice consistent?**
   - Poetic, wise, not condescending?

3. **Do Secret Cards feel valuable?**
   - Does the Notebook create collection desire?

4. **Is failure helpful?**
   - Do tailored fail messages teach, not just punish?

5. **Does progression feel earned?**
   - XP, exams, cards—do they create a sense of growth?

---

## Next Action Decision

Based on this QA, choose your path:

### Option A: Deepen Level 1
**If**: Everything works but lessons feel too short or simple
**Action**: Add 2-3 more tasks per lesson, more exam puzzles, more failureHints

### Option B: Ship Level 2
**If**: Level 1 feels solid, want to show multi-level progression
**Action**: Implement Level 2 (Tactics: Fork, Pin) using same system

### Option C: Meta Polish
**If**: System works but needs header XP bars, tooltips, micro-animations
**Action**: Add progress visualization and meta-UX touches

---

## Success Criteria

This walkthrough passes if:
- ✅ Complete flow works without crashes
- ✅ FailPattern messages display correctly
- ✅ Progress persists across refreshes
- ✅ Secret Card unlock feels rewarding
- ✅ Exam passed badge appears after completion
- ✅ No TypeScript errors in console
- ✅ Emotional resonance: "I want to learn more"

---

**Tester**: _____________________  
**Date Completed**: _____________________  
**Overall Pass/Fail**: _____________________  
**Recommended Next Step**: A / B / C
