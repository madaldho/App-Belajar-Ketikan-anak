# 🔨 Cara Build YukMengetik menjadi EXE

## Langkah 1: Install Dependencies Desktop

```bash
pip install -r requirements-desktop.txt
```

Ini akan install:
- Semua dependencies aplikasi web (FastAPI, SQLAlchemy, dll)
- **pywebview** - Library untuk membuat window desktop native
- **pyinstaller** - Tool untuk bundle Python menjadi .exe

## Langkah 2: Build Executable

```bash
python build_exe.py
```

Script ini akan:
1. Clean build folder sebelumnya
2. Jalankan PyInstaller dengan konfigurasi optimal
3. Bundle semua file (Python, dependencies, frontend, backend) menjadi 1 file .exe
4. Simpan hasil di folder `dist/`

**Proses build memakan waktu 2-5 menit tergantung spesifikasi PC**

## Langkah 3: Test Executable

Setelah build selesai:

```bash
cd dist
YukMengetik.exe
```

Atau double-click `YukMengetik.exe` di Windows Explorer.

## Hasil Build

```
dist/
└── YukMengetik.exe    # Single file executable (~50-80 MB)
```

File ini sudah **standalone** dan bisa:
- Dijalankan tanpa Python installed
- Dicopy ke komputer lain (Windows 10/11)
- Dibagikan ke user lain
- Diinstall di lab komputer sekolah

## Troubleshooting

### Error: "Failed to execute script"
- Pastikan semua dependencies terinstall
- Coba build ulang dengan `--clean` flag

### Error: "Module not found"
- Tambahkan `--hidden-import=nama_module` di `build_exe.py`

### Executable terlalu besar
- Normal untuk PyInstaller (50-80 MB)
- Bisa dikompres dengan UPX (opsional)

### Antivirus block executable
- Normal untuk .exe baru (false positive)
- Whitelist di antivirus atau submit ke VirusTotal

## Distribusi

### Opsi 1: Distribusi Manual
Copy `YukMengetik.exe` ke komputer target dan jalankan.

### Opsi 2: Buat Installer (Advanced)
Gunakan **Inno Setup** untuk membuat installer profesional:
1. Download Inno Setup: https://jrsoftware.org/isinfo.php
2. Buat script installer (contoh di bawah)
3. Compile menjadi `YukMengetik_Setup.exe`

## File yang Dibundle

Executable akan include:
- ✅ Python interpreter
- ✅ Semua dependencies (FastAPI, SQLAlchemy, dll)
- ✅ Frontend files (HTML, CSS, JS)
- ✅ Backend files (Python modules)
- ✅ Database akan dibuat otomatis saat pertama kali run

## Keuntungan Desktop App

1. **Standalone** - Tidak perlu install Python
2. **Native Window** - Terasa seperti aplikasi desktop asli
3. **Offline** - Tidak perlu koneksi internet
4. **Portable** - Bisa dijalankan dari USB drive
5. **Professional** - Lebih mudah didistribusikan ke sekolah

## Catatan Penting

- Database (`ketikan.db`) akan dibuat di folder yang sama dengan .exe
- Untuk update, cukup replace .exe lama dengan yang baru
- Data di database tidak akan hilang saat update
