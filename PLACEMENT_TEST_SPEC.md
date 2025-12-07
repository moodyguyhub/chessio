# Placement Test — Fast-Track to Chess School

**Status:** 📋 Spec ready for implementation  
**Purpose:** Allow experienced players to skip Pre-School by proving competency  
**Route:** `/school/placement`

---

## Overview

A 5-puzzle exam that tests fundamental chess knowledge. Pass ≥ 4/5 to unlock Chess School immediately without completing Pre-School.

---

## User Flow

### Entry Points
1. **Dashboard** → School card (locked state) → "Take Placement Test" button
2. **Direct link** → `/school/placement` (if logged in)

### Exam Experience
1. Land on placement page with intro text
2. 5 sequential puzzles (same UX as level exams)
3. Submit after completing all 5
4. Instant results: Pass (4-5 correct) or Fail (0-3 correct)

### Post-Exam
**If Pass:**
- Redirect to `/dashboard` with success banner
- School card now shows "Unlocked" state
- Can immediately enter Chess School

**If Fail:**
- Redirect to `/dashboard` with encouragement message
- School card still locked
- Copy suggests: "Complete Pre-School to build fundamentals"
- Can retake after 24 hours (optional for v1)

---

## Puzzle Design (5 Questions)

### 1. Basic Piece Movement
**Concept:** Rook vs Knight mobility  
**Question:** "How many squares can the white rook move to? Count all legal moves."  
**FEN:** `8/8/8/3R4/8/8/8/8 w - - 0 1`  
**Answer:** 14 squares (7 horizontal + 7 vertical)  
**Tests:** Understanding of piece movement rules

### 2. Check Recognition
**Concept:** Identify check  
**Question:** "Is the black king in check?"  
**FEN:** `4k3/8/8/8/8/2B5/8/4K3 b - - 0 1`  
**Answer:** Yes (bishop on c3 attacks king on e8)  
**Tests:** Ability to see threats

### 3. Basic Checkmate
**Concept:** Queen + King mate pattern  
**Question:** "Find the checkmate in 1 move for White."  
**FEN:** `7k/5Q2/6K1/8/8/8/8/8 w - - 0 1`  
**Answer:** Qg7# (or Qf8#)  
**Tests:** Mating pattern recognition

### 4. Piece Value / Tactics
**Concept:** Winning material  
**Question:** "White can capture a piece. Which capture wins the most material?"  
**FEN:** `r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1`  
**Answer:** Bxf7+ (winning the f7 pawn with check, forking king and rook)  
**Tests:** Tactical awareness and piece value

### 5. Endgame Basics
**Concept:** King and pawn vs king  
**Question:** "Can White promote the pawn and win?"  
**FEN:** `8/8/8/4k3/8/3P4/3K4/8 w - - 0 1`  
**Answer:** Yes (white king is in front of pawn, classic win)  
**Tests:** Basic endgame knowledge

---

## Technical Implementation

### Database Schema
Add to `User` model in `prisma/schema.prisma`:
```prisma
model User {
  // ... existing fields
  placementStatus  String?   @default("not_taken") // "not_taken" | "passed" | "failed"
  placementAttempts Int      @default(0)
  placementLastTaken DateTime?
}
```

Run migration:
```bash
npx prisma migrate dev --name add_placement_test
```

### File Structure
```
src/app/(protected)/school/placement/
  ├── page.tsx                    # Exam runner wrapper
  └── content.json                # 5 puzzle definitions

src/app/api/placement/
  └── route.ts                    # POST: save results, update user

src/lib/dashboard/profile.ts      # Update to read placementStatus
```

### Exam Data Format
**File:** `src/app/(protected)/school/placement/content.json`

```json
{
  "id": "placement-test",
  "title": "Chess School Placement Test",
  "description": "Prove your fundamentals to unlock structured training.",
  "passThreshold": 4,
  "puzzles": [
    {
      "id": "placement-q1",
      "question": "How many squares can the white rook move to?",
      "fen": "8/8/8/3R4/8/8/8/8 w - - 0 1",
      "type": "multiple-choice",
      "choices": ["10", "12", "14", "16"],
      "correctAnswer": "14",
      "explanation": "The rook can move 7 squares horizontally and 7 squares vertically."
    },
    // ... 4 more puzzles
  ]
}
```

### API Route
**File:** `src/app/api/placement/route.ts`

```typescript
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { score, total } = await req.json();
  const passed = score >= 4; // Pass threshold

  await db.user.update({
    where: { id: session.user.id },
    data: {
      placementStatus: passed ? "passed" : "failed",
      placementAttempts: { increment: 1 },
      placementLastTaken: new Date(),
    },
  });

  return Response.json({ 
    passed, 
    score, 
    total,
    message: passed 
      ? "Congratulations! Chess School is now unlocked." 
      : "Keep practicing! Complete Pre-School to build your fundamentals."
  });
}
```

### Profile Helper Update
**File:** `src/lib/dashboard/profile.ts`

```typescript
// Read placement status from DB
const user = await db.user.findUnique({
  where: { id: userId },
  select: { placementStatus: true },
});

const placementStatus: PlacementStatus = 
  (user?.placementStatus as PlacementStatus) || "not_taken";

// Update School access logic
const schoolAccess: SchoolAccess = 
  preSchoolStatus === "completed" || placementStatus === "passed"
    ? "unlocked"
    : "locked";
```

