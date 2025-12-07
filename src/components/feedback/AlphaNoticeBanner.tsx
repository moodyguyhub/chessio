'use client';

import { Alert, AlertDescription } from '@/components/ui/Alert';
import { MessageCircle } from 'lucide-react';

export function AlphaNoticeBanner() {
  return (
    <Alert className="mb-6 border-emerald-500/30 bg-emerald-500/5">
      <MessageCircle className="h-4 w-4 text-emerald-500" />
      <AlertDescription className="text-sm">
        <strong className="font-semibold">You're using an early alpha of Chessio.</strong>
        {' '}Every comment you send to the Coach or in feedback boxes goes straight to the builder. Help us sharpen this school.
      </AlertDescription>
    </Alert>
  );
}
