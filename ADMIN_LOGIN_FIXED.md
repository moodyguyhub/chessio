# Admin Login - Setup Complete! 🎉

## What Was Fixed

### 1. Separate Admin Login URL
- **Admin Login**: `http://localhost:3000/admin/login`
- **User Login**: `http://localhost:3000/login` (unchanged)

### 2. GitHub Sign-In Fixed
**Problem**: Form-based GitHub OAuth was causing CSRF token errors  
**Solution**: Updated to use NextAuth's `signIn()` function properly

**Changes Made**:
- Replaced `<form action="/api/auth/signin/github">` with button click handler
- Now uses `await signIn("github", { callbackUrl: "/admin" })`
- Added loading states and proper error handling
- Applied to both user login (`/login`) and admin login (`/admin/login`)

## Files Changed

1. ✅ `src/app/(auth)/admin/login/page.tsx` - NEW admin login page
2. ✅ `src/app/(auth)/login/page.tsx` - Fixed GitHub button
3. ✅ `src/app/(admin)/admin/layout.tsx` - Redirects to `/admin/login`
4. ✅ `.env` - Updated with admin login comment
5. ✅ `ADMIN_ACCESS.md` - Complete admin access guide

## How to Test

### Test Admin Login (GitHub OAuth)
1. **Clear your browser cookies/cache** (important!)
2. Go to: `http://localhost:3000/admin/login`
3. Click "Sign in with GitHub"  
4. Authorize the app
5. Should redirect to `/admin` dashboard
6. Verify you have ADMIN role and can access:
   - `/admin` - Dashboard
   - `/admin/seo` - SEO control panel
   - `/admin/content` - Content pipeline
   - `/admin/ai` - AI Workbench

### Test User Login (Regular Chess Learners)
1. Go to: `http://localhost:3000/login`
2. Try GitHub sign-in here too (should work now!)
3. Should redirect to `/app` (lessons dashboard)

## Troubleshooting

### Still seeing "MissingCSRF" error?
1. **Clear browser cache/cookies completely**
2. Try in incognito/private window
3. Restart dev server: `pkill -f "next dev" && npm run dev`

### GitHub not redirecting back?
1. Check GitHub OAuth app callback URL is: `http://localhost:3000/api/auth/callback/github`
2. Verify GITHUB_ID and GITHUB_SECRET in `.env`
3. Make sure you authorized the app in GitHub

### Not getting ADMIN role?
- Check `src/lib/auth.ts` line 61-69
- Currently ANY GitHub user gets ADMIN (for development)
- Modify `signIn` callback to restrict by email/username for production

## Next Steps

### For Production Deployment
1. Update GitHub OAuth app with production URL
2. Add production callback: `https://chessio.io/api/auth/callback/github`
3. Restrict admin access by email in `src/lib/auth.ts`:
   ```typescript
   if (account?.provider === "github" && user.email === "your@email.com") {
     // grant ADMIN only to specific email
   }
   ```

### Optional: Create First Admin User with Credentials
If you want email/password admin access:
```sql
-- In Prisma Studio or psql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'admin@chessio.io';
```

## Architecture Summary

```
┌─────────────────┐
│  User Routes    │
├─────────────────┤
│ /login          │──→ GitHub OAuth ──→ /app (role: USER)
│ /register       │──→ Credentials  ──→ /app (role: USER)
│ /app/*          │    (Protected)
└─────────────────┘

┌─────────────────┐
│  Admin Routes   │
├─────────────────┤
│ /admin/login    │──→ GitHub OAuth ──→ /admin (role: ADMIN)
│                 │──→ Credentials  ──→ /admin (role: ADMIN)
│ /admin/*        │    (Protected, admin-only)
│  ├─ dashboard   │
│  ├─ seo         │
│  ├─ content     │
│  └─ ai          │
└─────────────────┘
```

## Security Notes

- Admin routes check `role === "ADMIN"` in layout
- Non-admin users redirected to `/app`
- GitHub OAuth auto-grants ADMIN (dev only!)
- Separate login pages prevent user confusion
- All admin actions require authentication

---

**Status**: ✅ Ready to test!  
**Dev Server**: Running on http://localhost:3000  
**Admin Login**: http://localhost:3000/admin/login
