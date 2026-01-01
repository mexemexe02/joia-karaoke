"""
Karaoke Processing Pipeline
Handles: Download → Vocal Removal → Lyrics → Render → Upload
"""
import os
import subprocess
import tempfile
import sys
import io
from pathlib import Path
from typing import Optional, Dict
import yt_dlp

# Fix Windows encoding issues
if sys.platform == 'win32':
    # Set UTF-8 encoding for stdout/stderr
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

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
        """Remove vocals using Demucs (better maintained, no dependency conflicts)"""
        output_dir = Path(audio_path).parent
        output_path = output_dir / 'instrumental.mp3'
        
        # For Phase 1 local testing: Skip vocal removal if Demucs has encoding issues
        # This allows us to test the rest of the pipeline
        # In production/Docker, this should work fine
        use_demucs = False  # Set to True when encoding is fixed or in Docker
        
        if not use_demucs:
            # Fallback: Use original audio (for testing pipeline)
            # In production, this should use Demucs
            # Just copy the audio without vocal removal
            subprocess.run([
                'ffmpeg', '-i', audio_path,
                '-acodec', 'libmp3lame',
                '-ab', '192k', str(output_path),
                '-y'
            ], check=True, capture_output=True)
            return str(output_path)
        
        try:
            # Use Demucs via command line to avoid Python encoding issues on Windows
            # This is more reliable than using the Python API
            import shutil
            
            # Check if demucs command is available
            demucs_cmd = shutil.which('demucs')
            if not demucs_cmd:
                # Try to find it in the Python environment
                venv_python = sys.executable
                demucs_cmd = f'"{venv_python}" -m demucs'
            
            # Use Demucs command line interface
            # This avoids encoding issues with print statements
            # Format: demucs --two-stems=vocals input.wav
            # This separates into vocals and no_vocals (instrumental)
            temp_wav = output_dir / 'temp_audio.wav'
            
            # Convert input to WAV if needed
            if not str(audio_path).endswith('.wav'):
                subprocess.run([
                    'ffmpeg', '-i', audio_path,
                    '-y', str(temp_wav)
                ], check=True, capture_output=True)
                input_file = str(temp_wav)
            else:
                input_file = audio_path
            
            # Run Demucs with UTF-8 encoding environment variable
            # Suppress all output to avoid encoding issues
            env = os.environ.copy()
            env['PYTHONIOENCODING'] = 'utf-8'
            env['PYTHONUTF8'] = '1'
            
            # Separate vocals (creates separated/htdemucs/temp_audio/no_vocals.wav)
            # Use DEVNULL to suppress all output and avoid encoding issues
            with open(os.devnull, 'w', encoding='utf-8', errors='replace') as devnull:
                result = subprocess.run([
                    sys.executable, '-m', 'demucs',
                    '--two-stems=vocals',
                    '--out', str(output_dir),
                    input_file
                ], check=True, stdout=devnull, stderr=devnull, env=env)
            
            # Find the output file
            # Demucs creates: {out_dir}/htdemucs/{filename}/no_vocals.wav
            audio_name = Path(input_file).stem
            demucs_output = output_dir / 'htdemucs' / audio_name / 'no_vocals.wav'
            
            if not demucs_output.exists():
                # Try alternative path
                demucs_output = output_dir / 'separated' / 'htdemucs' / audio_name / 'no_vocals.wav'
            
            if demucs_output.exists():
                # Convert to MP3
                subprocess.run([
                    'ffmpeg', '-i', str(demucs_output),
                    '-acodec', 'libmp3lame',
                    '-ab', '192k', str(output_path),
                    '-y'
                ], check=True, capture_output=True)
                return str(output_path)
            else:
                raise FileNotFoundError(f"Demucs output not found. Expected: {demucs_output}")
            subprocess.run([
                'ffmpeg', '-i', str(wav_path),
                '-acodec', 'libmp3lame',
                '-ab', '192k', str(output_path),
                '-y'
            ], check=True, capture_output=True)
            
            return str(output_path)
            
        except ImportError:
            # Fallback: use original audio if Demucs not available
            import sys
            sys.stdout.write("WARNING: Demucs not available. Using original audio (vocals not removed).\n")
            sys.stdout.flush()
            subprocess.run([
                'ffmpeg', '-i', audio_path,
                '-acodec', 'libmp3lame',
                '-ab', '192k', str(output_path),
                '-y'
            ], check=True, capture_output=True)
            return str(output_path)
        except Exception as e:
            raise RuntimeError(f"Vocal removal failed: {str(e)}") from e
    
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

