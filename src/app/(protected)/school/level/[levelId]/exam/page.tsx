import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getExamPuzzlesByLevel, getFailPatternMap } from '@/lib/school/api';
import { SCHOOL_LEVELS } from '@/lib/school/levels';
import ExamRunner from '@/components/school/ExamRunner';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ levelId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { levelId } = await params;
  const levelNum = parseInt(levelId, 10);
  const level = SCHOOL_LEVELS.find(l => l.id === levelNum);
  
  return {
    title: level ? `${level.title} Exam | Chessio School` : 'Level Exam | Chessio School',
  };
}

export default async function ExamPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const { levelId } = await params;
  const levelNum = parseInt(levelId, 10);

  // For v1: allow Level 1, 2, and 3
  if (levelNum !== 1 && levelNum !== 2 && levelNum !== 3) {
    notFound();
  }

  const level = SCHOOL_LEVELS.find(l => l.id === levelNum);
  if (!level) {
    notFound();
  }

  const puzzles = await getExamPuzzlesByLevel(levelNum);

  // No exam available
  if (puzzles.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <h1 className="text-2xl font-bold">No Exam Available</h1>
            <p className="text-slate-400">
              This level doesn&apos;t have an exam yet. Go back to your lessons.
            </p>
            <Link href={`/school/level/${levelNum}`}>
              <Button>Back to Lessons</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const failPatterns = await getFailPatternMap();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <ExamRunner 
        level={levelNum}
        levelTitle={level.title}
        puzzles={puzzles}
        failPatterns={failPatterns}
      />
    </div>
  );
}
