# 🛠️ Vega Handoff Checklist: Level 0 MVP

> **Status:** Ready for Dev  
> **Phase:** Level 0 (The Basics)  
> **Designer:** Lyra

---

## 1. Implementation Priorities

| Priority | Feature | Description |
|----------|---------|-------------|
| 🔴 P0 | **Interactive Board** | Render board from FEN. Click-to-select, click-to-move. |
| 🔴 P0 | **Lesson Engine** | Logic to read `src/lib/lessons.ts` and validate moves. |
| 🔴 P0 | **Lesson Player UI** | Split layout (Text Left / Board Right). |
| 🟡 P1 | **Auth & Dashboard** | Simple "Start Level 0" entry point. |
| 🟡 P1 | **Completion Modal** | XP reward state. |

---

## 2. Core Components

Use primitives from `src/components/ui`:

| Component | Usage |
|-----------|-------|
| `Button` | Use `variant="primary"` for main actions. |
| `Card` | Use for Dashboard lesson items and Lesson Intros. |
| `Badge` | Use for XP indicators. |
| `Dialog` | Use for the Success/Completion modal. |

```tsx
import { Button, Card, Badge, Dialog } from "@/components/ui";
```

---

## 3. Data Structures

Lessons are defined in `src/lib/lessons.ts`.

```typescript
// Each lesson has:
{
  slug: string;        // URL-friendly identifier
  introText: string;   // Lesson introduction
  tasks: Task[];       // List of tasks to complete
}

// Each task has:
{
  startingFen: string;     // Board position
  goal: string;            // What user needs to do
  validMoves: string[];    // Acceptable moves ["e1-e8"]
  successMessage: string;
  failureDefault: string;
  failureSpecific?: Record<string, string>;  // {"e1-h4": "Rooks can't move diagonally!"}
  hintMessage: string;
}
```

---

## 4. Styling & UX

### Theme

Use the `chessio-*` semantic colors defined in `tailwind.config.ts`:

```tsx
// Backgrounds
className="bg-chessio-bg dark:bg-chessio-bg-dark"

// Cards
className="bg-chessio-card dark:bg-chessio-card-dark"

// Primary actions
className="bg-chessio-primary dark:bg-chessio-primary-dark"

// Text
className="text-chessio-text dark:text-chessio-text-dark"
className="text-chessio-muted dark:text-chessio-muted-dark"

// Borders
className="border-chessio-border dark:border-chessio-border-dark"

// Status
className="text-chessio-success"  // Green
className="text-chessio-danger"   // Red
className="text-chessio-warning"  // Orange
```

### Feedback States

| State | Visual Treatment |
|-------|------------------|
| **Selection** | Soft Indigo glow on selected square |
| **Error** | No red flashes. Shake animation + Orange text in Task Box |
| **Success** | Green checkmark + "Nice move!" text |

### Responsive Layout

| Viewport | Layout |
|----------|--------|
| Desktop | Split view: Text Left / Board Right |
| Mobile | Stacked view: Board top / Text bottom |

---

## 5. Open Questions

| Question | MVP Decision |
|----------|--------------|
| **XP Storage** | Store in local state/context or basic user record |
| **Lesson Locking** | Lock future lessons until previous is complete |

---

## Quick Reference

### File Locations

| Purpose | Path |
|---------|------|
| Lesson data | `src/lib/lessons.ts` |
| UI primitives | `src/components/ui/` |
| Chessboard | `src/components/chess/Chessboard.tsx` |
| Lesson player | `src/components/chess/LessonPlayer.tsx` |
| Tailwind config | `tailwind.config.ts` |

### Key Commands

```bash
npm run dev          # Start dev server
npm run db:push      # Push Prisma schema
npm run db:seed      # Seed lesson data
npm run lint         # Check for errors
npm run build        # Production build
```
