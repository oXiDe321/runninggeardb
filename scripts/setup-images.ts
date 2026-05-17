/**
 * One-shot setup: opens Supabase SQL editor and copies the ALTER TABLE commands.
 * Once columns exist, seeds products with images from manufacturer CDNs.
 *
 * Usage:
 *   1. npx tsx scripts/setup-images.ts  (copies SQL to clipboard, opens dashboard)
 *   2. Paste & run in Supabase SQL Editor
 *   3. npx tsx scripts/setup-images.ts --seed  (populates image_url for all products)
 */

import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const REF = 'ktgyjhlwfktflgjikced';
const TAG = 'trailgear-22';

const MIGRATION_SQL = `-- RunningGearDB: add image columns + spec detail columns
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS stack_heel_mm integer;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS stack_forefoot_mm integer;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS rock_plate boolean DEFAULT false;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS waterproof_version boolean DEFAULT false;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS terrain text;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS distance_sweet_spot text;
ALTER TABLE shoes ADD COLUMN IF NOT EXISTS from_the_trail text;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS front_pockets integer;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS back_pockets integer;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS soft_flask_included boolean DEFAULT false;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS itra_compliant boolean DEFAULT false;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS chest_strap_adjustable boolean DEFAULT false;
ALTER TABLE vests ADD COLUMN IF NOT EXISTS gender text DEFAULT 'unisex';
ALTER TABLE vests ADD COLUMN IF NOT EXISTS from_the_trail text;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS sodium_mg integer;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS calories integer;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS format text DEFAULT 'gel';
ALTER TABLE gels ADD COLUMN IF NOT EXISTS fodmap_friendly boolean DEFAULT false;
ALTER TABLE gels ADD COLUMN IF NOT EXISTS from_the_trail text;`;

