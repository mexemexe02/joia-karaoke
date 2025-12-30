# Setup Guide - Joia Karaoke

## Quick Start (5 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in:
   - Name: `joia-karaoke` (or whatever you like)
   - Database Password: (save this!)
   - Region: Choose closest to you
4. Wait ~2 minutes for project to initialize

### Step 2: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql`
4. Paste into the editor
5. Click **Run** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

### Step 3: Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

### Step 4: Configure Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and paste your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```

### Step 5: Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 6: First Sign-In

1. You'll see an auth modal
2. Enter your email
3. Check your email for magic link
4. Click the link to sign in
5. You're in! 🎉

## Adding Your First Songs

### Option 1: Add Existing YouTube Karaoke

1. Find a karaoke video on YouTube (search "song name karaoke")
2. Copy the URL
3. Click "Add Song" in the app
4. Fill in:
   - Title: Song name
   - Artist: Artist name
   - Source Type: YouTube
   - Source URL: Paste YouTube URL
5. Click "Add Song"

### Option 2: Add Custom Karaoke (Advanced)

1. Create karaoke track (see README.md for tools)
2. Upload to YouTube as **Unlisted**
3. Copy the YouTube URL
4. Add to catalog (same as Option 1)

## Deploying to Coolify

### Prerequisites

- Coolify instance running
- GitHub account
- Repository pushed to GitHub

### Steps

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **In Coolify**:
   - Create new application
   - Connect GitHub repository
   - Select your repo
   - Build pack: **Next.js** (auto-detected)
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Deploy!

3. **Access your app**:
   - Coolify will give you a URL
   - Open it and sign in
   - Start adding songs!

## Sharing with Your Cousin

### Method 1: Same Account (Simplest)

Just share your login credentials. Not ideal for security, but fastest.

### Method 2: Separate Accounts (Recommended)

1. In Supabase dashboard, go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter your cousin's email
4. Set a temporary password
5. Your cousin signs in with email/password
6. They can change password after first login

### Method 3: Open Registration (Most Flexible)

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Enable **Email** provider
3. Enable **Enable email confirmations** (optional but recommended)
4. Users can now sign up themselves!

## Troubleshooting

### "Missing Supabase environment variables"

- Make sure `.env.local` exists
- Check that variables start with `NEXT_PUBLIC_`
- Restart dev server after changing `.env.local`

### "Error fetching songs"

- Check Supabase dashboard → SQL Editor
- Verify `songs` table exists
- Check RLS policies are enabled (they should be from schema.sql)

### Can't sign in

- Check Supabase → Authentication → Settings
- Verify Email provider is enabled
- Check spam folder for magic link

### YouTube videos won't play

- Make sure URL is a valid YouTube link
- Try opening URL directly in browser first
- Some videos may be region-restricted

## Next Steps

1. Add 10-20 songs to test
2. Test on your Google TV (open the app URL in TV browser)
3. Create your first custom karaoke track
4. Invite your cousin!

## Support

If you run into issues:
1. Check Supabase logs (Dashboard → Logs)
2. Check browser console for errors
3. Verify all environment variables are set
4. Make sure database schema ran successfully


