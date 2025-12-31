from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Joia Karaoke Processor")

# CORS - allow frontend to call
frontend_urls = [
    "http://localhost:3000",
    os.getenv("FRONTEND_URL", "http://localhost:3000"),
]
# Add any additional frontend URLs from environment
if os.getenv("FRONTEND_URLS"):
    frontend_urls.extend(os.getenv("FRONTEND_URLS").split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=frontend_urls,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Job storage (in production, use Redis/DB)
jobs = {}

class KaraokeRequest(BaseModel):
    youtube_url: str
    lyrics: Optional[str] = None
    title: Optional[str] = None
    artist: Optional[str] = None

class JobStatus(BaseModel):
    job_id: str
    status: str  # "pending", "processing", "completed", "failed"
    progress: int  # 0-100
    message: str
    result_url: Optional[str] = None
    error: Optional[str] = None

@app.get("/")
async def root():
    return {"message": "Joia Karaoke Processor API", "status": "running"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/api/create-karaoke", response_model=JobStatus)
async def create_karaoke(request: KaraokeRequest, background_tasks: BackgroundTasks):
    """Start karaoke creation process"""
    import uuid
    job_id = str(uuid.uuid4())
    
    # Initialize job
    jobs[job_id] = {
        "status": "pending",
        "progress": 0,
        "message": "Job created",
        "youtube_url": request.youtube_url,
        "lyrics": request.lyrics,
        "title": request.title,
        "artist": request.artist,
    }
    
    # Start processing in background
    background_tasks.add_task(process_karaoke, job_id, request)
    
    return JobStatus(
        job_id=job_id,
        status="pending",
        progress=0,
        message="Job created, processing started"
    )

@app.get("/api/job/{job_id}", response_model=JobStatus)
async def get_job_status(job_id: str):
    """Get job status"""
    if job_id not in jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    
    job = jobs[job_id]
    return JobStatus(
        job_id=job_id,
        status=job["status"],
        progress=job["progress"],
        message=job["message"],
        result_url=job.get("result_url"),
        error=job.get("error")
    )

async def process_karaoke(job_id: str, request: KaraokeRequest):
    """Process karaoke creation pipeline"""
    try:
        from processor import KaraokeProcessor
        
        processor = KaraokeProcessor()
        
        # Update status
        jobs[job_id]["status"] = "processing"
        jobs[job_id]["progress"] = 10
        jobs[job_id]["message"] = "Downloading video from YouTube..."
        
        # Step 1: Download
        try:
            video_path = await processor.download_youtube(request.youtube_url, job_id)
        except Exception as e:
            raise RuntimeError(f"Failed to download video: {str(e)}") from e
        
        jobs[job_id]["progress"] = 30
        jobs[job_id]["message"] = "Removing vocals (this may take a few minutes)..."
        
        # Step 2: Remove vocals
        try:
            instrumental_path = await processor.remove_vocals(video_path, job_id)
        except Exception as e:
            raise RuntimeError(f"Failed to remove vocals: {str(e)}") from e
        
        jobs[job_id]["progress"] = 50
        jobs[job_id]["message"] = "Processing lyrics..."
        
        # Step 3: Get/sync lyrics
        try:
            lyrics_data = await processor.process_lyrics(
                instrumental_path, 
                request.lyrics,
                job_id
            )
        except Exception as e:
            raise RuntimeError(f"Failed to process lyrics: {str(e)}") from e
        
        jobs[job_id]["progress"] = 70
        jobs[job_id]["message"] = "Rendering karaoke video..."
        
        # Step 4: Render karaoke video
        try:
            output_path = await processor.render_video(
                instrumental_path,
                lyrics_data,
                request.title or "Karaoke Song",
                job_id
            )
        except Exception as e:
            raise RuntimeError(f"Failed to render video: {str(e)}") from e
        
        jobs[job_id]["progress"] = 90
        jobs[job_id]["message"] = "Finalizing..."
        
        # Step 5: Upload to YouTube (or return local path for now)
        # For Phase 1, we'll return the local path and user uploads manually
        result_url = output_path  # TODO: Upload to YouTube (Phase 2)
        
        jobs[job_id]["status"] = "completed"
        jobs[job_id]["progress"] = 100
        jobs[job_id]["message"] = "Karaoke video created! (Manual upload required for Phase 1)"
        jobs[job_id]["result_url"] = result_url
        
    except Exception as e:
        jobs[job_id]["status"] = "failed"
        jobs[job_id]["error"] = str(e)
        jobs[job_id]["message"] = f"Error: {str(e)}"
        # Log the full error for debugging
        import traceback
        print(f"Error processing karaoke job {job_id}:")
        print(traceback.format_exc())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

