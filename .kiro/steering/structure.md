# Project Structure

```
/
├── backend/
│   ├── main.py          # FastAPI app, API endpoints, server config
│   └── database.py      # SQLAlchemy models, DB initialization
│
├── frontend/
│   ├── index.html       # Minimal HTML shell
│   ├── app.js           # Full SPA logic (routing, state, UI)
│   ├── style.css        # Custom styles
│   ├── favicon.ico      # App icon
│   └── template_siswa.xlsx  # Excel template for student import
│
├── run.py               # Main entry point, server launcher
├── requirements.txt     # Python dependencies
├── ketikan.db          # SQLite database (auto-generated)
│
├── auto-start.bat      # Windows launcher
├── auto-start.sh       # Unix launcher
├── start_app.bat       # Alternative Windows launcher
└── start_app.sh        # Alternative Unix launcher
```

## Architecture Patterns

### Backend (FastAPI)
- RESTful API design
- Dependency injection for database sessions (`Depends(get_db)`)
- Pydantic models for request/response validation
- Relationship-based ORM queries (SQLAlchemy)

### Frontend (Vanilla JS)
- Single-page application (SPA) with client-side routing
- Global state management in `state` object
- Screen-based rendering (`renderScreen()` function)
- Event-driven input handling for typing test

### Database
- Relational model with foreign keys
- Cascade deletes for data integrity
- Default data seeding on first run
- Timestamps for audit trail

## Code Organization

### Backend Endpoints Pattern
- `/api/kelas` - Class management (CRUD)
- `/api/siswa` - Student management (CRUD)
- `/api/kata` - Test sentences (CRUD)
- `/api/hasil-tes` - Test results (Create, Read)
- `/api/leaderboard` - Rankings
- `/api/statistik-harian` - Daily statistics
- `/api/settings` - App configuration
- `/api/auth/login` - Admin authentication
- `/api/admin/*` - Admin-only operations

### Frontend Screens
- `home` - Dashboard with stats and leaderboard preview
- `pilih-siswa` - Student selection grid
- `countdown` - 3-2-1 countdown before test
- `tes` - Active typing test with real-time feedback
- `hasil` - Test results with confetti
- `leaderboard-full` - Complete leaderboard view
- `login-admin` - Admin PIN entry
- `admin` - Admin dashboard with tabs

## Naming Conventions
- Python: snake_case for variables/functions, PascalCase for classes
- JavaScript: camelCase for variables/functions
- Database: snake_case for table/column names
- CSS: kebab-case for class names
- Indonesian language for user-facing names (e.g., `siswa`, `kelas`, `kata`)
