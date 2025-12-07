import { NextResponse } from 'next/server';
import { withErrorHandling, apiSuccess, apiError } from '@/lib/api-errors';
import { logFeedback } from '@/lib/feedback/log';

export const runtime = 'nodejs';

const SYSTEM_PROMPT = `You are The Coach at The Russian School of Chess — direct, sparse, and demanding, but never cruel. You teach ideas, not just moves.

Your manner:
- Direct and economical with words
- Use metaphor when it clarifies (e.g., "The pawn is a scout, not a soldier")
- No hand-holding or excessive encouragement — students learn by thinking
- Acknowledge when the student sees something real; challenge when they're guessing
- Russian School style: serious, patient, but with high expectations

Your focus:
- Teach underlying principles (e.g., "Control the center because it controls the flanks")
- Help students understand WHY a move works, not just WHAT to do
- Point toward patterns they should recognize (e.g., "This is opposition — king faces king")
- Build intuition, not memorization
- When they're stuck, give a small push toward the idea, not the answer

Examples of your voice:
- "You see the threat, but not the reason. Think about what the rook controls."
- "This is not about checkmate yet. First, improve your position. Where does the king want to be?"
- "Good. You did not guess; you understood."

Keep responses brief (2-4 sentences typically). You are here to guide thinking, not to solve the puzzle for them.`;

interface CoachRequestBody {
  message: string;
  context?: {
    path?: string;
    level?: number;
    lessonSlug?: string;
  };
}

export const POST = withErrorHandling(async (req: Request) => {
  const body: CoachRequestBody = await req.json();

  // Validate message
  if (!body.message || typeof body.message !== 'string') {
    throw new Error('Invalid message');
  }

  const message = body.message.trim();
  if (message.length === 0 || message.length > 2000) {
    throw new Error('Message must be 1-2000 characters');
  }

  // Check for OpenAI API key
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OPENAI_API_KEY not configured — coach chat disabled');
    throw new Error('Coach chat is not configured. Contact support.');
  }

  // Log the question
  await logFeedback({
    source: 'coach_chat',
    text: message,
    level: body.context?.level,
    lessonSlug: body.context?.lessonSlug,
    path: body.context?.path,
    tags: ['coach_question', 'research'],
  });

  // Call OpenAI Chat Completions
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenAI API error:', errorData);
    throw new Error('OpenAI API request failed');
  }

  const data = await response.json();
  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error('No reply from OpenAI');
  }

  // Log the answer
  await logFeedback({
    source: 'coach_chat',
    text: reply,
    level: body.context?.level,
    lessonSlug: body.context?.lessonSlug,
    path: body.context?.path,
    tags: ['coach_answer', 'research'],
  });

  return apiSuccess({ reply });
}, 'coach-chat');
