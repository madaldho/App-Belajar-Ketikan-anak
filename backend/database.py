"""
Database configuration and models
"""
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Database setup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'ketikan.db')}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class Kelas(Base):
    __tablename__ = "kelas"
    
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String(50), unique=True, nullable=False)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    siswa = relationship("Siswa", back_populates="kelas", cascade="all, delete-orphan")

class Siswa(Base):
    __tablename__ = "siswa"
    
    id = Column(Integer, primary_key=True, index=True)
    nama = Column(String(100), nullable=False)
    kelas_id = Column(Integer, ForeignKey("kelas.id"), nullable=False)
    avatar = Column(String(10), default="👤")  # Emoji avatar
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    kelas = relationship("Kelas", back_populates="siswa")
    hasil_tes = relationship("HasilTes", back_populates="siswa", cascade="all, delete-orphan")

class Kata(Base):
    __tablename__ = "kata"
    
    id = Column(Integer, primary_key=True, index=True)
    kata = Column(Text, nullable=False)  # Changed to Text for longer sentences
    level = Column(String(20), default="Mudah")  # Mudah, Sedang, Sulit
    panjang = Column(Integer)
    tipe = Column(String(20), default="kata")  # kata, kalimat, paragraf
    created_at = Column(DateTime, default=datetime.now)

class HasilTes(Base):
    __tablename__ = "hasil_tes"
    
    id = Column(Integer, primary_key=True, index=True)
    siswa_id = Column(Integer, ForeignKey("siswa.id"), nullable=False)
    durasi = Column(Integer, default=60)  # detik
    kata_benar = Column(Integer, default=0)
    kata_salah = Column(Integer, default=0)
    wpm = Column(Float, default=0.0)  # Words Per Minute
    akurasi = Column(Float, default=0.0)  # Persentase
    skor = Column(Integer, default=0)
    foto = Column(Text, nullable=True)  # Base64 encoded image
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationships
    siswa = relationship("Siswa", back_populates="hasil_tes")

class Settings(Base):
    __tablename__ = "settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(Text)
    description = Column(String(200))
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

class AdminAccount(Base):
    __tablename__ = "admin_account"
    
    id = Column(Integer, primary_key=True, index=True)
    pin_hash = Column(String(200), nullable=False)
    nama = Column(String(100), default="Admin")
    created_at = Column(DateTime, default=datetime.now)

