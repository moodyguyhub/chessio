'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { FeedbackDifficulty } from '@/lib/feedback/types';
import { collapseIn } from '@/lib/motion';

interface LessonFeedbackProps {
  level: number;
  lessonSlug: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'submitted' | 'error';

export function LessonFeedback({ level, lessonSlug }: LessonFeedbackProps) {
  const [difficulty, setDifficulty] = useState<FeedbackDifficulty | undefined>();
  const [text, setText] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const shouldReduceMotion = useReducedMotion();

  const getDeviceType = (): 'mobile' | 'desktop' | 'unknown' => {
    if (typeof window === 'undefined') return 'unknown';
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  };

  const handleSubmit = async () => {
    if (!difficulty && !text.trim()) {
      return; // Nothing to submit
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          lessonSlug,
          source: 'lesson',
          difficulty,
          text: text.trim() || undefined,
          path: window.location.pathname,
          device: getDeviceType(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setStatus('submitted');
    } catch (err) {
      console.error('Feedback submission error:', err);
      setStatus('error');
    }
  };

  if (status === 'submitted') {
    return (
      <motion.div
        className="mt-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <p className="text-sm text-emerald-400 italic">
          &ldquo;Your honesty trains the school, too. Thank you.&rdquo;
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="mt-6 p-4 rounded-lg border border-slate-700/50 bg-slate-800/30"
      variants={shouldReduceMotion ? undefined : collapseIn}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-sm font-semibold mb-3">How did this lesson feel?</h3>
      
      <div className="flex gap-2 mb-3">
        <Button
          variant={difficulty === 'too_easy' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setDifficulty('too_easy')}
          disabled={status !== 'idle'}
        >
          Too Easy
        </Button>
        <Button
          variant={difficulty === 'just_right' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setDifficulty('just_right')}
          disabled={status !== 'idle'}
        >
          Just Right
        </Button>
        <Button
          variant={difficulty === 'too_hard' ? 'primary' : 'outline'}
          size="sm"
          onClick={() => setDifficulty('too_hard')}
          disabled={status !== 'idle'}
        >
          Too Hard
        </Button>
      </div>

      <textarea
        className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-900/50 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
        placeholder="Optional: What was the most confusing or annoying part?"
        rows={2}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={status !== 'idle'}
        maxLength={500}
      />

      {status === 'error' && (
        <Alert variant="destructive" className="mt-2">
          Failed to submit feedback. Please try again.
        </Alert>
      )}

      <Button
        onClick={handleSubmit}
        disabled={status !== 'idle' || (!difficulty && !text.trim())}
        className="mt-3 w-full"
        size="sm"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit'}
      </Button>
    </motion.div>
  );
}
