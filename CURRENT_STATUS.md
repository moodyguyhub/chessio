# Chessio - Current Status & Quick Start

**Last Updated:** December 7, 2025  
**Current Phase:** Production v1 with Ink & Ivory Theme

---

## 🚀 Quick Start for New Agents

### Local Development Setup
```bash
# 1. Start local Postgres
npx prisma dev       # Keep this running in separate terminal

# 2. Push schema and seed data
npm run db:push
npm run db:seed

# 3. Start dev server
npm run dev          # Open http://localhost:3000
```

### Verify Setup
- Landing page at `/` should show golden "Start Learning" button
- Dashboard at `/app` requires login (test user from seed or register)
- All 6 Level 0 lessons should be visible and playable

---

## 🎨 Current Design System

### Brand: "Ink & Ivory with Golden Accent"

**Color Palette** (in `tailwind.config.ts`):
```typescript
chessio: {
  // Dark theme backgrounds (warm, sophisticated)
  "bg-dark": "#050814",        // Page background
  "surface-dark": "#090f1f",   // Cards, panels
  "card-dark": "#111827",      // Modals, elevated surfaces
  
  // Golden primary (elegant, not flashy)
  primary: "#facc15",          // Buttons, accents
  "primary-dark": "#eab308",   // Hover states
  
  // Text & borders
  "text-dark": "#f9fafb",      // Main text
  "muted-dark": "#9ca3af",     // Secondary text
  "border-dark": "#1f2933",    // Borders
}
```

**Chessboard:** Amber-toned squares (`amber-50` light, `amber-900` dark)

**Design Philosophy:** "Serious player with charm" - professional but approachable

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Public auth pages (login, register)
│   ├── (protected)/app/     # Dashboard + lessons (requires auth)
│   ├── api/                 # API routes (auth, feedback, hints)
│   └── page.tsx             # Landing page
├── components/
│   ├── chess/               # Chessboard, LessonPlayer, TaskBox
│   └── ui/                  # Button, Card, Badge, modals
└── lib/
    ├── auth.ts              # NextAuth v5 config (GitHub + Credentials)
    ├── db.ts                # Prisma singleton
    ├── lessons.ts           # All 6 Level 0 lessons (source of truth)
    ├── gamification/        # XP & leveling system
    └── engagement/          # Today's Goal feature
