# Feedback & AI Coach v1 — Implementation Summary

## Overview
Complete two-phase feedback and AI coaching system for The Russian School of Chess.

- **Phase F1**: Feedback collection infrastructure (lesson/exam feedback)
- **Phase F2**: AI coach chat widget with OpenAI integration

## New Files Created

### Phase F1: Feedback Infrastructure
- `/src/lib/feedback/types.ts` — Type definitions (FeedbackPayload, FeedbackStored, FeedbackSource, FeedbackDifficulty)
- `/src/lib/feedback/log.ts` — Logging helper with console + optional webhook forwarding
- `/src/components/feedback/LessonFeedback.tsx` — Post-lesson difficulty rating widget (Too Easy/Just Right/Too Hard + optional text)
- `/src/components/feedback/ExamFeedback.tsx` — Post-exam 5-star rating widget + optional text feedback

### Phase F2: AI Coach
- `/src/app/api/coach/route.ts` — OpenAI Chat Completions endpoint with Russian School system prompt
- `/src/components/feedback/CoachChatWidget.tsx` — Floating chat button + conversation panel
- `/src/app/(protected)/school/layout.tsx` — School layout mounting the coach widget

## Modified Files

### Phase F1
- `/src/app/api/feedback/route.ts` — Extended to detect 'source' field and route between new (v1 plumbing) and old (DB-based) feedback systems
- `/src/components/school/LessonComplete.tsx` — Integrated LessonFeedback component at bottom
- `/src/components/school/ExamRunner.tsx` — Integrated ExamFeedback component in ExamComplete view

## Environment Variables

### Required for Coach Chat (Phase F2)
```bash
OPENAI_API_KEY=sk-...                      # Required for /api/coach
OPENAI_MODEL=gpt-4o-mini                   # Optional (default: gpt-4o-mini)
```

### Optional for Webhook Forwarding (Phase F1)
```bash
FEEDBACK_WEBHOOK_URL=https://...           # Generic webhook endpoint
# OR
FEEDBACK_SLACK_WEBHOOK=https://hooks.slack.com/...  # Slack-specific
```

## How It Works

### Phase F1: Feedback Collection

**After Lesson Completion:**
1. User completes lesson → sees LessonComplete screen
2. Feedback widget shows: "How did this lesson feel?" with 3 buttons (Too Easy/Just Right/Too Hard)
3. Optional textarea for additional comments (500 char max)
4. Submit → POST to `/api/feedback` with `{ level, lessonSlug, source: 'lesson', difficulty, text, path, device }`
5. API logs to console + forwards to webhook (if configured)
6. Success message: *"Your honesty trains the school, too. Thank you."*

**After Exam Completion:**
1. User completes exam → sees ExamComplete screen
2. Feedback widget shows: "How did this level feel overall?" with 5-star rating
3. Optional textarea: "What was the most confusing or painful part?" (1000 char max)
4. Submit → POST to `/api/feedback` with `{ level, source: 'exam', rating, text, path, device }`
5. Same logging flow as lesson feedback

