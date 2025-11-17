"""
Main runner script
Menjalankan aplikasi Game Ngetik Cepat
"""
import os
import sys
import webbrowser
import time
from threading import Timer

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

def open_browser():
    """Open browser after 2 seconds"""
    time.sleep(2)
    webbrowser.open('http://localhost:8000')
    print("✅ Browser dibuka di http://localhost:8000")

if __name__ == "__main__":
    print("=" * 60)
    print("🎮 GAME NGETIK CEPAT")
    print("=" * 60)
    print()
    print("📦 Memulai aplikasi...")
    print()
    
    # Check dependencies
    try:
        import fastapi
        import uvicorn
        import sqlalchemy
        print("✅ Dependencies terinstall")
    except ImportError as e:
        print(f"❌ Error: {e}")
        print()
        print("Jalankan command ini untuk install dependencies:")
        print("pip install -r requirements.txt")
        sys.exit(1)
    
    # Import and run
    try:
        from backend.main import app
        from backend.database import init_db
        
        # Initialize database
        print("📦 Inisialisasi database...")
        init_db()
        print()
        
        # Open browser in background
        Timer(2, open_browser).start()
        
        # Run server
        print("🚀 Server berjalan di http://localhost:8000")
        print("📝 Tekan CTRL+C untuk stop")
        print()
        print("=" * 60)
        print()
        
        import uvicorn
        uvicorn.run(app, host="0.0.0.0", port=8000, log_level="warning")
        
    except KeyboardInterrupt:
        print()
        print("=" * 60)
        print("👋 Aplikasi dihentikan. Sampai jumpa!")
        print("=" * 60)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)
