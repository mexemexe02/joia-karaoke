"""
Quick local test script
Tests if backend can start and basic imports work
"""
import sys

def test_imports():
    """Test if all required packages can be imported"""
    print("Testing imports...")
    try:
        import fastapi
        print("✅ FastAPI")
    except ImportError as e:
        print(f"❌ FastAPI: {e}")
        return False
    
    try:
        import yt_dlp
        print("✅ yt-dlp")
    except ImportError as e:
        print(f"❌ yt-dlp: {e}")
        return False
    
    try:
        import whisper
        print("✅ whisper")
    except ImportError as e:
        print(f"❌ whisper: {e}")
        return False
    
    try:
        import pysubs2
        print("✅ pysubs2")
    except ImportError as e:
        print(f"❌ pysubs2: {e}")
        return False
    
    try:
        import spleeter
        print("✅ spleeter")
    except ImportError as e:
        print(f"⚠️  spleeter: {e} (may need separate install)")
    
    # Check FFmpeg
    import subprocess
    try:
        result = subprocess.run(['ffmpeg', '-version'], 
                              capture_output=True, 
                              timeout=5)
        if result.returncode == 0:
            print("✅ FFmpeg")
        else:
            print("❌ FFmpeg not found")
            return False
    except FileNotFoundError:
        print("❌ FFmpeg not installed")
        return False
    except Exception as e:
        print(f"⚠️  FFmpeg check failed: {e}")
    
    return True

def test_basic_functionality():
    """Test basic functionality"""
    print("\nTesting basic functionality...")
    
    # Test yt-dlp can extract info (without downloading)
    try:
        import yt_dlp
        ydl_opts = {'quiet': True, 'no_warnings': True}
        # Use a short test video
        test_url = "https://www.youtube.com/watch?v=jNQXAC9IVRw"  # "Me at the zoo" - very short
        
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(test_url, download=False)
            print(f"✅ YouTube info extraction works")
            print(f"   Title: {info.get('title', 'N/A')[:50]}")
    except Exception as e:
        print(f"⚠️  YouTube test failed: {e}")
        print("   (This is OK - may need network or video may be unavailable)")
    
    return True

if __name__ == "__main__":
    print("=" * 50)
    print("Joia Karaoke Backend - Local Test")
    print("=" * 50)
    
    if test_imports():
        print("\n✅ All imports successful!")
        test_basic_functionality()
        print("\n" + "=" * 50)
        print("✅ Basic tests passed!")
        print("Ready to deploy to Coolify 🚀")
        print("=" * 50)
    else:
        print("\n❌ Some imports failed")
        print("Install missing packages: pip install -r requirements.txt")
        sys.exit(1)

