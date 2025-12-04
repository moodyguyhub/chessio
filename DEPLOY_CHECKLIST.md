# Chessio - First Deploy Checklist

> Use this checklist before every deployment to Vercel.  
> See Section G for when to use FULL vs LITE checklist.

---

## A. Environment & Secrets

- [ ] `NEXTAUTH_SECRET` is set in Vercel environment variables
- [ ] `NEXTAUTH_URL` is set to the production URL
- [ ] `DATABASE_URL` points to the production database (not local)
- [ ] No secrets are committed to git

---

## B. Database

- [ ] Schema is pushed to production: `npx prisma db push`
- [ ] Migrations are applied (if using migrations): `npx prisma migrate deploy`
- [ ] Seed data exists for Level 0 lessons
- [ ] Connection pooling is configured correctly

---

## C. Auth Flow

- [ ] Sign-up creates a new user successfully
- [ ] Sign-in works with valid credentials
- [ ] Sign-in fails gracefully with wrong password (no stack traces)
- [ ] JWT session persists across page refreshes
- [ ] Protected routes redirect to `/login` when not authenticated

---

## D. Beginner Flow (Lyra's Checklist)

- [ ] Landing page loads without errors
- [ ] "Get Started" / "Sign Up" CTA is prominently visible
- [ ] First screen uses **zero chess jargon** without explanation
  - No raw "e4", "Nf3" etc. without a tooltip or guided text
- [ ] After sign-up, user is redirected to dashboard or first lesson
- [ ] First lesson loads and displays correctly
- [ ] User can complete at least one task
- [ ] Progress is saved (verify: refresh page, progress persists)
- [ ] XP updates after completing a lesson
- [ ] Completion modal appears with celebration

---

## E. Error States

- [ ] Backend errors show friendly messages:
  - "Oops, something went wrong. Let's try that again."
- [ ] **No technical codes** like "Prisma P2002" appear anywhere in the UI
- [ ] Clear retry action is available on error screens
- [ ] Network errors (offline) are handled gracefully
- [ ] 404 page exists and is user-friendly

---

## F. Performance & Accessibility

- [ ] Page loads in < 3 seconds on 3G connection
- [ ] Chessboard is usable on mobile (touch targets are large enough)
- [ ] Text is readable (sufficient contrast)
- [ ] Basic keyboard navigation works

---

## G. Full vs Lite Checklist

### Use the FULL checklist when:

- [ ] DB schema/migrations changed
- [ ] Auth or session logic changed
- [ ] Chess rules / core game logic changed
- [ ] New API routes added
- [ ] Environment variables added/changed

### Use the LITE checklist when:

- [ ] Only UI layout, copy, or non-critical styling changed
- [ ] Bug fixes that don't touch DB/auth/chess logic

### Lite Checklist (minimum):

- [ ] Landing page loads without errors
- [ ] Sign-in flow completes successfully
- [ ] First lesson loads and saves progress (refresh to confirm)

---

## H. Post-Deploy Verification

After deployment completes:

1. [ ] Visit production URL — landing page loads
2. [ ] Sign up with a new test account
3. [ ] Complete first lesson task
4. [ ] Refresh page — progress is still there
5. [ ] Check Vercel logs for any errors

---

## Notes

- If any item fails, **do not proceed** with the deployment
- Document any issues in the team chat
- For urgent hotfixes, LITE checklist is acceptable with team approval
