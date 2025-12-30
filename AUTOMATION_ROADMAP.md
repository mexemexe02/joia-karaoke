# 🎤 Joia Karaoke - Full Automation Roadmap

## Vision: Complete Automation Pipeline

**Goal:** User pastes YouTube URL → App automatically creates karaoke video → Adds to library

**Workflow:**
1. User inputs YouTube URL
2. Download video/audio
3. Remove vocals (AI)
4. Extract/sync lyrics (AI)
5. Render karaoke video
6. Upload to YouTube (or host locally)
7. Auto-add to library

---

## 🛠️ Tools & Libraries to Integrate

### 1. YouTube Download
**Tool:** `yt-dlp` (fork of youtube-dl)
- **GitHub:** https://github.com/yt-dlp/yt-dlp
- **Language:** Python
- **Usage:** Download video/audio from YouTube
- **Install:** `pip install yt-dlp`
- **API:** Command-line tool, can be wrapped in Python

### 2. Vocal Removal / Source Separation
**Option A: Ultimate Vocal Remover (UVR)**
- **GitHub:** https://github.com/Anjok07/ultimatevocalremovergui
- **Language:** Python
- **Type:** GUI app, but has CLI/API capabilities
- **Models:** Pre-trained AI models for vocal separation
- **Quality:** Excellent, industry-standard

**Option B: Spleeter (by Deezer)**
- **GitHub:** https://github.com/deezer/spleeter
- **Language:** Python
- **Type:** Library/API
- **Install:** `pip install spleeter`
- **Quality:** Good, easier to integrate

**Option C: Moises API** (Commercial)
- **API:** https://moises.ai/api
- **Type:** Cloud API
- **Cost:** Pay-per-use
- **Quality:** Excellent, no local processing needed

**Option D: Demucs**
- **GitHub:** https://github.com/facebookresearch/demucs
- **Language:** Python
- **Type:** Library
- **Quality:** Very good, open-source

### 3. Lyrics Extraction & Sync
**Option A: OpenAI Whisper**
- **GitHub:** https://github.com/openai/whisper
- **Language:** Python
- **Type:** Library
- **Capabilities:** Transcribe audio → Get lyrics + timing
- **Install:** `pip install openai-whisper`
- **Quality:** Excellent, automatic timing

**Option B: Lyrics APIs**
- **Genius API:** https://genius.com/api-clients
- **Musixmatch API:** https://developer.musixmatch.com/
- **Lyrics.ovh:** Free API (no sync timing)

**Option C: Manual Input + Auto-Sync**
- User provides lyrics
- Use audio analysis to sync timing
- Libraries: `aubio`, `librosa` for beat detection

### 4. Video Rendering with Lyrics
**Tool: FFmpeg**
- **Website:** https://ffmpeg.org/
- **Language:** C (wrappers: Python, Node.js)
- **Python Wrapper:** `ffmpeg-python`
- **GitHub:** https://github.com/kkroening/ffmpeg-python
- **Capabilities:**
  - Overlay subtitles/lyrics
  - Combine audio + video
  - Add effects/animations
  - Export MP4

**Subtitle Format:** ASS/SSA (for karaoke effects)
- **Library:** `pysubs2` for subtitle manipulation
- **GitHub:** https://github.com/tkarabela/pysubs2

### 5. YouTube Upload
**Tool: Google YouTube Data API v3**
- **Documentation:** https://developers.google.com/youtube/v3
- **Python Library:** `google-api-python-client`
- **Requirements:**
  - OAuth 2.0 authentication
  - API quota management
  - Video upload (resumable)

**Alternative: Direct Upload Script**
- Use `youtube-upload` library
- **GitHub:** https://github.com/tokland/youtube-upload

---

## 🏗️ Architecture Plan

### Backend Service (New)
**Technology:** Python FastAPI or Node.js
**Purpose:** Handle video processing pipeline

**Endpoints:**
- `POST /api/create-karaoke`
  - Input: YouTube URL, optional lyrics
  - Output: Processing job ID
- `GET /api/job/{id}/status`
  - Check processing status
- `GET /api/job/{id}/result`
  - Get final YouTube URL

**Processing Pipeline:**
```
1. Download (yt-dlp)
   ↓
2. Extract Audio (ffmpeg)
   ↓
3. Remove Vocals (UVR/Spleeter)
   ↓
4. Transcribe/Sync Lyrics (Whisper)
   ↓
5. Render Video (ffmpeg + subtitles)
   ↓
6. Upload to YouTube (API)
   ↓
7. Return URL → Add to Supabase
```

### Frontend Integration
**Current:** Next.js app
**New Feature:** "Create Karaoke" button

**Flow:**
1. User clicks "Create Karaoke"
2. Modal opens: Paste YouTube URL
3. Optional: Paste/upload lyrics
4. Submit → Shows progress
5. When done → Auto-adds to library

