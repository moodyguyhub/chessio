# Vega Mega Prompt 1 – Chess School Data Layer

## Context
You are working on the **Chessio** project (Next.js 16 App Router + Prisma + NextAuth).
We're adding a **Chess School curriculum engine** on top of the existing lesson system.

**This prompt focuses ONLY on data structures + loading** (no UI).

## Goal
Create a clean, file-driven **School Data Layer** that:
- Defines TypeScript interfaces for lessons, tasks, exams, secret cards, and fail patterns
- Loads JSON content from a `/data/chessio/` folder
- Is extensible for Levels 0–10

## Requirements

### 1) Define Core Types

Create `src/lib/school/types.ts` with these interfaces:

```typescript
export type MoveString = string; // UCI format like "d1d8" or SAN

export interface LessonTask {
  id: string;
  fen: string;
  prompt: string;
  type: 'move';              // For now, only 'move' tasks
  correctMoves: MoveString[]; // Accepted move(s)
  successMessage?: string;    // Coach line on success
  failPatternIds?: string[];  // IDs referencing FailPattern
}

export interface Lesson {
  id: string;               // "level-1-lesson-1-check"
  level: number;            // 1
  order: number;            // Order inside the level
  slug: string;             // "check-the-warning"
  title: string;            // "Check (The Warning)"
  XP: number;
  coachIntro: string;       // Short wisdom paragraph
  summary: string;          // 1–2 line lesson summary
  tasks: LessonTask[];
  secretCardId?: string;    // ID of SecretCard unlocked on completion
}

export interface ExamPuzzle {
  id: string;
  level: number;
  fen: string;
  prompt: string;
  correctMoves: MoveString[];
  coachOnSuccess: string;
  failPatternIds?: string[];
}

export interface FailPattern {
  id: string;              // "cowards_exit"
  level?: number;
  name: string;            // "The Coward's Exit"
  description: string;     // Internal description for devs
  coachMessage: string;    // What the user sees
}

export interface SecretCard {
  id: string;              // "card_cpr"
  title: string;           // "The Shield of CPR"
  level: number;
  visualId: string;        // Icon / asset key
  text: string;            // 1–3 lines of rule text
}
```

### 2) Create Data Folder Structure

Create this structure:

```
/data/chessio/
  levels/
    level-1/
      lesson-check.json
      lesson-checkmate.json
      lesson-stalemate.json
      exams.json
  secret-cards.json
  fail-patterns.json
```

### 3) Seed Level 1 Content

#### `data/chessio/levels/level-1/lesson-check.json`

```json
{
  "id": "level-1-lesson-1-check",
  "level": 1,
  "order": 1,
  "slug": "check-the-warning",
  "title": "Check (The Warning)",
  "XP": 20,
  "coachIntro": "The King is under attack! He must run, block, or fight. He cannot ignore this.",
  "summary": "Learn the three defenses against check: Capture, Protect, Run (CPR).",
  "tasks": [
    {
      "id": "task1_run",
      "fen": "8/8/8/8/8/8/3k4/3K4 w - - 0 1",
      "prompt": "The King is attacked. Move him to a safe square.",
      "type": "move",
      "correctMoves": ["d1c2", "d1e2"],
      "successMessage": "Run, little King! Live to fight another day.",
      "failPatternIds": ["cowards_exit"]
    }
  ],
  "secretCardId": "card_cpr"
}
```

#### `data/chessio/levels/level-1/lesson-checkmate.json`

```json
{
  "id": "level-1-lesson-2-checkmate",
  "level": 1,
  "order": 2,
  "slug": "checkmate-the-execution",
  "title": "Checkmate (The Execution)",
  "XP": 25,
  "coachIntro": "Check is the warning. Checkmate is the sentence. The King cannot escape.",
  "summary": "Learn to recognize when the King has no escape: capture, protect, or run.",
  "tasks": [
    {
      "id": "task1_back_rank",
      "fen": "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
      "prompt": "White to move. Deliver checkmate.",
      "type": "move",
      "correctMoves": ["d1d8"],
      "successMessage": "His pawns are his shield, but also his coffin. You sealed the door."
    }
  ],
  "secretCardId": "card_back_rank"
}
```

#### `data/chessio/levels/level-1/lesson-stalemate.json`

