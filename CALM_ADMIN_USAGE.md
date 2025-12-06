# Calm Admin System - Setup & Usage Guide

## Quick Start (First Time Setup)

### 1. Run Migration & Seed
```bash
# Run the migration (adds 5 new tables + User.role)
npx prisma migrate dev --name add_calm_admin

# Seed the admin data (SEO pages, keywords, articles, prompts)
npx tsx prisma/seed-admin.ts
```

### 2. Grant Admin Access
```bash
# Open Prisma Studio
npx prisma studio

# Navigate to User table
# Find your user by email
# Change role from "USER" to "ADMIN"
# Save changes
```

Or via SQL:
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### 3. Start Dev Server
```bash
npm run dev
```

### 4. Access Admin
Visit: http://localhost:3000/admin

You'll see 4 sections:
- **Dashboard** - Real-time stats
- **SEO** - Page metadata + keyword library
- **Content** - Article pipeline
- **AI** - Team of 5 prompt library

---

## Usage Guide

### SEO Control Panel (`/admin/seo`)

**Edit Page Metadata:**
1. Scroll to the page you want (Home, Login, About)
2. Edit title, description, OG tags
3. Click "Save"
4. Changes reflect immediately on public site

**Manage Keywords:**
- View all Blue Ocean keywords in table
- Add new keyword: fill form + click "Add Keyword"
- Priority: 1 (High), 2 (Medium), 3 (Low)
- Archetype: True Beginner, Returning Adult, Quiet Worker

**Example Keywords:**
- "chess for anxious beginners"
- "relearning chess as an adult"
- "chess for introverts"

### Content Pipeline (`/admin/content`)

**View Article Ideas:**
- See all Season 02 content planned
- Each shows: keyword, archetype, slug, notes

**Update Status:**
1. Find the article card
2. Change dropdown: DRAFT → OUTLINED → WRITING → LIVE
3. Click "Save"
4. Badge color updates (gray → blue → amber → green)

**Add New Article:**
Currently manual via Prisma Studio or seed script. Future: in-app form.

### AI Workbench (`/admin/ai`)

**Use Prompts:**
1. Find the role you need (Product, SEO, Writer, Designer, Dev)
2. Click "Copy Prompt"
3. See "✓ Copied!" confirmation
4. Paste into ChatGPT, Claude, or custom AI tool
5. Add your specific request after the prompt

**Roles:**
- **Product / Strategy** - Decision-making, roadmap, analytics
- **SEO Copilot** - Keyword research, meta tags, content planning
- **Content Writer** - Blog posts, guides, landing pages
- **Design Copilot** - Ink & Ivory system, component design
- **Developer Assistant** - Code, debugging, architecture

---

## Testing Checklist

### Auth & Security
- [ ] Visit /admin when logged out → redirects to /login
- [ ] Visit /admin with USER role → redirects to /app
- [ ] Visit /admin with ADMIN role → shows dashboard

### Dashboard
- [ ] See correct counts (3 pages, 15 keywords, 3 articles, 5 prompts)
- [ ] Click quick action cards → navigate to sections

### SEO Page
- [ ] Edit home page metadata → save → check source on /
- [ ] Add new keyword → appears in table
- [ ] Priority badges show correct colors

### Content Page
- [ ] See 3 article ideas seeded
- [ ] Change status → badge color updates
- [ ] Notes expand/collapse properly

### AI Page
- [ ] See 5 prompts grouped by role
- [ ] Copy button works → clipboard has full prompt
- [ ] "✓ Copied!" shows for 2 seconds

---

## Data Reference

### Seeded Data

**SEO Pages (3):**
- home, login, about

**Keywords (15):**
Priority 1: chess for anxious beginners, relearning chess as an adult, chess for introverts
Priority 2: quiet chess learning, self-paced chess, chess without competition (+ 7 more)
Priority 3: chess without pressure, chess for homebodies, slow chess learning