---

## 📦 Implementation Phases

### Phase 1: Basic Pipeline (MVP)
**Goal:** Get end-to-end working, manual steps OK

1. ✅ YouTube download (yt-dlp)
2. ✅ Vocal removal (Spleeter - easiest)
3. ⚠️ Lyrics: Manual input + basic sync
4. ✅ Video render (ffmpeg)
5. ⚠️ Upload: Manual for now
6. ✅ Auto-add to library

**Timeline:** 1-2 weeks

### Phase 2: AI Automation
**Goal:** Full automation

1. ✅ Auto lyrics extraction (Whisper)
2. ✅ Auto timing sync (Whisper + audio analysis)
3. ✅ YouTube auto-upload (API)
4. ✅ Progress tracking UI

**Timeline:** 2-3 weeks

### Phase 3: Polish & Optimization
**Goal:** Production-ready

1. Queue system (Redis/Celery)
2. Error handling & retries
3. Quality options (resolution, bitrate)
4. Preview before upload
5. Edit lyrics before final render

**Timeline:** 1-2 weeks

---

## 🔧 Technical Stack

### Backend
- **Language:** Python 3.10+
- **Framework:** FastAPI
- **Video Processing:** FFmpeg
- **AI Models:** 
  - Whisper (lyrics)
  - Spleeter/UVR (vocal removal)
- **Queue:** Celery + Redis (for async jobs)
- **Storage:** Temporary files (local or S3)

### Infrastructure
- **Server:** Need GPU for AI models (or use cloud APIs)
- **Storage:** Temporary file storage
- **API Keys:** YouTube Data API, optional Moises API

### Frontend (Current)
- **Framework:** Next.js
- **Integration:** API calls to backend
- **UI:** Progress indicators, job status

---

## 🚀 Quick Start Implementation

### Step 1: Set Up Backend
```bash
# Create Python backend
mkdir karaoke-processor
cd karaoke-processor
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install fastapi uvicorn yt-dlp spleeter openai-whisper ffmpeg-python pysubs2 google-api-python-client
```

### Step 2: Create Processing Script
```python
# process_karaoke.py
import yt_dlp
import subprocess
from pathlib import Path

def download_youtube(url, output_dir):
    """Download video from YouTube"""
    ydl_opts = {
        'format': 'bestaudio/best',
        'outtmpl': f'{output_dir}/%(title)s.%(ext)s',
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([url])

def remove_vocals(input_file, output_file):
    """Remove vocals using Spleeter"""
    subprocess.run([
        'spleeter', 'separate',
        '-p', 'spleeter:2stems-16kHz',
        '-o', str(Path(output_file).parent),
        input_file
    ])

# ... more functions
```

### Step 3: Integrate with Frontend
- Add "Create Karaoke" button
- Call backend API
- Show progress
- Auto-add result to library

---

## 💰 Cost Considerations

### Free/Open Source:
- ✅ yt-dlp (free)
- ✅ Spleeter (free, local processing)
- ✅ Whisper (free, local processing)
- ✅ FFmpeg (free)

### Paid Options:
- 💰 Moises API: ~$0.10-0.50 per song
- 💰 Cloud GPU (if needed): $0.50-2/hour
- 💰 YouTube API: Free quota (10,000 units/day)

### Server Costs:
- **Option 1:** Self-hosted (free, but needs GPU)
- **Option 2:** Cloud (AWS/GCP): $50-200/month
- **Option 3:** Serverless (Vercel/Netlify): Limited for processing

---

## 🎯 Recommended Approach

**For Maximum Automation:**

1. **Use Spleeter** for vocal removal (free, good quality)
2. **Use Whisper** for lyrics + timing (free, excellent)
3. **Use FFmpeg** for rendering (free, powerful)
4. **Use YouTube API** for upload (free quota)

**Total Cost:** $0 (if self-hosted) or ~$50/month (cloud)

**Timeline:** 4-6 weeks for full implementation

---

## 📝 Next Steps

1. ✅ Document vision (this file)
2. ⏭️ Set up Python backend
3. ⏭️ Implement download + vocal removal
4. ⏭️ Add lyrics transcription
5. ⏭️ Build video renderer
6. ⏭️ Integrate YouTube upload
7. ⏭️ Connect to frontend
8. ⏭️ Add progress tracking

---

## 🔗 Key Resources

- **yt-dlp:** https://github.com/yt-dlp/yt-dlp
- **Spleeter:** https://github.com/deezer/spleeter
- **Whisper:** https://github.com/openai/whisper
- **FFmpeg:** https://ffmpeg.org/
- **YouTube API:** https://developers.google.com/youtube/v3
- **FastAPI:** https://fastapi.tiangolo.com/

---

**Status:** 📋 Planning Complete - Ready to Build

