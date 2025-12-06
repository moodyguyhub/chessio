# GitHub OAuth Setup for Admin Access

## Quick Setup (5 minutes)

### 1. Create GitHub OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the form:
   - **Application name**: `Chessio Admin (Dev)`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**

### 2. Get Your Credentials

After registration, you'll see:
- **Client ID**: Copy this
- **Client secrets**: Click "Generate a new client secret" and copy it

### 3. Add to .env File

```bash
# Add these to your .env file:
GITHUB_ID="your_client_id_here"
GITHUB_SECRET="your_client_secret_here"
```

### 4. Restart Dev Server

```bash
npm run dev
```

### 5. Login with GitHub

1. Go to http://localhost:3000/login
2. Click **"Sign in with GitHub"**
3. Authorize the app
4. You're automatically logged in with ADMIN role!
5. Go to http://localhost:3000/admin

---

## For Production (Vercel)

### 1. Create Production OAuth App

1. Go to https://github.com/settings/developers
2. Click **"New OAuth App"**
3. Fill in the form:
   - **Application name**: `Chessio Admin (Production)`
   - **Homepage URL**: `https://chessio.vercel.app` (or your domain)
   - **Authorization callback URL**: `https://chessio.vercel.app/api/auth/callback/github`
4. Click **"Register application"**

### 2. Add to Vercel Environment Variables

```bash
# In Vercel dashboard → Settings → Environment Variables
GITHUB_ID="production_client_id"
GITHUB_SECRET="production_client_secret"
```

Or via CLI:
```bash
vercel env add GITHUB_ID
vercel env add GITHUB_SECRET
```

### 3. Redeploy

```bash
git push origin main
# Or in Vercel dashboard: Deployments → Redeploy
```

---

## How It Works

1. **GitHub Login**: Click "Sign in with GitHub" on `/login`
2. **OAuth Flow**: User authorizes Chessio to access their GitHub profile
3. **Auto Admin**: The `signIn` callback in `auth.ts` checks if the provider is GitHub
4. **Role Assignment**: If user logs in via GitHub, their role is automatically set to `ADMIN`
5. **Access Granted**: User can now access `/admin` and all admin features

**Code Location**: `src/lib/auth.ts` (lines 58-73)

```typescript
async signIn({ user, account }) {
  // Auto-grant admin role to GitHub user
  if (account?.provider === "github" && user.email) {
    const dbUser = await db.user.findUnique({
      where: { email: user.email },
    });
    
    if (dbUser && dbUser.role !== "ADMIN") {
      await db.user.update({
        where: { id: dbUser.id },
        data: { role: "ADMIN" },
      });
    }
  }
  return true;
}
```

---

## Security Notes

- **GitHub OAuth is internal-only**: This setup gives admin access to ANY GitHub account that logs in
- **For production**: Consider restricting by GitHub username or organization
- **Recommended**: Add a check like:
  ```typescript
  if (account?.provider === "github" && user.email === "your@email.com") {
    // Grant admin only to specific email
  }
  ```

---

## Troubleshooting

**"Missing GITHUB_ID or GITHUB_SECRET"**
- Check `.env` file has both variables
- Restart dev server after adding env vars

**"Redirect URI mismatch"**
- Callback URL must exactly match: `http://localhost:3000/api/auth/callback/github`
- No trailing slash
- Check both dev and prod OAuth apps have correct URLs

**"GitHub button doesn't work"**
- Check browser console for errors
- Verify NEXTAUTH_URL is set in `.env`
- Try clicking the button again (first click might be slow)

**"Not redirected to admin after login"**
- Check database: `SELECT * FROM "User" WHERE email = 'your@github.email';`
- Verify role is set to `ADMIN`
- Clear cookies and try again

---

## Alternative: Keep Credentials Auth Only

If you prefer not to use GitHub OAuth, you can remove it:

1. Delete the GitHub button from `src/app/(auth)/login/page.tsx`
2. Remove the `signIn` callback from `src/lib/auth.ts`
3. Use the original manual role assignment:
   ```bash
   npx prisma studio
   # Change role from USER → ADMIN manually
   ```

---

Last updated: 2024-12-06
