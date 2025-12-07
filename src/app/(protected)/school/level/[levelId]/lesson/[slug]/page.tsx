import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { getLessonBySlug, getFailPatternMap } from '@/lib/school/api';
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

  // For v1: allow Level 1, 2, and 3
  if (levelNum !== 1 && levelNum !== 2 && levelNum !== 3) {
    notFound();
  }

  const lesson = await getLessonBySlug(levelNum, slug);
  if (!lesson) {
    notFound();
  }

  const level = SCHOOL_LEVELS.find(l => l.id === levelNum);
  const failPatterns = await getFailPatternMap();

  // Define lesson progression paths
  let nextAction: { href: string; label: string } | undefined;
  
  if (levelNum === 1) {
    if (slug === 'check-the-warning') {
      nextAction = {
        href: '/school/level/1/lesson/checkmate-the-execution',
        label: 'Continue to Lesson 2 – Checkmate'
      };
    } else if (slug === 'checkmate-the-execution') {
      nextAction = {
        href: '/school/level/1/lesson/stalemate-the-accident',
        label: 'Continue to Lesson 3 – Stalemate'
      };
    } else if (slug === 'stalemate-the-accident') {
      nextAction = {
        href: '/school/level/1/exam',
        label: 'Take the Level 1 Final Exam'
      };
    }
  } else if (levelNum === 2) {
    if (slug === 'forks-two-targets') {
      nextAction = {
        href: '/school/level/2/lesson/pins-the-nail',
        label: 'Continue to Lesson 2 – Pins (Nailed to the King)'
      };
    } else if (slug === 'pins-the-nail') {
      nextAction = {
        href: '/school/level/2/lesson/skewers-the-burning-line',
        label: 'Continue to Lesson 3 – Skewers (The Burning Line)'
      };
    } else if (slug === 'skewers-the-burning-line') {
      nextAction = {
        href: '/school/level/2/exam',
        label: 'Take the Level 2 Final Exam'
      };
    }
  } else if (levelNum === 3) {
    if (slug === 'pawn-square-the-race') {
      nextAction = {
        href: '/school/level/3/lesson/opposition-the-staring-contest',
        label: 'Continue to Lesson 2 – Opposition (The Staring Contest)'
      };
    } else if (slug === 'opposition-the-staring-contest') {
      nextAction = {
        href: '/school/level/3/lesson/king-and-pawn-the-escort',
        label: 'Continue to Lesson 3 – King and Pawn vs King'
      };
    } else if (slug === 'king-and-pawn-the-escort') {
      nextAction = {
        href: '/school/level/3/exam',
        label: 'Take the Level 3 Final Exam'
      };
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <LessonRunner 
        lesson={lesson} 
        levelTitle={level?.title ?? ''}
        failPatterns={failPatterns}
        nextAction={nextAction}
      />
    </div>
  );
}
