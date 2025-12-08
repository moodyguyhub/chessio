# Club Preview Puzzle - Reference

## Puzzle Details

**Theme:** Knight Fork (Royal Fork)  
**Difficulty:** Club Level (harder than School)  
**Objective:** White to move and win the Queen

---

## Position

**FEN:** `r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4`

This is from the Italian Game opening (after 1.e4 e5 2.Nf3 Nc6 3.Bc4 Nf6).

### Visual Board (White to move)

```
  a b c d e f g h
8 r . b q k b . r  (Black's back rank)
7 p p p p . p p p
6 . . n . . n . .
5 . . . . p . . .
4 . . B . P . . .  (White's Bishop on c4, Pawn on e4)
3 . . . . . N . .  (White's Knight on f3)
2 P P P P . P P P
1 R N B Q K . . R  (White's back rank)
  a b c d e f g h
```

---

## Solution

**Winning Move:** `Nf3-e5` (or in notation: `Nxe5`)

### Why It Works

1. The Knight on f3 captures the pawn on e5
2. From e5, the Knight:
   - Gives CHECK to the Black King on e8
   - Simultaneously attacks the Black Queen on d8
3. This is called a **Royal Fork** (attacking King + Queen)
4. Black must move the King (forced)
5. White captures the Queen next move

### Key Squares

- Knight starts: `f3`
- Knight moves to: `e5` (captures pawn)
- Knight attacks: `d8` (Queen) and `e8` (King) simultaneously

---

## Pedagogical Value

This puzzle teaches:
- **Knight forks** - attacking two pieces at once
- **Royal fork** - the most powerful fork (King + Queen)
- **Looking ahead** - seeing beyond the immediate capture
- **Forced moves** - understanding when opponent has no choice

Perfect for Club tier: harder than "move the piece" but not requiring deep calculation.

---

## Alternative Puzzle Ideas (Future)

If you want to swap this out later, here are Club-level themes:

1. **Pin:** Bishop pins Knight to King
2. **Skewer:** Rook attacks King, then Queen behind it
3. **Discovered attack:** Move one piece to reveal attack from another
4. **Double attack:** Queen attacks two pieces at once

All should be 1-2 moves and require "seeing the pattern" rather than just mechanics.

---

## Testing the Puzzle

To test in the app:

1. Create route: `/app/(protected)/play/club-preview/page.tsx`
2. Import `getClubPreviewPuzzle()` from `@/lib/lessons/club-preview`
3. Reuse existing lesson player component
4. Show `ClubComingSoonModal` after completion

Or test manually at: https://lichess.org/analysis/r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R_w_KQkq_-_4_4

---

*Reference for: TIER_SYSTEM_IMPLEMENTATION.md*
