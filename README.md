# ♟️ Chessio

**"Duolingo for Chess"** - An interactive chess learning platform where users master chess through bite-sized lessons, earn XP, and level up their skills.

> **Current Phase:** Production v1 with Ink & Ivory Theme  
> **Status:** 6 Level 0 lessons live, ready for expansion

---

## ✨ Features

- 🎯 **Interactive Lessons** - 6 beginner lessons teaching board basics and piece movement
- 📈 **XP & Leveling** - Gamified progression system with golden visual rewards
- 🎨 **Elegant Design** - Warm dark theme with golden accents ("Ink & Ivory")
- 💡 **Contextual Hints** - Static hints per task (AI integration ready for Phase 2)
- 🔐 **Authentication** - GitHub OAuth for admin + credential-based user accounts
- 📊 **Progress Tracking** - Resume lessons, track completion, unlock next content
- 🎵 **Sound Effects** - Move, capture, success, and error audio feedback
- 🎯 **Daily Goals** - Contextual "Today's Goal" based on user progress

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone and install:**
   ```bash
   git clone https://github.com/moodyguyhub/chessio.git
   cd chessio
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials (see below)
   ```

3. **Start local database:**
   ```bash
   npx prisma dev
   # Keep this terminal running
   ```

4. **Set up database schema:**
   ```bash
   npm run db:push      # Push schema to database
   npm run db:seed      # Seed 6 Level 0 lessons
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   - Landing page: http://localhost:3000
   - Dashboard: http://localhost:3000/app (requires login)

---

## 🔑 Environment Variables

Required in `.env`:

```env
# Database (local dev uses npx prisma dev)
DATABASE_URL="prisma+postgres://localhost:51216/..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# GitHub OAuth (for admin access)
GITHUB_ID="your-github-app-id"
GITHUB_SECRET="your-github-app-secret"

# Optional: Admin username
ADMIN_GITHUB_USERNAME="your-github-username"
```

---

## 🏗️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 16 (App Router) | Modern React with server components |
| **Database** | PostgreSQL + Prisma ORM | Type-safe queries, easy migrations |
| **Auth** | NextAuth v5 | Industry standard, flexible providers |
| **Styling** | Tailwind CSS | Rapid development, consistent design |
| **Chess** | Custom SVG Board | Lightweight, teaching-focused |
| **Deployment** | Vercel | Zero-config, instant previews |

--- ---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/              # Public auth pages (login, register)
│   ├── (protected)/app/     # Dashboard + lessons (requires auth)
│   ├── api/                 # API routes (auth, feedback, hints)
│   └── page.tsx             # Landing page with hero
├── components/
│   ├── chess/               # Chessboard, LessonPlayer, TaskBox
│   └── ui/                  # Button, Card, Badge, modals
├── lib/
│   ├── auth.ts              # NextAuth configuration
│   ├── db.ts                # Prisma client singleton
│   ├── lessons.ts           # All 6 Level 0 lessons (source of truth)
│   ├── gamification/        # XP & leveling system
│   └── engagement/          # Today's Goal feature
└── hooks/
    └── useChessAudio.ts     # Sound effects hook
```

**Key Files:**
- **Lessons:** `src/lib/lessons.ts` - All lesson definitions
- **Schema:** `prisma/schema.prisma` - Database models
- **Theme:** `tailwind.config.ts` - Chessio color tokens
- **Instructions:** `.github/copilot-instructions.md` - Dev guidelines

---

## 🎨 Design System

### Chessio Theme Tokens

```typescript
// Available in all components via Tailwind
bg-chessio-bg-dark        // #050814 - Page background
bg-chessio-surface-dark   // #090f1f - Cards, panels
bg-chessio-card-dark      // #111827 - Modals, elevated surfaces
bg-chessio-primary        // #facc15 - Golden buttons/accents
text-chessio-text-dark    // #f9fafb - Main text
text-chessio-muted-dark   // #9ca3af - Secondary text
border-chessio-border-dark // #1f2933 - Borders
```

**Philosophy:** "Serious player with charm" - professional but approachable

---

## 🎓 Current Content

### Level 0: Learn the Pieces (6 Lessons)
1. **Meet the Board** - Understanding ranks, files, and squares
2. **How the Rook Moves** - Straight-line movement
3. **How the Bishop Moves** - Diagonal movement
4. **How the Queen Moves** - Combined rook + bishop power
5. **How the King Moves** - One square in any direction
6. **How the Pawn Moves** - Forward movement + promotion

