# Vega Mega Prompt 3 – Lesson Runner for Level 1

## Context
You are working on the **Chessio** project (Next.js 16 App Router).
The **School Data Layer** and **Level Map UI** are complete.

**This prompt focuses on building the interactive Lesson Runner** that:
- Plays through a lesson's tasks one by one
- Shows the chessboard and validates moves
- Displays Coach success/fail messages
- Unlocks Secret Cards on completion

## Goal
Implement `/school/level/[levelId]/lesson/[slug]` with:
- Interactive chessboard from task FEN
- Move validation against `correctMoves`
- Coach feedback system
- Lesson completion + Secret Card unlock

## Requirements

### 1) Create Lesson Page Route

Create `src/app/(protected)/school/level/[levelId]/lesson/[slug]/page.tsx`:

```typescript
import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getLessonBySlug } from '@/lib/school/api';
import { SCHOOL_LEVELS } from '@/lib/school/levels';
import LessonRunner from '@/components/school/LessonRunner';

interface PageProps {
  params: Promise<{ levelId: string; slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { levelId, slug } = await params;
  const levelNum = parseInt(levelId, 10);
  const lesson = await getLessonBySlug(levelNum, slug);
  
  return {
    title: lesson ? `${lesson.title} | Chessio School` : 'Lesson | Chessio School',
  };
}

export default async function LessonPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { levelId, slug } = await params;
  const levelNum = parseInt(levelId, 10);

  // For v1: only allow Level 1
  if (levelNum !== 1) {
    notFound();
  }

  const lesson = await getLessonBySlug(levelNum, slug);
  if (!lesson) {
    notFound();
  }

  const level = SCHOOL_LEVELS.find(l => l.id === levelNum);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <LessonRunner 
        lesson={lesson} 
        levelTitle={level?.title ?? ''}
      />
    </div>
  );
}
```

### 2) Create LessonRunner Component

