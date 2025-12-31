FROM python:3.11-slim

# Install system dependencies
# Note: Spleeter and Whisper need additional packages
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    git \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
# Note: Spleeter and Whisper are large packages, install separately for better error handling
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir fastapi uvicorn python-multipart python-dotenv && \
    pip install --no-cache-dir yt-dlp supabase && \
    pip install --no-cache-dir pysubs2 && \
    pip install --no-cache-dir spleeter && \
    pip install --no-cache-dir openai-whisper

# Download Spleeter models (will be cached in Docker layer)
# This happens on first use, but we can pre-download to avoid delays
RUN python -c "from spleeter.separator import Separator; Separator('spleeter:2stems-16kHz')" || true

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Health check - use curl instead (more reliable)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
