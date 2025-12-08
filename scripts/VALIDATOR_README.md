# Chessio Lesson Validator - README

**A systematic 6-point QA system for validating chess lesson content.**

---

## Quick Start

```bash
# Run full validation
npm run validate:lessons

# View summary in terminal + detailed JSON report saved to:
# scripts/reports/lesson-validation.json
```

---

## What It Validates

### ✅ Check 1: Side to Move Consistency
- FEN active color matches prompt text
- Board orientation aligns with "you are white/black" language
- Flags black-to-move tasks for manual UX testing

### ✅ Check 2: Objective vs Reality
- **Mate-in-1**: Verifies checkmate is actually achievable
- **Win Material**: Confirms moves win pieces
- **Defend King**: Validates check escape moves
- **Fork/Pin/Skewer**: Basic theme detection

### ✅ Check 3: Single vs Multi-Solution
- Identifies when multiple "correct" moves exist
- Flags tasks that might punish "too correct" answers
- Helps decide pedagogical policy on accepting multiple solutions

### ✅ Check 4: Legal & Thematic Match
- Tests all `correctMoves` for legality
- Validates theme tags match actual tactics
- Limited by simplified FEN support in chess.js

### ✅ Check 5: Feedback Message Quality
- Checks for missing success/failure messages
- Flags generic unhelpful feedback
- Validates fail pattern coverage

### ✅ Check 6: XP / Difficulty Calibration
- Computes stats per level
- Flags outliers (>2x or <0.5x average XP)
- Helps maintain consistent progression curve

---

## Understanding the Output

### Issue Severity Levels

| Icon | Severity | Meaning | Action |
|------|----------|---------|--------|
| ❌ | `error` | Broken content (illegal moves, no mate exists) | **Must fix** before release |
| ⚠️ | `warn` | Potentially confusing (multiple solutions, material logic) | **Should review** for pedagogical fit |
| 🔍 | `needsHumanReview` | Context-dependent (simplified FENs, black-to-move) | Manual testing recommended |

### Issue Types

**Critical:**
- `InvalidFEN` - Can't parse position at all
- `IllegalCorrectMove` - Accepted move is illegal
- `NoMateInOneExists` - Mate task has no mating move

**Important:**
- `MultipleMateInOne` - Multiple mates exist, only one accepted
- `IncorrectMateMove` - Move in `correctMoves` doesn't deliver mate
- `SingleSolutionButMultipleGood` - Single-solution claim questionable

**Informational:**
- `SimplifiedFEN` - Teaching position (missing kings)
- `BlackToMoveTask` - Verify board orientation
- `NoMaterialGain` - False positive on technique tasks
- `MissingXP` - Lesson has 0 XP reward

---

## Known Limitations

### Simplified FENs
Many lessons use teaching positions without both kings present. This is **by design** but breaks chess.js validation.

**Impact:**
- Can't fully validate objective match
- Move legality checks are partial
- Theme detection disabled

**Workaround:** Validator flags these as `SimplifiedFEN` (needsHumanReview) and skips deep validation.

### False Positives
- **NoMaterialGain warnings on endgame lessons** (opposition, king-and-pawn) - These teach technique, not tactics
- **Black-to-move "warnings"** - Not errors if app handles board flip correctly

---

## File Structure

```
scripts/
  validate-lessons.ts          # Main validator (1076 lines)
  reports/
    lesson-validation.json     # Detailed output (705 lines)

LESSON_VALIDATION_SUMMARY.md   # Executive summary for stakeholders
VALIDATION_SURPRISING_PATTERNS.md  # Critical findings needing review
```

---

## Extending the Validator

### Adding a New Check

```typescript
function validateNewCheck(
  task: LessonTask,
  lesson: Lesson,
  chess: Chess
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Your validation logic here
  
  if (someProblem) {
    issues.push({
      taskId: task.id,
      lessonId: lesson.id,
      level: lesson.level,
      type: 'YourNewCheckType',
      severity: 'error', // or 'warn' or 'needsHumanReview'
      details: 'Explanation of what went wrong'
    });
  }
  
  return issues;
}

// Add to main loop in validateAllLessons()
allIssues.push(...validateNewCheck(task, lesson, chess));
```

### Adding New Objective Types

```typescript
// In inferObjectiveType()
if (prompt.includes('your_new_pattern')) {
  return 'yourNewType';
}

// In validateObjectiveVsReality()
case 'yourNewType':
  issues.push(...validateYourType(task, lesson, chess));
  break;
```

---

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Validate Lessons
on: [push, pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run validate:lessons
      # Upload report artifact
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: validation-report
          path: scripts/reports/lesson-validation.json
```

**Note:** Validator exits with code 1 if any errors found, failing CI.

---

## Frequently Asked Questions

### Q: Why are simplified FENs allowed?
**A:** Chessio is a teaching app, not a full chess engine. Puzzle-style positions (e.g., "just a knight and 2 pawns") help isolate concepts without distraction.

### Q: Should we accept all mating moves or just one?
**A:** **Recommendation:** Accept all for beginner lessons to avoid punishing correct play. For advanced lessons, use single best move with educational feedback explaining why.

### Q: How do I fix an `IllegalCorrectMove` error?
**A:**
1. Load the lesson in chessio UI
2. Verify FEN displays correctly
3. Test if move works in-app despite validator error
4. If move works in-app: Document limitation (simplified FEN issue)
5. If move fails in-app too: Fix FEN or move notation

### Q: What's the difference between UCI and SAN notation?
```
UCI:  e1f1  (from-to squares)
SAN:  Kf1   (piece + destination, with disambiguation)

Chessio uses UCI format in correctMoves arrays.
```

---

## Credits

**Built by:** Vega (Chessio QA Lead)  
**Architecture:** 6-point systematic validation framework  
**Tools:** TypeScript, chess.js, Node.js  
**Last Updated:** December 8, 2025

---

## Related Documentation

- `LESSON_VALIDATION_SUMMARY.md` - Executive summary of findings
- `VALIDATION_SURPRISING_PATTERNS.md` - Critical bugs to fix
- `src/lib/school/types.ts` - Lesson data type definitions
- `data/chessio/levels/` - Lesson JSON files

---

## Support

For questions about validator output, tag @vega in Discord or open an issue with:
- Lesson ID
- Task ID
- Validation error message
- Screenshot of task in-app (if possible)

**Happy validating!** 🔍♟️
