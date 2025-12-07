'use client';

import dynamic from 'next/dynamic';

// Dynamic import with no SSR for client-only widget
const CoachChatWidget = dynamic(
  () => import('@/components/feedback/CoachChatWidget').then((mod) => mod.CoachChatWidget),
  { ssr: false }
);

export default function SchoolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <CoachChatWidget />
    </>
  );
}