```

---

## 🗄️ Database Schema

**Current Models:**
- `User` - Auth + XP tracking
- `UserLessonProgress` - Lesson completion status
- `Feedback` - User feedback submissions
- `Account`/`Session` - NextAuth tables
- `AiTask` - AI-generated task queue

**Connection:** Neon PostgreSQL via Prisma (production + local dev via `npx prisma dev`)

---

## 🎓 Lessons System

### Current Content: 6 Level 0 Lessons
1. **Meet the Board** - Select squares (e4, a1, h8)
2. **How the Rook Moves** - Practice straight-line moves
3. **How the Bishop Moves** - Practice diagonal moves
4. **How the Queen Moves** - Combined rook + bishop
5. **How the King Moves** - One square in any direction
6. **How the Pawn Moves** - Forward movement + promotion

**Source of Truth:** `src/lib/lessons.ts`

**Export for Review:**
```bash
npx tsx scripts/export-lessons-to-md.ts
# Creates: chessio-lessons-export.md
```

### Lesson Task Types
- `select-square` - Click on a specific square
- `move-piece` - Move a piece from → to

**Validation:** Tasks define `expectedMove` or `targetSquare`, not full chess rules

---

## 🔐 Authentication

**Providers:**
- **GitHub OAuth** - Admin login (requires `GITHUB_ID` + `GITHUB_SECRET`)
- **Credentials** - User registration with bcrypt passwords

**Admin Access:**
- Set `ADMIN_GITHUB_USERNAME` in `.env` or Vercel env vars
- Admin user gets special access (future admin dashboard)

**Local .env required:**
```env
DATABASE_URL="..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret"
GITHUB_ID="..."
GITHUB_SECRET="..."
```

---

## 🎮 Key Features

### Gamification
- **XP System:** Users earn XP for completing lessons
- **Leveling:** Simple formula: `Level = floor(XP / 100) + 1`
- **Progress Tracking:** Dashboard shows completion % per level
- **Today's Goal:** Contextual daily goal based on progress

### UX Enhancements
- Action hints under CTAs ("Next up: 3 quick tasks")
- XP tooltips showing progress to next level
- Level 0 explanation text for beginners
- Feedback button on all lesson pages

### Sound Effects
- Move, capture, success, error sounds
- Hook: `useChessAudio()` in components

---

## 🚫 Known Constraints (Phase 0/1)

**Locked for v1:**
- ✅ Credentials-only auth (no Google/Apple yet)
- ✅ Node.js runtime only (no Edge)
- ✅ Static hints (no AI integration yet)
- ✅ Single-player only (no multiplayer)
- ✅ 6 lessons only (Level 0 complete)

**Future Phases:**
- Level 1+ lessons (castling, en passant, checkmate)
- AI-powered hints (OpenAI integration ready)
- Lesson replay with history
- Multiplayer practice mode

---

## 📝 Critical Files for New Agents

### Must Read First:
1. **`.github/copilot-instructions.md`** - Architecture & conventions
2. **`INFRA_NOTES.md`** - Database & deployment rules
3. **`tailwind.config.ts`** - Design system tokens

### Implementation References:
- **Lesson Engine:** `src/components/chess/LessonPlayer.tsx`
- **Task Validation:** `src/lib/lessons/engine.ts`
- **Progress Logic:** `src/lib/lessons/progress.ts`
- **Gamification:** `src/lib/gamification/xp.ts`

### Data Files:
- **Lessons:** `src/lib/lessons.ts` (all 6 lessons)
- **Seed:** `prisma/seed.ts` (initial data)
- **Schema:** `prisma/schema.prisma`

---

## 🐛 Common Issues & Solutions

### Build Errors
- **JSX syntax errors:** Check for orphaned `>` or missing closing tags
- **Import errors:** Ensure all imports use `@/` alias for `src/`
- **Prisma errors:** Run `npx prisma generate` after schema changes

### Local Dev Issues
- **DB connection fails:** Ensure `npx prisma dev` is running
- **Auth fails:** Check `.env` has all required variables
- **Lessons not showing:** Run `npm run db:seed` to populate

### Deployment Issues
- **Runtime errors:** Add `export const runtime = "nodejs"` to all DB routes
- **Env vars missing:** Set in Vercel dashboard (not .env)
- **Schema mismatch:** Run `npx prisma migrate deploy` in production

---

## 🎯 Current Focus Areas

### Completed Recently:
- ✅ Warm dark Ink & Ivory theme implementation
- ✅ Golden primary color consistency across app
- ✅ Chessboard amber square colors
- ✅ Header XP display styling
- ✅ Lesson export script for curriculum review
- ✅ Feedback button on all lesson pages
- ✅ Today's Goal with action hints

### Ready for Next Phase:
- 🔜 Complete remaining UX improvements (see below)
- 🔜 Add more Level 0 lessons (Knight, advanced Pawn)
- 🔜 Start Level 1 content (castling, special moves)
- 🔜 Admin dashboard for lesson management
- 🔜 Analytics integration

---

## 📋 Remaining UX Improvements (From User's "Pass")

**Dashboard:** ✅ Completed
- [x] Action hints under buttons
- [x] XP tooltips
- [x] Level 0 explanation text
- [x] Feedback button

**Lesson Player:** 🔜 Pending
- [ ] "3 quick taps and you're done" under Task 1
- [ ] Clickable hint button (not just text)
- [ ] "Nice! That's e4" toast on correct moves
- [ ] Streak counter for consecutive correct moves
- [ ] Gentle error messages with guidance

**Completion Screen:** 🔜 Pending
- [ ] "You completed 3 tasks and nailed board coordinates 🎯"
- [ ] "Next: Learn castling" with preview
- [ ] "How did this lesson feel?" difficulty buttons
- [ ] "Prefer a break? Progress is safe" reassurance text

---

## 🛠️ Useful Commands

```bash
# Development
npm run dev                          # Start dev server
npm run build                        # Production build
npm run lint                         # ESLint check

# Database
npx prisma dev                       # Start local Postgres
npm run db:push                      # Push schema (no migration)
npm run db:migrate                   # Create migration
npm run db:seed                      # Seed lessons
npm run db:studio                    # Open Prisma Studio

# Prisma
npx prisma generate                  # Generate client
npx prisma migrate deploy            # Deploy migrations (prod)
npx prisma db pull                   # Pull schema from DB

# Scripts
npx tsx scripts/export-lessons-to-md.ts  # Export lessons to markdown
npx tsx scripts/verify-xp-config.ts      # Verify XP config
```

---

## 📞 Getting Help

1. **Check existing docs:**
   - `README.md` - General overview
   - `DEV_NOTES.md` - Architecture decisions
   - `.github/copilot-instructions.md` - Coding conventions

2. **Search codebase:**
   - Use `grep` or IDE search for patterns
   - Check `src/lib/lessons/` for lesson logic examples

3. **Test locally first:**
   - Always test changes with `npm run dev`
   - Use `console.log` liberally
   - Check browser console for errors

---

## ✅ Health Check Checklist

Before starting work:
- [ ] `npm install` completed without errors
- [ ] `npx prisma dev` running (check port 51216)
- [ ] `.env` file exists with all required vars
- [ ] `npm run dev` starts without errors
- [ ] Can access http://localhost:3000
- [ ] Can log in with test user or register
- [ ] Dashboard shows all 6 lessons
- [ ] Can complete at least one lesson

---

**Status:** Production-ready with warm dark theme. Focus: UX improvements and content expansion.
