# 🛠️ Vega Handoff Document

> **Status:** Phase 2.1 Complete (December 7, 2025)  
> **Production:** https://chessio.io  
> **Current Focus:** Academy Experience (Dashboard 2.0 + School Foundation)

---

## Phase 2.1: Academy Polish ✅

**Deployed:** December 7, 2025  
**Features Shipped:**
- Landing Page 2.0 (Path to Mastery hero + ladder)
- ActiveDutyCard (state-driven mission card with 5 states)
- CampaignMap (4-tier curriculum visualization)
- School Foundation (Levels 1-3 with tier grouping)
- Pre-School Polish (warmer tones + Academy Gate card)
- Placement Test (5-position evaluation)

---

## Implementation Status

| Priority | Feature | Status |
|----------|---------|--------|
| ✅ P0 | **Interactive Board** | Custom SVG board with click/drag support |
| ✅ P0 | **Lesson Engine** | Task validation via DB-driven `validMoves` |
| ✅ P0 | **Lesson Player UI** | Split layout with TaskBox + Chessboard |
| ✅ P1 | **Auth & Dashboard** | Dashboard 2.0 with ActiveDutyCard + CampaignMap |
| ✅ P1 | **Completion Modal** | XP reward + next lesson CTA |
| ✅ P1 | **AI Coach** | Nova (GPT-4o-mini) for in-lesson guidance |
| ✅ P1 | **Placement Test** | 5-position evaluation for proper level assignment |

---

## Core Components

Design system from `src/components/ui`:

| Component | Usage |
|-----------|-------|
| `Button` | Primary actions (gradients), secondary (outline) |
| `Card` | Dashboard cards (ActiveDutyCard, Academy Gate) |
| `Badge` | Level badges, status chips |
| `Dialog` | Success modals, lesson completion |
| `Accordion` | Tier grouping in CampaignMap |

## Data Architecture

### Lessons (Database-Driven)

Lessons stored in PostgreSQL via Prisma (`Lesson` + `Task` models):

```typescript
// Lesson model
{
  id: string;
  title: string;
  slug: string;          // URL identifier
  description: string;
  orderIndex: number;    // For progression
  levelId: string;       // Links to School Level (1-15)
  xpReward: number;
  tasks: Task[];
}

// Task model
{
  instruction: string;   // What user needs to do
  startingFen: string;   // Board position
  goalType: string;      // "move" | "capture" | "select"
  validMoves: string;    // JSON array ["e1-e8"]
  successMessage: string;
  failureDefault: string;
  failureSpecific?: string;  // JSON object {"e1-h4": "Rooks can't move diagonally!"}
  hintMessage: string;
}
```

### Progress Tracking

```typescript
// UserLessonProgress model
{
  userId: string;
  lessonId: string;
  status: "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";
  completedAt?: Date;
  hintsUsed: number;
  data: Json;           // Flexible JSONB for future extensions
}
```

### School Levels (Tier System)

```typescript
// Level model
{
  id: string;
  levelNumber: number;  // 1-15
  title: string;        // "Check School", "Tactics 101"
  tier: number;         // 0 (Pre-School), 1 (Foundation), 2 (Candidate), 3 (Mastery)
  lessons: Lesson[];
}
```

---

## Styling & UX

### Design System (Phase 2.1)

Color palette defined in `tailwind.config.ts`:

```tsx
// Tier Colors (CampaignMap)
className="text-tier-1"  // Foundation (cyan)
className="text-tier-2"  // Candidate (purple)
className="text-tier-3"  // Mastery (amber)

// Status Colors
className="text-success" // Completed lessons (emerald)
className="text-muted"   // Locked content (gray)

// Gradients
className="bg-gradient-to-r from-cyan-500 to-blue-500"  // Primary CTAs
className="bg-gradient-to-br from-amber-400/10 to-orange-500/10"  // Pre-School warmth

// Interactive States
className="hover:scale-[1.02] transition-transform"  // Buttons
className="animate-pulse-glow"  // Available lessons (custom keyframe)
```

### Component Patterns

**ActiveDutyCard** (5 states):
- `new_user`: "Start Your Journey" (placement CTA)
- `placement_failed`: "Begin at Pre-School" (Pre-School CTA)
- `placement_passed`: "Welcome to School" (Level 1 CTA)
- `student_active`: "Resume Lesson" (continue CTA)
- `level_complete`: "Level Complete!" (celebration + next level)

**CampaignMap** (tier-based):
- Accordion for tier grouping (`<Accordion>` component)
- Level rows with status chips (Available, Current, Completed, Locked)
- Lesson rows nested under levels (indented, muted when locked)

### Feedback States

| State | Visual Treatment |
|-------|------------------|
| **Selection** | Soft cyan glow on selected square (`ring-2 ring-cyan-500`) |
| **Error** | Shake animation + orange text in TaskBox (no red flashes) |
| **Success** | Green checkmark + success message in TaskBox |
| **Available Lesson** | Pulse glow animation on CampaignMap row |
| **Completed Lesson** | Emerald checkmark icon, muted text |

### Responsive Layout

| Viewport | Layout |
|----------|--------|
| Desktop | Split view: TaskBox/Coach left, Chessboard right |
| Tablet | Stacked view: Chessboard top, TaskBox/Coach bottom |
| Mobile | Full-width stacked: Chessboard → TaskBox → Coach (collapsible) |

---

## Implementation Notes (Phase 2.1)

### Key Technical Decisions

1. **State Machine for Dashboard**: `duty-state.ts` determines ActiveDutyCard content based on user progress (5 states)
2. **Tier Calculation**: `school-map.ts` computes tier progress from lesson completion data
3. **Custom SVG Chessboard**: No libraries (react-chessboard removed in favor of teaching-focused custom component)
4. **AI Coach Integration**: GPT-4o-mini via `/api/lessons/[id]/coach` route
5. **Placement Test Logic**: localStorage for immediate UX, synced to user profile on dashboard load

### File Locations (Updated)

| Purpose | Path |
|---------|------|
| Dashboard | `src/app/(protected)/app/page.tsx` |
| ActiveDutyCard | `src/components/ui/ActiveDutyCard.tsx` |
| CampaignMap | `src/components/ui/CampaignMap.tsx` |
| Placement Test | `src/app/(protected)/school/placement/page.tsx` |
| Duty State Logic | `src/lib/gamification/duty-state.ts` |
| School Map Data | `src/lib/gamification/school-map.ts` |
| AI Coach | `src/components/chess/CoachPanel.tsx` |
| Chessboard | `src/components/chess/Chessboard.tsx` |
| Lesson Player | `src/components/chess/LessonPlayer.tsx` |
| Tailwind Config | `tailwind.config.ts` |

---

## Next Steps (Phase 2.2+)

- [ ] **Candidate Tier**: Levels 6-10 (Tactics, Openings, Strategy)
- [ ] **Mastery Tier**: Levels 11-15 (Advanced Endgames, Combinations)
- [ ] **Leaderboards**: Weekly XP rankings for engaged users
- [ ] **Social Sharing**: Share level completions to Twitter/Discord
- [ ] **Mobile App**: React Native port for iOS/Android

### Key Commands

```bash
npm run dev          # Start dev server
npm run db:push      # Push Prisma schema
npm run db:seed      # Seed lesson data
npm run lint         # Check for errors
npm run build        # Production build
```
