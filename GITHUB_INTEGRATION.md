# GitHub Integration Setup Guide

## Enable Admin Panel on Production (Vercel)

Your Wikipedia site can now create/edit/delete articles on production through GitHub API integration.

## Step 1: Create GitHub Personal Access Token

1. Go to [GitHub Settings → Developer Settings → Personal Access Tokens → Tokens (classic)](https://github.com/settings/tokens)
2. Click **Generate new token** → **Generate new token (classic)**
3. Give it a name: `Vercel Wikipedia Admin`
4. Set expiration: **No expiration** (or your preference)
5. Select scopes:
   - ✅ **repo** (check the main "repo" box - this gives full control)
6. Click **Generate token**
7. **⚠️ COPY THE TOKEN NOW** - you won't see it again!

## Step 2: Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add these variables:

### Required Variables:

| Variable | Value | Where to get it |
|----------|-------|-----------------|
| `GITHUB_TOKEN` | Your PAT from Step 1 | Just copied it |
| `GITHUB_OWNER` | Your GitHub username | Your profile (e.g., `dalil`) |
| `GITHUB_REPO` | Your repository name | Repo name (e.g., `wikipedia`) |
| `GITHUB_BRANCH` | `main` | Usually `main` or `master` |
| `VERCEL_DEPLOY_HOOK_URL` | Deploy hook URL | See Step 2a below |

### Step 2a: Create Vercel Deploy Hook

1. In your Vercel project, go to **Settings** → **Git** 
2. Scroll to **Deploy Hooks** section
3. Click **Create Hook**
4. Name it: `Admin Panel Auto Deploy`
5. Branch: `main` (or your default branch)
6. Click **Create Hook**
7. **Copy the URL** (looks like: `https://api.vercel.com/v1/integrations/deploy/...`)
8. Add this as `VERCEL_DEPLOY_HOOK_URL` environment variable

### Example:
```
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxx
GITHUB_OWNER=dalil
GITHUB_REPO=wikipedia
GITHUB_BRANCH=main
VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/xxxxxxx
```

**Important:** For each variable, select **Production, Preview, Development** (all environments)

## Step 3: Redeploy

1. Go to **Deployments** tab in Vercel
2. Click on latest deployment
3. Click **•••** → **Redeploy**
4. Wait for deployment to complete

## Step 4: Test It!

1. Go to `https://your-site.vercel.app/admin`
2. Log in with your admin credentials
3. Try creating a new article
4. It will:
   - Commit the file to GitHub
   - Trigger automatic Vercel redeployment (via Deploy Hook)
   - Article appears live in ~30-60 seconds (much faster than before!)

## How It Works

**Local Development:**
- Uses file system (instant, no GitHub needed)
- Works as before

**Production (Vercel):**
- Detects you're on Vercel
- Uses GitHub API to commit changes
- Vercel webhook triggers automatic redeploy
- New content appears after deployment

## Troubleshooting

### "Failed to create article" on production

**Check:**
1. All 4 GitHub variables are set in Vercel
2. GitHub token has `repo` scope
3. `GITHUB_OWNER` and `GITHUB_REPO` are correct
4. Token hasn't expired

### How to get your GitHub info:

Your repo URL: `https://github.com/OWNER/REPO`
- `OWNER` = your username
- `REPO` = repository name

Example: `https://github.com/dalil/wikipedia`
- `GITHUB_OWNER=dalil`
- `GITHUB_REPO=wikipedia`

### Still having issues?

Check Vercel Function Logs:
1. Go to your project in Vercel
2. Click **Functions** tab
3. Look for errors in recent invocations

## Security Notes

⚠️ **Keep your GitHub token secure!**
- Never commit it to your repository
- Never share it publicly
- If leaked, regenerate immediately at GitHub settings
- The token has full access to your repository

✅ **This is safe because:**
- Token is stored securely in Vercel environment variables
- Only your admin panel can trigger changes
- All changes are tracked in Git history
- You can revoke the token anytime

## Benefits

✅ Full admin panel functionality on production
✅ All changes tracked in Git (audit trail)
✅ Automatic deployments
✅ No database needed
✅ Completely free
✅ Works locally without GitHub
