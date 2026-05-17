-- RunningGearDB Initial Schema
-- Run this in Supabase SQL editor

-- Shoes table
CREATE TABLE shoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  year INT,
  price_usd NUMERIC,
  weight_g INT,
  stack_heel_mm INT,
  stack_forefoot_mm INT,
  drop_mm INT,
  lug_depth_mm NUMERIC,
  rock_plate BOOLEAN DEFAULT FALSE,
  carbon_plate BOOLEAN DEFAULT FALSE,
  waterproof_version BOOLEAN DEFAULT FALSE,
  discipline TEXT CHECK (discipline IN ('trail','road','hyrox','track','road-to-trail','parkrun')) DEFAULT 'trail',
  terrain TEXT CHECK (terrain IN ('rocky','muddy','mixed','road','track','gym')),
  distance_sweet_spot TEXT CHECK (distance_sweet_spot IN ('5k','10k','half','marathon','ultra')),
  our_rating NUMERIC(3,1),
  claimed_vs_actual TEXT,
  review_content TEXT,
  review_generated_at TIMESTAMPTZ,
  from_the_trail TEXT,
  published BOOLEAN DEFAULT FALSE,
  affiliate_url TEXT,
  amazon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vests table
CREATE TABLE vests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  year INT,
  capacity_l NUMERIC,
  weight_g INT,
  front_pockets INT,
  back_pockets INT,
  soft_flask_included BOOLEAN DEFAULT FALSE,
  utmb_compliant BOOLEAN DEFAULT FALSE,
  itra_compliant BOOLEAN DEFAULT FALSE,
  chest_strap_adjustable BOOLEAN DEFAULT FALSE,
  gender TEXT CHECK (gender IN ('unisex','women','men')) DEFAULT 'unisex',
  price_usd NUMERIC,
  our_rating NUMERIC(3,1),
  claimed_vs_actual TEXT,
  review_content TEXT,
  review_generated_at TIMESTAMPTZ,
  from_the_trail TEXT,
  published BOOLEAN DEFAULT FALSE,
  affiliate_url TEXT,
  amazon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gels table
CREATE TABLE gels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand TEXT NOT NULL,
  product TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  carbs_per_serving_g INT,
  sodium_mg INT,
  caffeine_mg INT,
  calories INT,
  format TEXT CHECK (format IN ('gel','chew','drink','bar')),
  real_food BOOLEAN DEFAULT FALSE,
  fodmap_friendly BOOLEAN DEFAULT FALSE,
  price_per_serving NUMERIC,
  our_rating NUMERIC(3,1),
  review_content TEXT,
  review_generated_at TIMESTAMPTZ,
  from_the_trail TEXT,
  published BOOLEAN DEFAULT FALSE,
  affiliate_url TEXT,
  amazon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  category TEXT CHECK (category IN ('guide','comparison','race','nutrition')),
  keywords TEXT[],
  published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  generated_at TIMESTAMPTZ,
  featured_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS (Row Level Security) - Public read access for published products
ALTER TABLE shoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vests ENABLE ROW LEVEL SECURITY;
ALTER TABLE gels ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON shoes FOR SELECT USING (published = TRUE);
CREATE POLICY "Allow public read" ON vests FOR SELECT USING (published = TRUE);
CREATE POLICY "Allow public read" ON gels FOR SELECT USING (published = TRUE);
CREATE POLICY "Allow public read" ON blog_posts FOR SELECT USING (published = TRUE);

CREATE POLICY "Service role full access" ON shoes USING (TRUE);
CREATE POLICY "Service role full access" ON vests USING (TRUE);
CREATE POLICY "Service role full access" ON gels USING (TRUE);
CREATE POLICY "Service role full access" ON blog_posts USING (TRUE);
