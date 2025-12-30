# 🚀 Coolify Deployment - Ready to Deploy!

**GitHub Repo:** https://github.com/mexemexe02/joia-karaoke

## Quick Deploy Steps

### 1. Deploy Backend Service

1. Open **Coolify Dashboard**
2. Click **"New Resource"** → **"Application"**
3. **Source:** GitHub
4. **Repository:** `mexemexe02/joia-karaoke`
5. **Branch:** `main`
6. **Build Pack:** Docker
7. **Dockerfile:** `backend/Dockerfile`
8. **Build Context:** `backend/`
9. **Port:** `8000`
10. **Service Name:** `joia-karaoke-backend`

**Environment Variables:**
```
FRONTEND_URL=https://your-frontend-url.coolify.app
```
(Update after frontend is deployed)

11. Click **"Deploy"**
12. **Wait for deployment** (5-10 minutes)
13. **Note the backend URL** (e.g., `https://backend-xyz.coolify.app`)

---

### 2. Deploy Frontend Service

1. In Coolify, click **"New Resource"** → **"Application"**
2. **Source:** GitHub
3. **Repository:** `mexemexe02/joia-karaoke` (same repo)
4. **Branch:** `main`
5. **Build Pack:** Docker
6. **Dockerfile:** `Dockerfile` (root)
7. **Build Context:** `.` (root)
8. **Port:** `3000`
9. **Service Name:** `joia-karaoke-frontend`

**Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL=https://bqmtyvrfyaejexomxrks.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_zZVygLIPooVaGG63PW7RjA_vxgQPIXS
NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.coolify.app
```
(Use the backend URL from Step 1)

10. Click **"Deploy"**
11. **Wait for deployment** (5-10 minutes)
12. **Note the frontend URL**

---

### 3. Update Backend CORS

1. Go back to **backend service** in Coolify
2. **Environment Variables** → Edit
3. Update `FRONTEND_URL` to your frontend URL:
   ```
   FRONTEND_URL=https://your-frontend-url.coolify.app
   ```
4. **Save** and **Restart** the service

---

### 4. Test!

1. Visit your **frontend URL**
2. You should see the karaoke library
3. Click **"Create Karaoke"** button
4. Paste a YouTube URL (try a short video first)
5. Submit and wait
   - **First time:** 10-20 minutes (downloads AI models)
   - **Subsequent:** 5-10 minutes

---

## ✅ Verification Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Backend CORS updated with frontend URL
- [ ] Can access frontend in browser
- [ ] "Create Karaoke" button works
- [ ] Can submit a YouTube URL

---

## 🐛 Troubleshooting

**Backend won't start:**
- Check Coolify logs
- Ensure Dockerfile is correct
- Check environment variables

**Frontend can't connect to backend:**
- Verify `NEXT_PUBLIC_BACKEND_URL` is correct
- Check backend is running
- Verify CORS settings

**Processing fails:**
- Check backend logs in Coolify
- First run downloads models (be patient)
- Ensure backend has enough RAM (4GB+)

---

**Ready to deploy!** 🚀

