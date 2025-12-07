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
