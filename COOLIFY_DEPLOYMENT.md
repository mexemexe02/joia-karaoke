# 🚀 Coolify Deployment Guide

Deploy both frontend and backend to Coolify.

## Architecture

- **Frontend**: Next.js app (port 3000)
- **Backend**: FastAPI service (port 8000)
- **Database**: Supabase (external)

---

## 📦 Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Add karaoke automation backend"
git push origin main
```

### 2. Deploy Backend (FastAPI)

1. **In Coolify Dashboard:**
   - Click "New Resource" → "Application"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Backend Service:**
   - **Name**: `joia-karaoke-backend`
   - **Build Pack**: Docker
   - **Dockerfile Location**: `backend/Dockerfile`
   - **Port**: `8000`
   - **Build Context**: `backend/`

3. **Environment Variables:**
   ```
   FRONTEND_URL=https://your-frontend-domain.com
   YOUTUBE_CLIENT_ID=your_youtube_client_id (optional, Phase 2)
   YOUTUBE_CLIENT_SECRET=your_youtube_client_secret (optional, Phase 2)
   YOUTUBE_REFRESH_TOKEN=your_refresh_token (optional, Phase 2)
   ```

4. **Deploy!**
   - Coolify will build and deploy
   - Note the backend URL (e.g., `https://backend-xyz.coolify.app`)

### 3. Deploy Frontend (Next.js)

1. **In Coolify Dashboard:**
   - Click "New Resource" → "Application"
   - Connect your GitHub repository (same repo)

2. **Configure Frontend Service:**
   - **Name**: `joia-karaoke-frontend`
   - **Build Pack**: Docker
   - **Dockerfile Location**: `Dockerfile` (root)
   - **Port**: `3000`
   - **Build Context**: `.` (root)

3. **Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://bqmtyvrfyaejexomxrks.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_zZVygLIPooVaGG63PW7RjA_vxgQPIXS
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.coolify.app
   ```

4. **Deploy!**
   - Coolify will build and deploy
   - Note the frontend URL

### 4. Update Backend CORS

After frontend is deployed, update backend environment variable:

```
FRONTEND_URL=https://your-frontend-domain.coolify.app
```

Then redeploy backend (or restart).

---

## 🔧 Post-Deployment

### Verify Backend

1. Visit: `https://your-backend-domain.coolify.app/health`
2. Should return: `{"status": "healthy"}`

### Verify Frontend

1. Visit your frontend URL
2. Should see the karaoke library
3. Click "Create Karaoke" button
4. Test the connection to backend

### Test Pipeline

1. Click "Create Karaoke"
2. Paste a YouTube URL
3. Submit
4. Check job status via API or UI

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Backend won't start
- **Check:** Docker logs in Coolify
- **Common:** Missing FFmpeg or Python dependencies
- **Fix:** Ensure Dockerfile installs all dependencies

**Problem:** CORS errors
- **Check:** Frontend URL in backend environment variables
- **Fix:** Update `FRONTEND_URL` and restart

### Frontend Issues

**Problem:** Can't connect to backend
- **Check:** `NEXT_PUBLIC_BACKEND_URL` environment variable
- **Fix:** Update to correct backend URL

**Problem:** Build fails
- **Check:** Node version (should be 20+)
- **Fix:** Update Dockerfile if needed

### Processing Issues

**Problem:** Jobs fail
- **Check:** Backend logs in Coolify
- **Common:** Missing FFmpeg, Spleeter models, or Whisper models
- **Fix:** First run downloads models automatically (may take time)

---

## 📊 Resource Requirements

### Backend
- **CPU**: 2+ cores recommended
- **RAM**: 4GB+ (for AI models)
- **Storage**: 10GB+ (for temporary files)
- **GPU**: Optional but recommended for faster processing

### Frontend
- **CPU**: 1 core
- **RAM**: 1GB
- **Storage**: 1GB

---

## 🔄 Updates

To update either service:

1. Push changes to GitHub
2. Coolify will auto-detect (if webhook configured)
3. Or manually trigger rebuild in Coolify dashboard

---

## 📝 Notes

- Backend processes videos asynchronously
- First video may take longer (model downloads)
- Temporary files are stored in `/tmp` (cleared on restart)
- For production, consider persistent storage for temp files
- Add Redis/Celery for better job management (Phase 3)

---

**Status:** Ready for deployment! 🚀

