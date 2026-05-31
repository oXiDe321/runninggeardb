// scripts/sync-images.ts
// Comprehensive image sync: applies Amazon images to all products with missing or broken brand-CDN images.
// Handles slug mismatches between amazon-enrichment.ts and actual DB slugs.
// Usage: npx tsx scripts/sync-images.ts

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
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';

function imageUrl(id: string) {
  return `https://m.media-amazon.com/images/I/${id}._AC_SL1500_.jpg`;
}
function amazonUrl(asin: string) {
  return `https://www.amazon.com.au/dp/${asin}?tag=${TAG}`;
}

// Direct mappings: DB slug → { asin, image_id } for known products
// Includes enrichment.ts entries + slug-mismatched entries
const DIRECT: Record<string, { asin: string; image_id: string }> = {
  // ── Shoes ──────────────────────────────────────────────────────
  'adidas-adizero-adios-9':     { asin: 'B0CJWQG37N', image_id: '81LG2rFlMtL' },
  'saucony-kinvara-15':         { asin: 'B0D31YWDYP', image_id: '71LI9dXqmiL' },
  'inov8-f-fly-280':            { asin: 'B0CRN62QV2', image_id: '71yk5mkTGML' },
  'reebok-nano-x5':             { asin: 'B0C9QZWVNF', image_id: '71tJHJYOMIL' },
  'nike-metcon-9':              { asin: 'B0CBQTBGGJ', image_id: '61OVumEBTNL' },
  // ── Vests ──────────────────────────────────────────────────────
  'salomon-adv-skin-5':         { asin: 'B07N1P636G', image_id: '71Y7h8BnGnL' },
  'ud-mountain-vest-7':         { asin: 'B09XQPZ93Q', image_id: '71EI9jd0taL' },
  'ud-ultra-vest-6':            { asin: 'B09WZ66JZM', image_id: '71mkvMWxkeL' },
  'bd-pursuit-10':              { asin: 'B07KXZXWZV', image_id: '71DMtNcaGSL' },
  'raidlight-responsiv-10l':    { asin: 'B07MFH4S5Q', image_id: '61ZPgY8r0AL' },
  'arcteryx-norvan-14':         { asin: 'B0CTFQR3BF', image_id: '71r7xmNLB-L' },
  'inov8-race-ultra-pro-2in1':  { asin: 'B08XY1Y9KQ', image_id: '61gNBd5j4AL' },
  'harrier-kinder-10l':         { asin: 'B0BVMCQKZ3', image_id: '61mXF9NxZtL' },
  'compressport-ultrun-s-15l':  { asin: 'B09KZHG63N', image_id: '81dRbV3GBAL' },
  'raidlight-ultralight-3l':    { asin: 'B083V4HJ8L', image_id: '71JH4MiqmBL' },
  'gregory-pace-3':             { asin: 'B09BCX1BYR', image_id: '81gPiVJxqQL' },
  'ultimate-direction-fastpack-20': { asin: 'B08L3HK3TT', image_id: '71nOc0ZHYBL' },
  'nathan-pinnacle-12l':        { asin: 'B0DSZ7MHK8', image_id: '71hdkOgTIrL' },
  // ── Gels (slug-mismatched enrichment entries) ───────────────────
  'gu-energy-roctane-ultra-endurance-gel': { asin: 'B0F465RRMR', image_id: '71-Sp3Xku2L' },
  'precision-fuel-hydration-pf-30-gel':    { asin: 'B0BT22QR5H', image_id: '71PXZk4pe9L' },
  // ── Gels (broken brand CDN → Amazon) ────────────────────────────
  'tailwind-endurance-fuel':    { asin: 'B09Y5GJ3VP', image_id: '71Pb38HiNNL' },
  'tailwind-rapid-hydration':   { asin: 'B09Y5GJ3VP', image_id: '71Pb38HiNNL' },
  'naak-ultra-waffle':          { asin: 'B0CJ3DXKPT', image_id: '71wEMh-0oGL' },
  'gu-energy-chews':            { asin: 'B001E5EQME', image_id: '81A1C+TkXRL' },
  'veloforte-energy-chews':     { asin: 'B0C4TRVKYD', image_id: '71Bx2AFQHPL' },
  'spring-energy-canaberry':    { asin: 'B07CBTPNMK', image_id: '71hQ9K9kT1L' },
  'spring-awesome-sauce':       { asin: 'B07CB9ZVKL', image_id: '71EJ+3aGz9L' },
  'clif-shot-gel':              { asin: 'B00DPJQ3UU', image_id: '81FzOgMqVNL' },
  'clif-bar-shot-gel':          { asin: 'B00DPJQ3UU', image_id: '81FzOgMqVNL' },
  'styrkr-gel50':               { asin: 'B0BWQQ7FMP', image_id: '71xEMVdFsML' },
  'lucho-dillitos-bocadillo':   { asin: 'B07SJM2QW1', image_id: '71ZDl-YYWAL' },
};

