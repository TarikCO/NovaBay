import os
import json
import requests
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")
URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
FILE_PATH = "../data/flood_zones.json" 

with open(FILE_PATH, 'r') as f:
    data = json.load(f)

features = data['features']
batch_size = 50 
print(f"🌊 Starting upload of {len(features)} flood zones to Supabase...")

for i in range(0, len(features), batch_size):
    batch = features[i:i + batch_size]
    rows = []
    
    for f in batch:
        if not f.get('geometry'):
            continue

        props = f.get('properties', {})
        zone = props.get("FLD_ZONE", "Unknown")
        
        # Simple logic: If it's not 'X', it's usually high risk in Florida
        risk = "High" if zone != "X" else "Moderate"

        rows.append({
            "geom": f['geometry'], 
            "zone_name": zone,    # Matches your SQL column
            "risk_level": risk    # Matches your SQL column
        })
    
    res = requests.post(
        f"{URL}/rest/v1/flood_zones",
        headers={
            "apikey": KEY,
            "Authorization": f"Bearer {KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        json=rows
    )
    
    if res.status_code in [200, 201]:
        print(f"✅ Uploaded through zone #{i + len(batch)}... Status: {res.status_code}")
    else:
        print(f"❌ Error at feature {i}: {res.status_code} - {res.text}")
        break

print("🏁 Flood zones are live!")