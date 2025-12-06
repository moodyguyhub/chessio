# AI Operations Manual – Chessio Calm Admin (v1)

**Last Updated**: December 6, 2024  
**Purpose**: Use AI (GPT-4) inside Chessio to make our work clearer and faster, **without** giving up human judgment, tone control, or Calm Dojo principles.

---

## 1. Core Principles

### 1.1 Human Decides, AI Assists

**AI never publishes directly.** It proposes; humans edit and approve.

Every AI interaction:
- Is logged in the database (`AiTask` table)
- Requires human review
- Must be marked as ACCEPTED or REJECTED
- Can be audited later for quality and learning

### 1.2 Calm First, Clever Second

If an AI suggestion feels:
- Hypey ("crush your opponents!")
- Shaming ("stop being bad at chess")
- Noisy or aggressive
- Promising unrealistic results

→ **We discard or rewrite it.**

Calm Dojo voice is: warm, specific, grounded, supportive, anti-competitive.

### 1.3 Single Source of Truth

All prompts live in `/admin/ai` (AiPromptTemplate table).

If you tweak a prompt for your role:
1. Test it
2. Update it in the admin
3. Document why you changed it

This keeps the team aligned on AI behavior.

### 1.4 Traceability

Every AI interaction is stored as an `AiTask`:
- Who requested it (`createdById`)
- What role they used (`role`)
- What context (`scope`, `targetId`)
- What they asked (`input`)
- What AI answered (`output`)
- Whether they used it (`status`: PENDING/ACCEPTED/REJECTED)

This makes AI **auditable and reviewable**.

---

## 2. Model Strategy (Internal Only)

### 2.1 Dual-Model Architecture

Nova uses **two OpenAI models** to balance cost and quality:

| Model | Use Case | Cost | When to Use |
|-------|----------|------|-------------|
| **gpt-4o** | Deep thinking, strategy, architecture | ~$0.01/request | Reasoning-heavy work |
| **gpt-4o-mini** | Routine admin tasks | ~$0.0003/request | 90-95% of requests |

**Routing is automatic** based on scope selection.

### 2.2 Reasoning Scopes (→ gpt-4o)

Use these for **strategic, architectural, or planning work** that benefits from deeper reasoning:

- **Strategy**: Product decisions, roadmap planning, feature evaluation
- **Protocol**: API design, system architecture, technical protocols
- **Architecture**: Database structure, service design, infrastructure decisions
- **Planning**: Long-form planning, sprint breakdowns, resource allocation

**Cost**: ~$5/$15 per 1M tokens (input/output)  
**When it's worth it**: High-stakes decisions where quality >> speed

### 2.3 Utility Scopes (→ gpt-4o-mini)

Use these for **routine content work** where the cheap model is more than sufficient:

- **Freeform**: General questions, quick copy suggestions, brainstorming
- **SEO Page**: Title and meta description suggestions
- **Article**: Content outlines, intro drafts, section ideas
- **Keyword**: Keyword research, intent analysis

**Cost**: ~$0.15/$0.60 per 1M tokens (input/output)  
**When it's enough**: 90%+ of admin tasks

### 2.4 Choosing the Right Scope

**Use Reasoning (gpt-4o) when**:
- Decision has long-term product impact
- Answer will inform multiple features
- Context is complex (architectural, multi-system)
- Stakes are high (user trust, data integrity)

**Use Utility (gpt-4o-mini) when**:
- Task is routine (SEO copy, outlines)
- Speed matters more than perfection
- Human will heavily edit output anyway
- It's exploratory or brainstorming

**Rule of thumb**: If you'd review it 5+ times before using, go Reasoning. If you'd tweak and ship, go Utility.

### 2.5 Cost Awareness

**Weekly budget guidance** (Season 01):
- Admin with ~50 AI requests/week: ~$0.05 (almost free)
- Heavy user with ~200 requests/week: ~$0.20
- Mixed usage (180 utility + 20 reasoning): ~$0.25

Nova is **designed to be cheap** at Chessio's scale. We optimize for:
1. **Quality where it matters** (strategy, architecture)
2. **Speed everywhere else** (content, SEO)
3. **Human judgment always** (AI never auto-publishes)

---

## 3. Roles & Responsibilities

### Product / Strategy
- **Owns**: Product + Writer role prompts
- **Uses AI for**: Planning, copy variants, announcement drafts
- **Responsible for**: Ensuring AI is used where it simplifies work, not where it adds noise
- **Red flag**: If AI starts suggesting features that violate Calm Dojo principles

