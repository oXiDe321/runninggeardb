/**
 * Seed script — populates shoes, vests, and gels tables with real product data
 * and Amazon affiliate links.
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * Amazon affiliate tag: trailgear-22
 * Before running, execute migrations in Supabase Dashboard SQL Editor:
 *   migrations/001_add_image_url.sql
 *   migrations/002_add_missing_columns.sql
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const AFFILIATE_TAG = 'trailgear-22';

function affiliateUrl(keywords: string): string {
  const query = encodeURIComponent(keywords);
  return `https://www.amazon.com.au/s?k=${query}&tag=${AFFILIATE_TAG}`;
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

// ── SHOES ──────────────────────────────────────────────

const shoes = [
  { brand: 'HOKA', model: 'Speedgoat 6', slug: 'hoka-speedgoat-6', discipline: 'trail', drop_mm: 7, weight_g: 228, price_usd: 155, our_rating: 4.8, carbon_plate: false, published: true },
  { brand: 'Salomon', model: 'Sense Ride 5', slug: 'salomon-sense-ride-5', discipline: 'trail', drop_mm: 8, weight_g: 240, price_usd: 130, our_rating: 4.6, carbon_plate: false, published: true },
  { brand: 'Brooks', model: 'Cascadia 17', slug: 'brooks-cascadia-17', discipline: 'trail', drop_mm: 10, weight_g: 248, price_usd: 140, our_rating: 4.5, carbon_plate: false, published: true },
  { brand: 'Nike', model: 'Pegasus Trail 5', slug: 'nike-pegasus-trail-5', discipline: 'trail', drop_mm: 10, weight_g: 244, price_usd: 120, our_rating: 4.4, carbon_plate: false, published: true },
  { brand: 'Nike', model: 'Ultrafly', slug: 'nike-ultrafly', discipline: 'trail', drop_mm: 6, weight_g: 265, price_usd: 260, our_rating: 4.7, carbon_plate: true, published: true },
  { brand: 'Saucony', model: 'Endorphin Rift', slug: 'saucony-endorphin-rift', discipline: 'trail', drop_mm: 8, weight_g: 235, price_usd: 150, our_rating: 4.6, carbon_plate: false, published: true },
  { brand: 'HOKA', model: 'Tecton X 3', slug: 'hoka-tecton-x-3', discipline: 'trail', drop_mm: 5, weight_g: 226, price_usd: 275, our_rating: 4.9, carbon_plate: true, published: true },
  { brand: 'Altra', model: 'Lone Peak 8', slug: 'altra-lone-peak-8', discipline: 'trail', drop_mm: 0, weight_g: 256, price_usd: 140, our_rating: 4.3, carbon_plate: false, published: true },
  { brand: 'La Sportiva', model: 'Bushido III', slug: 'la-sportiva-bushido-iii', discipline: 'trail', drop_mm: 8, weight_g: 230, price_usd: 145, our_rating: 4.5, carbon_plate: false, published: true },
  { brand: 'Inov-8', model: 'Trailfly G 270', slug: 'inov8-trailfly-g-270', discipline: 'trail', drop_mm: 0, weight_g: 202, price_usd: 150, our_rating: 4.4, carbon_plate: false, published: true },
  { brand: 'On', model: 'Cloudmonster', slug: 'on-cloudmonster', discipline: 'road', drop_mm: 11, weight_g: 264, price_usd: 160, our_rating: 4.7, carbon_plate: true, published: true },
  { brand: 'Nike', model: 'Vaporfly 3', slug: 'nike-vaporfly-3', discipline: 'road', drop_mm: 8, weight_g: 188, price_usd: 250, our_rating: 4.9, carbon_plate: true, published: true },
  { brand: 'ASICS', model: 'Superblast 2', slug: 'asics-superblast-2', discipline: 'road', drop_mm: 8, weight_g: 210, price_usd: 200, our_rating: 4.7, carbon_plate: false, published: true },
  { brand: 'Saucony', model: 'Endorphin Speed 4', slug: 'saucony-endorphin-speed-4', discipline: 'road', drop_mm: 8, weight_g: 204, price_usd: 170, our_rating: 4.6, carbon_plate: true, published: true },
  { brand: 'Adidas', model: 'Adios Pro 3', slug: 'adidas-adios-pro-3', discipline: 'road', drop_mm: 6, weight_g: 220, price_usd: 250, our_rating: 4.8, carbon_plate: true, published: true },
  { brand: 'Reebok', model: 'Nano X4', slug: 'reebok-nano-x4', discipline: 'hyrox', drop_mm: 4, weight_g: 340, price_usd: 140, our_rating: 4.3, carbon_plate: false, published: true },
  { brand: 'Under Armour', model: 'Tribase Reign 6', slug: 'ua-tribase-reign-6', discipline: 'hyrox', drop_mm: 2, weight_g: 310, price_usd: 130, our_rating: 4.2, carbon_plate: false, published: true },
  { brand: 'HOKA', model: 'Mach 6', slug: 'hoka-mach-6', discipline: 'parkrun', drop_mm: 5, weight_g: 195, price_usd: 140, our_rating: 4.5, carbon_plate: false, published: true },
];

// ── VESTS ──────────────────────────────────────────────

const vests = [
  { brand: 'Ultimate Direction', model: 'Adventure Vesta 6', slug: 'ud-adventure-vesta-6', capacity_l: 6, weight_g: 113, utmb_compliant: true, price_usd: 150, our_rating: 4.7, published: true },
  { brand: 'Salomon', model: 'ADV Skin 12', slug: 'salomon-adv-skin-12', capacity_l: 12, weight_g: 220, utmb_compliant: true, price_usd: 140, our_rating: 4.6, published: true },
  { brand: 'Nathan', model: 'VaporAiress 7L', slug: 'nathan-vaporairess-7l', capacity_l: 7, weight_g: 130, utmb_compliant: true, price_usd: 130, our_rating: 4.4, published: true },
  { brand: 'Osprey', model: 'Dyna 6', slug: 'osprey-dyna-6', capacity_l: 6, weight_g: 140, utmb_compliant: false, price_usd: 160, our_rating: 4.5, published: true },
  { brand: 'Black Diamond', model: 'Distance 15', slug: 'bd-distance-15', capacity_l: 15, weight_g: 280, utmb_compliant: true, price_usd: 200, our_rating: 4.8, published: true },
  { brand: 'Salomon', model: 'Active Skin 8', slug: 'salomon-active-skin-8', capacity_l: 8, weight_g: 190, utmb_compliant: true, price_usd: 110, our_rating: 4.2, published: true },
  { brand: 'CompressSport', model: 'UltraRace 10', slug: 'compressport-ultrarace-10', capacity_l: 10, weight_g: 170, utmb_compliant: true, price_usd: 130, our_rating: 4.1, published: true },
  { brand: 'RaidLight', model: 'Responsiv 10L', slug: 'raidlight-responsiv-10l', capacity_l: 10, weight_g: 195, utmb_compliant: true, price_usd: 120, our_rating: 4.0, published: true },
  { brand: 'Instinct', model: 'Trail 7', slug: 'instinct-trail-7', capacity_l: 7, weight_g: 155, utmb_compliant: true, price_usd: 105, our_rating: 4.3, published: true },
];

// ── GELS ───────────────────────────────────────────────

const gels = [
  { brand: 'Maurten', product: 'Gel 100', slug: 'maurten-gel-100', carbs_per_serving_g: 25, caffeine_mg: 0, price_per_serving: 3.5, our_rating: 4.8, real_food: false, published: true },
  { brand: 'Maurten', product: 'Gel 100 Caf 100', slug: 'maurten-gel-100-caf', carbs_per_serving_g: 25, caffeine_mg: 100, price_per_serving: 3.8, our_rating: 4.7, real_food: false, published: true },
  { brand: 'Precision Fuel', product: 'PF 30 Gel', slug: 'precision-fuel-pf30', carbs_per_serving_g: 30, caffeine_mg: 0, price_per_serving: 3.0, our_rating: 4.7, real_food: false, published: true },
  { brand: 'Precision Fuel', product: 'PF 30 Caf', slug: 'precision-fuel-pf30-caf', carbs_per_serving_g: 30, caffeine_mg: 75, price_per_serving: 3.2, our_rating: 4.6, real_food: false, published: true },
  { brand: 'SiS', product: 'Go Isotonic Gel', slug: 'sis-go-isotonic', carbs_per_serving_g: 22, caffeine_mg: 0, price_per_serving: 2.5, our_rating: 4.3, real_food: false, published: true },
  { brand: 'SiS', product: 'Go Isotonic + Caffeine', slug: 'sis-go-isotonic-caf', carbs_per_serving_g: 22, caffeine_mg: 75, price_per_serving: 2.8, our_rating: 4.4, real_food: false, published: true },
  { brand: 'Spring Energy', product: 'Energy Bar', slug: 'spring-energy-bar', carbs_per_serving_g: 40, caffeine_mg: 0, price_per_serving: 5.0, our_rating: 4.5, real_food: true, published: true },
  { brand: 'Spring Energy', product: 'Awesome Sauce Gel', slug: 'spring-awesome-sauce', carbs_per_serving_g: 25, caffeine_mg: 0, price_per_serving: 5.5, our_rating: 4.6, real_food: true, published: true },
  { brand: 'GU Energy', product: 'Original Gel', slug: 'gu-original-gel', carbs_per_serving_g: 21, caffeine_mg: 0, price_per_serving: 2.0, our_rating: 4.2, real_food: false, published: true },
  { brand: 'GU Energy', product: 'Roctane Gel', slug: 'gu-roctane-gel', carbs_per_serving_g: 21, caffeine_mg: 35, price_per_serving: 2.5, our_rating: 4.4, real_food: false, published: true },
  { brand: 'Huma', product: 'Chia Gel', slug: 'huma-chia-gel', carbs_per_serving_g: 21, caffeine_mg: 0, price_per_serving: 2.8, our_rating: 4.2, real_food: true, published: true },
  { brand: 'Huma', product: 'Chia Gel + Caffeine', slug: 'huma-chia-gel-caf', carbs_per_serving_g: 21, caffeine_mg: 25, price_per_serving: 2.8, our_rating: 4.3, real_food: true, published: true },
  { brand: 'Honey Stinger', product: 'Organic Gel', slug: 'honey-stinger-organic-gel', carbs_per_serving_g: 24, caffeine_mg: 0, price_per_serving: 2.5, our_rating: 4.1, real_food: true, published: true },
  { brand: 'Tailwind', product: 'Endurance Fuel', slug: 'tailwind-endurance-fuel', carbs_per_serving_g: 25, caffeine_mg: 0, price_per_serving: 2.0, our_rating: 4.6, real_food: false, published: true },
  { brand: 'Tailwind', product: 'Endurance Fuel + Caffeine', slug: 'tailwind-endurance-fuel-caf', carbs_per_serving_g: 25, caffeine_mg: 35, price_per_serving: 2.0, our_rating: 4.5, real_food: false, published: true },
  { brand: 'Clif', product: 'Bloks Energy Chews', slug: 'clif-bloks', carbs_per_serving_g: 24, caffeine_mg: 0, price_per_serving: 2.0, our_rating: 4.0, real_food: false, published: true },
  { brand: 'VFuel', product: 'Endurance Gel', slug: 'vfuel-endurance-gel', carbs_per_serving_g: 24, caffeine_mg: 0, price_per_serving: 2.5, our_rating: 4.0, real_food: false, published: true },
];

// ── Run ────────────────────────────────────────────────

async function main() {
  console.log('Seeding RunningGearDB (affiliate: amazon.com.au / trailgear-22)...\n');

  for (const category of [
    { name: 'shoes', label: 'shoes', items: shoes, getKeyword: (p: any) => `${p.brand} ${p.model}` },
    { name: 'vests', label: 'vests', items: vests, getKeyword: (p: any) => `${p.brand} ${p.model}` },
    { name: 'gels', label: 'gels', items: gels, getKeyword: (p: any) => `${p.brand} ${p.product}` },
  ] as const) {
    console.log(`Seeding ${category.items.length} ${category.label}...`);
    for (const item of category.items) {
      const keywords = category.getKeyword(item);
      const { error } = await supabase
        .from(category.name)
        .upsert({ ...item, amazon_url: affiliateUrl(keywords) }, { onConflict: 'slug' });
      if (error) {
        console.error(`  ✗ ${keywords}: ${error.message}`);
      } else {
        console.log(`  ✓ ${keywords}`);
      }
    }
    console.log('');
  }

  console.log('Seed complete.');
  console.log(`Total: ${shoes.length} shoes, ${vests.length} vests, ${gels.length} gels`);
  console.log(`Affiliate tag: ${AFFILIATE_TAG} (amazon.com.au)`);
}

main();