// Try Amazon search as fallback for anything still missing after DIRECT
async function searchAmazon(query: string): Promise<string[]> {
  const url = `https://www.amazon.com.au/s?k=${encodeURIComponent(query)}`;
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-AU,en;q=0.9' } });
    const html = await resp.text();
    return [...new Set(html.match(/\/dp\/(B0[A-Z0-9]{8})/g) ?? [])]
      .map(m => m.replace('/dp/', '')).slice(0, 5);
  } catch { return []; }
}

async function getProductImage(asin: string): Promise<string> {
  const url = `https://www.amazon.com.au/dp/${asin}`;
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': UA } });
    const html = await resp.text();
    const m = html.match(/"hiRes":"([^"]+)"/);
    return m ? m[1].split('/I/')[1]?.split('._')[0] ?? '' : '';
  } catch { return ''; }
}

async function updateSlug(table: 'shoes' | 'vests' | 'gels', slug: string, asin: string, image_id: string) {
  const { error } = await supabase
    .from(table)
    .update({ image_url: imageUrl(image_id), amazon_url: amazonUrl(asin) })
    .eq('slug', slug);
  if (error) console.log(`  ✗ ${error.message}`);
  else console.log(`  ✓ updated`);
}

async function main() {
  const tables = ['shoes', 'vests', 'gels'] as const;

  // Step 1: apply DIRECT mappings
  console.log('\n=== Step 1: Applying direct mappings ===');
  for (const [slug, { asin, image_id }] of Object.entries(DIRECT)) {
    for (const table of tables) {
      const { data } = await supabase.from(table).select('id').eq('slug', slug).maybeSingle();
      if (data) {
        console.log(`[${table}] ${slug}`);
        await updateSlug(table, slug, asin, image_id);
        break;
      }
    }
  }

  // Step 2: find anything still missing and try Amazon search
  console.log('\n=== Step 2: Searching Amazon for remaining gaps ===');
  const SEARCH_QUERIES: Record<string, { table: 'shoes' | 'vests' | 'gels'; query: string }> = {};

  for (const table of tables) {
    const nameField = table === 'gels' ? 'brand, product' : 'brand, model';
    const { data } = await supabase.from(table).select(`slug, ${nameField}, image_url`);
    for (const row of data ?? []) {
      const url = row.image_url ?? '';
      const name = table === 'gels' ? `${row.brand} ${row.product}` : `${row.brand} ${row.model}`;
      if (!url || (!url.includes('amazon') && url.includes('cdn'))) {
        if (!DIRECT[row.slug]) {
          SEARCH_QUERIES[row.slug] = { table, query: `${name} ${table === 'shoes' ? 'running shoe' : table === 'vests' ? 'running vest' : 'energy gel'}` };
        }
      }
    }
  }

  if (Object.keys(SEARCH_QUERIES).length === 0) {
    console.log('Nothing left to search — all gaps covered by direct mappings.');
    return;
  }

  for (const [slug, { table, query }] of Object.entries(SEARCH_QUERIES)) {
    console.log(`\n[${table}] ${slug}`);
    console.log(`  Searching: "${query}"`);
    const asins = await searchAmazon(query);
    if (!asins.length) { console.log('  ✗ no results'); continue; }

    let found = false;
    for (const asin of asins) {
      const image_id = await getProductImage(asin);
      if (image_id) {
        console.log(`  Found ASIN ${asin}, image_id ${image_id}`);
        await updateSlug(table, slug, asin, image_id);
        found = true;
        break;
      }
      await new Promise(r => setTimeout(r, 500));
    }
    if (!found) console.log('  ✗ no image found via search');
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('\n✅ Done.');
}

main().catch(console.error);
