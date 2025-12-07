# Vega Mega Prompt 2 – Level Map / School Dashboard UI

## Context
You are working on the **Chessio** project (Next.js 16 App Router).
The **School Data Layer** has been implemented (types, loaders, Level 1 content).

**This prompt focuses on building the Level Map / School Dashboard UI.**

## Goal
Build a `/school` page that:
- Lists Levels 0–10 with poetic names
- Shows which levels are unlocked vs locked
- Lets user navigate to lessons within unlocked levels

Think: **"Curriculum map with coach vibes"**

## Requirements

### 1) Create School Dashboard Page

Create `src/app/(protected)/school/page.tsx`:

```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { SCHOOL_LEVELS } from '@/lib/school/levels';
import SchoolDashboard from '@/components/school/SchoolDashboard';

export const metadata = {
  title: 'Chessio School | The Curriculum',
  description: 'Master chess through 11 levels of progressive mastery.',
};

export default async function SchoolPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // For v1: hardcode Level 1 as unlocked
  // Later: fetch from user progress
  const unlockedLevels = [1];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <SchoolDashboard 
        levels={SCHOOL_LEVELS} 
        unlockedLevels={unlockedLevels} 
      />
    </div>
  );
}
```

### 2) Create SchoolDashboard Component

Create `src/components/school/SchoolDashboard.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { LevelMeta } from '@/lib/school/levels';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, ChevronRight } from 'lucide-react';

interface SchoolDashboardProps {
  levels: LevelMeta[];
  unlockedLevels: number[];
}

export default function SchoolDashboard({ levels, unlockedLevels }: SchoolDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          Chessio School
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          "We do not start with openings. We start with the truth."
        </p>
      </div>

      {/* Level List */}
      <div className="space-y-4">
        {levels.map((level) => {
          const isUnlocked = unlockedLevels.includes(level.id);
          
          return (
            <LevelCard
              key={level.id}
              level={level}
              isUnlocked={isUnlocked}
            />
          );
        })}
      </div>
    </div>
  );
}

interface LevelCardProps {
  level: LevelMeta;
  isUnlocked: boolean;
}

function LevelCard({ level, isUnlocked }: LevelCardProps) {
  const CardWrapper = isUnlocked ? Link : 'div';
  const wrapperProps = isUnlocked 
    ? { href: `/school/level/${level.id}` }
    : {};

  return (
    <CardWrapper {...wrapperProps}>
      <Card 
        className={`
          transition-all duration-200
          ${isUnlocked 
            ? 'hover:shadow-lg hover:border-primary cursor-pointer' 
            : 'opacity-60 cursor-not-allowed'
          }
        `}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <CardTitle className="text-xl">
                {level.title}
              </CardTitle>
              {isUnlocked ? (
                <Badge variant="default" className="text-xs">
                  Unlocked
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Locked
                </Badge>
              )}
            </div>
            <CardDescription className="text-base">
              {level.subtitle}
            </CardDescription>
          </div>
          
          {isUnlocked && (
            <ChevronRight className="h-6 w-6 text-muted-foreground" />
          )}
        </CardHeader>
      </Card>
    </CardWrapper>
  );
}
```

### 3) Create Level Detail Page

Create `src/app/(protected)/school/level/[levelId]/page.tsx`:

```typescript
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getLessonsByLevel } from '@/lib/school/api';
import { SCHOOL_LEVELS } from '@/lib/school/levels';
import LevelDetail from '@/components/school/LevelDetail';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ levelId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { levelId } = await params;
  const levelNum = parseInt(levelId, 10);
  const level = SCHOOL_LEVELS.find(l => l.id === levelNum);
  
  return {
    title: level ? `${level.title} | Chessio School` : 'Level | Chessio School',
  };
}

export default async function LevelPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { levelId } = await params;
  const levelNum = parseInt(levelId, 10);

  // For v1: only allow Level 1
  if (levelNum !== 1) {
    notFound();
  }

  const level = SCHOOL_LEVELS.find(l => l.id === levelNum);
  if (!level) {
    notFound();
  }

  const lessons = await getLessonsByLevel(levelNum);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <LevelDetail level={level} lessons={lessons} />
    </div>
  );
}
```

