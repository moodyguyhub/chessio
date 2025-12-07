# 🚀 Deployment Checklist — Research Loop v1

## ✅ Code Deployed
- [x] Pushed to GitHub: commit `5863713`
- [ ] Vercel auto-deploy complete (check dashboard)
- [ ] Production build successful

## 🔧 Environment Variables (Do This Now)

### Required for AI Coach
Go to **Vercel Dashboard → chessio → Settings → Environment Variables**

Add:
```
OPENAI_API_KEY=sk-proj-...
```

Get from: https://platform.openai.com/api-keys

**Without this:** Coach chat will return "not configured" error (feedback still works)

### Optional for Feedback Webhook
Add:
```
FEEDBACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/HERE
```

**How to get Slack webhook:**
1. Go to https://api.slack.com/apps
2. "Create New App" → "From scratch"
3. Choose workspace + create
4. "Incoming Webhooks" → Activate → "Add New Webhook to Workspace"
5. Select channel (create `#chessio-feedback` first)
6. Copy webhook URL → paste into Vercel

**Without this:** Feedback logs to console only (still works, just harder to monitor)

## 🧪 Post-Deploy Testing

### 1. Smoke Test (5 mins)
- [ ] Visit production URL
- [ ] Go to `/school` — see alpha notice banner
- [ ] Click Level 1 → 3 lessons visible
- [ ] Start "Check" lesson → complete Task 1
- [ ] See green coach button (bottom-right)
- [ ] Click coach → chat opens with greeting

### 2. Feedback Flow Test (10 mins)
- [ ] Complete a full lesson
- [ ] Submit difficulty feedback (click "Just Right")
- [ ] Check Slack channel for log (or Vercel function logs)
- [ ] Complete Level 1 exam
- [ ] Submit 5-star rating
- [ ] Check Slack/logs again

### 3. Coach Chat Test (5 mins)
- [ ] Click green coach button
- [ ] Ask: "What's the difference between check and checkmate?"
- [ ] Verify response appears (2-4 sentences, Russian School style)
- [ ] Check Slack/logs for Q&A pair (tagged with "research")

### 4. Multi-Level Test (5 mins)
- [ ] Complete all Level 1 lessons + exam
- [ ] Check Level 2 unlocks (no longer greyed out)
- [ ] Start Level 2 lesson
- [ ] Verify coach still works
- [ ] Complete Level 2 → verify Level 3 unlocks

## 📊 Where to Monitor Feedback

### Option 1: Slack (Recommended)
- Create `#chessio-feedback` channel
- All submissions appear as JSON messages
- Easy to scan patterns

### Option 2: Vercel Function Logs
- Dashboard → Deployments → Latest → Functions
- Click `/api/feedback` or `/api/coach`
- View real-time logs (console output)

### Option 3: Export Weekly
```bash
# From Slack: Export last 7 days
# Or from Vercel: Download function logs
# Drop into analysis doc
```

## 🎯 First Week Goals

**Traffic:** Let 10-20 people use the school

**Data Collection:**
- 5-10 lesson feedback submissions
- 5-10 exam ratings
- 2-5 coach conversations

**Analysis:** Run first pattern check using `FEEDBACK_ANALYSIS_CHEATSHEET.md`

## 🔥 If Something Breaks

### Coach chat returns error
**Check:**
1. Is `OPENAI_API_KEY` set in Vercel?
2. Does key have credits? (check OpenAI dashboard)
3. Vercel function logs show actual error?

**Quick fix:** Unset `OPENAI_API_KEY` to disable coach (feedback still works)

### Feedback not appearing in Slack
**Check:**
1. Is `FEEDBACK_WEBHOOK_URL` correct?
2. Test webhook with curl:
```bash
curl -X POST YOUR_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text": "Test from Chessio"}'
```
3. Check Vercel function logs for POST errors

**Quick fix:** Remove webhook URL, use Vercel logs instead

### Build failed on Vercel
**Check:**
1. Vercel dashboard → Deployments → Failed build logs
2. Run `npm run build` locally to reproduce
3. Check environment variables are set

**Quick fix:** Redeploy previous working commit while debugging

## 📅 Weekly Ritual (Starting Week 2)

**Every Monday, 15 minutes:**

1. Export last 7 days of feedback from Slack
2. Copy into doc with 3 buckets: Too Easy / Too Hard / Bugs
3. Pick 1-3 patterns that repeat 3+ times
4. Create tiny fixes (reword instruction, split lesson, add hint)
5. Ship as v1.x patch
6. Repeat next week

## 🎓 What You Built

- **9 lessons** (check, mate, stale, fork, pin, skewer, pawn square, opposition, K+P)
- **3 exams** (21 puzzles total)
- **9 secret cards** (drip-fed rewards)
- **16 fail patterns** (contextual feedback)
- **645 XP** available across 3 levels
- **AI Coach** with Russian School personality
- **Feedback system** capturing difficulty + confusion
- **Research loop** turning users into curriculum trainers

## 🚀 Current Status

- [x] Code pushed to GitHub
- [ ] **YOU DO NOW:** Add `OPENAI_API_KEY` to Vercel
- [ ] **YOU DO NOW:** Add `FEEDBACK_WEBHOOK_URL` (optional)
- [ ] **THEN:** Run post-deploy tests
- [ ] **THEN:** Watch feedback flow for 1 week
- [ ] **THEN:** First analysis pass

---

**Next:** Once env vars are set, run through the smoke tests above and confirm everything works in production. Then you're live! 🎉
