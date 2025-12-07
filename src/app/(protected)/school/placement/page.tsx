import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getPlacementExam } from '@/lib/placement/api';
import { PlacementPageClient } from '@/components/school/PlacementPageClient';

export const metadata = {
  title: 'Placement Test | Chessio School',
  description: 'Prove you are ready for structured chess training.',
};

export default async function PlacementTestPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login?redirect=/school/placement');
  }

  const exam = await getPlacementExam();

  return <PlacementPageClient exam={exam} />;
}
