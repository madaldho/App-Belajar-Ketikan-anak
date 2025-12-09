"""
Build script untuk membuat executable Windows
Jalankan: python build_exe.py
"""
import PyInstaller.__main__
import os
import shutil
from pathlib import Path

def build():
    """Build executable dengan PyInstaller"""
    
    print("=" * 60)
    print("🔨 Building YukMengetik.exe")
    print("=" * 60)
    
    # Clean previous build
    if os.path.exists('dist'):
        shutil.rmtree('dist')
    if os.path.exists('build'):
        shutil.rmtree('build')
    
    # PyInstaller arguments
    args = [
        'desktop_app.py',                    # Main script
        '--name=YukMengetik',                # Nama executable
        '--onefile',                         # Single file executable
        '--windowed',                        # No console window
        '--icon=frontend/favicon.ico',       # App icon (jika ada .ico)
        
        # Include data files
        '--add-data=frontend;frontend',
        '--add-data=backend;backend',
        
        # Hidden imports (dependencies yang mungkin tidak terdeteksi)
        '--hidden-import=uvicorn.logging',
        '--hidden-import=uvicorn.loops',
        '--hidden-import=uvicorn.loops.auto',
        '--hidden-import=uvicorn.protocols',
        '--hidden-import=uvicorn.protocols.http',
        '--hidden-import=uvicorn.protocols.http.auto',
        '--hidden-import=uvicorn.protocols.websockets',
        '--hidden-import=uvicorn.protocols.websockets.auto',
        '--hidden-import=uvicorn.lifespan',
        '--hidden-import=uvicorn.lifespan.on',
        
        # Exclude unnecessary modules
        '--exclude-module=matplotlib',
        '--exclude-module=numpy',
        '--exclude-module=pandas',
        
        # Clean build
        '--clean',
    ]
    
    print("\n📦 Running PyInstaller...")
    PyInstaller.__main__.run(args)
    
    print("\n✅ Build complete!")
    print(f"📁 Executable location: {Path('dist/YukMengetik.exe').absolute()}")
    print("\n🎉 Sekarang Anda bisa jalankan YukMengetik.exe")

if __name__ == '__main__':
    build()
