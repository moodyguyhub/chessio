import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getLessonsByLevel, getExamPuzzlesByLevel } from '@/lib/school/api';
import { SCHOOL_LEVELS } from '@/lib/school/levels';
import LevelDetail from '@/components/school/LevelDetail';

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

  // For v1: allow Level 1, 2, and 3
  if (levelNum !== 1 && levelNum !== 2 && levelNum !== 3) {
    notFound();
  }

  const level = SCHOOL_LEVELS.find(l => l.id === levelNum);
  if (!level) {
    notFound();
  }

  const lessons = await getLessonsByLevel(levelNum);
  const exams = await getExamPuzzlesByLevel(levelNum);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <LevelDetail level={level} lessons={lessons} hasExam={exams.length > 0} />
    </div>
  );
}