### SEO Specialist
- **Owns**: SEO role prompts
- **Uses AI for**: Keyword angle exploration, title/description suggestions
- **Responsible for**: Final SEO copy quality, not the model
- **Red flag**: If AI suggests hypey titles or promises ("learn chess in 7 days!")

### Content Writer
- **Owns**: Writer role prompts
- **Uses AI for**: Outlines, intros, alternative phrasings
- **Responsible for**: Final text must sound like Chessio, not a generic blog
- **Red flag**: If AI output feels robotic or uses clichés

### Designer
- **Owns**: Design role prompts
- **Uses AI for**: Copy variants, layout ideas, component descriptions
- **Responsible for**: Design judgment stays human, AI doesn't replace visual thinking
- **Red flag**: If AI suggests complex UI patterns that contradict Calm Dojo simplicity

### Developer / Analytics
- **Owns**: Dev role prompts
- **Uses AI for**: Code suggestions, debugging help, architecture questions
- **Responsible for**: `/api/ai` health, rate limits, logging, security
- **Red flag**: If AI output bypasses review steps or auto-commits to production

---

## 3. How to Use AI in Calm Admin

### 3.1 AI Workbench (`/admin/ai`)

**Purpose**: General-purpose AI console for all 5 roles.

**How to use**:
1. Open `/admin/ai`
2. Select your **role** (Product, SEO, Writer, Designer, Dev)
3. Select **scope**:
   - `freeform`: General question, no context
   - `seoPage`: Will pull SEO page context (use with targetId)
   - `article`: Will pull article idea context (use with targetId)
   - `keyword`: Will pull keyword context (use with targetId)
4. Write your **request** clearly:
   - Good: "Draft a calm announcement for Season 01 launch targeting anxious beginners"
   - Bad: "write announcement"
