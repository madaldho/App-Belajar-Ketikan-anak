"""
Main runner script
Menjalankan aplikasi Game Ngetik Cepat
"""
import os
import sys
import webbrowser
import time
import socket
from threading import Timer

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
START_PORT = int(os.getenv("APP_PORT", "8000"))
DISPLAY_HOST = os.getenv(
    "APP_DISPLAY_HOST",
    "localhost" if APP_HOST in ("0.0.0.0", "::") else APP_HOST
)

def find_free_port(start_port, max_tries=10):
    """Find available port starting from start_port"""
    for port in range(start_port, start_port + max_tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            res = sock.connect_ex(('localhost', port))
            if res != 0: # Port is free (connection failed)
                return port
    return start_port

# Find free port
APP_PORT = find_free_port(START_PORT)
SERVER_URL = f"http://{DISPLAY_HOST}:{APP_PORT}"

def open_browser():
    """Open browser after 2 seconds"""
    time.sleep(2)
    try:
        webbrowser.open(SERVER_URL)
        print(f"✅ Browser dibuka di {SERVER_URL}")
    except:
        print(f"ℹ️  Silakan buka manual: {SERVER_URL}")

if __name__ == "__main__":
    print("=" * 60)
    print("🎮 GAME NGETIK CEPAT - MODE SEKOLAH (OFFLINE)")
    print("=" * 60)
    print(f"📂 Lokasi Data: {os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ketikan.db')}")
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
        print("📦 Cek Database Lokal...")
        init_db()
        print()
        
        # Open browser in background
        Timer(2, open_browser).start()
        
        # Run server
        print(f"🚀 Server SIAP! Berjalan di: {SERVER_URL}")
        print("📝 Tekan CTRL+C untuk stop")
        print()
        print("=" * 60)
        print()
        
        import uvicorn
        uvicorn.run(app, host=APP_HOST, port=APP_PORT, log_level="error")
        
    except KeyboardInterrupt:
        print()
        print("=" * 60)
        print("👋 Aplikasi dihentikan. Sampai jumpa!")
        print("=" * 60)
    except Exception as e:
        print(f"❌ Error Critical: {e}")
        # Keep window open on error (for Windows users)
        input("Tekan Enter untuk keluar...")
        sys.exit(1)
