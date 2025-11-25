import requests
import sys

try:
    # Test Analytics
    print("Testing Analytics Endpoint...")
    r = requests.get("http://localhost:8001/api/statistik-harian")
    if r.status_code == 200:
        print("✅ Analytics OK:", r.json())
    else:
        print(f"❌ Analytics Failed: {r.status_code}")

    # Test Import (Check if exists only, 405 Method Not Allowed is good for GET, 404 is bad)
    print("Testing Import Endpoint Existence...")
    r = requests.post("http://localhost:8001/api/admin/import-siswa") # No file, should be 422
    if r.status_code == 422: # Missing file
        print("✅ Import Endpoint Exists (Got 422 as expected for missing file)")
    elif r.status_code == 404:
        print("❌ Import Endpoint NOT FOUND (404)")
    else:
        print(f"⚠️ Import Endpoint returned: {r.status_code}")

except Exception as e:
    print(f"❌ Connection Error: {e}")