```json
{
  "id": "level-1-lesson-3-stalemate",
  "level": 1,
  "order": 3,
  "slug": "stalemate-the-accident",
  "title": "Stalemate (The Accident)",
  "XP": 20,
  "coachIntro": "The opponent cannot move, but he is not in check. Nobody wins. This is the accident you must avoid.",
  "summary": "Learn to leave the King room to breathe when you are winning.",
  "tasks": [
    {
      "id": "task1_avoid_stalemate",
      "fen": "8/8/6PK/8/8/8/p7/k7 w - - 0 1",
      "prompt": "White to move. Do NOT stalemate.",
      "type": "move",
      "correctMoves": ["g7"],
      "successMessage": "You left him one square to breathe—now you still win.",
      "failPatternIds": ["suffocator"]
    }
  ],
  "secretCardId": "card_stalemate"
}
```

#### `data/chessio/levels/level-1/exams.json`

```json
[
  {
    "id": "exam_l1_back_rank_trap",
    "level": 1,
    "fen": "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    "prompt": "White to move. Finish him.",
    "correctMoves": ["d1d8"],
    "coachOnSuccess": "His pawns are his shield, but also his coffin; seal the door.",
    "failPatternIds": []
  },
  {
    "id": "exam_l1_stalemate",
    "level": 1,
    "fen": "8/8/6PK/8/8/8/p7/k7 w - - 0 1",
    "prompt": "White to move. Do NOT stalemate.",
    "correctMoves": ["g7"],
    "coachOnSuccess": "You left him one square to breathe—now you still win.",
    "failPatternIds": ["suffocator"]
  }
]
```

#### `data/chessio/secret-cards.json`

```json
[
  {
    "id": "card_cpr",
    "title": "The Shield of CPR",
    "level": 1,
    "visualId": "icon_cpr_shield",
    "text": "When the King is attacked, remember CPR: Capture the attacker, Protect with a shield, or Run away. Look for the capture first."
  },
  {
    "id": "card_back_rank",
    "title": "The Back Rank Trap",
    "level": 1,
    "visualId": "icon_back_rank",
    "text": "When a King is trapped behind his own pawns, a rook on the eighth rank is checkmate. The pawns that protect him become his prison."
  },
  {
    "id": "card_stalemate",
    "title": "The Gift of Breath",
    "level": 1,
    "visualId": "icon_stalemate",
    "text": "When you are winning, leave your opponent one legal move. If he has no moves but is not in check, the game is a draw—stalemate."
  }
]
```

#### `data/chessio/fail-patterns.json`

```json
[
  {
    "id": "cowards_exit",
    "level": 1,
    "name": "The Coward's Exit",
    "description": "Player runs with the King when a simple capture or block exists.",
    "coachMessage": "Why do you run? You have a sword—capture him!"
  },
  {
    "id": "suffocator",
    "level": 1,
    "name": "The Suffocator",
    "description": "Player stalemates the opponent instead of leaving one square.",
    "coachMessage": "You forgot to leave him room to breathe, so now nobody wins."
  }
]
```

### 4) Implement Loader Functions

Create `src/lib/school/api.ts`:

```typescript
import path from 'path';
import fs from 'fs/promises';
import { Lesson, ExamPuzzle, SecretCard, FailPattern } from './types';

const DATA_DIR = path.join(process.cwd(), 'data', 'chessio');

export async function getLessonsByLevel(level: number): Promise<Lesson[]> {
  const levelDir = path.join(DATA_DIR, 'levels', `level-${level}`);
  
  try {
    const files = await fs.readdir(levelDir);
    const lessonFiles = files.filter(f => f.startsWith('lesson-') && f.endsWith('.json'));
    
    const lessons = await Promise.all(
      lessonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(levelDir, file), 'utf-8');
        return JSON.parse(content) as Lesson;
      })
    );
    
    return lessons.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error(`Error loading lessons for level ${level}:`, error);
    return [];
  }
}

export async function getLessonBySlug(level: number, slug: string): Promise<Lesson | null> {
  const lessons = await getLessonsByLevel(level);
  return lessons.find(l => l.slug === slug) || null;
}

export async function getExamPuzzlesByLevel(level: number): Promise<ExamPuzzle[]> {
  const examPath = path.join(DATA_DIR, 'levels', `level-${level}`, 'exams.json');
  
  try {
    const content = await fs.readFile(examPath, 'utf-8');
    return JSON.parse(content) as ExamPuzzle[];
  } catch (error) {
    console.error(`Error loading exams for level ${level}:`, error);
    return [];
  }
}

export async function getSecretCards(): Promise<SecretCard[]> {
  const cardPath = path.join(DATA_DIR, 'secret-cards.json');
  
  try {
    const content = await fs.readFile(cardPath, 'utf-8');
    return JSON.parse(content) as SecretCard[];
  } catch (error) {
    console.error('Error loading secret cards:', error);
    return [];
  }
}

export async function getFailPatterns(): Promise<FailPattern[]> {
  const patternPath = path.join(DATA_DIR, 'fail-patterns.json');
  
  try {
    const content = await fs.readFile(patternPath, 'utf-8');
    return JSON.parse(content) as FailPattern[];
  } catch (error) {
    console.error('Error loading fail patterns:', error);
    return [];
  }
}

export async function getFailPatternMap(): Promise<Record<string, FailPattern>> {
  const patterns = await getFailPatterns();
  return patterns.reduce((acc, pattern) => {
    acc[pattern.id] = pattern;
    return acc;
  }, {} as Record<string, FailPattern>);
}
```

