# Coach's Challenge - Quick Reference Card

## 🎯 What It Does

A scripted mini-game where students face "Chip" the Coach Bot to graduate from a level.

## 📍 Where to Find It

**User Flow:**
1. Complete all lessons in Level 0 or Level 1
2. See "Level X Challenge" card on dashboard
3. Click "Start Challenge"
4. Routes to `/challenge/level0_challenge` or `/challenge/level1_challenge`

## 🎮 Game Rules

### Level 0: "Basic Captures"
- **Goal**: Capture 3 pieces
- **Don't**: Lose your Queen
- **Time Limit**: 15 moves
- **Bot**: chip_l0 (dumb, makes obvious mistakes)

### Level 1: "Tactical Superiority"  
- **Goal**: Get +3 material lead (points)
- **Don't**: Blunder (lose 3+ points)
- **Time Limit**: 20 moves
- **Bot**: chip_l1 (captures hanging pieces, but hangs minors)

## 🧠 Key Concepts

### Material Values
```typescript
p = 1 (pawn)
n = 3 (knight)
b = 3 (bishop)
r = 5 (rook)
q = 9 (queen)
k = 0 (king)
```

### Blunder Detection
- **Queen Blunder** (L0 only): Moving queen to undefended, attacked square
- **Generic Blunder**: Losing 3+ points in a move (material drop)

### Bot Behavior
- **30% mistake rate**: Intentionally hangs pieces
- **No engine**: Just one-ply heuristics
- **Fair**: Won't hang king, won't make insane moves

## 🎨 UI Screens

1. **Intro**: Mission bullets, Chip avatar, "Let's Play!" button
2. **Playing**: Board + HUD (score/captures, moves left, progress bar)
3. **Result**: Success (confetti 🎉) or Fail (encouraging retry)

## 🔧 How to Modify

### Change Starting Position
Edit `src/lib/challenges/config.ts`:
```typescript
startingFEN: "your/fen/here w - - 0 1"
```

### Adjust Difficulty
In `config.ts`, change:
```typescript
winCondition: {
  targetCaptures: 3,  // Make harder: 4, 5
  maxMoves: 15        // Make easier: 20, 25
}
```

### Make Bot Dumber/Smarter
In `src/lib/challenges/bot.ts`:
```typescript
if (Math.random() < 0.3)  // Change to 0.5 (dumber) or 0.1 (smarter)
```

## 🐛 Common Issues

### "Challenge card not showing"
- Verify all lessons in that level are completed
- Check `level0Complete` or `level1Complete` in dashboard page

### "Illegal move" errors
- FEN might be invalid
- Verify starting position loads in UI

### "Bot not moving"
- Check console for errors in `bot.ts`
- Verify `getChipMove` returns a valid move

## 📝 TODO for Production

- [ ] Add challenge completion tracking to database
- [ ] Award badge on pass (integrate with badge system)
- [ ] Link "Review Lessons" to specific lesson on fail
- [ ] Replace emoji with actual Chip avatar image
- [ ] Add telemetry events (challenge_started, challenge_completed)

## 🚀 Testing

```bash
# Start dev server
npm run dev

# Go to dashboard
# Complete a lesson
# See challenge card appear
# Click "Start Challenge"
```

## 🎓 Design Philosophy

- **Emotionally Safe**: Fail copy is encouraging, not punishing
- **Pedagogical**: Reinforces what was just learned
- **Fun**: Chip is a character, not a faceless opponent
- **Quick**: 5-10 minutes max per challenge
- **Fair**: Bot makes mistakes so beginners can win

---

*For full implementation details, see `COACH_CHALLENGE_IMPLEMENTATION.md`*
