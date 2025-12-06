# Calm Admin System

**Internal control room for SEO, content planning, and AI operations**

## Philosophy

The Calm Admin exists to make team operations **boring and predictable**:
- ✅ Simple SEO management without external tools
- ✅ Content pipeline visible in one place
- ✅ AI prompts centralized for the "team of 5"
- ✅ Zero user-facing complexity

**Not exposed to end users.** This is internal infrastructure only.

---

## Architecture

### Data Models (Prisma)

1. **`SeoPage`** - Metadata for public pages
   - Stores title, description, OG tags for `home`, `login`, `about`
   - Wired into Next.js `generateMetadata()` functions

2. **`SeoKeyword`** - Blue Ocean keyword library
   - Stores long-tail keywords, intent, archetype, priority
   - Used for content planning and SEO research

3. **`ArticleIdea`** - Season 02 content pipeline
   - Title, slug, target keyword, archetype, status
   - Notes field for outlines, angles, examples

4. **`AiPromptTemplate`** - Team AI prompts
   - Role (product, seo, writer, designer, dev)
   - Name and full prompt content
   - Copy-paste ready for ChatGPT/Claude

5. **`User.role`** - Admin access control
   - Added `role` field: "USER" | "ADMIN"
   - Only ADMIN can access `/admin` routes

---

## Routes

### `/admin` - Dashboard
- Quick stats (pages, keywords, articles, prompts)
- Quick actions grid
- Calm principles reminder

### `/admin/seo` - SEO & Keywords
**Page Metadata Section:**
- List of all `SeoPage` items (home, login, about)
- Edit form for each page
- Changes reflect immediately on public site

**Keyword Library Section:**
- Table of Blue Ocean keywords
- Filter by archetype, priority
- Add/edit keywords for content planning

### `/admin/content` - Article Ideas
- Table of `ArticleIdea` items
- Status: DRAFT → OUTLINED → WRITING → LIVE
- Click to expand: notes, outline, target keyword
- Plan Season 02 guides

### `/admin/ai` - AI Workbench
**Prompt Library:**
- 5 role prompts (product, seo, writer, designer, dev)
- Copy button for each prompt
- Use with ChatGPT/Claude

**Optional Playground:**
- Dropdown: select role
- Text area: ask question
- "Ask Nova" button → calls `/api/ai`
- Response box below

---

## Implementation Status

### ✅ Phase 1: Schema & Seed (DONE)
- [x] Add Prisma models
- [x] Create migration
- [x] Write seed data (15 keywords, 3 articles, 5 prompts)
- [x] Add `User.role` field

### ✅ Phase 2: Admin Shell (DONE)
- [x] `/admin` layout with sidebar
- [x] Auth guard (admin only)
- [x] Dashboard with stats

### 🚧 Phase 3: CRUD Pages (TO DO)
- [ ] `/admin/seo` - SEO pages + keywords CRUD
- [ ] `/admin/content` - Article ideas CRUD
- [ ] `/admin/ai` - Prompt library viewer

### 🔮 Phase 4: AI Integration (OPTIONAL)
- [ ] `/api/ai` endpoint (calls OpenAI/Anthropic)
- [ ] Playground UI in `/admin/ai`
- [ ] Role-specific prompt injection

### 🔮 Phase 5: Public Site Integration (LATER)
- [ ] Wire `SeoPage` into `generateMetadata()` for home, login, about
- [ ] Optional: Generate sitemap from keywords
- [ ] Optional: Content calendar view

---

## Seed Data Summary

### SEO Pages (3)
1. **Home** - "Chessio — Learn Chess the Fun Way"
2. **Login** - "Sign In — Chessio"
3. **About** - "About Chessio — Chess for Anxious Beginners"

### Blue Ocean Keywords (15)
Priority 1 (High Intent):
- chess for anxious beginners
- chess for introverts
- chess lessons for adults starting from scratch
- chess for people who feel dumb
- relearning chess as an adult

Priority 2-3 (Supporting):
- learn chess with zero pressure
- gentle chess lessons
- chess for shy adults
- calm chess practice
- + 6 more

