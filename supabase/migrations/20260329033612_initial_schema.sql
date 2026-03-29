-- 1. Enable the spatial engine
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create the Parcel table
CREATE TABLE IF NOT EXISTS tampa_parcels (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  geom geometry(MULTIPOLYGON, 4326),
  folio TEXT,
  site_addr TEXT,
  site_zip TEXT,
  year_built INT,
  stories INT,
  dor_c TEXT -- This is the 'Condo vs House' code we saw earlier
);

-- 3. Create the Flood Zone table
CREATE TABLE IF NOT EXISTS flood_zones (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  geom geometry(MULTIPOLYGON, 4326),
  zone_name TEXT, 
  risk_level TEXT -- You can manually update this to 'High', 'Medium', etc.
);

-- 4. Create an 'Index' so the map is fast
CREATE INDEX IF NOT EXISTS parcels_geo_idx ON tampa_parcels USING GIST (geom);
CREATE INDEX IF NOT EXISTS flood_geo_idx ON flood_zones USING GIST (geom);

-- 5. THE BRIDGE: Create a function for the AI to use
-- This lets your frontend say: "Here is a folio number, tell me the risk."
CREATE OR REPLACE FUNCTION get_resilience_report(target_folio TEXT)
RETURNS TABLE (
  address TEXT,
  built_year INT,
  property_type TEXT,
  is_flooded BOOLEAN,
  flood_zone TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.site_addr,
    p.year_built,
    p.dor_c,
    ST_Intersects(p.geom, f.geom) as is_flooded,
    f.zone_name
  FROM tampa_parcels p
  LEFT JOIN flood_zones f ON ST_Intersects(p.geom, f.geom)
  WHERE p.folio = target_folio
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;