### Page Component
**File:** `src/app/(protected)/school/placement/page.tsx`

```typescript
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import PlacementExamRunner from "./PlacementExamRunner";
import content from "./content.json";

export default async function PlacementTestPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?redirect=/school/placement");
  }

  return (
    <div className="min-h-screen bg-chessio-bg-dark py-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-chessio-text mb-2">
            Placement Test
          </h1>
          <p className="text-chessio-muted">
            Answer 5 questions to prove you're ready for Chess School.
            <br />
            <strong>Pass 4/5 to unlock structured training.</strong>
          </p>
        </header>

        <PlacementExamRunner content={content} userId={session.user.id} />
      </div>
    </div>
  );
}
```

---

## Dashboard Integration

### SchoolCard.tsx Update
Change locked state copy:

```typescript
<p className="text-xs text-neutral-400">
  Finish Pre-School <strong>or pass the Placement Test</strong> to unlock 
  structured training with levels, exams, and your personal AI Coach.
</p>

// Update requirements checklist
<div className="space-y-2 pt-2">
  <div className="flex items-center gap-2 text-xs">
    <div className={`w-1.5 h-1.5 rounded-full ${
      preSchoolStatus === "completed" ? "bg-green-500" : "bg-neutral-600"
    }`} />
    <span className={preSchoolStatus === "completed" ? "text-green-400" : "text-neutral-500"}>
      Complete Pre-School
    </span>
  </div>
  <div className="flex items-center gap-2 text-xs">
    <div className={`w-1.5 h-1.5 rounded-full ${
      placementStatus === "passed" ? "bg-green-500" : "bg-neutral-600"
    }`} />
    <span className={placementStatus === "passed" ? "text-green-400" : "text-neutral-500"}>
      Pass Placement Test
    </span>
  </div>
</div>

// Update button (remove "coming soon" text)
<Link href="/school/placement" className="w-full">
  <Button size="sm" variant="ghost" className="w-full justify-center text-xs">
    Take Placement Test
  </Button>
</Link>
```

---

## Success Banner on Dashboard

Add to `/dashboard/page.tsx`:

```typescript
// Check for placement success from URL params
const searchParams = new URLSearchParams();
const placementPassed = searchParams.get("placement") === "passed";

{placementPassed && (
  <div className="mb-6 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
    <p className="text-sm font-medium text-green-400">
      🎉 Placement Test passed! Chess School is now unlocked.
    </p>
  </div>
)}
```

---

## QA Checklist

### Before Placement Test
- [ ] New user lands on `/dashboard`
- [ ] School card shows "Locked" with two requirements
- [ ] "Take Placement Test" button visible and enabled

### Taking Test
- [ ] `/school/placement` loads exam with 5 questions
- [ ] Can answer all questions using existing exam UI
- [ ] Submit triggers `/api/placement` POST
- [ ] Score calculated correctly (4/5 pass threshold)

### After Passing (4-5 correct)
- [ ] Redirects to `/dashboard?placement=passed`
- [ ] Success banner displays
- [ ] School card shows "Unlocked" state
- [ ] "Enter Chess School" button works
- [ ] `user.placementStatus` in DB = "passed"
- [ ] Profile helper returns `schoolAccess: "unlocked"`

### After Failing (0-3 correct)
- [ ] Redirects to `/dashboard` with encouragement
- [ ] School card still locked
- [ ] Can click "Take Placement Test" again
- [ ] `user.placementStatus` in DB = "failed"

### Retake Logic (Optional v1)
- [ ] User can retake immediately (or after 24hrs if you add cooldown)
- [ ] `placementAttempts` increments each time
- [ ] Can pass on any attempt

---

## Timeline Estimate

**Effort:** ~2-3 hours for experienced dev

1. **Schema + migration** (10 min)
2. **API route** (20 min)
3. **Profile helper update** (15 min)
4. **Puzzle content JSON** (30 min)
5. **Placement page component** (30 min)
6. **Dashboard banner + SchoolCard updates** (30 min)
7. **Testing + polish** (30 min)

---

## Future Enhancements (v2)

1. **Cooldown:** Can only retake every 24 hours
2. **Analytics:** Track pass rate, common wrong answers
3. **Adaptive difficulty:** Show harder puzzles if user is crushing it
4. **Certificate:** "You've been placed into Chess School - Level X"
5. **Skip Pre-School entirely:** If pass, hide Pre-School card or mark as "Skipped"

---

## Summary

**Current state:** Dashboard + gating works. Placement logic is stubbed.

**Missing piece:** The actual `/school/placement` exam and API to update user status.

**After this:** Your sentence becomes fully true:
> "From the website → dashboard → and from there they can join pre-school, school (if already completed pre-school **OR passed a test**), club."

✅ Website → dashboard → tracks: **Done**  
✅ Pre-School gating: **Done**  
⬜ Placement Test: **Spec ready, needs implementation**  
✅ Club teaser: **Done**

---

**Hand this to Vega when ready. The blueprint is complete.** 🎯
