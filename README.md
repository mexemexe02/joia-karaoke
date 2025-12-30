# 🎤 Joia Karaoke

A shared karaoke library system that supports both YouTube karaoke videos and custom-created tracks. Designed for TV playback via Google TV/Chromecast with future support for local Jellyfin hosting.

## Features

- **Hybrid Song Sources**: Add YouTube karaoke links or custom local MP4s
- **TV-Friendly Interface**: Large buttons and touch targets optimized for TV navigation
- **Shared Access**: Multi-user support for sharing with family/friends
- **Smart Search & Filters**: Find songs by artist, title, language, or duet status
- **Future-Proof**: Built to support Jellyfin integration (Phase B) without code changes

## Architecture

### Phase A (Current): YouTube-First
- All songs play via YouTube (existing karaoke or unlisted custom uploads)
- Zero server maintenance
- Perfect Google TV integration

### Phase B (Future): Jellyfin Support
- Local MP4 hosting via Jellyfin
- Mixed mode: YouTube + local songs in one catalog
- No code changes needed - just update `source_url` in database

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Coolify-ready

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Copy your project URL and anon key

### 2. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Coolify

1. Push to GitHub
2. In Coolify, create a new application
3. Connect your GitHub repo
4. Set environment variables
5. Deploy!

## Creating Custom Karaoke Tracks

### Workflow

1. **Remove Vocals**: Use Moises or Kits AI to create instrumental track
2. **Sync Lyrics**: 
   - Fast option: [karlyriceditor](https://github.com/karlyriceditor/karlyriceditor)
   - Pro option: Aegisub (for precise karaoke timing)
3. **Render MP4**: Export video with lyrics burned in
4. **Upload**: Upload to YouTube as Unlisted
5. **Add to Catalog**: Paste YouTube URL in the app

### Tools Reference

- **Vocal Removal**: Moises AI, Kits AI, or UVR (Ultimate Vocal Remover)
- **Lyric Sync**: karlyriceditor (GUI) or Aegisub (pro)
- **Video Rendering**: FFmpeg or karlyriceditor's built-in export

## Database Schema

The `songs` table supports:
- YouTube links (Phase A)
- Local/Jellyfin URLs (Phase B)
- Metadata: key, tempo, language, duet status
- Full-text search

See `supabase/schema.sql` for complete schema.

## Usage

### Adding Songs

1. Click "Add Song" button
2. Fill in title, artist, and source URL
3. For YouTube: paste any karaoke video URL
4. For custom: upload to YouTube (Unlisted) first, then paste URL
5. Add optional metadata (key, tempo, language, duet)

### Playing Songs

1. Browse or search your library
2. Click any song card
3. Opens in YouTube (or Jellyfin in Phase B)
4. Play on your Google TV!

### Sharing with Family

1. Invite users via Supabase Auth
2. They sign in with email
3. Same catalog, same access
4. No file sharing needed!

## Future: Jellyfin Integration (Phase B)

When ready to host local MP4s:

1. Set up Jellyfin server
2. Upload MP4s to Jellyfin library
3. For each song, update `source_url` to Jellyfin playback URL
4. Change `type` to `'local'`
5. Done! UI automatically handles both types

## Legal Notes

- Linking to existing YouTube karaoke videos is generally safe
- Unlisted uploads for private/family use are common practice
- Public sharing of custom karaoke tracks may have copyright implications
- This system is designed for private/family use

## Contributing

This is a personal project, but feel free to fork and adapt for your own karaoke needs!

## License

MIT