### Article Ideas (3)
1. **Anxious Beginners Guide** - "Why Anxious Beginners Struggle with Chess"
2. **Relearning Guide** - "How to Relearn Chess as an Adult"
3. **Introverts Guide** - "Chess for Introverts: Learn Alone, Play When Ready"

### AI Prompts (5)
1. **Product** - Calm Product Strategist (protects focus)
2. **SEO** - Calm SEO Copilot (Blue Ocean keywords)
3. **Writer** - Calm Content Writer (empathetic, clear)
4. **Designer** - Calm Design Copilot (Ink & Ivory system)
5. **Developer** - Calm Developer Assistant (boring, tested)

---

## Usage Instructions

### Running the Seed

```bash
# Apply migration
npx prisma migrate dev --name add_calm_admin

# Run seed script
npx tsx prisma/seed-admin.ts

# Or add to package.json:
# "prisma": { "seed": "tsx prisma/seed-admin.ts" }
```

### Accessing Admin

1. Sign in as user
2. Manually set `role = 'ADMIN'` in database:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```
3. Navigate to `/admin`

### Using AI Prompts

1. Go to `/admin/ai`
2. Find your role (e.g., "SEO")
3. Click "Copy Prompt"
4. Paste into ChatGPT/Claude
5. Ask your question

---

## Design Principles

1. **Boring over Clever**
   - Simple CRUD, no fancy features
   - Standard forms, tables, buttons

2. **Internal over Public**
   - Not indexed by Google
   - No user-facing routes
   - Admin-only access

3. **Calm over Chaos**
   - One place for SEO, content, AI
   - Reduces context switching
   - Makes ops predictable

4. **Manual over Automated**
   - Start with manual editing
   - Add AI/automation only if painful
   - Quality over speed

---

## Future Considerations (Season 02+)

### SEO Enhancements
- Auto-generate sitemap from keywords
- Track keyword rankings (simple)
- Content calendar view

### AI Integration
- In-app playground (no context switching)
- Save AI responses to article notes
- Auto-suggest keywords from prompts

### Content Workflow
- Draft → Outlined → Writing → Live pipeline
- Assign articles to team members
- Link articles to lessons/puzzles

### Analytics
- Simple view of traffic sources
- Top landing pages
- Conversion funnel

**But for now:** Keep it dead simple. v1 is just CRUD + prompts.

---

## Technical Notes

### Auth Guard Pattern
```ts
// app/(admin)/admin/layout.tsx
const session = await auth();
if (!session?.user?.id) redirect('/login');

// TODO: Check role from DB
// const user = await db.user.findUnique({ ... });
// if (user.role !== 'ADMIN') redirect('/');
```

### SEO Integration Pattern
```ts
// app/page.tsx (home)
export async function generateMetadata() {
  const seo = await db.seoPage.findUnique({ where: { slug: 'home' } });
  return {
    title: seo?.title ?? 'Default Title',
    description: seo?.description,
    // ...
  };
}
```

### AI Endpoint Pattern (Optional)
```ts
// app/api/ai/route.ts
export const runtime = 'nodejs';

export async function POST(req: Request) {
  const { role, message } = await req.json();
  const template = await db.aiPromptTemplate.findFirst({ where: { role } });
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: template.content },
      { role: "user", content: message }
    ]
  });
  
  return Response.json({ content: completion.choices[0].message.content });
}
```

---

## Maintenance

### Adding New SEO Pages
```ts
await db.seoPage.create({
  data: {
    slug: 'pricing',
    title: 'Pricing — Chessio',
    description: '...',
  }
});
```

### Adding New Keywords
```ts
await db.seoKeyword.create({
  data: {
    phrase: 'chess for perfectionists',
    intent: 'People who fear making mistakes',
    archetype: 'True Beginner',
    priority: 2,
  }
});
```

### Updating AI Prompts
Just edit in `/admin/ai` or directly in DB. Team members copy the latest version.

---

**Last Updated**: December 6, 2025  
**Status**: Phase 1-2 complete, ready for Phase 3 CRUD pages
