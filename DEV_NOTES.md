# Chessio - Development Notes

## Stack Choices

| Technology | Choice | Rationale |
|------------|--------|-----------|
| Framework | Next.js 16 (App Router) | Modern React with server components, great DX |
| Database | PostgreSQL + Prisma | Type-safe ORM, easy schema management |
| Auth | NextAuth v5 | Industry standard, supports multiple providers |
| Styling | Tailwind CSS | Rapid UI development, consistent design |
| Chess | Custom SVG board | Simpler than react-chessboard for teaching use-case |

## Running the Dev Server

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL

# 3. Push schema & seed data
npm run db:push
npm run db:seed

# 4. Start dev server
npm run dev
```

Open http://localhost:3000

## Key Architecture Decisions

### Custom Chessboard vs Library

We started with `react-chessboard` + `chess.js` but switched to a **custom SVG-based board** for Level 0 because:

1. **Simpler validation** - Level 0 tasks have explicit `validMoves` in the database; we don't need full chess rules
2. **Teaching-focused** - We control exactly which moves are allowed per task
3. **Lighter bundle** - No chess engine needed for "move the rook to e8" tasks
4. **Mobile-friendly** - Custom touch handling optimized for our use case

The `Chessboard` component in `src/components/chess/Chessboard.tsx` handles:
- FEN parsing (read-only, no full validation)
- Piece rendering with Unicode symbols
- Click-to-select and drag-to-move
- Square highlighting for hints/targets

### Lesson Engine

Tasks validate moves against `Task.validMoves` (JSON array like `["e1-e8"]`), not chess rules. This allows:
- Teaching illegal positions for demos
- Accepting only specific "correct" moves
- Custom failure messages for common mistakes (`Task.failureSpecific`)

### Progress & Unlocking

- New users start with Lesson 1 `AVAILABLE`, rest `LOCKED`
- Completing a lesson unlocks the next one
- XP is awarded once per lesson (tracked via `UserLessonProgress.status`)

## Assumptions

1. **Level 0 only** - This build focuses on teaching pieces, not full chess games
2. **No real-time** - Single-player lessons, no multiplayer
3. **No AI hints (Phase 1)** - Hints are static from `Task.hintMessage`
4. **Desktop + Mobile** - Responsive but not tablet-optimized

## File Structure

```
src/
├── app/
│   ├── (auth)/              # Public auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/         # Requires auth
│   │   └── app/
│   │       ├── page.tsx     # Dashboard
│   │       └── lessons/[slug]/
│   ├── api/
│   │   ├── auth/register/   # User registration
│   │   └── lessons/[id]/    # Lesson completion, hints
│   └── page.tsx             # Landing page
├── components/
│   └── chess/
│       ├── Chessboard.tsx   # Board rendering
│       ├── TaskBox.tsx      # Task instructions + feedback
│       ├── LessonPlayer.tsx # Lesson engine
│       └── LessonCompleteModal.tsx
└── lib/
    ├── auth.ts              # NextAuth config
    └── db.ts                # Prisma client
```

## TODOs for Future Phases

- [ ] Add more lessons (Queen, King, Knight, Pawn)
- [ ] Implement AI-powered hints (OpenAI/Anthropic)
- [ ] Add lesson replay with move history
- [ ] Sound effects for moves/completion
- [ ] Achievements/badges system
- [ ] Social features (compare progress with friends)
