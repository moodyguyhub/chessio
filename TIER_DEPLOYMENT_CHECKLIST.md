# 🚢 Tier System Deployment Checklist

## Status: ⚠️ Ready to Deploy (Needs Database)

**Created:** 2025-12-08  
**Feature:** Levels 0-20 Tier System (School/Club/College)  
**Files Changed:** 14 new files, 5 modified files  

---

## 🚨 CRITICAL: Start Here

### Step 1: Start Local Database

In a **separate terminal** (keep it running):

```bash
npx prisma dev
```

You should see:
```
✔ Prisma Postgres running at prisma+postgres://localhost:51216/...
```

### Step 2: Apply Schema Changes

```bash
npx prisma db push       # Push new User fields
npx prisma generate      # Regenerate Prisma client types
```

Expected output:
```
✔ Your database is now in sync with your Prisma schema.
✔ Generated Prisma Client to ./node_modules/@prisma/client
```

### Step 3: Restart Dev Server

```bash
npm run dev
```

**Verify:** TypeScript errors in `src/lib/progression/graduation.ts` should be GONE.

---

## 📋 Manual QA Checklist

### A. Dashboard "Path Ahead" Card (5 min)

#### Test 1: Low-Level User (L0-2)

1. Open http://localhost:3000/app (logged in, L0-2)
2. Scroll to bottom of dashboard
3. **Expected:**
   - ✅ See **TierProgressionCard** below Level 2 content
   - ✅ Headline: "The Road to Mastery"
   - ✅ Copy mentions School → Club → College
   - ✅ Badge says: 🔒 "Complete Level 3 to unlock"
   - ✅ Card looks **subtle** (not like a broken level)
   - ✅ No levels 4-20 visible anywhere

**Screenshot opportunity:** Card in State A

#### Test 2: Level 3 Complete User

1. Complete all Level 3 lessons OR manually set XP ≥ 375
2. Refresh dashboard
3. **Expected:**
   - ✅ **TierProgressionCard** now shows State B
   - ✅ Headline: "You've Graduated School! 🎓"
   - ✅ Badge says: 🚧 "In Development"
   - ✅ Copy mentions Club (Levels 4-9) coming soon
   - ✅ Still no clickable levels 4-20

**Screenshot opportunity:** Card in State B

---

### B. Level 3 Graduation Flow (10 min)

**Note:** Modals need client-side integration. For now, verify components render without errors.

#### Manual Modal Testing (Dev Tools)

1. Open browser console
2. Paste this to trigger graduation modal:

```javascript
// Test SchoolGraduationModal (in dev tools)
// You'll need to wire this into lesson completion later
```

**Expected behavior when wired:**
1. Complete last Level 3 lesson
2. `SchoolGraduationModal` appears:
   - ✅ Headline: "Chessio School Complete! 🎓"
   - ✅ Sub-headline + body text correct
   - ✅ Two buttons: "Claim Graduation Badge" + "Close"
3. Click "Close" → Modal disappears, dashboard loads
4. Click "Claim Badge" → `ClubPreviewCTAModal` appears next

**Current Status:** ⚠️ Modals exist but need integration point (lesson completion screen)

---

### C. Sneak Peek Challenge + Coming Soon (Future)

**Status:** 🔧 Components ready, needs routing

To complete this flow, you'll need:

1. **Route:** `/play/club-preview` or `/lessons/club-preview-knight-fork`
2. **Integration:** Reuse existing lesson player
3. **Flow:**
   - User clicks "Try the Challenge (Hard)" in CTA modal
   - Loads Club preview puzzle (knight fork)
   - On completion → `ClubComingSoonModal` appears
   - "Back to Home" → return to dashboard

**Club Preview Puzzle Reference:**
- Position: Italian Game tactical fork
- Solution: Nxe5 (royal fork)
- See: `CLUB_PREVIEW_PUZZLE_REF.md`

---

## 🔐 Security Checks (2 min)

### API Route Auth

Verify both routes require authentication:

```bash
# Should return 401 Unauthorized without session
curl http://localhost:3000/api/progression/graduation -X POST
curl http://localhost:3000/api/progression/club-preview -X POST
```

**Expected:** Both return `{"error":"Unauthorized"}` with status 401

