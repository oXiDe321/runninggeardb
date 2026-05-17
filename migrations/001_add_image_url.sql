-- Add image_url column to all product tables
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS image_url text;
