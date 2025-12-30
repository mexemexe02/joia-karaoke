# Karaoke Creation Workflow Guide

This guide walks you through creating custom karaoke tracks with synced lyrics, from source audio to playable MP4.

## Overview

Your karaoke creation pipeline:
1. **Source Audio** → Get the original song
2. **Remove Vocals** → Use Moises/Kits AI
3. **Sync Lyrics** → Time lyrics to music
4. **Render Video** → Create MP4 with lyrics overlay
5. **Upload & Add** → Upload to YouTube (Unlisted) and add to catalog

## Step-by-Step Workflow

### Step 1: Get Source Audio

**Options:**
- Purchase from iTunes/Amazon Music (DRM-free)
- Use your own CD rips
- Legal streaming downloads (if allowed by service)

**Format:** MP3 or WAV (WAV preferred for quality)

### Step 2: Remove Vocals

#### Option A: Moises AI

1. Go to [moises.ai](https://moises.ai)
2. Upload your audio file
3. Select "Vocal Remover" or "Stem Separation"
4. Download the instrumental track
5. Export as WAV or high-quality MP3

**Pros:** Easy, web-based, good quality
**Cons:** Requires subscription for full features

#### Option B: Kits AI

1. Go to [kits.ai](https://kits.ai)
2. Upload audio
3. Use vocal removal feature
4. Download instrumental

**Pros:** Good quality, AI-powered
**Cons:** May require subscription

#### Option C: Ultimate Vocal Remover (UVR) - Free & Open Source

1. Download from [GitHub - UVR](https://github.com/Anjok07/ultimatevocalremovergui)
2. Install (Windows/Mac/Linux)
3. Load your audio
4. Choose model (MDX-Net recommended)
5. Process and export

**Pros:** Free, offline, excellent quality
**Cons:** Requires installation, more technical

### Step 3: Get Lyrics

**Sources:**
- Official lyrics from artist website
- Genius.com (usually accurate)
- Lyrics.com
- Manual transcription (most accurate)

**Format:** Plain text, one line per verse/chorus

### Step 4: Sync Lyrics to Music

#### Option A: karlyriceditor (Easiest)

1. Download from [GitHub - karlyriceditor](https://github.com/karlyriceditor/karlyriceditor)
2. Open application
3. Load your instrumental audio
4. Paste lyrics
5. Click through song, timing each line:
   - Click when line should start
   - Click when next line should start
6. Preview sync
7. Export as:
   - ASS subtitle file (for Aegisub)
   - Direct MP4 video (easiest!)

**Pros:** Simple GUI, can export directly to MP4
**Cons:** Less precise than Aegisub

#### Option B: Aegisub (Professional)

1. Download [Aegisub](https://aegisub.org)
2. Open Aegisub
3. Load your instrumental audio (Video → Open Audio)
4. Paste lyrics into subtitle editor
5. Use karaoke timing:
   - Select line
   - Press `Ctrl+K` for karaoke mode
   - Time each syllable/word
   - Use `\k` tags for precise timing
6. Style your lyrics (colors, fonts, positioning)
7. Export as ASS file

**Pros:** Professional control, precise timing, beautiful styling
**Cons:** Steeper learning curve

**Aegisub Tutorial Resources:**
- [Karaoke Mugen Documentation](https://karaoke.mugen.in.th/en/) - Great karaoke timing guide
- YouTube: "Aegisub karaoke tutorial"

### Step 5: Render Video with Lyrics

#### Method 1: karlyriceditor Direct Export

If you used karlyriceditor:
1. After syncing, click "Export Video"
2. Choose background:
   - Static image
   - Color gradient
   - Video loop (optional)
3. Set resolution (1080p recommended)
4. Export MP4

#### Method 2: FFmpeg with ASS Subtitles

If you have ASS file from Aegisub:

```bash
# Install FFmpeg first (if not installed)
# Windows: Download from ffmpeg.org
# Mac: brew install ffmpeg
# Linux: sudo apt install ffmpeg

# Render video with burned-in subtitles
ffmpeg -i instrumental.mp3 \
       -loop 1 -i background.jpg \
       -vf "subtitles=lyrics.ass:force_style='FontSize=24,PrimaryColour=&Hffffff,OutlineColour=&H000000,Outline=2'" \
       -c:v libx264 -preset medium -crf 23 \
       -c:a aac -b:a 192k \
       -shortest \
       -pix_fmt yuv420p \
       output.mp4
```

**Background Options:**
- Static image (album art, gradient)
- Video loop (subtle animation)
- Simple color background

#### Method 3: HandBrake (GUI Alternative)

1. Download [HandBrake](https://handbrake.fr)
2. Load your audio
3. Add subtitle file (ASS)
4. Set to burn in subtitles
5. Add background image/video
6. Encode to MP4

### Step 6: Upload to YouTube (Unlisted)

1. Go to [YouTube Studio](https://studio.youtube.com)
2. Click "Create" → "Upload videos"
3. Select your MP4 file
4. Set visibility to **Unlisted**
5. Add title: `[Artist] - [Song] (Karaoke)`
6. Add description (optional)
7. Upload
8. Copy the video URL

### Step 7: Add to Your Catalog

1. Open your Joia Karaoke app
2. Click "Add Song"
3. Fill in:
   - Title: Song name
   - Artist: Artist name
   - Type: YouTube
   - Source URL: Paste YouTube URL
   - Add metadata (key, tempo, language, duet)
4. Save!

## Quick Reference: Tool Stack

### For Beginners
1. **Moises AI** → Remove vocals
2. **karlyriceditor** → Sync lyrics + export video
3. **YouTube** → Upload unlisted
4. **Done!**

### For Quality Enthusiasts
1. **UVR** → Remove vocals (better quality)
2. **Aegisub** → Professional lyric timing
3. **FFmpeg** → Render with custom styling
4. **YouTube** → Upload unlisted
5. **Done!**

## Tips & Best Practices

### Vocal Removal
- Use high-quality source audio (320kbps MP3 or WAV)
- Try different models if first attempt isn't perfect
- Some songs work better than others (depends on mix)

### Lyric Timing
- Start with karlyriceditor to learn
- Move to Aegisub when you want more control
- Practice makes perfect - first few songs take longer

### Video Styling
- Use readable fonts (Arial, Helvetica, sans-serif)
- High contrast (white text, black outline)
- Large font size for TV viewing (24-32pt)
- Position lyrics in lower third of screen

### File Organization
```
Karaoke Projects/
  ├── Source Audio/
  │   └── Artist - Song.mp3
  ├── Instrumentals/
  │   └── Artist - Song (Instrumental).wav
  ├── Lyrics/
  │   └── Artist - Song.txt
  ├── Subtitles/
  │   └── Artist - Song.ass
  └── Videos/
      └── Artist - Song (Karaoke).mp4
```

## Time Estimates

- **First song**: 2-3 hours (learning tools)
- **After practice**: 30-60 minutes per song
- **With workflow**: 20-30 minutes per song

## Troubleshooting

### Vocals still audible
- Try different vocal removal model
- Use higher quality source
- Some songs are harder (heavy reverb, effects)

### Lyrics out of sync
- Re-time in editor
- Check audio tempo matches original
- Verify instrumental is same length as original

### Video won't upload
- Check file size (YouTube limit: 256GB, but 2GB recommended)
- Verify codec (H.264 video, AAC audio)
- Try re-encoding with HandBrake

## Resources

- **Karaoke Mugen**: [karaoke.mugen.in.th](https://karaoke.mugen.in.th/en/) - Excellent timing guides
- **Aegisub Manual**: [aegisub.org/docs](https://aegisub.org/docs/)
- **FFmpeg Guide**: [ffmpeg.org/documentation](https://ffmpeg.org/documentation.html)
- **UVR Models**: Check UVR GitHub for latest models

## Next Steps

1. Create your first karaoke track (start simple!)
2. Add it to your catalog
3. Test on Google TV
4. Refine your workflow
5. Build your library!


