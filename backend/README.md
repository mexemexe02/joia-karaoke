# Joia Karaoke Backend Processor

FastAPI service for automated karaoke video creation.

## Features

- Download YouTube videos
- Remove vocals using Spleeter
- Transcribe/sync lyrics using Whisper
- Render karaoke videos with FFmpeg
- Upload to YouTube (Phase 2)

## Setup

### Local Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Install FFmpeg (system dependency)
# Windows: Download from https://ffmpeg.org/
# Mac: brew install ffmpeg
# Linux: apt-get install ffmpeg

# Run server
uvicorn main:app --reload --port 8000
```

### Coolify Deployment

1. Push to GitHub
2. In Coolify, create new service
3. Connect GitHub repo
4. Set build context to `backend/`
5. Coolify will use the Dockerfile
6. Set environment variables
7. Deploy!

## Environment Variables

- `FRONTEND_URL` - Frontend URL for CORS
- `YOUTUBE_CLIENT_ID` - YouTube API (Phase 2)
- `YOUTUBE_CLIENT_SECRET` - YouTube API (Phase 2)
- `YOUTUBE_REFRESH_TOKEN` - YouTube API (Phase 2)

## API Endpoints

- `POST /api/create-karaoke` - Start karaoke creation
- `GET /api/job/{job_id}` - Get job status
- `GET /health` - Health check

## Notes

- First run downloads Whisper models (~150MB)
- Spleeter models download on first use
- Processing can take 5-15 minutes per video
- For production, use Celery + Redis for async jobs

