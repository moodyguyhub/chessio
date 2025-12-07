# Feedback Analysis Cheat Sheet

Quick reference for turning Chessio feedback into actionable changes.

## 🔍 Pattern Recognition

### Difficulty Signals

| Signal | Count | Action |
|--------|-------|--------|
| "Too Easy" on Level 1 | 3+ | Add variation tasks or remove scaffolding |
| "Too Hard" on specific lesson | 3+ | Break into 2 lessons or add intermediate step |
| "Just Right" majority | 70%+ | Keep as-is, minor polish only |
| Mixed (no consensus) | Even split | Test with next cohort before changing |

### Confusion Keywords

| Keyword Cluster | Likely Issue | Fix Template |
|----------------|--------------|--------------|
| "stalemate", "draw", "not checkmate" | Concept distinction unclear | Add comparison task: "Is this check, checkmate, or stalemate?" |
| "opposition", "facing", "squares" | Spatial reasoning gap | Add visual diagram or animation |
| "fork", "attack two", "which piece" | Pattern recognition weak | Add more examples with different pieces |
| "didn't know where to click" | UI affordance problem | Add hover highlights or directional hints |
| "hint didn't help" | Hint quality issue | Rewrite hint to explain *why*, not just *what* |

### Coach Chat Archetypes

| Question Type | What It Reveals | Response Strategy |
|--------------|-----------------|-------------------|
| "What's the difference between X and Y?" | Concept confusion | Add comparison lesson or coach explainer |
| "Can [piece] do [illegal move]?" | Rule gap | Add early lesson on piece movement constraints |
| "Why did I lose?" | Result interpretation unclear | Add post-game coach analysis feature |
| "Tell me more about [advanced topic]" | Engagement signal, ready for deeper content | Add to "future lessons" roadmap |
| "This is too hard" | Frustration, may churn | Check if lesson is gated properly or too steep |

## 📊 Sample Analysis Workflow

### Given: 15 feedback submissions from Week 1

```
LESSON FEEDBACK:
1. Level 1, Lesson 1 (Check): "Too Easy" — "I already knew this"
2. Level 1, Lesson 1 (Check): "Just Right" — ""
3. Level 1, Lesson 2 (Checkmate): "Too Hard" — "I don't get how this is mate"
4. Level 1, Lesson 2 (Checkmate): "Too Hard" — "Confusing instruction"
5. Level 1, Lesson 3 (Stalemate): "Too Hard" — "Why is this not checkmate?"
6. Level 1, Lesson 3 (Stalemate): "Too Hard" — "Stalemate makes no sense"
7. Level 1, Lesson 3 (Stalemate): "Just Right" — "Clicked after the examples"

EXAM FEEDBACK:
8. Level 1 Exam: 3 stars — "Stalemate questions were hard"
9. Level 1 Exam: 5 stars — ""
10. Level 1 Exam: 4 stars — "Some puzzles felt repetitive"

COACH CHAT:
11. Q: "What's the difference between checkmate and stalemate?"
12. Q: "Why is stalemate a draw and not a loss?"
13. Q: "Can you explain the stalemate rule again?"
14. Q: "Is there an easy way to remember stalemate?"
15. Q: "What happens if both players run out of moves?"
```

### Analysis:

**🔴 RED FLAG: Stalemate**
- 4 "Too Hard" on Lesson 3
- 1 "Just Right" (only after examples)
- 3 exam complaints
- 5 coach questions (all stalemate-related)

**Pattern:** Stalemate is the biggest pain point in Level 1.

**Root Cause Hypothesis:** 
- Concept is counterintuitive (no legal moves = draw, not loss)
- Single lesson tries to teach rule + recognition at once
- Not enough contrast with checkmate examples

**Proposed Changes:**
1. **Split Stalemate lesson** into two:
   - Lesson 3a: "Stalemate Rule" (3 tasks, just the rule + definition)
   - Lesson 3b: "Spotting Stalemate" (4 tasks, checkmate vs stalemate drills)
2. **Add coach hint** to Task 1 of new Lesson 3a: "Stalemate feels wrong, but it's the rule. No legal moves + not in check = draw."
3. **Rewrite instruction** in Task 1: 
   - Before: "A stalemate occurs when a player has no legal moves and is not in check."
   - After: "Stalemate is a draw. The losing side has NO legal moves, but their king is NOT in check. It's a clever escape!"

**🟢 GREEN LIGHT: Check/Checkmate**
- Lesson 1: 1 "Too Easy", 1 "Just Right" → mostly works
- Lesson 2: 2 "Too Hard" but no coach questions → isolated, not systemic
- Exam: Mostly 4-5 stars

**Pattern:** Check/Checkmate are working reasonably well.

**Proposed Changes:**
- Lesson 1: Add *one* harder variation task for advanced students
- Lesson 2: Clarify instruction wording (check examples for "confusing instruction")

### Action Plan (Ship in v1.1):

**Priority 1 (This Week):**
- [ ] Split Stalemate lesson into 3a + 3b
- [ ] Rewrite Lesson 3a Task 1 instruction
- [ ] Add coach hint: "Stalemate is the rule, not an error"

**Priority 2 (Next Week):**
- [ ] Review Lesson 2 instruction copy for clarity
- [ ] Add challenge variation to Lesson 1 (for "Too Easy" segment)

**Priority 3 (Future):**
- [ ] Consider stalemate mini-game or interactive explainer

## 🎯 Change Guidelines

### When to Act

| Scenario | Action Threshold |
|----------|-----------------|
| Same complaint | 3+ occurrences |
| Coach question cluster | 3+ similar questions |
| Low exam stars | 50%+ below 4 stars |
| "Too Hard" on single lesson | 60%+ of responses |

### When to Wait

- Single complaint (could be outlier)
- Mixed signals with no clear pattern
- Feature request without pain point validation
- "Would be nice" vs. "I'm stuck"

### How Small to Start

**✅ Good First Changes:**
- Reword instruction (5 mins)
- Add one hint (10 mins)
- Split lesson into two (30 mins)
- Add one task variation (20 mins)

**❌ Too Big for v1.1:**
- Rebuild entire level
- Add new game modes
- Animated explainers
- Multi-step progressions

**Golden Rule:** Ship 3 small fixes > 1 big overhaul.

## 📈 Measuring Success

### Before/After Metrics

Track these for each change:

| Metric | How to Measure |
|--------|----------------|
| Difficulty rating shift | % "Too Hard" → "Just Right" after change |
| Coach question drop | Count of repeat questions on fixed topic |
| Exam star improvement | Avg rating before/after curriculum tweak |
| Completion rate | % who finish lesson after vs. before |

### Example:

**Before:** Stalemate lesson = 60% "Too Hard", 8 coach questions, 3.2 star exam avg

*[Ship split lesson + new copy]*

**After (Week 2):** Stalemate lessons = 30% "Too Hard", 2 coach questions, 4.1 star exam avg

**Result:** ✅ Change validated, keep new structure.

## 🛠️ Implementation Template

For each feedback-driven change:

```markdown
## Change: [Short title]

**Trigger:** [Number] complaints about [specific issue]

**Evidence:**
- Feedback quote 1
- Feedback quote 2
- Coach question pattern

**Root Cause:** [Your hypothesis]

**Solution:** [Specific change]

**Files Changed:**
- `/data/chessio/levels/level-X/lesson-Y.json`
- `/src/lib/lessons/hints.ts`

**Expected Impact:** [What should improve]

**Track:** [Metric to watch for 2 weeks]
```

---

**Next Step:** Wait for 10-15 feedback submissions, then run first analysis pass with this cheat sheet.