**Export Curriculum:**
```bash
npx tsx scripts/export-lessons-to-md.ts
# Creates: chessio-lessons-export.md
```

---

## 📝 Scripts

| Command | Description |
|---------|-------------|
| **Development** | |
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |
| **Database** | |
| `npx prisma dev` | Start local Postgres (keep running) |
| `npm run db:push` | Push schema without migration |
| `npm run db:migrate` | Create new migration |
| `npm run db:seed` | Seed 6 Level 0 lessons |
| `npm run db:studio` | Open Prisma Studio |
| **Prisma** | |
| `npx prisma generate` | Regenerate Prisma Client |
| `npx prisma migrate deploy` | Deploy migrations (production) |
| **Scripts** | |
| `npx tsx scripts/export-lessons-to-md.ts` | Export lessons to markdown |
| `npx tsx scripts/verify-xp-config.ts` | Verify XP configuration |

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **CURRENT_STATUS.md** | 📌 **Start here!** Current state & quick start |
| `.github/copilot-instructions.md` | Architecture & coding conventions |
| `INFRA_NOTES.md` | Database & deployment rules |
| `DEV_NOTES.md` | Technical decisions & rationale |
| `chessio-lessons-export.md` | Full lesson curriculum export |

---

## 🛠️ Development Workflow

### Before Starting Work:
1. ✅ Run `npx prisma dev` in separate terminal
2. ✅ Ensure `.env` has all required variables
3. ✅ Run `npm run dev` and verify http://localhost:3000 loads
4. ✅ Can log in and access dashboard
5. ✅ All 6 lessons show up and are playable

### Making Changes:
- **Lessons:** Edit `src/lib/lessons.ts` → reseed with `npm run db:seed`
- **Schema:** Edit `prisma/schema.prisma` → `npm run db:push`
- **UI:** Use chessio theme tokens from `tailwind.config.ts`
- **API Routes:** Always add `export const runtime = "nodejs"`

### Testing:
- Manual testing in browser (no automated tests yet)
- Check browser console for errors
- Test on mobile viewport (responsive design)

---

## 🚀 Deployment

**Platform:** Vercel (auto-deploy from main branch)

**Environment Variables:** Set in Vercel dashboard:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXTAUTH_URL` - Production URL (https://chessio.io)
- `NEXTAUTH_SECRET` - Production secret (generate with `openssl rand -base64 32`)
- `GITHUB_ID` / `GITHUB_SECRET` - Production OAuth app credentials
- `ADMIN_GITHUB_USERNAME` - Your GitHub username for admin access

**Deploy Process:**
1. Push to `main` branch
2. Vercel auto-deploys
3. Monitor build logs in Vercel dashboard
4. Verify deployment at https://chessio.io

---

## 🎯 Roadmap

### ✅ Phase 0 Complete
- [x] Core lesson engine
- [x] 6 Level 0 lessons
- [x] XP & leveling system
- [x] Warm dark theme
- [x] Sound effects
- [x] Progress tracking
- [x] Today's Goal feature

### 🔜 Phase 1 Planned
- [ ] Complete UX improvements (lesson player enhancements)
- [ ] Add Knight lesson
- [ ] Add advanced Pawn lesson (en passant, capturing)
- [ ] Level 1: Castling
- [ ] Level 1: Check and Checkmate basics
- [ ] Admin dashboard for lesson management

### 🔮 Phase 2 Future
- [ ] AI-powered hints (OpenAI integration)
- [ ] Multiplayer practice mode
- [ ] Puzzle collections
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes following conventions in `.github/copilot-instructions.md`
3. Test locally: `npm run dev` and verify functionality
4. Ensure build works: `npm run build`
5. Commit with clear message: `git commit -m "feat: add feature"`
6. Push and create PR: `git push origin feature/your-feature`

**Guidelines:**
- Use TypeScript strictly (no `any` types)
- Follow existing code patterns
- Add comments for complex logic
- Test on mobile viewport
- Use chessio theme tokens for styling

---

## 📄 License

MIT License - see LICENSE file for details

---

**Built with 💛 by the Chessio team**  
Live at: https://chessio.io
