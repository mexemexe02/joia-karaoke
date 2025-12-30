# 🚀 Quick Deploy Guide

## Step 1: Push to GitHub

**If you don't have a GitHub repo yet:**

```bash
# Create repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/joia-karaoke.git
git branch -M main
git push -u origin main
```

**If you already have a repo:**

```bash
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

## Step 2: Deploy Backend in Coolify

1. **Open Coolify Dashboard**
2. **New Resource** → **Application**
3. **Connect GitHub** → Select your repo
4. **Configure:**
   - **Name**: `joia-karaoke-backend`
   - **Build Pack**: Docker
   - **Dockerfile**: `backend/Dockerfile`
   - **Build Context**: `backend/`
   - **Port**: `8000`
5. **Environment Variables:**
   ```
   FRONTEND_URL=https://your-frontend-domain.coolify.app
   ```
   (Update this after frontend is deployed)
6. **Deploy!**
7. **Note the backend URL** (e.g., `https://backend-xyz.coolify.app`)

## Step 3: Deploy Frontend in Coolify

1. **New Resource** → **Application**
2. **Connect GitHub** → Same repo
3. **Configure:**
   - **Name**: `joia-karaoke-frontend`
   - **Build Pack**: Docker
   - **Dockerfile**: `Dockerfile` (root)
   - **Build Context**: `.` (root)
   - **Port**: `3000`
4. **Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://bqmtyvrfyaejexomxrks.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_zZVygLIPooVaGG63PW7RjA_vxgQPIXS
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.coolify.app
   ```
   (Use the backend URL from Step 2)
5. **Deploy!**
6. **Note the frontend URL**

## Step 4: Update Backend CORS

1. Go back to backend service in Coolify
2. Update environment variable:
   ```
   FRONTEND_URL=https://your-frontend-url.coolify.app
   ```
3. **Restart** the backend service

## Step 5: Test!

1. Visit your frontend URL
2. Click **"Create Karaoke"**
3. Paste a YouTube URL
4. Submit and wait (first time will download models - 10-20 min)

---

## ⚠️ Important Notes

- **First video processing takes 10-20 minutes** (model downloads)
- **Backend needs 4GB+ RAM** for AI processing
- **Check Coolify logs** if something fails
- **Models download automatically** on first use

---

**Ready? Let's deploy!** 🚀

