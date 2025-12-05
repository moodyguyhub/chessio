# Staging Deployment Guide - v1.0-alpha

## Pre-flight Checklist

- [x] All code committed to `main`
- [x] Prisma migrations created (`prisma/migrations/20251205034919_init`)
- [x] Tag: `v1.0-alpha`

## Environment Variables (Required)

```bash
# Generate a new secret for staging:
# openssl rand -base64 32

NODE_ENV=production
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/chessio_staging
AUTH_SECRET=<generate-new-secret>
NEXTAUTH_URL=https://your-staging-domain.com
```

## Deployment Steps

### 1. Database Setup
Create a new PostgreSQL database (Neon, Supabase, Railway, etc.)

### 2. Build Command
```bash
npx prisma migrate deploy && next build
```

### 3. Start Command
```bash
next start
```

### 4. Post-Deploy: Seed Data (Optional)
If you want lessons pre-populated:
```bash
npx tsx prisma/seed.ts
```

## Lyra Vibe Check Tests ✨

### 1. Thumb Test (Mobile Viewport)
- [ ] Dashboard cards reachable with one thumb
- [ ] Lesson navigation comfortable
- [ ] Chessboard squares tappable (44px+ touch targets)
- [ ] Check `dvh` viewport on iOS Safari

### 2. Shake Test (<100ms Latency)
- [ ] Piece selection: instant highlight
- [ ] Move execution: no perceptible delay
- [ ] Success/error feedback: immediate

### 3. Audio Test (First Interaction)
- [ ] Sound plays on first tap (not before user gesture)
- [ ] Move sound on piece selection
- [ ] Capture sound on captures
- [ ] Success fanfare on lesson complete
- [ ] Error sound on wrong moves

### 4. Visual Celebration
- [ ] Confetti triggers on lesson completion
- [ ] Confetti doesn't block interaction

## Content Inventory (v1.0-alpha)

| Level | Lessons | Total XP |
|-------|---------|----------|
| Level 0 | Board, Rook, Bishop, Queen, King, Pawn | 75 |
| Level 1 | Knight, Castling, Check, Checkmate | 85 |
| Puzzles | Mate in One (5 puzzles) | 30 |
| Level 2 | En Passant, Stalemate | 50 |
| **Total** | **13 lessons** | **240 XP** |

## Rollback
```bash
git checkout <previous-tag>
npx prisma migrate deploy
```

## Known Limitations (v1)
- Credentials-only auth (no OAuth)
- Static hints (no AI)
- No lesson replay/history
- Single-player only
