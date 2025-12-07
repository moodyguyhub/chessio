'use client';

import { useEffect, useState } from 'react';
import { Lesson, SecretCard } from '@/lib/school/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { LessonFeedback } from '@/components/feedback/LessonFeedback';

interface LessonCompleteProps {
  lesson: Lesson;
  levelTitle: string;
  nextAction?: {
    href: string;
    label: string;
  };
}

export default function LessonComplete({ lesson, nextAction }: LessonCompleteProps) {
  const [secretCard, setSecretCard] = useState<SecretCard | null>(null);

  useEffect(() => {
    // Fetch secret card data if unlocked
    if (lesson.secretCardId) {
      fetch('/api/school/secret-cards')
        .then((res) => res.json())
        .then((data) => {
          const card = data.cards?.find((c: SecretCard) => c.id === lesson.secretCardId);
          if (card) setSecretCard(card);
        })
        .catch(console.error);
    }
  }, [lesson.secretCardId]);

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Success header */}
      <Card className="border-green-500/50 bg-green-500/5">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Lesson Complete!</h1>
              <p className="text-lg text-slate-400">
                {lesson.summary}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              +{lesson.XP} XP
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Secret Card unlock */}
      {secretCard && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-xl">Secret Rule Unlocked</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{secretCard.title}</h3>
              <p className="text-slate-400">{secretCard.text}</p>
            </div>
            <Link href="/school/notebook">
              <Button variant="outline" size="sm" className="gap-2">
                View Collection
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Coach message */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">The Coach says...</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="italic text-slate-400">
            &ldquo;Good. You now understand the warning. Next, we study the execution.&rdquo;
          </p>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex flex-col gap-4">
        {/* Primary Next Action - if provided */}
        {nextAction && (
          <Link href={nextAction.href}>
            <Button className="w-full gap-2 text-lg py-6">
              {nextAction.label}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        )}
        
        {/* Secondary actions */}
        <div className="flex gap-4">
          <Link href={`/school/level/${lesson.level}`} className="flex-1">
            <Button variant="outline" className="w-full">
              Back to Lessons
            </Button>
          </Link>
          <Link href="/school" className="flex-1">
            <Button variant={nextAction ? "outline" : "primary"} className="w-full gap-2">
              {nextAction ? "Back to School" : "Continue"}
              {!nextAction && <ArrowRight className="h-4 w-4" />}
            </Button>
          </Link>
        </div>
      </div>

      {/* Lesson Feedback */}
      <LessonFeedback level={lesson.level} lessonSlug={lesson.slug} />
    </div>
  );
}