# Database initialization
def init_db():
    """Create all tables and insert default data"""
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if data already exists
        if db.query(Kelas).count() > 0:
            print("✅ Database sudah ada data")
            return
        
        print("📦 Membuat data awal...")
        
        # Default settings
        default_settings = [
            Settings(key="durasi_tes", value="60", description="Durasi tes dalam detik"),
            Settings(key="min_panjang_kata", value="4", description="Minimal panjang kata"),
            Settings(key="max_panjang_kata", value="12", description="Maksimal panjang kata"),
            Settings(key="auto_return_home", value="true", description="Auto kembali ke home"),
            Settings(key="auto_return_delay", value="10", description="Delay auto return (detik)"),
            Settings(key="show_leaderboard_home", value="true", description="Tampilkan leaderboard di home"),
            Settings(key="quote_motivasi", value="Lebih baik salah daripada tidak mencoba sama sekali", description="Quote motivasi di home"),
            Settings(key="penalty_salah", value="5", description="Pengurangan poin per karakter salah"),
        ]
        db.add_all(default_settings)
        
        # Default admin PIN: 098123
        import bcrypt
        pin_bytes = "098123".encode('utf-8')
        pin_hash = bcrypt.hashpw(pin_bytes, bcrypt.gensalt()).decode('utf-8')
        admin = AdminAccount(
            pin_hash=pin_hash,
            nama="Admin"
        )
        db.add(admin)
        
        # Default kelas
        kelas_list = [
            Kelas(nama="7A"),
            Kelas(nama="7B"),
            Kelas(nama="8A"),
            Kelas(nama="8B"),
        ]
        db.add_all(kelas_list)
        db.commit()
        
        # Default siswa
        siswa_list = [
            Siswa(nama="Ahmad Fauzi", kelas_id=1, avatar="👦"),
            Siswa(nama="Siti Nurhaliza", kelas_id=1, avatar="👧"),
            Siswa(nama="Budi Santoso", kelas_id=1, avatar="👦"),
            Siswa(nama="Maya Putri", kelas_id=2, avatar="👧"),
            Siswa(nama="Rudi Hartono", kelas_id=2, avatar="👦"),
        ]
        db.add_all(siswa_list)
        db.commit()
        
        # Default kalimat untuk tes mengetik (per huruf mode)
        kata_list = [
            # Kalimat Mudah - Pendek, kata umum
            Kata(kata="Aku suka belajar di sekolah setiap hari dengan teman-teman.", level="Mudah", panjang=61, tipe="kalimat"),
            Kata(kata="Buku adalah jendela dunia yang membuka wawasan kita.", level="Mudah", panjang=54, tipe="kalimat"),
            Kata(kata="Guru mengajar dengan sabar dan penuh perhatian.", level="Mudah", panjang=49, tipe="kalimat"),
            Kata(kata="Kami bermain bola di lapangan sekolah saat istirahat.", level="Mudah", panjang=55, tipe="kalimat"),
            Kata(kata="Matematika adalah pelajaran yang sangat menarik.", level="Mudah", panjang=50, tipe="kalimat"),
            Kata(kata="Perpustakaan sekolah memiliki banyak koleksi buku.", level="Mudah", panjang=52, tipe="kalimat"),
            Kata(kata="Saya rajin membaca buku setiap hari di rumah.", level="Mudah", panjang=47, tipe="kalimat"),
            Kata(kata="Komputer membantu kita belajar dengan lebih mudah.", level="Mudah", panjang=52, tipe="kalimat"),
            Kata(kata="Teman-teman saya sangat ramah dan suka membantu.", level="Mudah", panjang=50, tipe="kalimat"),
            Kata(kata="Olahraga membuat tubuh kita sehat dan kuat.", level="Mudah", panjang=44, tipe="kalimat"),
            
            # Kalimat Sedang - Lebih panjang, kata agak kompleks
            Kata(kata="Pendidikan merupakan fondasi penting untuk membangun masa depan yang cerah bagi generasi muda.", level="Sedang", panjang=95, tipe="kalimat"),
            Kata(kata="Kerja sama tim sangat diperlukan untuk mencapai tujuan bersama dengan lebih efektif.", level="Sedang", panjang=87, tipe="kalimat"),
            Kata(kata="Teknologi informasi berkembang pesat dan mengubah cara kita berkomunikasi sehari-hari.", level="Sedang", panjang=89, tipe="kalimat"),
            Kata(kata="Kreativitas dan inovasi adalah kunci sukses dalam menghadapi tantangan di era modern.", level="Sedang", panjang=88, tipe="kalimat"),
            Kata(kata="Lingkungan yang bersih dan sehat mencerminkan kepedulian masyarakat terhadap alam.", level="Sedang", panjang=85, tipe="kalimat"),
            Kata(kata="Membaca buku secara rutin dapat meningkatkan kemampuan berpikir kritis dan analitis.", level="Sedang", panjang=87, tipe="kalimat"),
            Kata(kata="Kejujuran dan integritas merupakan nilai-nilai penting yang harus dijaga dalam kehidupan.", level="Sedang", panjang=92, tipe="kalimat"),
            Kata(kata="Prestasi akademik yang baik memerlukan usaha, disiplin, dan konsistensi dalam belajar.", level="Sedang", panjang=89, tipe="kalimat"),
            
            # Kalimat Sulit - Panjang, kata kompleks, tanda baca
            Kata(kata="Kemajuan ilmu pengetahuan dan teknologi membawa dampak signifikan terhadap perkembangan peradaban manusia di seluruh dunia.", level="Sulit", panjang=125, tipe="kalimat"),
            Kata(kata="Kepemimpinan yang baik membutuhkan kemampuan komunikasi, empati, dan pengambilan keputusan yang bijaksana dalam berbagai situasi.", level="Sulit", panjang=131, tipe="kalimat"),
            Kata(kata="Globalisasi menciptakan peluang dan tantangan baru yang memerlukan adaptasi cepat serta pemahaman lintas budaya yang mendalam.", level="Sulit", panjang=130, tipe="kalimat"),
            Kata(kata="Keterampilan berpikir kritis sangat penting untuk menganalisis informasi secara objektif dan membuat keputusan yang tepat.", level="Sulit", panjang=127, tipe="kalimat"),
            Kata(kata="Pembangunan berkelanjutan mengintegrasikan aspek ekonomi, sosial, dan lingkungan untuk kesejahteraan generasi masa depan.", level="Sulit", panjang=128, tipe="kalimat"),
            
            # Paragraf untuk advanced users
            Kata(kata="Indonesia adalah negara kepulauan terbesar di dunia dengan kekayaan budaya yang sangat beragam. Setiap daerah memiliki keunikan tersendiri dalam bahasa, adat istiadat, dan tradisi yang telah diwariskan turun-temurun.", level="Sulit", panjang=227, tipe="paragraf"),
        ]
        db.add_all(kata_list)
        db.commit()
        
        print("✅ Data awal berhasil dibuat!")
        print("   - 4 Kelas")
        print("   - 5 Siswa")
        print(f"   - {len(kata_list)} Kalimat untuk tes mengetik")
        print("   - PIN Admin: 098123")
        
    finally:
        db.close()

def get_db():
    """Dependency for FastAPI"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
