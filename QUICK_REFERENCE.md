# Quick Reference Card

## 🚀 Getting Started (First Time)

1. **Supabase Setup**
   - Create project at supabase.com
   - Run `supabase/schema.sql` in SQL Editor
   - Copy URL and anon key

2. **Local Setup**
   ```bash
   npm install
   cp env.example .env.local
   # Edit .env.local with your Supabase keys
   npm run dev
   ```

3. **First Sign-In**
   - Open http://localhost:3000
   - Enter email
   - Check email for magic link
   - Sign in!

## ➕ Adding Songs

### YouTube Karaoke (Fast)
1. Find karaoke on YouTube
2. Copy URL
3. Click "Add Song"
4. Fill: Title, Artist, paste URL
5. Save

### Custom Karaoke (Quality)
1. Remove vocals (Moises/Kits AI)
2. Sync lyrics (karlyriceditor)
3. Export MP4
4. Upload to YouTube (Unlisted)
5. Add to catalog (paste YouTube URL)

## 🎵 Playing Songs

1. Browse or search library
2. Click song card
3. Opens in YouTube
4. Play on TV!

## 🔍 Search & Filters

- **Search**: Type artist or title
- **Language**: Filter by language
- **Duet**: Show only duets/solos

## 👥 Sharing with Cousin

**Option 1**: Share your login
**Option 2**: Create account in Supabase dashboard
**Option 3**: Enable sign-up in Supabase

## 📺 TV Setup

1. Open app URL in TV browser
2. Navigate with remote
3. Click songs to play
4. YouTube opens automatically

## 🛠️ Tools for Custom Karaoke

- **Vocal Removal**: Moises AI, Kits AI, UVR
- **Lyric Sync**: karlyriceditor (easy), Aegisub (pro)
- **Video Render**: karlyriceditor or FFmpeg

## 📁 File Organization

```
Karaoke Projects/
  ├── Source Audio/
  ├── Instrumentals/
  ├── Lyrics/
  ├── Subtitles/
  └── Videos/
```

## 🔗 Useful Links

- **Moises**: moises.ai
- **Kits AI**: kits.ai
- **karlyriceditor**: GitHub - karlyriceditor
- **Aegisub**: aegisub.org
- **UVR**: GitHub - ultimatevocalremovergui

## ⚡ Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint
```

## 🐛 Troubleshooting

**Can't sign in?**
- Check Supabase Auth settings
- Verify email provider enabled

**Songs not loading?**
- Check Supabase connection
- Verify schema ran successfully
- Check browser console

**YouTube won't play?**
- Verify URL is valid
- Try opening URL directly
- Check region restrictions

## 📝 Song Metadata Tips

- **Key**: Musical key (C, Am, F#m)
- **Tempo**: BPM (beats per minute)
- **Language**: en, es, pt, etc.
- **Duet**: Check if song is duet
- **Notes**: Any extra info

## 🎯 Workflow Tips

1. **Start with YouTube**: Add 20-30 existing karaoke first
2. **Create custom**: Only for songs that don't exist or suck
3. **Batch add**: Add multiple YouTube songs quickly
4. **Organize**: Use consistent naming (Artist - Title)

## 🔮 Future: Jellyfin

When ready:
1. Set up Jellyfin server
2. Upload MP4s
3. Update `source_url` to Jellyfin URL
4. Change `type` to `'local'`
5. Done! No code changes needed.

---

**Need help?** Check SETUP.md for detailed instructions.


