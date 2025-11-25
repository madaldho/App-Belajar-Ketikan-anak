"""
FastAPI Main Application
Game Ngetik Cepat - Kiosk Mode
"""
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
import bcrypt
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime, timedelta
import os
import openpyxl
from io import BytesIO

from backend.database import (
    get_db, init_db, 
    Kelas, Siswa, Kata, HasilTes, Settings, AdminAccount
)

# Paths & config
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
APP_HOST = os.getenv("APP_HOST", "0.0.0.0")
APP_PORT = int(os.getenv("APP_PORT", "8000"))
DISPLAY_HOST = os.getenv(
    "APP_DISPLAY_HOST",
    "localhost" if APP_HOST in ("0.0.0.0", "::") else APP_HOST
)

# Initialize FastAPI
app = FastAPI(title="Game Ngetik Cepat", version="1.0.0")

# Pydantic models for API
class KelasCreate(BaseModel):
    nama: str

class KelasResponse(BaseModel):
    id: int
    nama: str
    jumlah_siswa: int = 0
    
    class Config:
        from_attributes = True

class SiswaCreate(BaseModel):
    nama: str
    kelas_id: int
    avatar: str = "👤"

class SiswaResponse(BaseModel):
    id: int
    nama: str
    kelas_id: int
    kelas_nama: str
    avatar: str
    
    class Config:
        from_attributes = True

class KataCreate(BaseModel):
    kata: str
    level: str = "Mudah"

class KataResponse(BaseModel):
    id: int
    kata: str
    level: str
    panjang: int
    
    class Config:
        from_attributes = True

class HasilTesCreate(BaseModel):
    siswa_id: int
    durasi: int
    kata_benar: int
    kata_salah: int
    wpm: float
    akurasi: float
    skor: int

class HasilTesResponse(BaseModel):
    id: int
    siswa_id: int
    siswa_nama: str
    kelas_nama: str
    durasi: int
    kata_benar: int
    kata_salah: int
    wpm: float
    akurasi: float
    skor: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    pin: str

class SettingsUpdate(BaseModel):
    key: str
    value: str

class ResetRequest(BaseModel):
    confirm: bool

# ============ ENDPOINTS ============

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()
    print(f"🚀 Server started at http://{DISPLAY_HOST}:{APP_PORT}")

# Serve static files (HTML, CSS, JS)
@app.get("/")
async def read_root():
    """Serve home page"""
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if not os.path.exists(index_path):
        raise HTTPException(status_code=500, detail="Frontend index.html tidak ditemukan")
    return FileResponse(index_path)

# Mount static folder
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

# ============ AUTH ============