**Articles (3):**
1. "Chess for Anxious Beginners: A Gentle Guide"
2. "Relearning Chess as an Adult: Tips for Busy People"
3. "Introverted Chess: How to Learn Without Playing Against Others"

**AI Prompts (5):**
Product, SEO, Writer, Designer, Developer (full context in each)

---

## Common Tasks

### Update SEO for Launch
1. Go to /admin/seo
2. Edit home page: optimize title/description for Jan 6 launch
3. Save → changes live immediately

### Plan Season 02 Content
1. Go to /admin/content
2. Review 3 article ideas
3. Move "Anxious Beginners" to OUTLINED status
4. Use AI Writer prompt to draft outline

### Get AI Help
1. Go to /admin/ai
2. Copy "SEO Copilot" prompt
3. Paste into Claude/ChatGPT
4. Add: "Research 10 more Blue Ocean keywords for Chessio"

---

## Architecture Notes

**Tech Stack:**
- Server Components (no API routes)
- Server Actions for mutations
- Prisma + PostgreSQL
- Runtime: nodejs (all DB routes)

**Design Principles:**
- Calm over clever (boring CRUD)
- Internal only (not indexed)
- Manual first, automate later
- Makes ops predictable

**Why No API Routes?**
Server Actions are simpler for admin CRUD. No JSON parsing, built-in CSRF protection, direct DB access.

**Why JSONB for Notes?**
Flexible schema. Start simple (just text), extend later (rich formatting, attachments) without migrations.

---

## Future Enhancements (Optional)

### Phase 4: AI Integration
- `/api/ai` endpoint with OpenAI/Anthropic
- In-app playground in /admin/ai
- Save AI responses to article notes

### Phase 5: Rich Features
- Rich text editor for article notes
- Keyword rank tracking (simple)
- Content calendar view
- Link articles to lessons/puzzles

### Phase 6: Automation
- Auto-generate OG images
- Scheduled publish (LIVE → published_at)
- Email notifications for status changes

---

## Troubleshooting

**"Role-based auth not working"**
- Check User.role in database (should be "ADMIN")
- Restart dev server after seeding

**"Counts show 0 on dashboard"**
- Run: `npx tsx prisma/seed-admin.ts`
- Check Prisma Studio: SeoPage, SeoKeyword, ArticleIdea, AiPromptTemplate tables

**"Copy button doesn't work"**
- Requires HTTPS or localhost
- Check browser console for clipboard API errors

**"SEO changes don't reflect on public site"**
- revalidatePath() called in updateSeoPage action
- Try hard refresh (Ctrl+Shift+R)
- Check generateMetadata() in src/app/page.tsx

---

## File Reference

**Database:**
- `prisma/schema.prisma` - 5 new models + User.role
- `prisma/seed-admin.ts` - Seed script
- `prisma/migrations/20251206_add_calm_admin/` - Migration

**Admin Routes:**
- `src/app/(admin)/admin/layout.tsx` - Shell + auth guard
- `src/app/(admin)/admin/page.tsx` - Dashboard
- `src/app/(admin)/admin/seo/*` - SEO control panel
- `src/app/(admin)/admin/content/*` - Content pipeline
- `src/app/(admin)/admin/ai/*` - AI workbench

**Public Integration:**
- `src/app/page.tsx` - generateMetadata() for home
- `src/app/(auth)/layout.tsx` - generateMetadata() for login/register

**Documentation:**
- `CALM_ADMIN_SYSTEM.md` - Architecture & design
- `CALM_ADMIN_USAGE.md` - This file

---

## Support

For questions or issues:
1. Check `CALM_ADMIN_SYSTEM.md` for architecture details
2. Review code comments in admin files
3. Test in Prisma Studio (visual DB browser)
4. Verify role: `SELECT role FROM "User" WHERE email = 'yours';`

Last updated: 2024-12-06 (Phase 3 complete)
