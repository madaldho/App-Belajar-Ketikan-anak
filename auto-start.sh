#!/bin/bash
# Auto-start script untuk macOS/Linux
# Jalankan: chmod +x auto-start.sh && ./auto-start.sh

echo "========================================"
echo "   GAME NGETIK CEPAT - AUTO START"
echo "========================================"
echo ""

# Pindah ke directory script
cd "$(dirname "$0")"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 tidak terinstall!"
    echo "Silakan install Python dari https://python.org"
    exit 1
fi

echo "[OK] Python3 terdeteksi"
echo ""

# Check dependencies
echo "Mengecek dependencies..."
python3 -c "import fastapi, uvicorn, sqlalchemy" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "[INFO] Installing dependencies..."
    pip3 install -r requirements.txt
    echo ""
fi

echo "[OK] Dependencies ready"
echo ""

# Run aplikasi
echo "Memulai aplikasi..."
echo ""
python3 run.py
