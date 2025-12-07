import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSecretCards } from '@/lib/school/api';
import NotebookGallery from '@/components/school/NotebookGallery';

export const metadata = {
  title: "Coach's Notebook | Chessio School",
  description: 'Your collection of chess wisdom',
};

export default async function NotebookPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const allCards = await getSecretCards();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Coach&apos;s Notebook</h1>
          <p className="text-slate-400 text-lg">
            Every lesson teaches a truth. Collect them all.
          </p>
        </div>

        {/* Card Gallery */}
        <NotebookGallery cards={allCards} />
      </div>
    </div>
  );
}