### 5) Create Level Metadata

Create `src/lib/school/levels.ts`:

```typescript
export interface LevelMeta {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
}

export const SCHOOL_LEVELS: LevelMeta[] = [
  { id: 0, slug: "mechanics", title: "Level 0 – Mechanics", subtitle: "How the pieces move." },
  { id: 1, slug: "kings-fate", title: "Level 1 – The King's Fate", subtitle: "Check, mate, and safety." },
  { id: 2, slug: "tactical-eye", title: "Level 2 – The Tactical Eye", subtitle: "Forks, pins, skewers." },
  { id: 3, slug: "truth-endgames", title: "Level 3 – The Truth", subtitle: "Endgames first, always." },
  { id: 4, slug: "opening-development", title: "Level 4 – The Opening", subtitle: "Principles, not memorization." },
  { id: 5, slug: "strategic-mastermind", title: "Level 5 – The Strategic Mastermind", subtitle: "Good pieces, bad pieces." },
  { id: 6, slug: "competitive-mind", title: "Level 6 – The Competitive Mind", subtitle: "Prophylaxis, trading, psychology." },
  { id: 7, slug: "science-of-calculation", title: "Level 7 – The Science of Calculation", subtitle: "Candidates, forcing moves, zwischenzug." },
  { id: 8, slug: "positional-mastery", title: "Level 8 – The Positional Mastery", subtitle: "Color complexes, space, initiative." },
  { id: 9, slug: "endgame-virtuoso", title: "Level 9 – The Endgame Virtuoso", subtitle: "Lucena, Philidor, rook technique." },
  { id: 10, slug: "graduation", title: "Level 10 – The Graduation", subtitle: "A full game vs the Hustler." }
];
```

### 6) Create Test Script

Create `scripts/test-school-data.ts`:

```typescript
import { getLessonsByLevel, getExamPuzzlesByLevel, getSecretCards, getFailPatterns } from '../src/lib/school/api';

async function main() {
  console.log('🏫 Testing School Data Layer\n');
  
  const lessons = await getLessonsByLevel(1);
  console.log(`✅ Level 1 Lessons: ${lessons.length}`);
  lessons.forEach(l => console.log(`   - ${l.title} (${l.slug})`));
  
  const exams = await getExamPuzzlesByLevel(1);
  console.log(`\n✅ Level 1 Exams: ${exams.length}`);
  
  const cards = await getSecretCards();
  console.log(`\n✅ Secret Cards: ${cards.length}`);
  cards.forEach(c => console.log(`   - ${c.title}`));
  
  const patterns = await getFailPatterns();
  console.log(`\n✅ Fail Patterns: ${patterns.length}`);
  patterns.forEach(p => console.log(`   - ${p.name}`));
}

main().catch(console.error);
```

Add to `package.json`:

```json
{
  "scripts": {
    "test:school-data": "tsx scripts/test-school-data.ts"
  }
}
```

## Definition of Done

✅ Types defined in `src/lib/school/types.ts`
✅ Data folder structure created with Level 1 content
✅ Loader functions implemented in `src/lib/school/api.ts`
✅ Test script runs without errors: `npm run test:school-data`
✅ Can import and use:
   - `const lessons = await getLessonsByLevel(1);`
   - `const exams = await getExamPuzzlesByLevel(1);`
   - `const cards = await getSecretCards();`
✅ No TypeScript compilation errors

## Notes

- Follow existing Chessio conventions (see `.github/copilot-instructions.md`)
- Use Node.js runtime (not Edge) for any API routes
- Keep error handling clean (don't leak implementation details)
- This is foundational—UI comes in next prompts
