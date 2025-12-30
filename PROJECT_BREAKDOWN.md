# Project Breakdown: Joia Karaoke System

## Overview

A hybrid karaoke library system that supports both YouTube karaoke videos (Phase A) and custom-created tracks with future Jellyfin hosting (Phase B). Designed for TV playback and shared family access.

## Architecture Decisions

### Why This Approach?

1. **YouTube-First (Phase A)**: Zero infrastructure, instant sharing, perfect TV integration
2. **Future-Proof Design**: Database schema supports local hosting without code changes
3. **TV-Optimized UI**: Large touch targets, simple navigation, works with remote
4. **Shared Access**: Multi-user support via Supabase Auth

## Project Structure

```
joia-karaoke/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main library page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── SongCard.tsx       # Song display card
│   ├── SearchBar.tsx      # Search input
│   ├── FilterBar.tsx      # Language/duet filters
│   ├── AddSongButton.tsx  # Add song trigger
│   ├── AddSongModal.tsx   # Song creation form
│   └── AuthModal.tsx      # Authentication UI
├── lib/                   # Utilities
│   └── supabase.ts        # Supabase client & types
├── supabase/              # Database
│   └── schema.sql         # Complete database schema
├── package.json           # Dependencies
├── README.md              # Main documentation
├── SETUP.md               # Setup instructions
├── KARAOKE_CREATION_GUIDE.md  # How to create karaoke tracks
└── PROJECT_BREAKDOWN.md   # This file
```

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icons

### Backend/Database
- **Supabase**: PostgreSQL database + Auth
- **Row Level Security**: Secure data access

### Deployment
- **Coolify**: Self-hosted deployment platform
- **GitHub**: Version control

## Database Schema

### Core Tables

#### `songs` (Main Catalog)
- Stores all song metadata
- Supports both `youtube` and `local` types
- Full-text search enabled
- Indexed for fast queries

#### `tags` (Optional)
- Genre/mood tags
- Color coding

#### `song_tags` (Junction)
- Many-to-many relationship
- Not required for MVP

#### `users` (Future)
- User management
- Currently handled by Supabase Auth

### Key Design Decisions

1. **`type` enum**: Explicitly supports YouTube vs Local
2. **`source_url`**: Single field handles both types
3. **RLS Policies**: Open read, authenticated write
4. **Full-text search**: PostgreSQL GIN index

## Component Architecture

### Page Components

**`app/page.tsx`** (Main Library)
- Fetches songs from Supabase
- Manages filters and search
- Handles playback (opens YouTube)
- Shows auth modal if needed

### Reusable Components

**`SongCard`**
- Displays song info
- Shows YouTube thumbnail
- TV-friendly click target
- Visual type indicator

**`SearchBar`**
- Real-time search
- Filters by title/artist

**`FilterBar`**
- Language dropdown
- Duet toggle
- Dynamic options from data

**`AddSongModal`**
- Form for new songs
- Validates YouTube URLs
- Supports both types
- Error handling

**`AuthModal`**
- Supabase Auth UI
- Magic link support
- Email/password

## Data Flow

### Adding a Song

1. User clicks "Add Song"
2. Modal opens with form
3. User fills in details
4. Form validates (especially YouTube URL)
5. Insert to Supabase `songs` table
6. Refresh library
7. New song appears

### Playing a Song

1. User clicks song card
2. `onPlay` handler called
3. `window.open(song.source_url)`
4. Opens in new tab/window
5. On TV: Opens YouTube app (if URL is YouTube)

### Searching/Filtering

1. User types in search or changes filter
2. `useEffect` triggers `filterSongs()`
3. Filters applied to `songs` array
4. `filteredSongs` state updated
5. UI re-renders with filtered results

## Phase A vs Phase B

### Phase A (Current): YouTube-Only

**How it works:**
- All `source_url` values are YouTube links
- All `type` values are `'youtube'`
- Playback = open YouTube URL
- Zero server maintenance

**Pros:**
- Instant setup
- No storage costs
- Perfect TV integration
- Easy sharing

**Cons:**
- YouTube ads (unless Premium)
- Quality depends on upload
- Potential takedowns (rare for unlisted)

### Phase B (Future): Jellyfin Integration

**What changes:**
- Some songs have `type = 'local'`
- `source_url` points to Jellyfin playback URL
- UI automatically handles both types
- No code changes needed!

