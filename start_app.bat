@echo off
TITLE Game Ngetik Cepat - Sekolah
COLOR 0A
CLS

ECHO ============================================================
ECHO  GAME NGETIK CEPAT - MODE SEKOLAH
ECHO ============================================================
ECHO.
ECHO  [1/3] Memeriksa Python...
python --version >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO  ❌ Python tidak ditemukan!
    ECHO  Silakan install Python dari https://python.org
    PAUSE
    EXIT
)

ECHO  [2/3] Memeriksa Dependencies...
python -c "import fastapi, uvicorn, sqlalchemy" >NUL 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO  📦 Menginstall module yang dibutuhkan...
    pip install -r requirements.txt
) ELSE (
    ECHO  ✅ Dependencies OK
)

ECHO  [3/3] Menjalankan Aplikasi...
ECHO.
python run.py

PAUSE