5. Click **"Ask Nova"**
6. Review the output
7. Mark as **ACCEPTED** (if you used it) or **REJECTED** (if you didn't)

**Best practices**:
- Be specific in your request
- Include context if AI doesn't auto-pull it
- Read the output slowly
- Adapt the tone before using it

**Example requests**:
```
Role: Product
Scope: Freeform
Message: "Draft 3 calm ways to ask users for feedback after completing Level 0"

Role: Writer
Scope: Article
Message: "Suggest 5 subheadings for the section on tactical patterns for anxious beginners"
```

---

### 3.2 SEO Metadata Updates (`/admin/seo`)

**Purpose**: Get AI suggestions for page titles and meta descriptions.

**How to use**:
1. Open `/admin/seo`
2. Find the page you want to optimize (home, login, about)
3. Click **"✨ Ask Nova"** button
4. AI will suggest calm, non-hype title + description
5. Review in the modal
6. **Manually copy/paste** parts you like into the form fields
7. Click **"Save Changes"**

**AI prompt used**:
```
"Suggest a calm, non-hype title and meta description for the [page] page. 
Keep title under 60 chars, description under 160 chars. 
Target anxious adult chess beginners who feel intimidated by competitive play. 
Avoid promises of quick results or aggressive language."
```

**Important**: 
- Never auto-apply AI suggestions
- Always review for tone
- Ensure it matches current page content
- Test in Google search preview tool

---

### 3.3 Article Creation (`/admin/content`)

**Purpose**: Get AI help with outlines and intros for Season 02 content.

**How to use**:

**For Outlines**:
1. Open `/admin/content`
2. Find your article idea
3. Click **"📝 Generate Outline"**
4. Review the suggested structure
5. Copy useful parts into the `notes` field
6. Adapt to your own structure

**For Intros**:
1. Find your article idea
2. Click **"✍️ Draft Intro"**
3. Review the 3-paragraph intro
4. Rewrite in your own voice
5. Use as inspiration, not final copy

**AI prompts used**:
```
Outline: "Create a calm, non-judgmental outline for this article. 
Target audience: anxious adult chess beginners (800-1100 Elo) 
who feel intimidated by competitive play. Use the Calm Dojo voice: 
supportive, specific, and anti-hype. Break down into 4-5 main sections 
with brief descriptions."

Intro: "Write a 3-paragraph intro for this article in the Calm Dojo voice. 
Address why the topic matters to anxious beginners, validate their feelings, 
and set expectations for what they'll learn. No hype, no promises of quick 
results. Tone: warm, specific, grounded."
```

**Workflow**:
1. Product creates `ArticleIdea` (status: DRAFT)
2. Writer clicks "Generate Outline" → adapts in `notes`
3. Writer updates status: DRAFT → OUTLINED
4. Writer clicks "Draft Intro" → rewrites in their editor
5. Writer continues writing → updates status: OUTLINED → WRITING
6. Product reviews → updates status: WRITING → LIVE

---

## 4. Standard Workflows

### Workflow 1: SEO Metadata Refresh

**Scenario**: Jan 6 launch approaching, need to optimize home page for anxious beginners.

**Steps**:
1. SEO opens `/admin/seo`
2. Reviews current title/description for `home` page
3. Clicks **"✨ Ask Nova"**
4. Reviews AI suggestion
5. Adapts wording to be more specific and calm
6. Pastes into form fields
7. Clicks **"Save Changes"**
8. Verifies on `/` page (view source)
9. Marks AiTask as **ACCEPTED** in `/admin/ai`

**Time**: ~5 minutes  
**Quality check**: Does it speak to anxious adults? Is it specific? No hype?

---

### Workflow 2: Article Outline Creation

**Scenario**: Planning "Chess for Anxious Beginners" guide for Season 02.

**Steps**:
1. Product creates `ArticleIdea` in `/admin/content`:
   - Title: "Chess for Anxious Beginners: A Gentle Guide"
   - Keyword: "chess for anxious beginners"
   - Archetype: "True Beginner"
   - Status: DRAFT
2. Writer opens `/admin/content`
3. Clicks **"📝 Generate Outline"**
4. Reviews AI's suggested structure
5. Adapts outline in `notes` field:
   - Adds specific examples
   - Removes generic sections
   - Ensures progression makes sense for anxious learners
6. Updates status: DRAFT → OUTLINED
7. Marks AiTask as **ACCEPTED**

**Time**: ~10 minutes  
**Quality check**: Does the outline address anxiety specifically? Is it beginner-appropriate?

---

### Workflow 3: General AI Query

**Scenario**: Designer needs help describing a calm onboarding modal.

**Steps**:
1. Designer opens `/admin/ai`
2. Selects role: **Designer**
3. Selects scope: **Freeform**
4. Writes request:
   ```
   "Suggest 3 calm, non-pushy ways to explain why users should complete 
   their profile after registering. Context: anxious adult chess learners 
   who might feel judged. Keep it optional, not required."
   ```
5. Clicks **"Ask Nova"**
6. Reviews 3 suggestions
7. Picks favorite, tweaks wording
8. Uses in modal component
9. Marks AiTask as **ACCEPTED**

**Time**: ~3 minutes  
**Quality check**: Does it feel calm? Is it optional, not pushy?

---

## 5. Guardrails & Red Flags

### ❌ We DO NOT ship AI output that:

1. **Promises unrealistic results**
   - "Gain 500 Elo in a week"
   - "Master chess in 30 days"
   - "Crush your opponents fast"

2. **Uses shaming language**
   - "Stop being bad at chess"
   - "Finally learn chess the right way"
   - "Don't embarrass yourself in games"

3. **Encourages addictive play**
   - "Play 10 games daily for rapid improvement"
   - "Compete against others to level up"
   - "Climb the leaderboard now"

4. **Creates anxiety or pressure**
   - "You're falling behind"
   - "Most players at your level..."
   - "Urgent: Complete today's lesson"

### ✅ What to do if you see red flags:

1. **Rewrite it** in Calm Dojo language
2. Mark the AiTask as **REJECTED**
3. Try again with a better instruction
4. If it keeps happening, update the role prompt in `/admin/ai`
5. Alert the team in Slack/Discord

### Example Rewrite:

**AI Output (BAD)**:
> "Master chess tactics fast and crush your opponents with these 5 powerful tricks!"

**Human Rewrite (GOOD)**:
> "5 tactical patterns that help anxious beginners feel more confident in their games"

---

## 6. Quality Standards

Every AI-assisted piece of content must pass these checks:

### Voice Check
- [ ] Sounds like Chessio, not a generic blog
- [ ] Warm and supportive, not cold or robotic
- [ ] Specific examples, not vague advice

### Tone Check
- [ ] No hype or exaggeration
- [ ] No shaming or judgment
- [ ] No pressure or urgency

### Audience Check
- [ ] Speaks to anxious adult beginners
- [ ] Validates their feelings
- [ ] Sets realistic expectations

### Accuracy Check
- [ ] Chess concepts are correct
- [ ] Elo ranges are appropriate
- [ ] Links and references work

If any check fails → **rewrite before publishing**.

---

## 7. Technical Details

### API Endpoint
- **URL**: `/api/ai`
- **Method**: POST
- **Auth**: Admin role required
- **Model**: `gpt-4o-mini` (fast, cost-effective)
- **Rate limit**: None yet (add if needed)

### Request Format
```json
{
  "role": "seo",
  "scope": "seoPage",
  "targetId": "clx123abc",
  "message": "Your request here"
}
```

### Response Format
```json
{
  "success": true,
  "taskId": "clx456def",
  "output": "AI response here"
}
```

### Database Schema
```prisma
model AiTask {
  id          String       @id @default(cuid())
  role        String       // 'product' | 'seo' | 'writer' | 'designer' | 'dev'
  scope       String       // 'seoPage' | 'keyword' | 'article' | 'freeform'
  targetId    String?      // optional context ID
  input       String       // human request
  output      String?      // AI response
  status      AiTaskStatus // PENDING | ACCEPTED | REJECTED
  createdById String
  createdAt   DateTime
  reviewedAt  DateTime?
}
```

---

## 8. Cost Management

**Current model**: `gpt-4o-mini`
- **Cost**: ~$0.15 per 1M input tokens, ~$0.60 per 1M output tokens
- **Avg request**: ~500 tokens input + 500 tokens output = $0.0006
- **100 requests/day**: ~$0.06/day = $1.80/month

**If costs increase**:
1. Switch to `gpt-3.5-turbo` for simple tasks
2. Add caching for repeated requests
3. Set daily limits per user
4. Monitor `AiTask` table for usage patterns

---

## 9. Security & Privacy

### Current Setup
- ✅ Admin-only access (role check)
- ✅ All requests logged
- ✅ No user data sent to OpenAI (only internal content)
- ✅ API key in environment variables

### Future Considerations
- Add rate limiting per user
- Implement request queuing for fairness
- Add content filters for sensitive topics
- Review logs monthly for misuse

---

## 10. Troubleshooting

### "Unauthorized" Error
- Check you're logged in with admin role
- Verify `User.role = 'ADMIN'` in database
- Clear cookies and log in again

### "No prompt template found"
- Run seed script: `npx tsx prisma/seed-admin.ts`
- Check `AiPromptTemplate` table has prompts for all 5 roles

### "OpenAI API key not configured"
- Add `OPENAI_API_KEY` to `.env` and `.env.production.local`
- Restart server after adding env vars
- Get key from https://platform.openai.com/api-keys

### "AI response is off-tone"
- Mark as REJECTED
- Update the role prompt in `/admin/ai` → Prompt Library
- Add specific instructions about Calm Dojo voice
- Test again

### "Task not saving"
- Check browser console for errors
- Verify `/api/ai/task` endpoint is working
- Check database connection

---

## 11. Future Enhancements (Phase 4+)

### Short-term (Next 2-4 weeks)
- [ ] Add caching for repeated requests
- [ ] Implement rate limiting (10 requests/hour per user)
- [ ] Add "Regenerate" button to get alternative suggestions
- [ ] Show token usage and cost estimates

### Medium-term (1-2 months)
- [ ] Rich text editor for article notes
- [ ] AI-suggested images (DALL-E integration)
- [ ] Keyword rank tracking with AI analysis
- [ ] Content calendar with AI writing prompts

### Long-term (3-6 months)
- [ ] Custom fine-tuned model for Calm Dojo voice
- [ ] Automated content grading (checks voice/tone)
- [ ] AI-powered feedback analysis (sentiment, themes)
- [ ] Multi-language support with AI translation

---

## 12. Learning & Iteration

### Monthly Review Process

**What to review**:
1. Query `AiTask` table for the month
2. Look at ACCEPTED vs REJECTED ratio
3. Read sample outputs that were rejected
4. Identify patterns in what works vs what doesn't

**Questions to ask**:
- Are prompts getting better?
- Is tone drift happening?
- Are we overusing AI for certain tasks?
- Are we underusing it for others?

**Actions to take**:
- Update role prompts based on learnings
- Share best practices with team
- Document new workflows
- Adjust quality standards if needed

---

## 13. Support & Feedback

### For Questions
1. Check this manual first
2. Check `/admin/ai` → Recent Tasks for examples
3. Ask in team Slack/Discord
4. Tag Product or Dev lead

### For Bugs
1. Note what you were trying to do
2. Share error message or screenshot
3. Include AiTask ID if available
4. Report to Dev lead

### For Feature Requests
1. Describe the workflow you want to improve
2. Explain how AI could help
3. Suggest a guardrail to keep it calm
4. Share in team channel for discussion

---

**Remember**: AI is a tool, not a replacement for human judgment. When in doubt, trust your instinct and rewrite in your own voice. Calm Dojo voice comes from humans who care, not from models that predict text.

---

Last updated: December 6, 2024  
Next review: January 15, 2025 (post-Season 01 launch)