### 4) Create LevelDetail Component

Create `src/components/school/LevelDetail.tsx`:

```typescript
'use client';

import Link from 'next/link';
import { LevelMeta } from '@/lib/school/levels';
import { Lesson } from '@/lib/school/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Trophy } from 'lucide-react';

interface LevelDetailProps {
  level: LevelMeta;
  lessons: Lesson[];
}

export default function LevelDetail({ level, lessons }: LevelDetailProps) {
  return (
    <div className="space-y-8">
      {/* Back button */}
      <Link href="/school">
        <Button variant="ghost" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to School
        </Button>
      </Link>

      {/* Level header */}
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">
          {level.title}
        </h1>
        <p className="text-lg text-muted-foreground">
          {level.subtitle}
        </p>
      </div>

      {/* Lessons list */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Lessons</h2>
        
        {lessons.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No lessons available yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          lessons.map((lesson) => (
            <LessonCard 
              key={lesson.id} 
              lesson={lesson} 
              levelId={level.id}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface LessonCardProps {
  lesson: Lesson;
  levelId: number;
}

function LessonCard({ lesson, levelId }: LessonCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-xl">
              {lesson.title}
            </CardTitle>
            <CardDescription className="text-base">
              {lesson.summary}
            </CardDescription>
          </div>
          
          <Badge variant="secondary" className="ml-4 flex items-center gap-1">
            <Trophy className="h-3 w-3" />
            {lesson.XP} XP
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <Link href={`/school/level/${levelId}/lesson/${lesson.slug}`}>
          <Button className="w-full gap-2">
            <Play className="h-4 w-4" />
            Start Lesson
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
```

### 5) Add Navigation Link (Optional)

If you have a main navigation bar, add a link to `/school`:

```typescript
// In your nav component (e.g., src/components/layout/Navbar.tsx)
<Link href="/school">School</Link>
```

Or add a button on the main dashboard (`/app`) linking to `/school`.

### 6) Styling Adjustments

Ensure the following UI components exist (they should from your design system):
- `<Card>` from `@/components/ui/card`
- `<Badge>` from `@/components/ui/badge`
- `<Button>` from `@/components/ui/button`

If any are missing, create them following shadcn/ui patterns or your existing component library.

### 7) Add Helper Function for Future Progress

Create `src/lib/school/progress.ts` (stub for now):

```typescript
/**
 * Get unlocked levels for a user.
 * For v1: returns [1] (hardcoded)
 * Later: query UserLessonProgress or similar
 */
export async function getUnlockedLevels(userId: string): Promise<number[]> {
  // TODO: implement with real DB logic
  return [1];
}
```

You can import this in the page later when you wire up real progress tracking.

## Definition of Done

✅ `/school` route exists and shows all 11 levels
✅ Level 1 is marked as "Unlocked", all others as "Locked"
✅ Clicking Level 1 navigates to `/school/level/1`
✅ Level 1 detail page shows:
   - Level title & subtitle
   - List of lessons loaded from JSON (3 lessons)
   - Each lesson shows title, summary, XP, and "Start Lesson" button
✅ Clicking "Start Lesson" routes to `/school/level/1/lesson/[slug]` (will be implemented in next prompt)
✅ No TypeScript errors
✅ UI matches Chessio design system (Tailwind + existing components)
✅ Protected routes check for authentication

## Notes

- Follow Chessio conventions (see `.github/copilot-instructions.md`)
- Use existing auth pattern with `auth()` from `@/lib/auth`
- Keep styling consistent with existing pages
- Icons are from `lucide-react`
- For v1, only Level 1 is playable—locked levels are visual placeholders
- The lesson runner will be built in Prompt 3

## Testing

After implementing, verify:
1. Navigate to `/school` while logged in
2. See all 11 levels, only Level 1 unlocked
3. Click Level 1 → see lesson list
4. Each lesson has correct title, summary, XP
5. "Start Lesson" buttons have correct hrefs (even though lesson page doesn't exist yet)
