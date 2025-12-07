'use client';

import { useEffect, useState } from 'react';
import { SecretCard } from '@/lib/school/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Lock, Sparkles } from 'lucide-react';
import { getUnlockedSecretCards } from '@/lib/school/progress';
import Link from 'next/link';

interface NotebookGalleryProps {
  cards: SecretCard[];
}

export default function NotebookGallery({ cards }: NotebookGalleryProps) {
  const [unlockedCardIds, setUnlockedCardIds] = useState<string[]>([]);

  useEffect(() => {
    setUnlockedCardIds(getUnlockedSecretCards());
  }, []);

  const unlockedCount = unlockedCardIds.length;
  const totalCount = cards.length;

  return (
    <div className="space-y-8">
      {/* Progress Stats */}
      <Card className="bg-slate-800/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Collection Progress</p>
              <p className="text-2xl font-bold">
                {unlockedCount} / {totalCount} Cards
              </p>
            </div>
            <Sparkles className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => {
          const isUnlocked = unlockedCardIds.includes(card.id);
          
          return (
            <Card 
              key={card.id}
              className={
                isUnlocked 
                  ? 'border-yellow-500/30 bg-yellow-500/5' 
                  : 'border-slate-700 bg-slate-800/30 opacity-60'
              }
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg flex-1">
                    {isUnlocked ? card.title : '???'}
                  </CardTitle>
                  <Badge variant={isUnlocked ? 'default' : 'secondary'}>
                    {isUnlocked ? <Sparkles className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {isUnlocked ? (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-300 italic">
                      &ldquo;{card.text}&rdquo;
                    </p>
                    <p className="text-xs text-slate-500">
                      Level {card.level}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-500">
                      Complete lessons to unlock this secret...
                    </p>
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-slate-600" />
                      <p className="text-xs text-slate-600">Locked</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Back Button */}
      <div className="flex justify-center pt-4">
        <Link href="/school">
          <Button variant="outline" size="lg">
            Back to School
          </Button>
        </Link>
      </div>
    </div>
  );
}
