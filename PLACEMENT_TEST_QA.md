# Placement Test QA Checklist

## Test Environment
- **Route:** `/school/placement`
- **Storage:** `localStorage["chessio_placement_v1"]`
- **Passing Score:** 4/5 puzzles

## Pre-Test Setup
1. Clear localStorage: `localStorage.removeItem("chessio_placement_v1")`
2. Login with test account
3. Navigate to `/dashboard`
4. Verify School card shows "Locked" with "Try Placement Test" button

---

## The Gatekeeper – 5 Puzzles (Correct Answers)

### Puzzle 1: Safety First (Mechanics)
- **FEN:** `r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQ1K1R b kq - 5 4`
- **Question:** "Your Queen is under attack. Move her to a safe square where she is NOT captured."
- **Correct Answer:** `d8e7` (Queen d8 → e7)
- **Test:**
  1. Click Queen on d8
  2. Click e7
  3. Should show: "Good. This is how a player answers."
  4. Auto-advance to next puzzle after 1.8s

### Puzzle 2: The Fork (Tactics)
- **FEN:** `r1bqk2r/pppp1ppp/2n5/2b1n3/2B1N3/8/PPPP1PPP/RNBQK2R w KQkq - 0 6`
- **Question:** "White to move. Find the move that attacks two pieces at once."
- **Correct Answer:** `c4f7` (Bishop c4 → f7, forking King and Rook)
- **Test:**
  1. Click Bishop on c4
  2. Click f7
  3. Should show success message
  4. Auto-advance

### Puzzle 3: Greed vs. Logic (Safe Capture)
- **FEN:** `r2q1rk1/ppp2ppp/2n5/3p4/3P2b1/2P2N2/P1P2PPP/R1BQ1RK1 w - - 0 1`
- **Question:** "Black has a hanging Bishop on g4. Should White take it? Find the best move."
- **Correct Answer:** `h2h3` (Pawn h2 → h3, attacking Bishop without losing Queen)
- **Test:**
  1. Click pawn on h2
  2. Click h3
  3. Should show success message
  4. Auto-advance

### Puzzle 4: The Finisher (Checkmate)
- **FEN:** `6k1/5ppp/8/8/8/8/2r5/3R2K1 w - - 0 1`
- **Question:** "White to move. Deliver Checkmate in 1 move."
- **Correct Answer:** `d1d8` (Rook d1 → d8 checkmate)
- **Test:**
  1. Click Rook on d1
  2. Click d8
  3. Should show success message
  4. Should trigger completion (last puzzle)

### Puzzle 5: The Race (Endgame)
- **FEN:** `8/8/8/P7/5k2/8/8/6K1 w - - 0 1`
- **Question:** "White to move. Can the pawn run to promotion, or must you bring the King?"
- **Correct Answer:** `a5a6` (Pawn advances - can outrun Black King)
- **Test:**
  1. Click pawn on a5
  2. Click a6
  3. Should show success message
  4. Should trigger completion

---

## Test Cases

### ✅ Test 1: Pass (5/5)
1. Answer all 5 puzzles correctly
2. Should see result screen: "You passed." with checkmark
3. Score: 5 of 5
4. Coach message: "Good. You know how the pieces fight..."
5. Primary CTA: "Enter Chess School"
6. Check localStorage: `status: "passed", score: 5, total: 5`
7. Navigate to `/dashboard`: School card should show "Unlocked" + "Placement passed" badge

### ✅ Test 2: Pass (4/5)
1. Get puzzle 1 wrong (try `d8e8`)
2. Should show fail message: "Too passive. You block your own King."
3. Try again, get correct answer `d8e7`
4. Complete remaining puzzles correctly
5. Result: "You passed." - Score: 4 of 5
6. School should unlock

### ❌ Test 3: Fail (3/5)
1. Get 2 puzzles wrong (try wrong moves, don't retry - just advance)
2. Complete test with 3/5
3. Result screen: "Not yet." with circle icon
4. Coach message: "Stop. You have potential, but your foundation is cracked..."
5. Primary CTA: "Start in Chessio Pre-School"
6. Check localStorage: `status: "failed", score: 3, total: 5`
7. Navigate to `/dashboard`: School card should remain "Locked"

### 🔄 Test 4: Retake
1. Complete test (pass or fail)
2. On result screen, click "Retake the test (resets your placement)"
3. localStorage should clear
4. Should return to intro screen
5. Complete test again
6. New result should overwrite old one

---

## Fail State Messages (Spot Check)

Test that specific wrong moves show custom messages:

- **Puzzle 1:** Try `d8f6` → "Careful! The enemy Knight on c3 can jump to d5 later. Not the safest."
- **Puzzle 2:** Try `e4c5` → "You captured the Bishop, but you missed the check! Look for something stronger."
- **Puzzle 4:** Try `d1a1` → "You moved the Rook, but you did not attack the King."

Test generic fail message:
- **Any puzzle:** Make random illegal capture → "Not quite. Look again at the King and the pieces around him."

---

## Edge Cases

- [ ] Back button during test (should work, state preserved)
- [ ] Refresh during test (localStorage not implemented for progress - starts over - this is expected v1 behavior)
- [ ] Already passed test: Navigate to `/school/placement` → should show result screen with retake option
- [ ] Auth: Visit `/school/placement` logged out → redirects to `/login?redirect=/school/placement`
- [ ] Mobile: All puzzles render correctly on small screens

---

## Dashboard Integration

After passing placement test:

- [ ] School card shows "Unlocked" badge
- [ ] "Placement passed" secondary badge visible
- [ ] Primary button: "Enter Chess School" → links to `/school`
- [ ] Requirements checklist: "Pass Placement Test" shows green dot

After failing placement test:

- [ ] School card remains "Locked"
- [ ] "Try Placement Test" button still visible (can retake)
- [ ] Requirements checklist: both items show gray dots

---

## Performance & UX

- [ ] Board renders immediately (no flash)
- [ ] Square selection highlights correctly
- [ ] Success/error feedback appears within 100ms
- [ ] Auto-advance timing feels natural (1.8s)
- [ ] Coach hints are visible and readable
- [ ] Category badges display correctly
- [ ] Progress counter updates: "Puzzle 2 of 5" / "Score: 1/5"

---

## Production Smoke Test

Before announcing to testers:

1. Deploy to production
2. Clear browser cache
3. Run Test 1 (Pass 5/5) end-to-end
4. Verify School unlocks
5. Check console for errors
6. Test on mobile device
7. Check that placement data persists after logout/login (localStorage is tied to browser, not account)

**Known v1 Limitation:** localStorage is browser-specific. If user passes on desktop but opens mobile, they'll see "not taken" on mobile. Document this as expected behavior for v1.
