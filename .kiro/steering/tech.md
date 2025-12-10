# Technology Stack

## Backend
- **FastAPI** - Modern Python web framework for API endpoints
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Embedded database (offline-ready, file: `ketikan.db`)
- **Uvicorn** - ASGI server
- **bcrypt** - Password hashing for admin PIN
- **openpyxl** - Excel file handling for student imports

## Frontend
- **Vanilla JavaScript** - No framework, pure JS SPA
- **TailwindCSS** (CDN) - Utility-first CSS framework
- **Google Fonts** - Inter (UI) & JetBrains Mono (code/typing)
- **canvas-confetti** - Celebration animations

## Database Schema
Tables: `kelas`, `siswa`, `kata`, `hasil_tes`, `settings`, `admin_account`

## Common Commands

### Installation
```bash
pip install -r requirements.txt
```

### Run Application
```bash
python run.py
```

### Quick Start (Auto-launch)
- Windows: Double-click `auto-start.bat`
- macOS/Linux: Run `auto-start.sh`

### Port Configuration
Default port: 8000 (auto-finds free port if occupied)
Set custom port: `APP_PORT=8080 python run.py`

### Database Reset
```bash
rm ketikan.db
python run.py  # Will recreate with default data
```

## Default Credentials
- Admin PIN: `098123`