**Technical Details:**
- `logFeedback()` generates UUID + ISO timestamp
- Adds `userId` and `sessionId` if available (future enhancement)
- Console log shows full JSON payload
- Optional webhook POST (non-blocking, errors logged but don't fail request)
- Backward compatible with existing DB-based feedback system (checks for 'source' field to route)

### Phase F2: AI Coach

**User Experience:**
1. Floating green button (MessageCircle icon) appears bottom-right on all `/school/*` pages
2. Click → opens chat panel (360px desktop, full-width mobile)
3. Empty state: *"Ask me about chess ideas."* + *"I teach understanding, not just moves."*
4. User types question (max 2000 chars) → press Enter or Send button
5. "Coach is thinking..." appears while waiting for OpenAI response
6. Coach reply appears in chat (2-4 sentence typical length)
7. Conversation history preserved in component state (client-side only, no persistence)

**Technical Flow:**
1. Frontend: `CoachChatWidget` → POST to `/api/coach` with `{ message, context: { path, level?, lessonSlug? } }`
2. Backend:
   - Validate message (1-2000 chars)
   - Check `OPENAI_API_KEY` env var
   - Log question via `logFeedback()` with `source: 'coach_chat'`, `tags: ['coach_question']`
   - Call OpenAI Chat Completions with Russian School system prompt
   - Model: `gpt-4o-mini` (or env override), temp: 0.7, max_tokens: 300
   - Log answer via `logFeedback()` with `tags: ['coach_answer']`
   - Return `{ reply }`
3. Frontend: Display reply in chat panel

**System Prompt (Russian School Coach):**
- Direct, spare, demanding but never cruel
- Teaches ideas not just moves
- Uses metaphors to clarify concepts
- No hand-holding, builds intuition over memorization
- Example voice: *"You see the threat, but not the reason. Think about what the rook controls."*
- Response length: 2-4 sentences typically

## Viewing Feedback Logs

### Console (Development)
```bash
npm run dev
# Complete a lesson or exam → submit feedback
# Check terminal for JSON output:
[Feedback] { id: 'abc-123', source: 'lesson', difficulty: 'just_right', ... }
```

### Webhook (Production)
Set `FEEDBACK_WEBHOOK_URL` or `FEEDBACK_SLACK_WEBHOOK` and configure a receiver:

**Slack Example:**
1. Create incoming webhook in Slack workspace
2. Set `FEEDBACK_SLACK_WEBHOOK=https://hooks.slack.com/services/...`
3. All feedback POSTs to Slack channel as JSON

**Generic Webhook Example:**
1. Set `FEEDBACK_WEBHOOK_URL=https://your-logging-service.com/events`
2. Expects POST with `Content-Type: application/json`
3. Body: `FeedbackStored` object

### Coach Chat Logs
Both questions and answers logged via same `logFeedback()` system:
- Questions: `source: 'coach_chat'`, `tags: ['coach_question']`
- Answers: `source: 'coach_chat'`, `tags: ['coach_answer']`

## How to Disable

### Disable Lesson/Exam Feedback Widgets
Remove from completion screens:
```bash
# Edit these files and comment out feedback component imports/usage:
src/components/school/LessonComplete.tsx
src/components/school/ExamRunner.tsx
```

### Disable Coach Chat Widget
Remove from school layout:
```bash
# Edit this file and comment out CoachChatWidget:
src/app/(protected)/school/layout.tsx
```

### Disable OpenAI Integration
Remove or unset `OPENAI_API_KEY` env var — coach chat will return 503 error with message:
*"Coach chat is not configured. Contact support."*

## Testing

### Manual QA Checklist
- [ ] Complete a Level 1 lesson → submit difficulty feedback → verify console log + webhook
- [ ] Complete a Level 1 exam → submit star rating feedback → verify console log + webhook
- [ ] Click "Ask the Coach" button → send question → verify response appears + both Q&A logged
- [ ] Test coach chat with no `OPENAI_API_KEY` → verify friendly error message
- [ ] Test mobile responsiveness (feedback widgets + chat panel)

### Build Verification
```bash
npm run build    # Should complete without TypeScript errors
```

### Smoke Test
```bash
npm run dev
# 1. Visit /school
# 2. See floating coach button (green, bottom-right)
# 3. Complete first lesson → see feedback widget
# 4. Complete level exam → see feedback widget
# 5. Click coach button → chat opens → send message → verify response
```

## Data Schema

### FeedbackPayload
```typescript
{
  level?: number;                          // Optional (undefined for coach_chat without context)
  lessonSlug?: string;                     // Lesson identifier (undefined for exams)
  source: "lesson" | "exam" | "coach_chat";
  rating?: number;                         // 1-5 for exams
  difficulty?: "too_easy" | "just_right" | "too_hard";  // For lessons
  text?: string;                           // Freeform feedback
  tags?: string[];                         // e.g. ["coach_question"]
  path?: string;                           // Current route
  device?: "mobile" | "desktop" | "unknown";
}
```

### FeedbackStored (extends FeedbackPayload)
```typescript
{
  ...FeedbackPayload,
  id: string;                              // UUID
  createdAt: string;                       // ISO timestamp
  userId?: string;                         // If authenticated
  sessionId?: string;                      // From cookie (future)
}
```

## Future Enhancements (Out of Scope for v1)

- [ ] Persist coach chat conversations to DB
- [ ] Add userId and sessionId to feedback logs (requires session middleware)
- [ ] Coach context awareness (parse level/lesson from path, retrieve lesson content)
- [ ] Feedback analytics dashboard (aggregate difficulty ratings, common pain points)
- [ ] A/B test different coach prompt variations
- [ ] Rate limiting for coach chat (prevent abuse)
- [ ] Coach chat history across sessions (requires user association)

## Acceptance Criteria

✅ **Phase F1 Complete:**
- [x] FeedbackPayload and FeedbackStored types defined
- [x] logFeedback() helper logs to console + optional webhook
- [x] /api/feedback route handles new system (backward compatible with old DB-based system)
- [x] LessonFeedback component with difficulty buttons + textarea
- [x] ExamFeedback component with 5-star rating + textarea
- [x] Both integrated into LessonComplete and ExamRunner

✅ **Phase F2 Complete:**
- [x] /api/coach route with OpenAI Chat Completions integration
- [x] Russian School system prompt implemented
- [x] CoachChatWidget floating button + chat panel
- [x] Widget mounted in school layout (dynamic import, client-side only)
- [x] Both Q&A logged via logFeedback()

✅ **Build & Test:**
- [x] npm run build passes without errors
- [x] All TypeScript types correct
- [x] Backward compatibility with existing feedback system maintained

## Support

For issues or questions:
1. Check console logs for feedback submissions
2. Verify `OPENAI_API_KEY` is set for coach chat
3. Test webhook URL with curl if logs aren't forwarding
4. Check that school layout is being rendered (widget only appears on `/school/*` routes)

---

**Implementation Date:** 2025  
**Status:** ✅ Production Ready  
**Total Files:** 7 new, 3 modified  
**LOC:** ~700 lines
