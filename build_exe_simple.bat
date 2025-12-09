@echo off
echo ============================================================
echo Building YukMengetik.exe
echo ============================================================
echo.

echo Cleaning previous build...
if exist dist rmdir /s /q dist
if exist build rmdir /s /q build
if exist YukMengetik.spec del YukMengetik.spec

echo.
echo Running PyInstaller...
pyinstaller ^
    --name=YukMengetik ^
    --onefile ^
    --windowed ^
    --add-data="frontend;frontend" ^
    --add-data="backend;backend" ^
    --hidden-import=uvicorn.logging ^
    --hidden-import=uvicorn.loops ^
    --hidden-import=uvicorn.loops.auto ^
    --hidden-import=uvicorn.protocols ^
    --hidden-import=uvicorn.protocols.http ^
    --hidden-import=uvicorn.protocols.http.auto ^
    --hidden-import=uvicorn.protocols.websockets ^
    --hidden-import=uvicorn.protocols.websockets.auto ^
    --hidden-import=uvicorn.lifespan ^
    --hidden-import=uvicorn.lifespan.on ^
    --exclude-module=matplotlib ^
    --exclude-module=numpy ^
    --exclude-module=pandas ^
    --clean ^
    desktop_app.py

echo.
echo ============================================================
echo Build Complete!
echo ============================================================
echo.
echo Executable location: dist\YukMengetik.exe
echo.
echo You can now run: dist\YukMengetik.exe
echo.
pause
