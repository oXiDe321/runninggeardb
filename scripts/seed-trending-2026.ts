/**
 * seed-trending-2026.ts — 30 trending products (10 shoes, 10 vests, 10 gels)
 * sourced from iRunFar, Trail&Kale, OutdoorGearLab, Reddit r/running, The Run Testers
 * Usage: npx tsx scripts/seed-trending-2026.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

const TAG = 'trailgear-22';
const amz = (q: string) => `https://www.amazon.com.au/s?k=${encodeURIComponent(q)}&tag=${TAG}`;

// ── 10 Trending Shoes ──────────────────────────────────────────────────────
// Sources: The Run Testers, Trail&Kale, OutdoorGearLab, r/running
const shoes = [
  {
    brand: 'Nike', model: 'Pegasus 42', slug: 'nike-pegasus-42',
    discipline: 'road', drop_mm: 10, weight_g: 255, stack_heel_mm: 40,
    price_usd: 130, msrp_usd: 130, our_rating: 8.1,
    carbon_plate: false, published: true,
    tagline: 'Most-loved daily trainer, redesigned',
  },
  {
    brand: 'HOKA', model: 'Mach 7', slug: 'hoka-mach-7',
    discipline: 'road', drop_mm: 5, weight_g: 218, stack_heel_mm: 33,
    price_usd: 145, msrp_usd: 145, our_rating: 8.6,
    carbon_plate: false, published: true,
    tagline: 'Lightweight versatility, all-pace favourite',
  },
  {
    brand: 'ASICS', model: 'Novablast 5', slug: 'asics-novablast-5',
    discipline: 'road', drop_mm: 8, weight_g: 268, stack_heel_mm: 41,
    price_usd: 140, msrp_usd: 140, our_rating: 8.4,
    carbon_plate: false, published: true,
    tagline: 'Bouncy everyday trainer, unbeatable value',
  },
  {
    brand: 'New Balance', model: 'Fresh Foam X 1080v15', slug: 'nb-fresh-foam-1080v15',
    discipline: 'road', drop_mm: 6, weight_g: 270, stack_heel_mm: 40,
    price_usd: 175, msrp_usd: 175, our_rating: 8.5,
    carbon_plate: false, published: true,
    tagline: 'Max-cushion Infinion foam, long run king',
  },
  {
    brand: 'Saucony', model: 'Endorphin Pro 5', slug: 'saucony-endorphin-pro-5',
    discipline: 'road', drop_mm: 8, weight_g: 185, stack_heel_mm: 40,
    price_usd: 250, msrp_usd: 250, our_rating: 9.1,
    carbon_plate: true, published: true,
    tagline: 'Carbon super-shoe, race-day weapon',
  },
  {
    brand: 'Salomon', model: 'Xodus Ultra 4', slug: 'salomon-xodus-ultra-4',
    discipline: 'trail', drop_mm: 6, weight_g: 285, stack_heel_mm: 38,
    price_usd: 165, msrp_usd: 165, our_rating: 8.9,
    carbon_plate: false, published: true,
    tagline: '#1 all-mountain trail shoe 2026',
  },
  {
    brand: 'Adidas', model: 'Adizero Evo SL', slug: 'adidas-adizero-evo-sl',
    discipline: 'road', drop_mm: 6, weight_g: 210, stack_heel_mm: 40,
    price_usd: 200, msrp_usd: 200, our_rating: 8.7,
    carbon_plate: false, published: true,
    tagline: 'Sub-racer speed at a sub-200 price',
  },
  {
    brand: 'Brooks', model: 'Hyperion Max 2', slug: 'brooks-hyperion-max-2',
    discipline: 'road', drop_mm: 8, weight_g: 230, stack_heel_mm: 38,
    price_usd: 150, msrp_usd: 150, our_rating: 8.3,
    carbon_plate: false, published: true,
    tagline: 'Speed-focused daily with nitrogen foam',
  },
  {
    brand: 'On', model: 'Cloudstratus 4', slug: 'on-cloudstratus-4',
    discipline: 'road', drop_mm: 9, weight_g: 285, stack_heel_mm: 38,
    price_usd: 170, msrp_usd: 170, our_rating: 8.0,
    carbon_plate: false, published: true,
    tagline: 'Double CloudTec stability, long-run comfort',
  },
  {
    brand: 'Nike', model: 'Ultrafly Trail 2', slug: 'nike-ultrafly-trail-2',
    discipline: 'trail', drop_mm: 8, weight_g: 225, stack_heel_mm: 38,
    price_usd: 200, msrp_usd: 200, our_rating: 8.8,
    carbon_plate: true, published: true,
    tagline: 'Carbon trail racer built for UTMB-style efforts',
  },
];

// ── 10 Trending Vests ──────────────────────────────────────────────────────
// Sources: iRunFar, CleverHiker, OutdoorGearLab, Switchback Travel
const vests = [
  {
    brand: 'UltrAspire', model: 'Alpha 6.0', slug: 'ultraspire-alpha-6',
    capacity_l: 6, weight_g: 155, price_usd: 150, our_rating: 8.8,
    utmb_compliant: true, soft_flask_included: true, published: true,
  },
  {
    brand: 'UltrAspire', model: 'Spry 5.0', slug: 'ultraspire-spry-5',
    capacity_l: 4, weight_g: 85, price_usd: 120, our_rating: 8.4,
    utmb_compliant: false, soft_flask_included: false, published: true,
  },
  {
    brand: 'The North Face', model: 'Summit Series Run 10', slug: 'tnf-summit-run-10',
    capacity_l: 10, weight_g: 200, price_usd: 200, our_rating: 8.6,
    utmb_compliant: true, soft_flask_included: true, published: true,
  },
  {
    brand: 'Orange Mud', model: 'HydraQuiver Vest Pack 2.0', slug: 'orange-mud-hydraquiver-2',
    capacity_l: 4, weight_g: 210, price_usd: 140, our_rating: 8.2,
    utmb_compliant: false, soft_flask_included: false, published: true,
  },
  {
    brand: 'Inov-8', model: 'RacePac 8', slug: 'inov8-racepac-8',
    capacity_l: 8, weight_g: 195, price_usd: 110, our_rating: 8.1,
    utmb_compliant: false, soft_flask_included: false, published: true,
  },
  {
    brand: 'Salomon', model: 'Active Skin 4', slug: 'salomon-active-skin-4',
    capacity_l: 4, weight_g: 145, price_usd: 130, our_rating: 8.5,
    utmb_compliant: true, soft_flask_included: true, published: true,
  },
  {
    brand: 'Montane', model: 'Gecko VP 5+', slug: 'montane-gecko-vp-5',
    capacity_l: 5, weight_g: 160, price_usd: 135, our_rating: 8.3,
    utmb_compliant: false, soft_flask_included: true, published: true,
  },
  {
    brand: 'Raidlight', model: 'Revolutiv 12L', slug: 'raidlight-revolutiv-12l',
    capacity_l: 12, weight_g: 225, price_usd: 155, our_rating: 8.2,
    utmb_compliant: true, soft_flask_included: true, published: true,
  },
  {
    brand: 'Dynafit', model: 'Alpine 12L', slug: 'dynafit-alpine-12l',
    capacity_l: 12, weight_g: 240, price_usd: 140, our_rating: 8.0,
    utmb_compliant: false, soft_flask_included: false, published: true,
  },
  {
    brand: 'UltrAspire', model: 'Momentum 3.0', slug: 'ultraspire-momentum-3',
    capacity_l: 6, weight_g: 170, price_usd: 135, our_rating: 8.3,
    utmb_compliant: false, soft_flask_included: false, published: true,
  },
];

// ── 10 Trending Gels / Fuel ────────────────────────────────────────────────
// Sources: runbikecalc.com, 220 Triathlon, thefeed.com, livefortheoutdoors.com
const gels = [
  {
    brand: 'Maurten', product: 'Gel 160', slug: 'maurten-gel-160',
    carbs_per_serving_g: 40, caffeine_mg: 0, calories: 160,
    price_per_serving: 5.00, our_rating: 9.0,
    format: 'gel', real_food: false, fodmap_friendly: false, published: true,
  },
  {
    brand: 'Neversecond', product: 'C30 Sport Gel', slug: 'neversecond-c30-gel',
    carbs_per_serving_g: 30, caffeine_mg: 0, calories: 120,
    price_per_serving: 3.20, our_rating: 8.5,
    format: 'gel', real_food: false, fodmap_friendly: false, published: true,
  },
  {
    brand: 'Precision Fuel', product: 'PF 90 Caffeine Gel', slug: 'precision-fuel-pf90-caff',
    carbs_per_serving_g: 90, caffeine_mg: 100, calories: 360,
    price_per_serving: 5.80, our_rating: 8.8,
    format: 'gel', real_food: false, fodmap_friendly: false, published: true,
  },
  {
    brand: 'SiS', product: 'Beta Fuel + Nootropics Gel', slug: 'sis-beta-fuel-nootropics',
    carbs_per_serving_g: 40, caffeine_mg: 75, calories: 160,
    price_per_serving: 4.00, our_rating: 8.4,
    format: 'gel', real_food: false, fodmap_friendly: false, published: true,
  },
  {
    brand: 'Myprotein', product: 'The Energy Gel', slug: 'myprotein-energy-gel',
    carbs_per_serving_g: 22, caffeine_mg: 75, calories: 88,
    price_per_serving: 1.80, our_rating: 7.8,
    format: 'gel', real_food: false, fodmap_friendly: false, published: true,
  },
  {
    brand: 'Hammer Nutrition', product: 'HEED Energy Gel', slug: 'hammer-heed-gel',
    carbs_per_serving_g: 21, caffeine_mg: 0, calories: 90,
    price_per_serving: 2.20, our_rating: 7.9,
    format: 'gel', real_food: false, fodmap_friendly: false, published: true,
  },
  {
    brand: 'Skratch Labs', product: 'Energy Chews Sport', slug: 'skratch-energy-chews',
    carbs_per_serving_g: 19, caffeine_mg: 0, calories: 80,
    price_per_serving: 3.00, our_rating: 8.2,
    format: 'chew', real_food: true, fodmap_friendly: false, published: true,
  },
  {
    brand: 'Gatorade', product: 'Endurance Energy Chews', slug: 'gatorade-endurance-chews',
    carbs_per_serving_g: 24, caffeine_mg: 0, calories: 100,
    price_per_serving: 2.50, our_rating: 7.6,
    format: 'chew', real_food: false, fodmap_friendly: false, published: true,
  },
  {
    brand: 'Muir Energy', product: 'Real Food Gel', slug: 'muir-energy-real-food',
    carbs_per_serving_g: 22, caffeine_mg: 0, calories: 100,
    price_per_serving: 3.50, our_rating: 8.3,
    format: 'gel', real_food: true, fodmap_friendly: false, published: true,
  },
  {
    brand: 'Maurten', product: 'Drink Mix 160', slug: 'maurten-drink-mix-160',
    carbs_per_serving_g: 40, caffeine_mg: 0, calories: 160,
    price_per_serving: 4.50, our_rating: 8.6,
    format: 'drink', real_food: false, fodmap_friendly: false, published: true,
  },
];

async function main() {
  console.log('Seeding 30 trending 2026 products...\n');

  // Shoes
  console.log('── SHOES ──');
  for (const s of shoes) {
    const row = { ...s, amazon_url: amz(`${s.brand} ${s.model} running shoe`) };
    const { error } = await supabase.from('shoes').upsert(row, { onConflict: 'slug' });
    console.log(error ? `  ✗ ${s.slug}: ${error.message}` : `  ✓ ${s.brand} ${s.model}`);
  }

  // Vests
  console.log('\n── VESTS ──');
  for (const v of vests) {
    const row = { ...v, amazon_url: amz(`${v.brand} ${v.model} running vest`) };
    const { error } = await supabase.from('vests').upsert(row, { onConflict: 'slug' });
    console.log(error ? `  ✗ ${v.slug}: ${error.message}` : `  ✓ ${v.brand} ${v.model}`);
  }

  // Gels
  console.log('\n── GELS ──');
  for (const g of gels) {
    const row = { ...g, amazon_url: amz(`${g.brand} ${g.product}`) };
    const { error } = await supabase.from('gels').upsert(row, { onConflict: 'slug' });
    console.log(error ? `  ✗ ${g.slug}: ${error.message}` : `  ✓ ${g.brand} ${g.product}`);
  }

  console.log('\n✅ Done. Now run: npx tsx scripts/verify-fix-images.ts');
}

main().catch(console.error);
