# Chessio - Development Notes

**Last Updated:** December 7, 2025 (Phase 2.1)  
**Production:** https://chessio.io

## Stack Choices

| Technology | Choice | Rationale |
|------------|--------|-----------|
| Framework | Next.js 16 (App Router) | Modern React with server components, great DX |
| Database | PostgreSQL + Prisma | Type-safe ORM, easy schema management |
| Auth | NextAuth v5 | Industry standard, JWT sessions for v1 |
| Styling | Tailwind CSS | Rapid UI development, consistent design |
| Chess | Custom SVG board | Simpler than libraries for teaching use-case |
| AI | OpenAI GPT-4o-mini | In-lesson Coach + SEO content generation |

## Phase 2.1 Architecture (Current)

### Dashboard System
- **ActiveDutyCard**: Singular focal point showing current mission (5 states)
- **CampaignMap**: Visual curriculum hierarchy with 4 tiers
- **duty-state.ts**: State machine determining user's next action
- **school-map.ts**: Progress calculation for tier/level display

### Placement Test Flow
1. User takes 5-position evaluation at `/school/placement`
2. Score 4/5 → unlock School directly (skip Pre-School)
3. Score <4/5 → mandate Pre-School completion
4. Result stored in localStorage, synced to profile on dashboard load

### Tier System
- **Pre-School (Tier 0)**: 6 sandbox lessons for absolute beginners
- **Foundation (Tier 1)**: Levels 1-3 (checks, tactics, endgames)
- **Candidate (Tier 2)**: Levels 6-10 (coming soon)
- **Mastery (Tier 3)**: Levels 11-15 (coming soon)

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

We started with `react-chessboard` + `chess.js` but switched to a **custom SVG-based board** because:

1. **Teaching-focused validation** - Lessons have explicit `validMoves` in DB; full chess rules not needed for guided tasks
2. **UI control** - Custom highlighting, animations, and visual feedback for teaching
3. **Lighter bundle** - No chess engine dependency for foundational lessons
4. **Flexibility** - Easy to adapt board behavior per lesson type (tactics, endgames, puzzles)

**Note:** chess.js is still used for FEN validation and advanced levels (coming soon).
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

- New users see ActiveDutyCard with "Start Your Journey" (placement test)
- Placement test unlocks School directly (4/5) or mandates Pre-School (<4/5)
- Completing a lesson unlocks the next one in sequence
- XP awarded once per lesson (tracked via `UserLessonProgress.status`)
- Dashboard shows current duty state: placement → pre-school → level → celebration

## Current Status (Phase 2.1)

✅ **Live in Production**: https://chessio.io  
✅ **Foundation Tier**: Levels 1-3 (Check School, Tactics 101, Endgames 101)  
✅ **Placement Test**: 5-position evaluation for proper level assignment  
✅ **Pre-School**: 6 sandbox lessons for absolute beginners  
✅ **AI Coach**: In-lesson guidance with GPT-4o-mini (Nova)  
✅ **XP & Leveling**: Player profile with level calculation  

## File Structure

```
src/
├── app/
│   ├── (auth)/              # Public auth pages
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/         # Requires auth
│   │   ├── app/             # Dashboard (ActiveDutyCard + CampaignMap)
│   │   └── school/          # Levels 1-3 + Placement Test
│   ├── api/
│   │   ├── auth/register/   # User registration
│   │   ├── lessons/[id]/    # Lesson completion, hints, Coach
│   │   └── xp/sync/         # XP updates
│   └── page.tsx             # Landing page (Path to Mastery)
├── components/
│   ├── brand/
│   │   ├── Logo.tsx         # Chessio wordmark
│   │   └── Badge.tsx        # Level badges
│   ├── chess/
│   │   ├── Chessboard.tsx   # Custom SVG board
│   │   ├── TaskBox.tsx      # Task instructions + feedback
│   │   ├── LessonPlayer.tsx # Lesson engine
│   │   ├── CoachPanel.tsx   # AI Coach (Nova)
│   │   └── LessonCompleteModal.tsx
│   └── ui/
│       ├── ActiveDutyCard.tsx   # Current mission card
│       ├── CampaignMap.tsx      # Curriculum visualization
│       └── Accordion.tsx        # Tier grouping
└── lib/
    ├── auth.ts              # NextAuth v5 config
    ├── db.ts                # Prisma client
    ├── gamification/
    │   ├── duty-state.ts    # State machine for ActiveDutyCard
    │   └── school-map.ts    # Tier/level data + progress calculation
    └── ai-config.ts         # OpenAI GPT-4o-mini (Nova)
```

## Phase 2.2+ Roadmap

- [ ] Candidate Tier (Levels 6-10): Tactics, Openings, Strategy
- [ ] Mastery Tier (Levels 11-15): Advanced endgames, combinations
- [ ] Lesson replay with move history viewer
- [ ] Sound effects for moves/completion (partially implemented)
- [ ] Leaderboards and social features
- [ ] Mobile app (React Native)
- [ ] Achievements/badges system
- [ ] Social features (compare progress with friends)
