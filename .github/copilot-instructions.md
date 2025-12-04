# Chessio - AI Coding Agent Instructions

## Quick Start
```bash
npx prisma dev       # Start local Postgres (keep running)
npm run db:push      # Push Prisma schema
npm run db:seed      # Seed Level 0 lessons
npm run dev          # Dev server at localhost:3000
```

## Architecture Overview

**"Duolingo for Chess"** - Next.js 16 App Router + Prisma/PostgreSQL + NextAuth v5.

### v1 Constraints (LOCKED)
- **Auth:** Credentials-only, JWT sessions (no Google/Apple)
- **Runtime:** Node.js only, no Edge (all DB routes need `runtime = "nodejs"`)
- **No @vercel/*:** Don't import from Vercel SDKs
- **Error handling:** Never leak Prisma codes to UI

### Core Data Flow
1. **Lessons**: `Lesson` → `Task[]` → `LessonPlayer` component
2. **Progress**: `UserLessonProgress` tracks status (LOCKED/AVAILABLE/COMPLETED) + `data` JSONB
3. **XP**: Awarded on lesson completion, simple level calc (`Math.floor(xp / 100) + 1`)

### Route Structure
```
/                     # Landing page
/login, /register     # Auth (group: (auth))
/app                  # Dashboard (protected)
/app/lessons/[slug]   # Lesson player (protected)
```

## Critical Patterns

### API Route Template
```typescript
// All DB-touching routes MUST have this:
export const runtime = "nodejs";

// Use error wrapper for friendly messages:
import { withErrorHandling, apiSuccess } from "@/lib/api-errors";

export const POST = withErrorHandling(async (req) => {
  // ... your logic
  return apiSuccess({ data });
}, "context-for-logs");
```

### Chess Logic
```typescript
// Use chess.js wrapper for rule validation:
import { validateMove, isCheckmate } from "@/lib/chess";

// Level 0 uses explicit validMoves from Task, not full chess rules
// chess.js is for future levels with real gameplay
```

### Chessboard Component (Custom, No Library)
```typescript
// src/components/chess/Chessboard.tsx - Custom SVG board
<Chessboard
  fen="8/8/8/8/8/8/8/4R3 w - - 0 1"
  onSquareClick={(sq) => ...}
  onMove={(from, to) => ...}
  highlightSquares={["e8"]}
  selectedSquare={selected}
/>
```

### Task Schema (DB-driven lessons)
```typescript
// prisma/schema.prisma - Task model
model Task {
  goalType        String   // "move" | "capture" | "select"
  validMoves      String   // JSON: ["e1-e8"]
  failureSpecific String?  // JSON: {"e1-h4": "Rooks can't move diagonally!"}
  hintMessage     String   // Static hint text
}
```

### UserLessonProgress (Flexible JSONB)
```typescript
// The `data` field stores flexible progress info:
// { "completed": true, "hintsUsed": 2, "attempts": 5 }
// Start simple, extend without schema changes
```

### Auth Pattern
```typescript
import { auth } from "@/lib/auth";
const session = await auth();
if (!session?.user?.id) redirect("/login");
```

## Project Conventions
- **Route groups**: `(auth)` for public, `(protected)` for auth-required
- **Server components default**, `"use client"` only for interactivity
- **Prisma singleton**: import `db` from `@/lib/db`
- **Error handling**: import from `@/lib/api-errors`
- **Chess logic**: import from `@/lib/chess`
- **Components**: `src/components/chess/` for chess-related, `src/components/ui/` for generic

## Key Files
| Purpose | File |
|---------|------|
| Infra rules | `INFRA_NOTES.md` |
| Deploy checklist | `DEPLOY_CHECKLIST.md` |
| Auth config | `src/lib/auth.ts` |
| DB client | `src/lib/db.ts` |
| API errors | `src/lib/api-errors.ts` |
| Chess utils | `src/lib/chess.ts` |
| Chessboard | `src/components/chess/Chessboard.tsx` |
| Lesson engine | `src/components/chess/LessonPlayer.tsx` |
| Dashboard | `src/app/(protected)/app/page.tsx` |
| Schema | `prisma/schema.prisma` |
| Seed data | `prisma/seed.ts` |

## Adding New Lessons
1. Add to `prisma/seed.ts` following existing pattern
2. Include tasks with: `instruction`, `startingFen`, `goalType`, `validMoves`, `successMessage`, `failureDefault`, `hintMessage`
3. Run `npm run db:seed`

## DO / DON'T

### ✅ DO
- Add `runtime = "nodejs"` to all API routes touching DB
- Use `withErrorHandling` wrapper for APIs
- Use Prisma singleton from `src/lib/db`
- Return friendly error messages
- Test chess logic with chess.js

### ❌ DON'T
- Import from `@vercel/*`
- Use Edge runtime for DB routes
- Leak Prisma error codes to UI
- Add OAuth providers without discussion
- Create new models without team review

## Known Limitations (Phase 0/1)
- Credentials-only auth (no OAuth)
- 3-5 hard-coded lessons only
- Static hints (no AI integration yet)
- No lesson replay/history
- No sound effects
- Single-player only
