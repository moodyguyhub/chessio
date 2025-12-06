# Admin Access Guide

## Login URLs

- **User Login**: `http://localhost:3000/login` (for chess learners)
- **Admin Login**: `http://localhost:3000/admin/login` (for content management)

## Admin Access Methods

### 1. GitHub OAuth (Recommended)
- Go to http://localhost:3000/admin/login
- Click "Sign in with GitHub"
- Automatically grants ADMIN role to authorized GitHub accounts
- Redirects to `/admin` dashboard

### 2. Credentials (Email/Password)
- Create an admin account via database or register with email
- Manually set `role = "ADMIN"` in database
- Sign in at http://localhost:3000/admin/login

## GitHub OAuth Setup

Your GitHub OAuth app is configured with:
- **Client ID**: `Ov23liLIy6kMyXaiKwKR`
- **Callback URL**: `http://localhost:3000/api/auth/callback/github`
- **Environment Variables**: Set in `.env`

### Testing GitHub Sign-In

1. Make sure dev server is running: `npm run dev`
2. Go to http://localhost:3000/admin/login
3. Click "Sign in with GitHub"
4. Authorize the app
5. You'll be redirected to `/admin` dashboard with ADMIN role

## Troubleshooting

### "Authentication failed" error
- Check that `GITHUB_ID` and `GITHUB_SECRET` are set in `.env`
- Verify callback URL in GitHub OAuth app settings matches: `http://localhost:3000/api/auth/callback/github`
- Make sure the GitHub account has been authorized

### Not getting ADMIN role
- Check `src/lib/auth.ts` line 57-67 for auto-admin logic
- Currently grants ADMIN to any GitHub user
- Can be modified to restrict to specific email/username

## Admin Routes

After signing in at `/admin/login`, you can access:

- `/admin` - Dashboard with stats
- `/admin/seo` - SEO pages & keywords management
- `/admin/content` - Article ideas pipeline
- `/admin/ai` - AI Workbench with Nova

## Security Notes

- Admin login is separate from user login
- Only users with `role = "ADMIN"` can access `/admin/*` routes
- Non-admin users are redirected to `/app`
- GitHub OAuth automatically grants ADMIN role (modify in `auth.ts` for production)
