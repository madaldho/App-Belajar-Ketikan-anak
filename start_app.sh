#!/bin/bash
echo "============================================================"
echo " GAME NGETIK CEPAT - MODE SEKOLAH"
echo "============================================================"
echo

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 tidak ditemukan!"
    exit 1
fi

# Install deps if needed
echo "📦 Memeriksa dependencies..."
pip3 install -r requirements.txt > /dev/null 2>&1

# Run
echo "🚀 Menjalankan aplikasi..."
python3 run.py
