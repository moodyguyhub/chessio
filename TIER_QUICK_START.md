# 🚀 Tier System Quick Start

**3-Minute Deployment**

---

## 🔌 Database

Chessio uses a **hosted Postgres** (Neon/Railway/Supabase).

Your `.env` should have:
```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
```

---

## Deploy in 1 Command

```bash
npx prisma db push && npx prisma generate && npm run dev
```

---

## Smoke Test

1. Open http://localhost:3000/app
2. Scroll to bottom
3. See: **"The Road to Mastery"** card ✓

---

## Troubleshooting

**Connection error?**
→ Check DATABASE_URL in `.env` points to your hosted Postgres

**TS errors?**
→ Run `npx prisma generate` again

**No card?**
→ Check browser console

---

**Full guide:** `TIER_FINAL_DEPLOY.md`  
**Files:** 14 new, 5 modified
