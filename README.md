# ⚡ TYPING TEST - Game Ngetik Cepat

**Aplikasi tes mengetik profesional** untuk kompetisi sekolah dengan mode kiosk.  
**Mode per-huruf** dengan feedback real-time warna hijau/merah seperti MonkeyType!

---

## 🚀 CARA INSTALL & JALANKAN

### 1. Install Python (jika belum ada)
- Download Python 3.11+ dari https://python.org
- ✅ **PENTING**: Centang "Add Python to PATH" saat install

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Jalankan Aplikasi
```bash
python run.py
```

**Atau klik 2x file:**
- Windows: `auto-start.bat`
- macOS/Linux: `auto-start.sh`

Aplikasi akan otomatis:
✅ Membuat database SQLite  
✅ Mengisi 24 kalimat Bahasa Indonesia  
✅ Membuka browser di **http://localhost:8000**

---

## ✨ FITUR UTAMA

### 🎯 **Mode Tes Per-Huruf**
- **Real-time feedback** - Hijau = benar, Merah = salah
- **Support backspace** - Bisa hapus huruf salah
- **Kalimat lengkap** - 2-3 baris, bukan per kata
- **Timer 60 detik** - Countdown jelas
- **WPM & Akurasi** - Update real-time

### � **Mode Murid**
- Pilih kelas & nama dari grid card besar
- Tes mengetik dengan UI modern & clean
- Hasil langsung masuk leaderboard
- Animasi confetti saat selesai
- Auto-return ke home (10 detik)

### 🏆 **Leaderboard**
- Halaman khusus leaderboard lengkap
- Filter by kelas
- Top 3 dengan medal 🥇🥈🥉
- Background gradient untuk ranking tinggi
- Real-time update setiap 30 detik di home

### 👨‍🏫 **Mode Guru (Admin)**
- PIN: `1234` (default)
- Dashboard akan ditambahkan untuk:
  - Kelola kelas & siswa
  - Kelola kalimat tes
  - Analytics & export data

### 🖥️ **Kiosk Mode**
- Auto-return to home
- Statistik harian di home
- Leaderboard preview (Top 5)
- Touch-friendly (tombol besar)
- Fullscreen support

---

## 🎨 DESIGN & UI/UX

✅ **Modern & Professional**
- Gradient backgrounds (blue → indigo → purple)
- Glassmorphism effects (backdrop blur)
- Smooth animations & transitions
- Shadow & hover effects

✅ **Responsive**
- Desktop: Grid 4 kolom untuk card siswa
- Tablet: Grid 3 kolom
- Mobile: Grid 2 kolom
- Font auto-adjust per device

✅ **Accessibility**
- High contrast colors
- Clear typography (Inter + JetBrains Mono)
- Large touch targets (min 44x44px)
- Keyboard shortcuts (ESC untuk berhenti)

---

## 📂 STRUKTUR PROJECT

```
App Ketikan anak/
├── run.py                  # Main runner (start here)
├── auto-start.bat          # Windows auto-start
├── auto-start.sh           # macOS/Linux auto-start
├── requirements.txt        # Python dependencies
├── README.md              # Dokumentasi ini
├── ketikan.db             # SQLite database (auto-generated)
├── backend/
│   ├── main.py           # FastAPI server & API endpoints
│   └── database.py       # Database models & init
└── frontend/
    ├── index.html        # Main HTML (minimal)
    └── app.js            # Full SPA JavaScript logic
```

---

## 🛠️ TECH STACK

**Backend:**
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM untuk database
- **SQLite** - Database (offline-ready)
- **bcrypt** - Password hashing untuk PIN admin
- **Uvicorn** - ASGI server

**Frontend:**
- **Vanilla JavaScript** - No framework, pure JS
- **TailwindCSS CDN** - Utility-first CSS
- **Google Fonts** - Inter & JetBrains Mono

---

## 📊 DATABASE

**Tabel:**
1. **Kelas** - Daftar kelas (7A, 7B, 8A, 8B)
2. **Siswa** - Data siswa dengan kelas & avatar emoji
3. **Kata** - 24 kalimat Bahasa Indonesia (mudah/sedang/sulit)
4. **HasilTes** - Record semua tes (WPM, akurasi, skor)
5. **Settings** - Konfigurasi aplikasi
6. **AdminAccount** - PIN admin (bcrypt)

**Default Data:**
- 4 Kelas (7A, 7B, 8A, 8B)
- 5 Siswa contoh
- 24 Kalimat (10 mudah, 8 sedang, 6 sulit)
- PIN Admin: `1234`

---

## 🔧 KONFIGURASI

Edit file `backend/database.py` untuk:
- Ubah default kelas
- Tambah/edit siswa awal
- Tambah kalimat baru
- Ubah durasi tes (default 60 detik)

Edit `backend/main.py` untuk:
- Ubah port server (default 8000)
- Tambah API endpoints baru

---

## � TROUBLESHOOTING

**Port sudah dipakai:**
```bash
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000   # Windows
```

**Dependencies error:**
```bash
pip install --upgrade pip
pip install -r requirements.txt --force-reinstall
```

**Database corrupt:**
```bash
rm ketikan.db
python run.py  # Will recreate
```

---

## 📞 SUPPORT

Dibuat dengan ❤️ untuk pendidikan Indonesia  
Version: **1.0.0** (November 2025)

**Fitur mendatang:**
- [ ] Admin dashboard lengkap
- [ ] Export leaderboard ke PDF
- [ ] Grafik progress siswa
- [ ] Mode practice (tanpa timer)
- [ ] Custom kalimat per level
