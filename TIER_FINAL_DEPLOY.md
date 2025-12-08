# 🎯 Tier System - Final Deployment (5 min)

## 🔌 Database Setup (Recommended)

Chessio uses a **hosted Postgres database** (Neon, Railway, or Supabase).

### One-Time Setup

1. **Create a Postgres database** (e.g. `chessio_app`) in your provider
2. **Set this in your `.env`:**

   ```bash
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
   ```

3. **Apply schema and start:**

   ```bash
   npx prisma db push
   npx prisma generate
   npm run dev
   ```

> **Note:** We don't use `npx prisma dev` for normal development. It's only for throwaway experiments. Your `.env` should always point to the real hosted database.

---

## 🚀 Deploy Tier System (First Time)

```bash
# Apply new schema (adds graduation flags to User model)
npx prisma db push
npx prisma generate

# Start app
npm run dev
```

---

## ✅ Success Check (30 seconds)

Open http://localhost:3000/app and scroll to bottom:

**You should see:**
- 📍 "The Road to Mastery" card
- 🔒 Badge: "Complete Level 3 to unlock"
- ✅ No TypeScript errors
- ✅ No levels 4-20 visible

**If you see that card → deployment successful! 🎉**

---

## 🧪 Full Feature Test (5 min)

1. **Play through to Level 3 completion**
2. **Graduation modal appears:**
   - "Chessio School Complete! 🎓"
   - Click "Claim Graduation Badge"
3. **Sneak peek CTA modal appears:**
   - "Want a taste of the big leagues?"
   - Click "Try the Challenge (Hard)"
4. **Club preview puzzle loads:**
   - Knight fork tactical puzzle
   - Complete it (solution: Nxe5)
5. **Coming soon modal appears:**
   - "Welcome to the Club (Coming Soon)"
   - Click "Back to Home"
6. **Dashboard shows State B:**
   - "You've Graduated School!"
   - Badge: "In Development"

---

## 🐛 If Something Breaks

**"Can't reach database"**
→ DATABASE_URL port doesn't match running DB

**"Property hasSeenSchoolGraduation does not exist"**
→ Run `npx prisma generate` again

**Card not showing**
→ Check browser console for errors
→ Verify `graduationState` is fetched in page.tsx

---

## 📁 What Got Deployed

- **14 new files:** Components, modals, helpers
- **5 modified files:** Config, schema, dashboard
- **Database changes:** 2 new User fields
- **Levels extended:** 0-20 (only 0-3 playable)

---

**Status:** Ready to ship ✅  
**Time:** 5 min setup + 5 min QA = 10 min total

---

*For detailed docs: See TIER_DEPLOYMENT_CHECKLIST.md*