**Checked:**
- ✅ `src/app/api/progression/graduation/route.ts` - has `auth()` check
- ✅ `src/app/api/progression/club-preview/route.ts` - has `auth()` check

---

## 🎨 Visual Regression (3 min)

### Desktop (1920x1080)

1. Dashboard loads without layout shifts
2. TierProgressionCard doesn't break grid
3. Modals are centered, readable
4. Badges have proper colors (warning = amber, secondary = slate)

### Mobile (375x667)

1. Dashboard scrolls smoothly
2. TierProgressionCard fits in viewport (not too tall)
3. Modal text is readable
4. Buttons aren't off-screen

**Test on:** Chrome DevTools mobile emulator + real device if possible

---

## 🔍 Code Safety Checks (5 min)

### No Accidental Level 4-20 Exposure

```bash
# Search for tier references in UI components
grep -r "tier.*club\|tier.*college" src/components --include="*.tsx" | grep -v "/progression/"
```

**Expected:** Only see progression components (TierProgressionCard), not in level lists

### Verify Level Config

```bash
# Check that only 0-3 are playable
grep "playable: true" src/lib/gamification/config.ts
```

**Expected:** Only lines 23-26 (Levels 0-3)

### No Breaking Changes to XP System

```bash
# Run existing tests
npm run test:unit -- gamification
```

**Expected:** All XP/level tests pass (33 tests)

---

## 📊 Database Verification

After `db:push`, check the schema:

```bash
npx prisma studio
```

1. Open User model
2. Verify new fields exist:
   - ✅ `hasSeenSchoolGraduation` (Boolean, default: false)
   - ✅ `hasAttemptedClubPreview` (Boolean, default: false)

**Optional:** Create test user and toggle these flags to verify State B

---

## ✅ Definition of Done

Mark complete when:

- [ ] Database schema applied successfully
- [ ] TypeScript compiles without errors
- [ ] Dashboard shows TierProgressionCard in correct state
- [ ] Card State A/B logic works based on XP level
- [ ] No levels 4-20 are clickable/visible
- [ ] Mobile layout doesn't break
- [ ] API routes require authentication
- [ ] Existing XP tests pass

**Bonus (Future Sprint):**
- [ ] Graduation modal triggered on Level 3 completion
- [ ] Club preview route created
- [ ] Full sneak peek flow works end-to-end

---

## 🐛 Troubleshooting

### "Can't reach database server"

**Fix:** Start Prisma dev in separate terminal:
```bash
npx prisma dev
```

### "Property 'hasSeenSchoolGraduation' does not exist"

**Fix:** Regenerate Prisma client:
```bash
npx prisma generate
```

### Card not showing on dashboard

**Check:**
1. `graduationState` is fetched in page.tsx (line ~37)
2. `<TierProgressionCard>` is rendered after Level 2 (line ~865)
3. Import is correct at top of file

### Modal types errors

**Fix:** Dialog uses `isOpen` not `open`, and requires `title` prop
```tsx
<Dialog isOpen={isOpen} onClose={onClose} title="Modal Title">
```

---

## 📈 Next Steps (Post-QA)

If all checks pass:

1. **Commit & Push:**
   ```bash
   git add .
   git commit -m "feat: add tier system (levels 0-20) with graduation flow"
   git push origin main
   ```

2. **Deploy to Staging/Production:**
   - Vercel will auto-deploy on push
   - Run `npx prisma db push` on production database
   - Test production dashboard

3. **Future Integration Points:**
   - Hook graduation modal into Level 3 lesson completion
   - Create `/play/club-preview` route
   - Add telemetry for graduation events
   - Consider A/B testing modal copy

---

## 📞 Need Help?

**Blockers:**
- Database won't start → Check `.env` has correct `DATABASE_URL`
- TS errors persist → Try `rm -rf node_modules/.prisma && npx prisma generate`
- Card not rendering → Check browser console for errors

**Questions on design:**
- Refer to `TIER_SYSTEM_IMPLEMENTATION.md`
- Check Lyra's original spec in this chat context

---

**Status:** ✅ Core implementation complete, QA in progress  
**Last Updated:** 2025-12-08  
**Estimated QA Time:** 15-20 minutes

