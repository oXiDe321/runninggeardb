/**
 * Seed latest 2026 products with images.
 * Usage: npx tsx scripts/seed-latest.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TAG = 'trailgear-22';

function amz(keywords: string) {
  return `https://www.amazon.com.au/s?k=${encodeURIComponent(keywords)}&tag=${TAG}`;
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

// ── 2026 shoes ─────────────────────────────────────────
const shoes = [
  { brand: 'HOKA', model: 'Speedgoat 7', slug: 'hoka-speedgoat-7', discipline: 'trail', drop_mm: 6, weight_g: 220, price_usd: 155, our_rating: 4.9, carbon_plate: false, published: true },
  { brand: 'Nike', model: 'Vaporfly 4', slug: 'nike-vaporfly-4', discipline: 'road', drop_mm: 8, weight_g: 184, price_usd: 260, our_rating: 5.0, carbon_plate: true, published: true },
  { brand: 'Salomon', model: 'Genesis', slug: 'salomon-genesis', discipline: 'trail', drop_mm: 8, weight_g: 252, price_usd: 145, our_rating: 4.5, carbon_plate: false, published: true },
  { brand: 'ASICS', model: 'Superblast 3', slug: 'asics-superblast-3', discipline: 'road', drop_mm: 8, weight_g: 205, price_usd: 200, our_rating: 4.8, carbon_plate: false, published: true },
  { brand: 'Saucony', model: 'Endorphin Speed 5', slug: 'saucony-endorphin-speed-5', discipline: 'road', drop_mm: 8, weight_g: 199, price_usd: 170, our_rating: 4.7, carbon_plate: true, published: true },
  { brand: 'Brooks', model: 'Cascadia 18', slug: 'brooks-cascadia-18', discipline: 'trail', drop_mm: 8, weight_g: 240, price_usd: 140, our_rating: 4.6, carbon_plate: false, published: true },
  { brand: 'On', model: 'Cloudultra 2', slug: 'on-cloudultra-2', discipline: 'trail', drop_mm: 8, weight_g: 250, price_usd: 180, our_rating: 4.4, carbon_plate: false, published: true },
  { brand: 'New Balance', model: 'FuelCell Rebel v4', slug: 'nb-fuelcell-rebel-v4', discipline: 'road', drop_mm: 6, weight_g: 190, price_usd: 140, our_rating: 4.5, carbon_plate: false, published: true },
  { brand: 'Adidas', model: 'Terrex Speed Ultra 2', slug: 'adidas-terrex-speed-ultra-2', discipline: 'trail', drop_mm: 8, weight_g: 210, price_usd: 180, our_rating: 4.4, carbon_plate: false, published: true },
  { brand: 'Puma', model: 'Deviate Nitro Elite 3', slug: 'puma-deviate-nitro-elite-3', discipline: 'road', drop_mm: 8, weight_g: 195, price_usd: 200, our_rating: 4.6, carbon_plate: true, published: true },
];

// ── 2026 vests ─────────────────────────────────────────
const vests = [
  {
    brand: 'Salomon', model: 'ADV Skin 14', slug: 'salomon-adv-skin-14', capacity_l: 14,
    weight_g: 235, utmb_compliant: true, price_usd: 160, our_rating: 4.8, published: true,
  },
  {
    brand: 'Naked', model: 'Running Band 2.0', slug: 'naked-running-band-2', capacity_l: 2,
    weight_g: 45, utmb_compliant: false, price_usd: 55, our_rating: 4.5, published: true,
  },
  {
    brand: 'RaidLight', model: 'Ultra 15L', slug: 'raidlight-ultra-15l', capacity_l: 15,
    weight_g: 240, utmb_compliant: true, price_usd: 160, our_rating: 4.2, published: true,
  },
];

// ── 2026 gels ──────────────────────────────────────────
const gels = [
  {
    brand: 'Maurten', product: 'Gel 160', slug: 'maurten-gel-160', carbs_per_serving_g: 40,
    caffeine_mg: 0, price_per_serving: 4.5, our_rating: 4.9, real_food: false, published: true,
  },
  {
    brand: 'Precision Fuel', product: 'PF 90 Gel', slug: 'precision-fuel-pf90', carbs_per_serving_g: 90,
    caffeine_mg: 0, price_per_serving: 5.5, our_rating: 4.6, real_food: false, published: true,
  },
  {
    brand: 'GU Energy', product: 'Liquid Energy Gel', slug: 'gu-liquid-energy', carbs_per_serving_g: 23,
    caffeine_mg: 0, price_per_serving: 2.0, our_rating: 4.3, real_food: false, published: true,
  },
  {
    brand: 'Huma', product: 'Chia Gel Plus', slug: 'huma-chia-gel-plus', carbs_per_serving_g: 22,
    caffeine_mg: 50, price_per_serving: 3.2, our_rating: 4.4, real_food: true, published: true,
  },
  {
    brand: 'SiS', product: 'Beta Fuel Gel', slug: 'sis-beta-fuel-gel', carbs_per_serving_g: 40,
    caffeine_mg: 0, price_per_serving: 3.5, our_rating: 4.5, real_food: false, published: true,
  },
  {
    brand: 'Naak', product: 'Ultra Energy Waffle', slug: 'naak-ultra-waffle', carbs_per_serving_g: 30,
    caffeine_mg: 0, price_per_serving: 4.0, our_rating: 4.2, real_food: true, published: true,
  },
];

async function main() {
  console.log('Seeding latest 2026 products...\n');

  for (const [table, items, getKw] of [
    ['shoes', shoes, (p: any) => `${p.brand} ${p.model}`] as const,
    ['vests', vests, (p: any) => `${p.brand} ${p.model}`] as const,
    ['gels', gels, (p: any) => `${p.brand} ${p.product}`] as const,
  ]) {
    console.log(`${table}:`);
    for (const item of items) {
      const { error } = await supabase.from(table).upsert(
        { ...item, amazon_url: amz(getKw(item)) },
        { onConflict: 'slug' },
      );
      console.log(error ? `  ✗ ${getKw(item)}: ${error.message}` : `  ✓ ${getKw(item)}`);
    }
  }

  console.log('\nDone.');
}

main();