// Product images from manufacturer CDNs
const IMAGES: Record<string, Record<string, string>> = {
  shoes: {
    'hoka-speedgoat-6': 'https://www.hoka.com/content/dam/hoka/products/men/m-speedgoat-6/1123158_BSHB_1.jpg',
    'salomon-sense-ride-5': 'https://www.salomon.com/sites/default/files/styles/product_full/public/products/L41684700_0.jpg',
    'brooks-cascadia-17': 'https://www.brooksrunning.com/dw/image/v2/BGPF_PRD/on/demandware.static/-/Sites-brooks-master/default/dwhash/110393_488_l.jpg',
    'nike-pegasus-trail-5': 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/pegasus-trail-5.jpg',
    'nike-ultrafly': 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/ultrafly-trail.jpg',
    'saucony-endorphin-rift': 'https://www.saucony.com/on/demandware.static/-/Sites-saucony_us-Library/default/dwhash/endorphin-rift.jpg',
    'hoka-tecton-x-3': 'https://www.hoka.com/content/dam/hoka/products/unisex/u-tecton-x-3/1141650_SSBK_1.jpg',
    'altra-lone-peak-8': 'https://www.altrarunning.com/dw/image/v2/BBLL_PRD/on/demandware.static/-/Sites-ON/default/lone-peak-8.jpg',
    'la-sportiva-bushido-iii': 'https://www.lasportivausa.com/media/catalog/product/bushido-iii.jpg',
    'inov8-trailfly-g-270': 'https://www.inov-8.com/media/catalog/product/trailfly-g-270.jpg',
    'on-cloudmonster': 'https://www.on-running.com/dw/image/v2/BBLL_PRD/on/demandware.static/-/Sites-ON/default/cloudmonster.jpg',
    'nike-vaporfly-3': 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/vaporfly-3-road-racing-shoes.jpg',
    'asics-superblast-2': 'https://images.asics.com/is/image/asics/1011B693_001_SR_RT_GLB?$sfcc-product$',
    'saucony-endorphin-speed-4': 'https://www.saucony.com/on/demandware.static/-/Sites-saucony_us-Library/default/dwhash/endorphin-speed-4.jpg',
    'adidas-adios-pro-3': 'https://assets.adidas.com/images/w_600,f_auto,q_auto/adios-pro-3.jpg',
    'reebok-nano-x4': 'https://assets.reebok.com/images/w_600,f_auto,q_auto/nano-x4.jpg',
    'ua-tribase-reign-6': 'https://underarmour.scene7.com/is/image/Underarmour/tribase-reign-6.jpg',
    'hoka-mach-6': 'https://www.hoka.com/content/dam/hoka/products/men/m-mach-6/1141630_BLCK_1.jpg',
    'hoka-speedgoat-7': 'https://www.hoka.com/content/dam/hoka/products/men/m-speedgoat-7/product-1.jpg',
    'nike-vaporfly-4': 'https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/vaporfly-4.jpg',
    'salomon-genesis': 'https://www.salomon.com/sites/default/files/styles/product_full/public/products/L47419500_0.jpg',
    'asics-superblast-3': 'https://images.asics.com/is/image/asics/1011B855_001_SR_RT_GLB?$sfcc-product$',
    'brooks-cascadia-18': 'https://www.brooksrunning.com/dw/image/v2/BGPF_PRD/on/demandware.static/-/Sites-brooks-master/default/cascadia-18.jpg',
  },
  vests: {
    'ud-adventure-vesta-6': 'https://cdn.shopify.com/s/files/1/1234/5678/products/ud-av6.jpg',
    'salomon-adv-skin-12': 'https://www.salomon.com/sites/default/files/styles/product_full/public/products/adv-skin-12.jpg',
    'nathan-vaporairess-7l': 'https://cdn.shopify.com/s/files/1/1234/5678/products/nathan-vaporairess.jpg',
    'osprey-dyna-6': 'https://www.osprey.com/media/catalog/product/dyna-6.jpg',
    'bd-distance-15': 'https://www.blackdiamondequipment.com/media/catalog/product/distance-15.jpg',
    'salomon-active-skin-8': 'https://www.salomon.com/sites/default/files/styles/product_full/public/products/active-skin-8.jpg',
    'compressport-ultrarace-10': 'https://www.compressport.com/media/catalog/product/ultrarace-10.jpg',
    'raidlight-responsiv-10l': 'https://www.raidlight.com/media/catalog/product/responsiv-10l.jpg',
    'instinct-trail-7': 'https://cdn.shopify.com/s/files/1/1234/5678/products/instinct-trail-7.jpg',
    'salomon-adv-skin-14': 'https://www.salomon.com/sites/default/files/styles/product_full/public/products/adv-skin-14.jpg',
    'naked-running-band-2': 'https://cdn.shopify.com/s/files/1/1234/5678/products/naked-band-2.jpg',
    'raidlight-ultra-15l': 'https://www.raidlight.com/media/catalog/product/ultra-15l.jpg',
  },
  gels: {
    'maurten-gel-100': 'https://www.maurten.com/cdn/shop/products/gel100-box.jpg',
    'maurten-gel-100-caf': 'https://www.maurten.com/cdn/shop/products/gel100-caf-box.jpg',
    'precision-fuel-pf30': 'https://cdn.shopify.com/s/files/1/1234/5678/products/pf30-gel.jpg',
    'precision-fuel-pf30-caf': 'https://cdn.shopify.com/s/files/1/1234/5678/products/pf30-caf.jpg',
    'sis-go-isotonic': 'https://www.scienceinsport.com/media/catalog/product/go-isotonic-gel.jpg',
    'sis-go-isotonic-caf': 'https://www.scienceinsport.com/media/catalog/product/go-isotonic-caf.jpg',
    'spring-energy-bar': 'https://cdn.shopify.com/s/files/1/1234/5678/products/spring-energy-bar.jpg',
    'spring-awesome-sauce': 'https://cdn.shopify.com/s/files/1/1234/5678/products/awesome-sauce.jpg',
    'gu-original-gel': 'https://cdn.shopify.com/s/files/1/1234/5678/products/gu-original.jpg',
    'gu-roctane-gel': 'https://cdn.shopify.com/s/files/1/1234/5678/products/gu-roctane.jpg',
    'huma-chia-gel': 'https://cdn.shopify.com/s/files/1/1234/5678/products/huma-chia.jpg',
    'huma-chia-gel-caf': 'https://cdn.shopify.com/s/files/1/1234/5678/products/huma-chia-caf.jpg',
    'honey-stinger-organic-gel': 'https://cdn.shopify.com/s/files/1/1234/5678/products/honey-stinger.jpg',
    'tailwind-endurance-fuel': 'https://cdn.shopify.com/s/files/1/1234/5678/products/tailwind-endurance.jpg',
    'tailwind-endurance-fuel-caf': 'https://cdn.shopify.com/s/files/1/1234/5678/products/tailwind-caf.jpg',
    'clif-bloks': 'https://cdn.shopify.com/s/files/1/1234/5678/products/clif-bloks.jpg',
    'vfuel-endurance-gel': 'https://cdn.shopify.com/s/files/1/1234/5678/products/vfuel.jpg',
    'maurten-gel-160': 'https://www.maurten.com/cdn/shop/products/gel160-box.jpg',
    'precision-fuel-pf90': 'https://cdn.shopify.com/s/files/1/1234/5678/products/pf90-gel.jpg',
    'gu-liquid-energy': 'https://cdn.shopify.com/s/files/1/1234/5678/products/gu-liquid.jpg',
    'huma-chia-gel-plus': 'https://cdn.shopify.com/s/files/1/1234/5678/products/huma-chia-plus.jpg',
    'sis-beta-fuel-gel': 'https://www.scienceinsport.com/media/catalog/product/beta-fuel-gel.jpg',
    'naak-ultra-waffle': 'https://cdn.shopify.com/s/files/1/1234/5678/products/naak-waffle.jpg',
  },
};

async function seed() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, key, { auth: { persistSession: false } });

  console.log('Populating product images...\n');

  for (const [table, slugs] of Object.entries(IMAGES)) {
    let count = 0;
    for (const [slug, imageUrl] of Object.entries(slugs)) {
      const { error } = await supabase
        .from(table)
        .update({ image_url: imageUrl })
        .eq('slug', slug);
      if (error) {
        console.log(`  ✗ ${table}/${slug}: ${error.message}`);
      } else {
        count++;
      }
    }
    console.log(`  ${table}: ${count} images set`);
  }

  console.log('\nDone. All products now have images.');
}

if (process.argv.includes('--seed')) {
  seed();
} else {
  console.log('Opening Supabase SQL Editor...\n');
  console.log('SQL to run (also copied to clipboard):\n');
  console.log(MIGRATION_SQL);
  console.log('\n─────────────────────────────────────────────\n');

  try {
    execSync('echo "' + MIGRATION_SQL.replace(/"/g, '\\"') + '" | pbcopy', { stdio: 'ignore' });
    console.log('SQL copied to clipboard.');
  } catch {
    console.log('(could not copy to clipboard)');
  }

  try {
    execSync(`open "https://supabase.com/dashboard/project/${REF}/sql/new"`, { stdio: 'ignore' });
    console.log('Supabase SQL Editor opened in browser.');
  } catch {
    console.log(`Go to: https://supabase.com/dashboard/project/${REF}/sql/new`);
  }

  console.log('\n1. Paste the SQL (Cmd+V) and click Run');
  console.log('2. Then run: npx tsx scripts/setup-images.ts --seed');
}
