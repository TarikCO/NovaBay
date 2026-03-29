import os
import json
import requests
from dotenv import load_dotenv

# 1. Load the .env file from the root directory
# Since the script is in /scripts, we go up one level to find .env
load_dotenv(dotenv_path="../.env")

# 2. Grab the variables
URL = os.getenv("SUPABASE_URL")
KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
FILE_PATH = "../data/parcel.json"

with open(FILE_PATH, 'r') as f:
    data = json.load(f)

features = data['features']
batch_size = 50 # Upload in chunks so it doesn't timeout

for i in range(0, len(features), batch_size):
    batch = features[i:i + batch_size]
    rows = []
    for f in batch:
        # 1. The Guard: If the house has no shape, SKIP IT
        if not f.get('geometry'):
            print(f"⏩ Skipping parcel {f.get('properties', {}).get('FOLIO')} (No geometry)")
            continue

        props = f.get('properties', {})
        rows.append({
            # 2. Send the geometry as a native object (remove json.dumps)
            "geom": f['geometry'], 
            "folio": props.get("FOLIO"),
            "site_addr": props.get("SITE_ADDR"),
            "site_zip": props.get("SITE_ZIP"),
            "year_built": props.get("ACT"),
            "stories": props.get("tSTORIES"),
            "dor_c": props.get("DOR_C")
        })
    
    res = requests.post(
        f"{URL}/rest/v1/tampa_parcels",
        headers={"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
        json=rows
    )
    if res.status_code not in [200, 201]:
        print(f"❌ Error at feature {i}: {res.status_code} - {res.text}")
        # This stops the script so we can read the first error
        break 
    else:
        print(f"✅ Uploaded up to feature {i + len(batch)}... Status: {res.status_code}")