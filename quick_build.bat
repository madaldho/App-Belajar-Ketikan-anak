@echo off
echo ============================================================
echo Quick Build YukMengetik.exe with Icon
echo ============================================================

echo Stopping any running Python processes...
taskkill /f /im python.exe >nul 2>&1

echo Cleaning build folders...
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build
if exist *.spec del *.spec

echo Building EXE (this may take 3-5 minutes)...
pyinstaller --onefile --windowed --icon=app_icon.ico --name=YukMengetik --add-data="frontend;frontend" --add-data="backend;backend" desktop_app.py

echo.
if exist dist\YukMengetik.exe (
    echo ✅ BUILD SUCCESS!
    echo.
    echo File: dist\YukMengetik.exe
    dir dist\YukMengetik.exe
    echo.
    echo Ready to distribute!
) else (
    echo ❌ BUILD FAILED!
    echo Check the output above for errors.
)

echo.
pause