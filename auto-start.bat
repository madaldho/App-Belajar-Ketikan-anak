@echo off
REM Auto-start script untuk Game Ngetik Cepat
REM Jalankan file ini untuk start aplikasi otomatis

echo ========================================
echo    GAME NGETIK CEPAT - AUTO START
echo ========================================
echo.

REM Pindah ke directory aplikasi
cd /d "%~dp0"

REM Check Python installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python tidak terinstall!
    echo Silakan install Python dari https://python.org
    echo.
    pause
    exit /b 1
)

echo [OK] Python terdeteksi
echo.

REM Check dependencies
echo Mengecek dependencies...
python -c "import fastapi, uvicorn, sqlalchemy" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing dependencies...
    pip install -r requirements.txt
    echo.
)

echo [OK] Dependencies ready
echo.

REM Run aplikasi
echo Memulai aplikasi...
echo.
python run.py

pause