@app.post("/api/auth/login")
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Verify admin PIN"""
    admin = db.query(AdminAccount).first()
    
    # Auto-fix if admin missing (e.g. existing DB from older version)
    if not admin:
        pin_bytes = "1234".encode('utf-8')
        pin_hash = bcrypt.hashpw(pin_bytes, bcrypt.gensalt()).decode('utf-8')
        admin = AdminAccount(pin_hash=pin_hash, nama="Admin")
        db.add(admin)
        db.commit()
    
    # Verify PIN using bcrypt
    pin_bytes = request.pin.encode('utf-8')
    pin_hash_bytes = admin.pin_hash.encode('utf-8')
    
    if not bcrypt.checkpw(pin_bytes, pin_hash_bytes):
        raise HTTPException(status_code=401, detail="PIN salah")
    
    return {"success": True, "message": "Login berhasil"}

# ============ ADMIN FEATURES ============

@app.post("/api/admin/reset-leaderboard")
async def reset_leaderboard(request: ResetRequest, db: Session = Depends(get_db)):
    """Reset leaderboard (delete all test results)"""
    if not request.confirm:
        raise HTTPException(status_code=400, detail="Konfirmasi diperlukan")
    
    db.query(HasilTes).delete()
    db.commit()
    return {"success": True, "message": "Leaderboard berhasil direset"}

@app.post("/api/admin/import-siswa")
async def import_siswa(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Import siswa from Excel"""
    if not file.filename.endswith('.xlsx'):
        raise HTTPException(status_code=400, detail="Format file harus .xlsx")
    
    try:
        contents = await file.read()
        wb = openpyxl.load_workbook(BytesIO(contents))
        sheet = wb.active
        
        count = 0
        for row in sheet.iter_rows(min_row=2, values_only=True):
            if not row or not row[0]: continue
            
            nama = str(row[0]).strip()
            kelas_nama = str(row[1]).strip() if len(row) > 1 and row[1] else "Umum"
            
            # Find or create kelas
            kelas = db.query(Kelas).filter(Kelas.nama == kelas_nama).first()
            if not kelas:
                kelas = Kelas(nama=kelas_nama)
                db.add(kelas)
                db.commit()
                db.refresh(kelas)
            
            # Find or create siswa
            siswa = db.query(Siswa).filter(Siswa.nama == nama, Siswa.kelas_id == kelas.id).first()
            if not siswa:
                siswa = Siswa(nama=nama, kelas_id=kelas.id, avatar="👤")
                db.add(siswa)
                count += 1
        
        db.commit()
        return {"success": True, "message": f"Berhasil import {count} siswa baru"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error import: {str(e)}")

# ============ KELAS ============

@app.get("/api/kelas", response_model=List[KelasResponse])
async def get_kelas(db: Session = Depends(get_db)):
    """Get all kelas"""
    kelas_list = db.query(Kelas).all()
    result = []
    for k in kelas_list:
        result.append({
            "id": k.id,
            "nama": k.nama,
            "jumlah_siswa": len(k.siswa)
        })
    return result

@app.post("/api/kelas", response_model=KelasResponse)
async def create_kelas(kelas: KelasCreate, db: Session = Depends(get_db)):
    """Create new kelas"""
    # Check duplicate
    existing = db.query(Kelas).filter(Kelas.nama == kelas.nama).first()
    if existing:
        raise HTTPException(status_code=400, detail="Kelas sudah ada")
    
    new_kelas = Kelas(nama=kelas.nama)
    db.add(new_kelas)
    db.commit()
    db.refresh(new_kelas)
    
    return {
        "id": new_kelas.id,
        "nama": new_kelas.nama,
        "jumlah_siswa": 0
    }

@app.put("/api/kelas/{kelas_id}", response_model=KelasResponse)
async def update_kelas(kelas_id: int, kelas: KelasCreate, db: Session = Depends(get_db)):
    """Update kelas"""
    db_kelas = db.query(Kelas).filter(Kelas.id == kelas_id).first()
    if not db_kelas:
        raise HTTPException(status_code=404, detail="Kelas tidak ditemukan")
    
    db_kelas.nama = kelas.nama
    db.commit()
    db.refresh(db_kelas)
    
    return {
        "id": db_kelas.id,
        "nama": db_kelas.nama,
        "jumlah_siswa": len(db_kelas.siswa)
    }

@app.delete("/api/kelas/{kelas_id}")
async def delete_kelas(kelas_id: int, db: Session = Depends(get_db)):
    """Delete kelas"""
    db_kelas = db.query(Kelas).filter(Kelas.id == kelas_id).first()
    if not db_kelas:
        raise HTTPException(status_code=404, detail="Kelas tidak ditemukan")
    
    db.delete(db_kelas)
    db.commit()
    return {"success": True, "message": "Kelas berhasil dihapus"}

# ============ SISWA ============

@app.get("/api/siswa", response_model=List[SiswaResponse])
async def get_siswa(kelas_id: Optional[int] = None, db: Session = Depends(get_db)):
    """Get all siswa, optionally filter by kelas"""
    query = db.query(Siswa)
    if kelas_id:
        query = query.filter(Siswa.kelas_id == kelas_id)
    
    siswa_list = query.all()
    result = []
    for s in siswa_list:
        result.append({
            "id": s.id,
            "nama": s.nama,
            "kelas_id": s.kelas_id,
            "kelas_nama": s.kelas.nama,
            "avatar": s.avatar
        })
    return result

@app.post("/api/siswa", response_model=SiswaResponse)
async def create_siswa(siswa: SiswaCreate, db: Session = Depends(get_db)):
    """Create new siswa"""
    new_siswa = Siswa(
        nama=siswa.nama,
        kelas_id=siswa.kelas_id,
        avatar=siswa.avatar
    )
    db.add(new_siswa)
    db.commit()
    db.refresh(new_siswa)
    
    return {
        "id": new_siswa.id,
        "nama": new_siswa.nama,
        "kelas_id": new_siswa.kelas_id,
        "kelas_nama": new_siswa.kelas.nama,
        "avatar": new_siswa.avatar
    }

@app.put("/api/siswa/{siswa_id}", response_model=SiswaResponse)
async def update_siswa(siswa_id: int, siswa: SiswaCreate, db: Session = Depends(get_db)):
    """Update siswa"""
    db_siswa = db.query(Siswa).filter(Siswa.id == siswa_id).first()
    if not db_siswa:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan")
    
    db_siswa.nama = siswa.nama
    db_siswa.kelas_id = siswa.kelas_id
    db_siswa.avatar = siswa.avatar
    db.commit()
    db.refresh(db_siswa)
    
    return {
        "id": db_siswa.id,
        "nama": db_siswa.nama,
        "kelas_id": db_siswa.kelas_id,
        "kelas_nama": db_siswa.kelas.nama,
        "avatar": db_siswa.avatar
    }

@app.delete("/api/siswa/{siswa_id}")
async def delete_siswa(siswa_id: int, db: Session = Depends(get_db)):
    """Delete siswa"""
    db_siswa = db.query(Siswa).filter(Siswa.id == siswa_id).first()
    if not db_siswa:
        raise HTTPException(status_code=404, detail="Siswa tidak ditemukan")
    
    db.delete(db_siswa)
    db.commit()
    return {"success": True, "message": "Siswa berhasil dihapus"}

# ============ KATA ============

@app.get("/api/kata", response_model=List[KataResponse])
async def get_kata(level: Optional[str] = None, db: Session = Depends(get_db)):
    """Get all kata, optionally filter by level"""
    query = db.query(Kata)
    if level:
        query = query.filter(Kata.level == level)
    
    kata_list = query.all()
    return kata_list

@app.post("/api/kata", response_model=KataResponse)
async def create_kata(kata: KataCreate, db: Session = Depends(get_db)):
    """Create new kata"""
    # Check duplicate
    existing = db.query(Kata).filter(Kata.kata == kata.kata).first()
    if existing:
        raise HTTPException(status_code=400, detail="Kata sudah ada")
    
    new_kata = Kata(
        kata=kata.kata,
        level=kata.level,
        panjang=len(kata.kata)
    )
    db.add(new_kata)
    db.commit()
    db.refresh(new_kata)
    
    return new_kata

@app.put("/api/kata/{kata_id}", response_model=KataResponse)
async def update_kata(kata_id: int, kata: KataCreate, db: Session = Depends(get_db)):
    """Update kata"""
    db_kata = db.query(Kata).filter(Kata.id == kata_id).first()
    if not db_kata:
        raise HTTPException(status_code=404, detail="Kata tidak ditemukan")
    
    db_kata.kata = kata.kata
    db_kata.level = kata.level
    db_kata.panjang = len(kata.kata)
    db.commit()
    db.refresh(db_kata)
    
    return db_kata

@app.delete("/api/kata/{kata_id}")
async def delete_kata(kata_id: int, db: Session = Depends(get_db)):
    """Delete kata"""
    db_kata = db.query(Kata).filter(Kata.id == kata_id).first()
    if not db_kata:
        raise HTTPException(status_code=404, detail="Kata tidak ditemukan")
    
    db.delete(db_kata)
    db.commit()
    return {"success": True, "message": "Kata berhasil dihapus"}

# ============ HASIL TES ============

@app.post("/api/hasil-tes", response_model=HasilTesResponse)
async def create_hasil_tes(hasil: HasilTesCreate, db: Session = Depends(get_db)):
    """Save hasil tes"""
    new_hasil = HasilTes(
        siswa_id=hasil.siswa_id,
        durasi=hasil.durasi,
        kata_benar=hasil.kata_benar,
        kata_salah=hasil.kata_salah,
        wpm=hasil.wpm,
        akurasi=hasil.akurasi,
        skor=hasil.skor
    )
    db.add(new_hasil)
    db.commit()
    db.refresh(new_hasil)
    
    return {
        "id": new_hasil.id,
        "siswa_id": new_hasil.siswa_id,
        "siswa_nama": new_hasil.siswa.nama,
        "kelas_nama": new_hasil.siswa.kelas.nama,
        "durasi": new_hasil.durasi,
        "kata_benar": new_hasil.kata_benar,
        "kata_salah": new_hasil.kata_salah,
        "wpm": new_hasil.wpm,
        "akurasi": new_hasil.akurasi,
        "skor": new_hasil.skor,
        "created_at": new_hasil.created_at
    }

@app.get("/api/hasil-tes-all")
async def get_all_hasil_tes(db: Session = Depends(get_db)):
    """Get ALL hasil tes dengan tanggal & jam untuk admin history panel"""
    results = db.query(HasilTes).order_by(HasilTes.created_at.desc()).all()
    
    data = []
    for r in results:
        data.append({
            "id": r.id,
            "siswa_nama": r.siswa.nama,
            "kelas_nama": r.siswa.kelas.nama,
            "wpm": r.wpm,
            "akurasi": r.akurasi,
            "skor": r.skor,
            "created_at": r.created_at.isoformat()
        })
    
    return data

@app.get("/api/leaderboard")
async def get_leaderboard(
    kelas_id: Optional[int] = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get leaderboard, optionally filter by kelas"""
    # Subquery untuk mendapatkan skor tertinggi per siswa
    from sqlalchemy import func
    
    subquery = db.query(
        HasilTes.siswa_id,
        func.max(HasilTes.skor).label('best_score')
    ).group_by(HasilTes.siswa_id).subquery()
    
    # Join untuk mendapatkan detail hasil terbaik
    query = db.query(HasilTes).join(
        subquery,
        (HasilTes.siswa_id == subquery.c.siswa_id) & 
        (HasilTes.skor == subquery.c.best_score)
    ).join(Siswa)
    
    if kelas_id:
        query = query.filter(Siswa.kelas_id == kelas_id)
    
    results = query.order_by(HasilTes.skor.desc()).limit(limit).all()
    
    leaderboard = []
    for rank, hasil in enumerate(results, 1):
        leaderboard.append({
            "rank": rank,
            "siswa_id": hasil.siswa_id,
            "siswa_nama": hasil.siswa.nama,
            "kelas_nama": hasil.siswa.kelas.nama,
            "avatar": hasil.siswa.avatar,
            "skor": hasil.skor,
            "wpm": hasil.wpm,
            "akurasi": hasil.akurasi,
            "created_at": hasil.created_at
        })
    
    return leaderboard

@app.get("/api/statistik-harian")
async def get_statistik_harian(db: Session = Depends(get_db)):
    """Get statistik hari ini"""
    from sqlalchemy import func
    
    today = datetime.now().date()
    
    # Total pemain hari ini
    total_pemain = db.query(func.count(func.distinct(HasilTes.siswa_id))).filter(
        func.date(HasilTes.created_at) == today
    ).scalar()
    
    # Total tes hari ini
    total_tes = db.query(func.count(HasilTes.id)).filter(
        func.date(HasilTes.created_at) == today
    ).scalar()
    
    # Rata-rata skor hari ini
    avg_skor = db.query(func.avg(HasilTes.skor)).filter(
        func.date(HasilTes.created_at) == today
    ).scalar() or 0
    
    # WPM tertinggi hari ini
    max_wpm = db.query(func.max(HasilTes.wpm)).filter(
        func.date(HasilTes.created_at) == today
    ).scalar() or 0
    
    # Akurasi terbaik hari ini
    max_akurasi = db.query(func.max(HasilTes.akurasi)).filter(
        func.date(HasilTes.created_at) == today
    ).scalar() or 0
    
    return {
        "total_pemain": total_pemain or 0,
        "total_tes": total_tes or 0,
        "rata_rata_skor": round(avg_skor, 1),
        "wpm_tertinggi": round(max_wpm, 1),
        "akurasi_terbaik": round(max_akurasi, 1)
    }

# ============ SETTINGS ============

@app.get("/api/settings")
async def get_settings(db: Session = Depends(get_db)):
    """Get all settings"""
    settings = db.query(Settings).all()
    result = {}
    for s in settings:
        result[s.key] = s.value
    return result

@app.put("/api/settings")
async def update_settings(settings: SettingsUpdate, db: Session = Depends(get_db)):
    """Update a setting"""
    db_setting = db.query(Settings).filter(Settings.key == settings.key).first()
    if not db_setting:
        # Create if not exists
        db_setting = Settings(key=settings.key, value=settings.value)
        db.add(db_setting)
    else:
        db_setting.value = settings.value
        db_setting.updated_at = datetime.now()
    
    db.commit()
    return {"success": True, "message": "Setting berhasil diupdate"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=APP_HOST, port=APP_PORT)
