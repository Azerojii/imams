# Setting Up Vercel Blob Storage for Image Uploads

## What is Vercel Blob?
Vercel Blob is a simple file storage solution that works perfectly with Vercel deployments. It provides:
- Fast CDN-backed URLs for your images
- No filesystem write issues (works in production)
- Easy integration with Next.js

## Setup Steps

### 1. Create a Vercel Blob Store
1. Go to https://vercel.com/dashboard/stores
2. Click "Create Database" or "Create Store"
3. Select "Blob" as the store type
4. Name it (e.g., "wikipedia-images")
5. Click "Create"

### 2. Get Your Token
1. After creating the store, you'll see the store dashboard
2. Go to the ".env.local" tab
3. Copy the `BLOB_READ_WRITE_TOKEN` value

### 3. Add to Environment Variables

**For Local Development:**
Add to your `.env` file:
```
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXXXXXX_XXXXXXXXXXXXXXXXX
```

**For Vercel Production:**
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add new variable:
   - Key: `BLOB_READ_WRITE_TOKEN`
   - Value: (paste your token)
   - Environment: Production (and Preview if needed)
4. Click "Save"

### 4. Redeploy (if needed)
If your site is already deployed, you'll need to redeploy for the environment variable to take effect:
- Go to your Vercel project
- Click "Deployments"
- Click the three dots on the latest deployment
- Click "Redeploy"

## How It Works

1. User uploads an image via the ImageUploader component
2. Image is sent to `/api/upload` endpoint
3. API uploads the image to Vercel Blob using `@vercel/blob` package
4. Vercel Blob returns a permanent CDN URL (e.g., `https://xxxxx.public.blob.vercel-storage.com/image.jpg`)
5. This URL is inserted into the markdown
6. Image displays from Vercel's CDN (fast worldwide)

## Free Tier Limits
- 1 GB storage
- 100 GB bandwidth per month
- More than enough for a wiki with images!

## Testing
After setup, try uploading an image in the article editor. If it works, you'll see the image appear immediately!
