"""
Karaoke Processing Pipeline
Handles: Download → Vocal Removal → Lyrics → Render → Upload
"""
import os
import subprocess
import tempfile
from pathlib import Path
from typing import Optional, Dict
import yt_dlp

# Import with fallback for missing dependencies
try:
    import whisper
except ImportError:
    whisper = None

try:
    from pysubs2 import SSAFile, SSAEvent, SSAStyle
except ImportError:
    SSAFile = None
    SSAEvent = None
    SSAStyle = None

class KaraokeProcessor:
    def __init__(self):
        self.temp_dir = Path(tempfile.gettempdir()) / "joia-karaoke"
        self.temp_dir.mkdir(exist_ok=True)
        
        # Load Whisper model (lazy load)
        self.whisper_model = None
    
    async def download_youtube(self, url: str, job_id: str) -> str:
        """Download video/audio from YouTube"""
        output_dir = self.temp_dir / job_id
        output_dir.mkdir(exist_ok=True)
        
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': str(output_dir / 'video.%(ext)s'),
            'quiet': True,
            'no_warnings': True,
        }
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            filename = ydl.prepare_filename(info)
            
            # Convert to audio if needed
            if not filename.endswith('.mp3') and not filename.endswith('.m4a'):
                audio_path = output_dir / 'audio.mp3'
                subprocess.run([
                    'ffmpeg', '-i', filename,
                    '-vn', '-acodec', 'libmp3lame',
                    '-ab', '192k', str(audio_path),
                    '-y'  # Overwrite
                ], check=True, capture_output=True)
                return str(audio_path)
            
            return filename
    
    async def remove_vocals(self, audio_path: str, job_id: str) -> str:
        """Remove vocals using Spleeter"""
        output_dir = Path(audio_path).parent
        output_path = output_dir / 'instrumental.wav'
        
        try:
            # Spleeter command
            # Note: Spleeter needs to be installed and models downloaded
            result = subprocess.run([
                'spleeter', 'separate',
                '-p', 'spleeter:2stems-16kHz',
                '-o', str(output_dir),
                audio_path
            ], check=True, capture_output=True, text=True)
            
            # Spleeter outputs to a subdirectory
            # Format: {output_dir}/{filename}/accompaniment.wav
            audio_name = Path(audio_path).stem
            spleeter_output = output_dir / audio_name / 'accompaniment.wav'
            
            if spleeter_output.exists():
                # Convert to MP3 for consistency
                subprocess.run([
                    'ffmpeg', '-i', str(spleeter_output),
                    '-acodec', 'libmp3lame',
                    '-ab', '192k', str(output_path),
                    '-y'
                ], check=True, capture_output=True)
                return str(output_path)
            
            raise FileNotFoundError(f"Spleeter output not found: {spleeter_output}")
        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"Spleeter failed: {e.stderr}") from e
        except FileNotFoundError:
            raise RuntimeError("Spleeter command not found. Please install spleeter.")
    
    async def process_lyrics(
        self, 
        audio_path: str, 
        lyrics_text: Optional[str],
        job_id: str
    ) -> Dict:
        """Process lyrics - transcribe if not provided, sync timing"""
        if whisper is None:
            raise RuntimeError("Whisper not installed. Please install openai-whisper.")
        
        if not self.whisper_model:
            # Load Whisper model (base model for speed)
            self.whisper_model = whisper.load_model("base")
        
        try:
            if lyrics_text:
                # User provided lyrics - use Whisper to get timing
                result = self.whisper_model.transcribe(audio_path, word_timestamps=True)
                # Match provided lyrics with transcribed words for timing
                # This is simplified - full implementation would align text
                return {
                    "text": lyrics_text,
                    "segments": result.get("segments", []),
                    "words": result.get("words", [])
                }
            else:
                # Auto-transcribe
                result = self.whisper_model.transcribe(audio_path, word_timestamps=True)
                return {
                    "text": result["text"],
                    "segments": result.get("segments", []),
                    "words": result.get("words", [])
                }
        except Exception as e:
            raise RuntimeError(f"Whisper transcription failed: {str(e)}") from e
    
    async def render_video(
        self,
        audio_path: str,
        lyrics_data: Dict,
        title: str,
        job_id: str
    ) -> str:
        """Render karaoke video with lyrics overlay"""
        if SSAFile is None:
            raise RuntimeError("pysubs2 not installed. Please install pysubs2.")
        
        output_dir = Path(audio_path).parent
        output_path = output_dir / f"{title.replace(' ', '_')}_karaoke.mp4"
        
        # Create ASS subtitle file for karaoke effect
        subs = SSAFile()
        style = SSAStyle()
        style.fontname = "Arial"
        style.fontsize = 48
        style.primarycolor = "&H00FFFFFF"  # White
        style.outline = 2
        style.shadow = 2
        style.alignment = 5  # Center bottom
        subs.styles["Default"] = style
        
        # Add lyrics with timing
        for segment in lyrics_data.get("segments", []):
            start_time = segment["start"]
            end_time = segment["end"]
            text = segment["text"].strip()
            
            if text:
                event = SSAEvent(
                    start=start_time * 100,  # Convert to centiseconds
                    end=end_time * 100,
                    text=text
                )
                subs.events.append(event)
        
        # Save subtitle file
        subtitle_path = output_dir / "lyrics.ass"
        subs.save(str(subtitle_path))
        
        # Get audio duration for video length
        import json
        duration_result = subprocess.run([
            'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
            '-of', 'json', audio_path
        ], capture_output=True, text=True, check=True)
        
        duration = float(json.loads(duration_result.stdout)['format']['duration'])
        
        # Render video with FFmpeg
        # Create a simple background (black or gradient)
        subprocess.run([
            'ffmpeg',
            '-f', 'lavfi',
            '-i', f'color=c=black:s=1920x1080:d={int(duration) + 1}',  # Black background, match audio duration
            '-i', audio_path,
            '-vf', f"subtitles={subtitle_path}:force_style='FontSize=48,PrimaryColour=&H00FFFFFF,Outline=2,Shadow=2,Alignment=5'",
            '-c:v', 'libx264',
            '-c:a', 'aac',
            '-shortest',
            '-y',
            str(output_path)
        ], check=True, capture_output=True)
        
        return str(output_path)
    
    async def upload_to_youtube(
        self,
        video_path: str,
        title: str,
        description: str = "Karaoke video created with Joia Karaoke"
    ) -> str:
        """Upload video to YouTube (Phase 2)"""
        # TODO: Implement YouTube API upload
        # For Phase 1, return local path
        return video_path

