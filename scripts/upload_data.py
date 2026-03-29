import json
import requests

# 1. Update these from your Supabase 'Project Settings' -> 'API'
URL = "YOUR_SUPABASE_PROJECT_URL"
KEY = "YOUR_SERVICE_ROLE_KEY"  # Use the Service Role key for bulk imports
FILE_PATH = "../data/parcel_clipped.geojson"

with open(FILE_PATH, 'r') as f:
    data = json.load(f)

features = data['features']
batch_size = 500 # Upload in chunks so it doesn't timeout

for i in range(0, len(features), batch_size):
    batch = features[i:i + batch_size]
    rows = []
    for f in batch:
        props = f['properties']
        rows.append({
            "geom": json.dumps(f['geometry']),
            "folio": props.get("FOLIO"),
            "site_addr": props.get("SITE_ADDR"),
            "site_zip": props.get("SITE_ZIP"),
            "year_built": props.get("ACT"), # Property Appraiser uses 'ACT' for year built
            "stories": props.get("tSTORIES"),
            "dor_c": props.get("DOR_C")
        })
    
    res = requests.post(
        f"{URL}/rest/v1/tampa_parcels",
        headers={"apikey": KEY, "Authorization": f"Bearer {KEY}", "Content-Type": "application/json"},
        json=rows
    )
    print(f"Uploaded up to feature {i + len(batch)}... Status: {res.status_code}")