FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    libsndfile1 \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements
COPY requirements.txt .

# Install Python dependencies with retry logic
RUN pip install --no-cache-dir --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r requirements.txt || \
    (pip install --no-cache-dir fastapi uvicorn python-multipart python-dotenv && \
     pip install --no-cache-dir yt-dlp && \
     pip install --no-cache-dir supabase)

# Copy application
COPY . .

# Expose port
EXPOSE 8000

# Health check - use curl instead (more reliable)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
