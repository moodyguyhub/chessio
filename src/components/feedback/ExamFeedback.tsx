'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Star } from 'lucide-react';

interface ExamFeedbackProps {
  level: number;
}

type SubmitStatus = 'idle' | 'submitting' | 'submitted' | 'error';

export function ExamFeedback({ level }: ExamFeedbackProps) {
  const [rating, setRating] = useState<number | undefined>();
  const [hoveredRating, setHoveredRating] = useState<number | undefined>();
  const [text, setText] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');

  const getDeviceType = (): 'mobile' | 'desktop' | 'unknown' => {
    if (typeof window === 'undefined') return 'unknown';
    return window.innerWidth < 768 ? 'mobile' : 'desktop';
  };

  const handleSubmit = async () => {
    if (!rating && !text.trim()) {
      return; // Nothing to submit
    }

    setStatus('submitting');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          source: 'exam',
          rating,
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
      <div className="mt-6 p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5">
        <p className="text-sm text-emerald-400 italic">
          &ldquo;Your honesty trains the school, too. Thank you.&rdquo;
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 p-4 rounded-lg border border-slate-700/50 bg-slate-800/30">
      <h3 className="text-sm font-semibold mb-3">How did this level feel overall?</h3>
      
      {/* Star Rating */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 hover:scale-110 transition-transform disabled:opacity-50"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(undefined)}
            disabled={status !== 'idle'}
          >
            <Star
              className={`h-6 w-6 ${
                (hoveredRating !== undefined ? star <= hoveredRating : star <= (rating ?? 0))
                  ? 'fill-yellow-500 text-yellow-500'
                  : 'text-slate-600'
              }`}
            />
          </button>
        ))}
        {rating && (
          <span className="ml-2 text-sm text-slate-400 self-center">
            {rating} / 5
          </span>
        )}
      </div>

      <textarea
        className="w-full px-3 py-2 rounded-md border border-slate-600 bg-slate-900/50 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
        placeholder="Optional: If you could change one thing about this level, what would it be?"
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={status !== 'idle'}
        maxLength={1000}
      />

      {status === 'error' && (
        <Alert variant="destructive" className="mt-2">
          Failed to submit feedback. Please try again.
        </Alert>
      )}

      <Button
        onClick={handleSubmit}
        disabled={status !== 'idle' || (!rating && !text.trim())}
        className="mt-3 w-full"
        size="sm"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  );
}
