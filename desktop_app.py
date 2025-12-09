"""
YukMengetik Desktop Application
Standalone desktop app dengan embedded browser
"""
import os
import sys
import threading
import time
import socket
import webview
from pathlib import Path

# Add backend to path
BASE_DIR = Path(__file__).parent
sys.path.insert(0, str(BASE_DIR / 'backend'))

def find_free_port(start_port=8000, max_tries=10):
    """Find available port"""
    for port in range(start_port, start_port + max_tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
            res = sock.connect_ex(('localhost', port))
            if res != 0:
                return port
    return start_port

def start_server(port):
    """Start FastAPI server in background thread"""
    try:
        import uvicorn
        from backend.main import app
        from backend.database import init_db
        
        # Initialize database
        print("📦 Initializing database...")
        init_db()
        
        # Run server
        print(f"🚀 Starting server on port {port}...")
        uvicorn.run(app, host="127.0.0.1", port=port, log_level="error")
    except Exception as e:
        print(f"❌ Server error: {e}")

def main():
    """Main entry point"""
    print("=" * 60)
    print("🎮 YukMengetik - Desktop Application")
    print("=" * 60)
    
    # Find free port
    port = find_free_port()
    url = f"http://127.0.0.1:{port}"
    
    # Start server in background thread
    server_thread = threading.Thread(target=start_server, args=(port,), daemon=True)
    server_thread.start()
    
    # Wait for server to start
    print("⏳ Waiting for server to start...")
    time.sleep(3)
    
    # Create desktop window
    print("🖥️  Opening application window...")
    window = webview.create_window(
        title='YukMengetik - Game Ngetik Cepat',
        url=url,
        width=1280,
        height=800,
        resizable=True,
        fullscreen=False,
        min_size=(800, 600),
        background_color='#f1f5f9'
    )
    
    # Start GUI
    webview.start(debug=False)
    
    print("👋 Application closed")

if __name__ == '__main__':
    main()