Create `src/components/school/LessonRunner.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Lesson, LessonTask } from '@/lib/school/types';
import Chessboard from '@/components/chess/Chessboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { unlockSecretCard } from '@/lib/school/progress';
import LessonComplete from './LessonComplete';

interface LessonRunnerProps {
  lesson: Lesson;
  levelTitle: string;
}

type FeedbackType = 'success' | 'error' | 'idle';

export default function LessonRunner({ lesson, levelTitle }: LessonRunnerProps) {
  const [taskIndex, setTaskIndex] = useState(0);
  const [feedback, setFeedback] = useState<{ type: FeedbackType; message: string }>({
    type: 'idle',
    message: '',
  });
  const [isComplete, setIsComplete] = useState(false);

  const currentTask = lesson.tasks[taskIndex];
  const isLastTask = taskIndex === lesson.tasks.length - 1;

  const handleMove = (from: string, to: string) => {
    if (!currentTask) return;

    // Convert to UCI format: "e2e4"
    const moveUCI = from + to;

    // Check if move is correct
    const isCorrect = currentTask.correctMoves.some(
      (correctMove) => correctMove.toLowerCase() === moveUCI.toLowerCase()
    );

    if (isCorrect) {
      // Success!
      const successMsg = currentTask.successMessage || 'Excellent. Move to the next task.';
      setFeedback({ type: 'success', message: successMsg });

      // Move to next task after a short delay
      setTimeout(() => {
        if (isLastTask) {
          handleLessonComplete();
        } else {
          setTaskIndex((prev) => prev + 1);
          setFeedback({ type: 'idle', message: '' });
        }
      }, 2000);
    } else {
      // Fail
      // TODO: In next iteration, check failPatternIds for specific messages
      setFeedback({
        type: 'error',
        message: 'Not quite. Try again.',
      });
    }
  };

  const handleLessonComplete = () => {
    // Unlock secret card if exists
    if (lesson.secretCardId) {
      unlockSecretCard(lesson.secretCardId);
    }
    setIsComplete(true);
  };

  if (isComplete) {
    return (
      <LessonComplete
        lesson={lesson}
        levelTitle={levelTitle}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/school/level/${lesson.level}`}>
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {levelTitle}
          </Button>
        </Link>

        <Badge variant="secondary">
          Task {taskIndex + 1} of {lesson.tasks.length}
        </Badge>
      </div>

      {/* Lesson intro (only on first task) */}
      {taskIndex === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{lesson.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground italic">
              "{lesson.coachIntro}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Task area */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chessboard */}
        <Card>
          <CardContent className="pt-6">
            <Chessboard
              fen={currentTask.fen}
              onMove={handleMove}
              interactiveMode="move"
            />
          </CardContent>
        </Card>

        {/* Instructions & Feedback */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Task</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{currentTask.prompt}</p>
            </CardContent>
          </Card>

          {/* Feedback */}
          {feedback.type !== 'idle' && (
            <Alert variant={feedback.type === 'success' ? 'default' : 'destructive'}>
              <AlertDescription className="text-base">
                {feedback.message}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 3) Create LessonComplete Component

Create `src/components/school/LessonComplete.tsx`:

```typescript
'use client';

import { useEffect, useState } from 'react';
import { Lesson, SecretCard } from '@/lib/school/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface LessonCompleteProps {
  lesson: Lesson;
  levelTitle: string;
}

export default function LessonComplete({ lesson, levelTitle }: LessonCompleteProps) {
  const [secretCard, setSecretCard] = useState<SecretCard | null>(null);

  useEffect(() => {
    // Fetch secret card data if unlocked
    if (lesson.secretCardId) {
      fetch('/api/school/secret-cards')
        .then((res) => res.json())
        .then((cards) => {
          const card = cards.find((c: SecretCard) => c.id === lesson.secretCardId);
          if (card) setSecretCard(card);
        })
        .catch(console.error);
    }
  }, [lesson.secretCardId]);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Success header */}
      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Lesson Complete!</h1>
              <p className="text-lg text-muted-foreground">
                {lesson.summary}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              +{lesson.XP} XP
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Secret Card unlock */}
      {secretCard && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-xl">Secret Rule Unlocked</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <h3 className="font-semibold text-lg">{secretCard.title}</h3>
            <p className="text-muted-foreground">{secretCard.text}</p>
          </CardContent>
        </Card>
      )}

      {/* Coach message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">The Coach says...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="italic text-muted-foreground">
            "Good. You now understand the warning. Next, we study the execution."
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex gap-4">
        <Link href={`/school/level/${lesson.level}`} className="flex-1">
          <Button variant="outline" className="w-full">
            Back to Lessons
          </Button>
        </Link>
        <Link href="/school" className="flex-1">
          <Button className="w-full gap-2">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
```

### 4) Create Progress Helper Functions

Create `src/lib/school/progress.ts`:

```typescript
/**
 * Client-side progress tracking for v1
 * Uses localStorage for simplicity
 * Later: migrate to DB with UserLessonProgress
 */

const STORAGE_KEY_CARDS = 'chessio_unlocked_cards';
const STORAGE_KEY_LESSONS = 'chessio_completed_lessons';

export function unlockSecretCard(cardId: string): void {
  if (typeof window === 'undefined') return;
  
  const unlocked = getUnlockedSecretCards();
  if (!unlocked.includes(cardId)) {
    unlocked.push(cardId);
    localStorage.setItem(STORAGE_KEY_CARDS, JSON.stringify(unlocked));
  }
}

export function getUnlockedSecretCards(): string[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_CARDS);
  return stored ? JSON.parse(stored) : [];
}

export function markLessonComplete(lessonId: string): void {
  if (typeof window === 'undefined') return;
  
  const completed = getCompletedLessons();
  if (!completed.includes(lessonId)) {
    completed.push(lessonId);
    localStorage.setItem(STORAGE_KEY_LESSONS, JSON.stringify(completed));
  }
}

export function getCompletedLessons(): string[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY_LESSONS);
  return stored ? JSON.parse(stored) : [];
}

export function isLessonComplete(lessonId: string): boolean {
  return getCompletedLessons().includes(lessonId);
}

/**
 * Get unlocked levels for a user.
 * For v1: returns [1] (hardcoded)
 * Later: calculate based on completed lessons
 */
export async function getUnlockedLevels(userId: string): Promise<number[]> {
  // TODO: implement with real DB logic
  return [1];
}
```

### 5) Create Secret Cards API Route

Create `src/app/api/school/secret-cards/route.ts`:

```typescript
import { getSecretCards } from '@/lib/school/api';
import { apiSuccess, withErrorHandling } from '@/lib/api-errors';

export const runtime = 'nodejs';

export const GET = withErrorHandling(async () => {
  const cards = await getSecretCards();
  return apiSuccess({ cards });
}, 'get-secret-cards');
```

### 6) Update Chessboard Component (If Needed)

Your existing `Chessboard` component should accept:

```typescript
interface ChessboardProps {
  fen?: string;
  onMove?: (from: string, to: string) => void;
  interactiveMode?: 'move' | 'select' | 'none';
  highlightSquares?: string[];
  selectedSquare?: string | null;
}
```

If your current implementation differs:
- Add `fen` prop to set position
- Ensure `onMove` callback receives `from` and `to` as square strings (e.g., "e2", "e4")
- Add `interactiveMode` prop to enable/disable interaction

Example minimal adapter (if needed):

```typescript
// In Chessboard.tsx
useEffect(() => {
  if (fen) {
    const chess = new Chess(fen);
    // Update internal board state
  }
}, [fen]);

const handleSquareClick = (square: string) => {
  if (!selectedSquare) {
    setSelectedSquare(square);
  } else {
    // Attempt move
    onMove?.(selectedSquare, square);
    setSelectedSquare(null);
  }
};
```

### 7) Wire Up Alert Component (If Missing)

If `<Alert>` doesn't exist, create `src/components/ui/alert.tsx`:

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
```

## Definition of Done

✅ Route `/school/level/1/lesson/check-the-warning` loads and displays:
   - Lesson title & coach intro
   - Interactive chessboard with FEN from first task
   - Task prompt
✅ Making a correct move (e.g., `d1c2`):
   - Shows success message from task data
   - Advances to next task after delay
   - If last task, shows Lesson Complete screen
✅ Making an incorrect move:
   - Shows error feedback
   - Board resets (or move is prevented)
✅ Completing all tasks:
   - Shows LessonComplete component
   - Displays +XP badge
   - Shows Secret Card unlock animation/card
   - Secret Card data is fetched from API
   - Card ID is saved to localStorage
✅ Navigation works:
   - "Back" button returns to level detail
   - "Continue" button returns to school dashboard
✅ No TypeScript errors
✅ Component is reusable for all Level 1 lessons

## Testing Checklist

After implementation:
1. ✅ Navigate to `/school/level/1`
2. ✅ Click "Start Lesson" on "Check (The Warning)"
3. ✅ See chessboard with correct FEN
4. ✅ Click a king square, then click a valid destination
5. ✅ Verify success message appears
6. ✅ Task advances automatically
7. ✅ Complete all tasks
8. ✅ See completion screen with XP and Secret Card
9. ✅ Verify card is saved (check localStorage in DevTools)
10. ✅ Test navigation buttons

## Notes

- Follow Chessio conventions (see `.github/copilot-instructions.md`)
- Use existing chess utilities from `@/lib/chess` if helpful
- For v1, move validation is simple UCI string matching
- Fail patterns will be integrated in a future prompt
- Keep Coach messages prominent and impactful
- Secret Card unlock should feel rewarding (consider subtle animation)
- localStorage is temporary—will migrate to DB in next phase

## Future Enhancements (Not in This Prompt)

- ❌ Fail pattern detection (Prompt 5)
- ❌ Hint system
- ❌ Sound effects
- ❌ XP animation
- ❌ Progress persistence to DB
- ❌ Lesson replay
