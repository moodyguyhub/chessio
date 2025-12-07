# Research Loop Setup — Living Lab Configuration

## What Changed

Chessio is now a **living research lab** with three feedback channels:

1. **Lesson Feedback** — Difficulty ratings + open-ended confusion notes
2. **Exam Feedback** — 5-star level rating + "one change" improvement ideas  
3. **Coach Chat** — AI conversations that capture student thinking patterns

## 🔧 Production Setup (Do This Now)

### Step 1: Add Environment Variables

```bash
# .env.production or Vercel environment
OPENAI_API_KEY=sk-proj-...                    # Required for coach chat
FEEDBACK_WEBHOOK_URL=https://hooks.slack.com/services/...  # Optional
```

**Webhook Setup (Slack):**
1. Go to https://api.slack.com/apps
2. Create app → "Incoming Webhooks" → Add New Webhook to Workspace
3. Select channel (e.g., `#chessio-feedback`)
4. Copy webhook URL → add as `FEEDBACK_WEBHOOK_URL`

### Step 2: Deploy

```bash
git add .
git commit -m "Add research loop: microcopy + alpha notice + coach greeting"
git push origin main
```

Vercel will auto-deploy with new env vars.

### Step 3: Monitor Your Inbox

All feedback now flows to:
- **Console logs** (Vercel function logs)
- **Slack channel** (if webhook configured)

Each message includes:
```json
{
  "id": "uuid-here",
  "source": "lesson" | "exam" | "coach_chat",
  "level": 1,
  "lessonSlug": "level-1-lesson-1-check",
  "difficulty": "too_hard",
  "text": "I don't understand why this is stalemate",
  "tags": ["research"],
  "path": "/school/level/1/lesson/check",
  "device": "mobile",
  "createdAt": "2025-12-07T..."
}
```

## 📊 What You'll Learn

### Week 1-2: Discovery Phase

**Watch for patterns in:**

1. **Difficulty signals:**
   - "Too Easy" on Level 1 → might need to start harder
   - "Too Hard" on specific lessons → add scaffolding
   - "Just Right" majority → validation

2. **Confusion hotspots:**
   - Repeated terms: "stalemate", "opposition", "fork"
   - UI friction: "couldn't figure out where to click"
   - Instruction gaps: "I don't get what this means"

3. **Coach conversations:**
   - Questions reveal gaps: "What's the difference between check and checkmate?"
   - Misconceptions surface: "Can pawns move backwards?"
   - Interest signals: "Tell me more about endgames"

### Sample Weekly Ritual (15 mins)

```bash
# 1. Export feedback from Slack (last 7 days)
# 2. Drop into three buckets:
```

**Too Easy Bucket:**
- "Level 1 felt like I already knew this"
- "Stalemate was obvious"

**Too Hard/Confusing Bucket:**
- "I don't understand opposition"
- "The fork lesson moved too fast"
- "What does 'zugzwang' mean?"

**Bugs/UX Bucket:**
- "Button didn't work on mobile"
- "Couldn't see the hint"
- "Page froze after exam"

```bash
# 3. For each bucket, pick ONE small fix:
```

**Example fixes:**
- Too Easy → Add "What piece delivers checkmate here?" variation to Lesson 1
- Confusing → Reword opposition instruction: "The king who moves first loses ground"
- Bug → Test mobile hint button behavior

```bash
# 4. Ship as v1.1 patch
# 5. Repeat next week
```

## 🎯 What Success Looks Like

**Month 1:**
- 10-20 feedback submissions
- 2-3 coach conversations
- 3-5 actionable curriculum tweaks identified

**Month 2:**
- Feedback → Changes → Less confusion on those topics
- Coach chat shows deeper questions (sign of engagement)
- "Too Easy/Hard" balance improves (more "Just Right")

**Month 3:**
- Users mention *specific improvements* ("opposition is clearer now")
- Coach becomes study buddy, not just hint machine
- You have a **living curriculum** that responds to learners

## 🧪 Current UX Changes

### 1. Alpha Notice Banner
Appears at top of `/school` page:

> **You're using an early alpha of Chessio.** Every comment you send to the Coach or in feedback boxes goes straight to the builder. Help us sharpen this school.

**Why:** Sets expectations + makes feedback feel impactful.

### 2. Lesson Feedback Microcopy
After completing a lesson:

- Title: "How did this lesson feel?"
- Buttons: Too Easy / Just Right / Too Hard
- Textarea placeholder: "Optional: What was the most confusing or annoying part?"

**Why:** Direct question → specific actionable data.

### 3. Exam Feedback Microcopy
After completing a level exam:

- Title: "How did this level feel overall?"
- 5-star rating
- Textarea placeholder: "Optional: If you could change one thing about this level, what would it be?"

**Why:** One sharp improvement idea beats rambling.

### 4. Coach Chat Improvements
When opening coach chat:

- **Auto-greeting:** "I am your Coach. Ask me about a position, or tell me what felt unclear in this level."
- **Input placeholder:** "Ask me about your position – or tell me what felt confusing so far."

**Why:** Prompts users to share confusion, not just random questions.

### 5. Research Tagging
All coach Q&A now tagged with `["research"]` for easy filtering in logs/Slack.

## 📁 Files Modified

- `/src/components/feedback/LessonFeedback.tsx` — Updated placeholder
- `/src/components/feedback/ExamFeedback.tsx` — Updated placeholder
- `/src/components/feedback/CoachChatWidget.tsx` — Auto-greeting + new placeholder
- `/src/components/feedback/AlphaNoticeBanner.tsx` — New component
- `/src/components/school/SchoolDashboard.tsx` — Added alpha banner
- `/src/app/api/coach/route.ts` — Added "research" tag to logs

## 🚀 Next: Turn Feedback Into Features

Once you have 10+ feedback submissions, **send me a sample batch** (anonymized) and I'll help you:

1. **Identify top 3 curriculum changes** (e.g., "add Task 0 before opposition")
2. **Spot UX friction points** (e.g., "mobile users can't see hints")
3. **Find content gaps** (e.g., "need visual explanation of zugzwang")

Then we'll ship targeted v1.1 improvements based on *real learner pain*.

---

**Status:** ✅ Live in production  
**Monitoring:** Slack #chessio-feedback (or console logs)  
**Weekly Ritual:** 15-min feedback review → 1-3 small fixes  
**Goal:** Build curriculum that **responds to learners**, not assumptions
