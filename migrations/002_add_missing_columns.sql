-- Add missing columns to match full product schema
-- Run in Supabase Dashboard SQL Editor

-- Shoes: spec detail columns
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS stack_heel_mm integer;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS stack_forefoot_mm integer;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS rock_plate boolean DEFAULT false;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS waterproof_version boolean DEFAULT false;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS terrain text;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS distance_sweet_spot text;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS claimed_vs_actual text;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS from_the_trail text;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS image_url text;

-- Vests: spec detail columns
ALTER TABLE vests ADD COLUMN IF NOT EXISTS front_pockets integer;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS back_pockets integer;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS soft_flask_included boolean DEFAULT false;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS itra_compliant boolean DEFAULT false;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS chest_strap_adjustable boolean DEFAULT false;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS gender text DEFAULT 'unisex';
ALTER TABLE vests ADD COLUMN IF NOT EXISTS claimed_vs_actual text;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS from_the_trail text;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS image_url text;

-- Gels: spec detail columns
ALTER TABLE gels ADD COLUMN IF NOT EXISTS sodium_mg integer;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS calories integer;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS format text DEFAULT 'gel';
ALTER TABLE gels ADD COLUMN IF NOT EXISTS fodmap_friendly boolean DEFAULT false;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS claimed_vs_actual text;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS from_the_trail text;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS image_url text;
