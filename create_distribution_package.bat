@echo off
echo ============================================================
echo Membuat Paket Distribusi YukMengetik
echo ============================================================

REM Buat folder distribusi
if exist YukMengetik_v1.0 rmdir /s /q YukMengetik_v1.0
mkdir YukMengetik_v1.0

echo Copying files...
copy dist\YukMengetik.exe YukMengetik_v1.0\
copy CARA_INSTALL.txt YukMengetik_v1.0\
copy frontend\template_siswa.xlsx YukMengetik_v1.0\
copy LICENSE.txt YukMengetik_v1.0\

echo Membuat README singkat...
echo =============================================================== > YukMengetik_v1.0\README.txt
echo    YUKMENGENTIK - GAME NGETIK CEPAT >> YukMengetik_v1.0\README.txt
echo =============================================================== >> YukMengetik_v1.0\README.txt
echo. >> YukMengetik_v1.0\README.txt
echo CARA INSTALL: >> YukMengetik_v1.0\README.txt
echo 1. Double-click YukMengetik.exe >> YukMengetik_v1.0\README.txt
echo 2. Tunggu aplikasi terbuka >> YukMengetik_v1.0\README.txt
echo 3. Selesai! >> YukMengetik_v1.0\README.txt
echo. >> YukMengetik_v1.0\README.txt
echo PIN ADMIN: 098123 >> YukMengetik_v1.0\README.txt
echo. >> YukMengetik_v1.0\README.txt
echo FITUR: >> YukMengetik_v1.0\README.txt
echo - Tes mengetik dengan feedback real-time >> YukMengetik_v1.0\README.txt
echo - Leaderboard otomatis >> YukMengetik_v1.0\README.txt
echo - Admin panel lengkap >> YukMengetik_v1.0\README.txt
echo - Import siswa dari Excel >> YukMengetik_v1.0\README.txt
echo - Offline, tidak perlu internet >> YukMengetik_v1.0\README.txt
echo. >> YukMengetik_v1.0\README.txt
echo Untuk dokumentasi lengkap, baca CARA_INSTALL.txt >> YukMengetik_v1.0\README.txt

echo.
echo Membuat ZIP file...
powershell Compress-Archive -Path YukMengetik_v1.0\* -DestinationPath YukMengetik_v1.0.zip -Force

echo.
echo ============================================================
echo PAKET DISTRIBUSI SIAP!
echo ============================================================
echo.
echo Folder: YukMengetik_v1.0\
echo ZIP: YukMengetik_v1.0.zip
echo.
echo Isi paket:
dir YukMengetik_v1.0
echo.
echo CARA DISTRIBUSI:
echo 1. Kirim file YukMengetik_v1.0.zip ke orang lain
echo 2. Mereka extract dan double-click YukMengetik.exe
echo 3. Selesai!
echo.
echo PIN Admin: 098123
echo.
pause