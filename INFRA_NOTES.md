# Chessio - Infrastructure Notes (v1 Locked)

> **Last Updated:** December 2024  
> **Status:** Locked for Phase 0/1 — no changes without team discussion

---

## 1. Deployment Target

| What | Value |
|------|-------|
| Platform | Vercel |
| Runtime | **Node.js only** (no Edge) |
| Region | Auto (Vercel default) |

### Critical Rule

**All routes that touch the database MUST declare:**

```typescript
export const runtime = "nodejs";
```

This prevents accidental Edge deployment which breaks Prisma connections.

---

## 2. Database

| What | Value |
|------|-------|
| Provider | External PostgreSQL (Neon/Supabase/Railway) |
| ORM | Prisma 7 |
| Connection | Via `@prisma/adapter-pg` |

### Connection Rules

- Use the **Prisma singleton** from `src/lib/db.ts` — never instantiate PrismaClient directly.
- Connection pooling handled by the adapter.
- For local dev: run `npx prisma dev` to start the local Prisma Postgres server.

---

## 3. Data Model (v1)

Only two core models for Phase 0/1:

- **`User`** — basic auth info + XP
- **`UserLessonProgress`** — tracks lesson status per user

### UserLessonProgress Design

```prisma
model UserLessonProgress {
  id        String   @id @default(cuid())
  userId    String
  lessonId  String
  
  status    LessonStatus @default(LOCKED)
  hintsUsed Int          @default(0)
  data      Json?        // JSONB for flexible tracking
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([userId, lessonId])
  @@index([userId, lessonId])  // Composite index for fast lookups
}
```

The `data` field (JSONB) allows flexible progress tracking without schema changes:

```json
{ "completed": true, "hintsUsed": 2, "attempts": 5, "timeSpentMs": 45000 }
```

Start simple (`{ "completed": true }`), extend later as needed.

---

## 4. Auth Rules (NextAuth v5)

### Sessions

- **Strategy:** JWT-only (`session.strategy = "jwt"`)
- **No database sessions** in v1

### Providers for Phase 0/1

- ✅ **Credentials ONLY** (email + password)
- ❌ No Google, Apple, etc.

Any additional provider is a *product* decision after first user tests.

### Secrets

Generate `NEXTAUTH_SECRET` locally:

```bash
openssl rand -base64 32
```

Put it only in `.env*` files, **never in git**.

### Required Environment Variables

```env
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=http://localhost:3000  # or production URL
DATABASE_URL=your-postgres-connection-string
```

---

## 5. Chess Logic

### Library

Use **chess.js** for:
- Move legality validation
- Special rules (castling, en passant, promotion)
- Check/checkmate/stalemate detection

### Testing Requirements

Unit tests MUST cover:
- Legal vs illegal moves
- Castling (kingside & queenside)
- En passant
- Pawn promotion
- Simple checkmate patterns
- Stalemate detection

Tests run in CI via `npm test`.

---

## 6. Error Handling

### Golden Rule

**No technical errors exposed to users.**

When Prisma or any backend service fails, the UI must show friendly messages like:
- "Something went wrong saving your progress. Let's try again."
- "Oops! We couldn't load that lesson. Please refresh."

### Implementation

All API routes use an error adapter that:
1. Catches Prisma/DB errors
2. Logs the full error server-side
3. Returns a generic, friendly message to the client

```typescript
// Never leak this to users:
// PrismaClientKnownRequestError P2002: Unique constraint failed

// Always return this instead:
{ error: "Something went wrong. Please try again." }
```

---

## 7. Lessons (v1 Content Strategy)

### Hard-coded Only

v1 includes **3-5 basic lessons** seeded in code/JSON:
1. The Chessboard (squares, notation)
2. The Rook (straight lines)
3. The Bishop (diagonals)

### No CMS

Defer dedicated lesson tables/CMS until:
- We've watched real users complete lessons
- We need more than ~10 lessons

---

## 8. Do / Don't Summary

### ✅ DO

- Use `runtime = "nodejs"` on all DB-touching routes
- Use the Prisma singleton from `src/lib/db.ts`
- Use JWT sessions (no DB sessions)
- Return friendly error messages
- Run `npx prisma dev` for local development
- Test chess logic in CI

### ❌ DON'T

- Import from `@vercel/*` (no Vercel SDK)
- Use Edge runtime for anything touching the database
- Leak Prisma error codes to the UI
- Add OAuth providers without product discussion
- Create new lesson models without team review

---

## 9. Linting & Conventions

### ESLint Rules

ESLint enforces infra rules:
- **Error:** Any import from `@vercel/*` packages
- **Warning:** DB-touching routes missing `runtime = 'nodejs'`

### Prettier

Single shared config in repo — no style debates.

---

## 10. UI Components & Design System

Chessio uses a distinct, **dependency-free UI kit** located in `src/components/ui`.

### Core Primitives

- `Button` — Primary, secondary, danger variants
- `Input` — Form inputs with label/error states
- `Card` — Content containers
- `Badge` — Status indicators
- `Dialog` — Modal overlays

### Development Rules

| Rule | Description |
|------|-------------|
| **Single Source of Truth** | All new features MUST use `src/components/ui`. Avoid ad-hoc utility classes for repeated patterns. |
| **Extension Strategy** | If a new component is needed, build it in `components/ui` first. |
| **Reference Only** | The commercial Tailwind Plus / Catalyst code resides in `design/` for inspiration but is **never imported** into the production build. |
| **Accessibility** | All primitives must maintain basic a11y standards (focus management, aria-labels) without relying on heavy external libraries like HeadlessUI unless interaction complexity demands it. |

### Semantic Design Tokens

Use `chessio.*` tokens from `tailwind.config.ts`:

```typescript
// Colors
chessio.bg / chessio.bg-dark       // Background
chessio.card / chessio.card-dark   // Card surfaces
chessio.primary / chessio.primary-dark  // Interactive elements
chessio.text / chessio.text-dark   // Primary text
chessio.muted / chessio.muted-dark // Secondary text
chessio.border / chessio.border-dark  // Borders
chessio.success / chessio.danger / chessio.warning  // Status colors
```

### Component Example

```tsx
// ✅ Correct — use UI primitives
import { Button, Card } from "@/components/ui";

// ❌ Wrong — don't import from design/
import { Button } from "@/design/extracted/...";
```

---

## 11. Environment Setup

### Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start Prisma dev server (local Postgres)
npx prisma dev

# 3. Copy the DATABASE_URL from the output to your .env

# 4. Push schema
npm run db:push

# 5. Seed lessons
npm run db:seed

# 6. Start dev server
npm run dev
```

### Required Tools

- Node.js 20+
- npm 10+
- Docker (for Prisma dev server's Postgres)

---

## Changelog

| Date | Change | Author |
|------|--------|--------|
| Dec 2024 | Initial v1 lock | Team |