**Migration path:**
1. Set up Jellyfin server
2. Upload MP4s to Jellyfin
3. For each song, update:
   - `type` → `'local'`
   - `source_url` → Jellyfin URL
4. Done!

**Mixed mode:**
- 70% YouTube (existing karaoke)
- 20% YouTube unlisted (custom)
- 10% Jellyfin (premium local)
- All in one catalog!

## Authentication Flow

### Current Setup
- Supabase Auth with email
- Magic link support
- Row Level Security enabled
- Open read, authenticated write

### Sharing with Cousin

**Option 1: Same Account**
- Share credentials
- Simple but less secure

**Option 2: Separate Accounts**
- Create user in Supabase dashboard
- Cousin signs in with email/password
- Same catalog access

**Option 3: Open Registration**
- Enable sign-up in Supabase
- Cousin creates own account
- Most flexible

## TV Compatibility

### Google TV / Chromecast

**How it works:**
1. Open app URL in TV browser
2. Navigate with remote
3. Click song
4. YouTube URL opens in YouTube app
5. Play!

**Optimizations:**
- Large touch targets (48px minimum)
- High contrast colors
- Simple navigation
- Keyboard-friendly (remote = keyboard)

### Future: Casting Support

Could add:
- Chromecast SDK integration
- Direct casting from app
- Queue management
- Currently: Simple URL opening works great

## Deployment Strategy

### Development
- Local: `npm run dev`
- Test on local network
- Access from TV via `http://your-ip:3000`

### Production (Coolify)
1. Push to GitHub
2. Connect repo in Coolify
3. Set environment variables
4. Deploy
5. Access via Coolify URL

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Security Considerations

### Current
- Supabase RLS policies
- Public read (by design - family library)
- Authenticated write
- No sensitive data stored

### Future Enhancements
- User-specific playlists
- Private songs (user-only)
- Admin roles
- Rate limiting

## Performance Optimizations

### Current
- Client-side filtering (fast for <1000 songs)
- Indexed database queries
- Image optimization (Next.js Image)
- Lazy loading (future)

### Future
- Server-side search (PostgreSQL full-text)
- Pagination
- Virtual scrolling
- CDN for assets

## Testing Strategy

### Manual Testing
1. Add YouTube song → Verify appears
2. Search → Verify filtering
3. Click play → Verify YouTube opens
4. Add custom song → Verify workflow
5. Test on TV → Verify navigation

### Future: Automated
- Unit tests (components)
- Integration tests (Supabase)
- E2E tests (Playwright)

## Known Limitations

1. **No video preview**: Just opens YouTube
2. **No queue system**: One song at a time
3. **No offline mode**: Requires internet
4. **No casting**: Relies on YouTube app
5. **Client-side filtering**: May slow with 1000+ songs

## Future Enhancements

### Phase 2 Features
- Playlists
- Favorites
- Recently played
- Song requests (cousin can request)

### Phase 3 Features
- Jellyfin integration
- Direct video playback (no YouTube)
- Queue system
- Mobile app

### Phase 4 Features
- AI lyric sync (automatic)
- Vocal removal integration
- Batch import
- Analytics

## Maintenance

### Regular Tasks
- Add new songs
- Update metadata
- Clean up duplicates
- Backup database (Supabase handles this)

### Monitoring
- Check Supabase dashboard
- Monitor errors (browser console)
- User feedback

## Success Metrics

### Phase A Goals
- ✅ 50+ songs in library
- ✅ Cousin can access
- ✅ Works on Google TV
- ✅ Easy song addition

### Phase B Goals
- ✅ 10+ custom karaoke tracks
- ✅ Jellyfin integration working
- ✅ Mixed YouTube/local playback
- ✅ Zero code changes needed

## Conclusion

This system is designed to:
1. **Start simple**: YouTube-only, zero infrastructure
2. **Scale gracefully**: Add custom tracks as needed
3. **Future-proof**: Jellyfin ready without rewrite
4. **Family-friendly**: Easy sharing, TV-optimized

The architecture supports your workflow:
- Quick wins: Add existing YouTube karaoke
- Premium tracks: Create custom with Moises/Kits
- Future growth: Migrate to Jellyfin when ready

No wasted work. No dead ends. Just a karaoke library that grows with you.


