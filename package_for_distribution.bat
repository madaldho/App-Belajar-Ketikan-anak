@echo off
echo ============================================================
echo YukMengetik - Package for Distribution
echo ============================================================
echo.

REM Create distribution folders
echo Creating distribution folders...
if exist distribution rmdir /s /q distribution
mkdir distribution
mkdir distribution\exe_only
mkdir distribution\source_code
mkdir distribution\hybrid

echo.
echo ============================================================
echo Option 1: Building EXE...
echo ============================================================
call build_exe_simple.bat

echo.
echo ============================================================
echo Option 2: Packaging EXE Distribution
echo ============================================================
copy dist\YukMengetik.exe distribution\exe_only\
copy CARA_INSTALL.txt distribution\exe_only\
copy frontend\template_siswa.xlsx distribution\exe_only\
copy LICENSE.txt distribution\exe_only\

echo.
echo ============================================================
echo Option 3: Packaging Source Code Distribution
echo ============================================================
xcopy /E /I /Y backend distribution\source_code\backend
xcopy /E /I /Y frontend distribution\source_code\frontend
xcopy /E /I /Y .kiro distribution\source_code\.kiro
copy run.py distribution\source_code\
copy desktop_app.py distribution\source_code\
copy requirements.txt distribution\source_code\
copy requirements-desktop.txt distribution\source_code\
copy build_exe_simple.bat distribution\source_code\
copy build_exe.py distribution\source_code\
copy README.md distribution\source_code\
copy BUILD_INSTRUCTIONS.md distribution\source_code\
copy DISTRIBUSI.md distribution\source_code\
copy LICENSE.txt distribution\source_code\
copy CARA_INSTALL.txt distribution\source_code\

echo.
echo ============================================================
echo Option 4: Packaging Hybrid Distribution
echo ============================================================
copy dist\YukMengetik.exe distribution\hybrid\
copy CARA_INSTALL.txt distribution\hybrid\
copy LICENSE.txt distribution\hybrid\
mkdir distribution\hybrid\source
xcopy /E /I /Y backend distribution\hybrid\source\backend
xcopy /E /I /Y frontend distribution\hybrid\source\frontend
xcopy /E /I /Y .kiro distribution\hybrid\source\.kiro
copy run.py distribution\hybrid\source\
copy desktop_app.py distribution\hybrid\source\
copy requirements.txt distribution\hybrid\source\
copy requirements-desktop.txt distribution\hybrid\source\
copy build_exe_simple.bat distribution\hybrid\source\
copy README.md distribution\hybrid\source\
copy BUILD_INSTRUCTIONS.md distribution\hybrid\source\
copy DISTRIBUSI.md distribution\hybrid\source\

echo.
echo ============================================================
echo Creating ZIP files...
echo ============================================================
powershell Compress-Archive -Path distribution\exe_only\* -DestinationPath distribution\YukMengetik_EXE_v1.0.zip -Force
powershell Compress-Archive -Path distribution\source_code\* -DestinationPath distribution\YukMengetik_Source_v1.0.zip -Force
powershell Compress-Archive -Path distribution\hybrid\* -DestinationPath distribution\YukMengetik_Complete_v1.0.zip -Force

echo.
echo ============================================================
echo DISTRIBUTION PACKAGES READY!
echo ============================================================
echo.
echo Created 3 distribution packages:
echo.
echo 1. YukMengetik_EXE_v1.0.zip
echo    - For end users (schools, teachers)
echo    - Contains: EXE + documentation
echo    - Size: ~50-80 MB
echo.
echo 2. YukMengetik_Source_v1.0.zip
echo    - For developers
echo    - Contains: Full source code
echo    - Size: ~5-10 MB
echo.
echo 3. YukMengetik_Complete_v1.0.zip
echo    - Hybrid package
echo    - Contains: EXE + Source code
echo    - Size: ~60-90 MB
echo.
echo Location: distribution\
echo.
echo You can now distribute these ZIP files!
echo.
pause
