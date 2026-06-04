// scripts/enrich-amazon.ts
// Searches Amazon Australia (.com.au) for all 90 seed products, extracts ASIN + hi-res image.
// Writes results to lib/amazon-enrichment.ts which is imported by the seed route.
//
// Usage: npx tsx scripts/enrich-amazon.ts

import { SHOES, VESTS, GELS } from '../lib/seed-products';
import * as fs from 'fs';
import * as path from 'path';

interface ProductSearch {
  brand: string;
  model: string;
  table: 'shoes' | 'vests' | 'gels';
  slug: string;
}

const products: ProductSearch[] = [
  ...SHOES.map((s) => ({ brand: s.brand, model: s.model, table: 'shoes' as const, slug: s.slug })),
  ...VESTS.map((v) => ({ brand: v.brand, model: v.model, table: 'vests' as const, slug: v.slug })),
  ...GELS.map((g) => ({ brand: g.brand, model: g.product, table: 'gels' as const, slug: g.slug })),
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';
const TAG = 'trailgear-22';
const DELAY_MS = 2000; // polite to Amazon

// Known results from previous runs — skip these
const KNOWN = new Set([
  'hoka-speedgoat-6', 'salomon-sense-ride-5', 'brooks-cascadia-17',
  'on-cloudmonster', 'nike-pegasus-trail-5', 'ud-adventure-vesta-6',
  'salomon-adv-skin-12', 'nathan-vaporairess-7l', 'osprey-dyna-6',
  'bd-distance-15', 'maurten-gel-100', 'precision-fuel-pf30',
  'sis-go-isotonic', 'spring-energy-bar', 'gu-original-gel',
  'saucony-peregrine-15', 'altra-lone-peak-9-plus', 'la-sportiva-bushido-iii',
  'topo-ultraventure-4', 'hoka-challenger-8', 'inov8-trailfly-g270-v3',
  'nike-ultrafly', 'salomon-speedcross-6', 'hoka-clifton-10',
  'brooks-ghost-17', 'asics-gel-nimbus-27', 'saucony-endorphin-speed-5',
  'nb-fresh-foam-1080v14', 'nike-vomero-18', 'mizuno-wave-rider-29',
  'brooks-glycerin-22', 'saucony-ride-18', 'adidas-boston-13',
  'nb-fuelcell-rebel-v5', 'hoka-mach-x2', 'puma-deviate-nitro-3',
  'asics-superblast-2', 'on-cloudsurfer-2', 'saucony-triumph-23',
  'salomon-adv-skin-8', 'ud-race-vest-6', 'nathan-pinnacle-pro-12l',
  'nathan-trailmix-12l', 'osprey-duro-6', 'osprey-duro-15',
  'bd-distance-8', 'naked-running-band', 'compressport-free-belt-pro',
  'camelbak-octane-12', 'decathlon-evadict-vest-10l', 'maurten-gel-100-caf',
  'maurten-drink-mix-320', 'gu-roctane-gel', 'sis-beta-fuel-gel',
  'sis-beta-fuel-chews', 'huma-chia-gel', 'huma-gel-plus',
  'torq-energy-gel', 'torq-energy-drink', 'high5-energy-gel',
  'high5-energy-drink', 'clif-bloks-chews', 'honey-stinger-gel',
  'honey-stinger-waffle', 'nike-alphafly-3', 'patagonia-slope-runner-8l',
  'precision-fuel-pf90', 'bonk-breaker-chews', 'altra-lone-peak-8',
  'altra-olympus-6', 'on-cloudultra-2', 'asics-gel-kayano-31',
]);

async function searchAmazon(query: string): Promise<string[]> {
  const url = `https://www.amazon.com.au/s?k=${encodeURIComponent(query)}`;
  const resp = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept-Language': 'en-AU,en;q=0.9' },
  });
  const html = await resp.text();
  const asins = [...new Set(html.match(/\/dp\/B0[A-Z0-9]{8}/g) ?? [])]
    .map((m) => m.replace('/dp/', ''))
    .slice(0, 5);
  return asins;
}

async function getProductInfo(asin: string): Promise<{ title: string; image: string } | null> {
  const url = `https://www.amazon.com.au/dp/${asin}`;
  const resp = await fetch(url, { headers: { 'User-Agent': UA } });
  const html = await resp.text();

  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch ? titleMatch[1].replace(/&#x27;/g, "'").replace(/&amp;/g, '&') : '';

  const imgMatch = html.match(/"hiRes":"([^"]+)"/);
  const image = imgMatch ? imgMatch[1] : '';

  if (!title) return null;
  return { title, image };
}

function matchTitle(title: string, brand: string, model: string): boolean {
  const t = title.toLowerCase();
  const brandWords = brand.toLowerCase().split(/\s+/);
  const modelWords = model.toLowerCase().split(/\s+/);
  // Require all brand words + at least half the model words
  const brandOk = brandWords.every((w) => t.includes(w));
  const modelOk = modelWords.filter((w) => t.includes(w)).length >= Math.ceil(modelWords.length / 2);
  return brandOk && modelOk;
}

async function main() {
  const results: Record<string, { asin: string; image_id: string }> = {};
  const toProcess = products.filter((p) => !KNOWN.has(p.slug));

  console.log(`Processing ${toProcess.length} new products (${KNOWN.size} already known)...\n`);

  for (let i = 0; i < toProcess.length; i++) {
    const p = toProcess[i];
    const query = `${p.brand} ${p.model}`;
    console.log(`[${i + 1}/${toProcess.length}] ${query}...`);

    const asins = await searchAmazon(query);
    console.log(`   Found ${asins.length} ASINs: ${asins.join(', ')}`);

    let found: { asin: string; title: string; image: string } | null = null;

    for (const asin of asins) {
      const info = await getProductInfo(asin);
      if (!info) continue;

      if (matchTitle(info.title, p.brand, p.model)) {
        found = { asin, ...info };
        break;
      }
      console.log(`   ✗ ${asin}: "${info.title.slice(0, 80)}..."`);
    }

    if (found) {
      const imageId = found.image.split('/I/')[1]?.split('._')[0] || found.image.split('/I/')[1]?.split('.')[0] || '';
      console.log(`   ✓ ${found.asin}: ${found.title.slice(0, 80)}`);
      console.log(`   🖼  ${imageId}`);
      results[p.slug] = { asin: found.asin, image_id: imageId };
    } else {
      console.log(`   ⚠ No match found`);
    }

    // Write incremental results after each product
    const outputPath = path.join(__dirname, '..', 'lib', 'amazon-enrichment.ts');
    const allKnown: Record<string, { asin: string; image_id: string }> = {
      'hoka-speedgoat-6': { asin: 'B0DMT7T2ZR', image_id: '71i0iPhrz0L' },
      'salomon-sense-ride-5': { asin: 'B0C46K36B4', image_id: '81fX+8jgyXL' },
      'brooks-cascadia-17': { asin: 'B0CH1NBVD3', image_id: '71dPUdpiOwL' },
      'on-cloudmonster': { asin: 'B098NM355R', image_id: '61+AEfQ7+2L' },
      'nike-pegasus-trail-5': { asin: 'B0DHLGB9QV', image_id: '71wH9qPlMrL' },
      'ud-adventure-vesta-6': { asin: 'B09WZ66JZM', image_id: '71mkvMWxkeL' },
      'salomon-adv-skin-12': { asin: 'B0992F7C9P', image_id: '71LeYvbr-VL' },
      'nathan-vaporairess-7l': { asin: 'B0BLV67Q6C', image_id: '61-eBhdBKkL' },
      'osprey-dyna-6': { asin: 'B0CPKYBJC9', image_id: '61NIvI531nL' },
      'bd-distance-15': { asin: 'B0BR62PSVW', image_id: '61QUP6TEReL' },
      'maurten-gel-100': { asin: 'B07H319S3V', image_id: '710vQKAUK4L' },
      'precision-fuel-pf30': { asin: 'B0BT22QR5H', image_id: '71PXZk4pe9L' },
      'sis-go-isotonic': { asin: 'B0768NDFZ8', image_id: '719lcIM3F1L' },
      'spring-energy-bar': { asin: 'B09TVCT5T8', image_id: '81zpUvWAFNL' },
      'gu-original-gel': { asin: 'B0009W6X3W', image_id: '61xDJIqJkeL' },
      ...results,
    };
    const lines = Object.entries(allKnown).map(([slug, d]) =>
      `  '${slug}': { asin: '${d.asin}', image_id: '${d.image_id}' },`
    );
    fs.writeFileSync(outputPath,
      `// lib/amazon-enrichment.ts — generated by scripts/enrich-amazon.ts\n` +
      `// Last run: ${new Date().toISOString()}\n` +
      `// Matched: ${Object.keys(allKnown).length}/${products.length}\n\n` +
      `export const AMAZON_ENRICHMENT: Record<string, { asin: string; image_id: string }> = {\n` +
      lines.join('\n') + '\n};\n'
    );

    if (i < toProcess.length - 1) {
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n✅ Matched: ${Object.keys(results).length + KNOWN.size}/${products.length}`);
  console.log(`Results written to lib/amazon-enrichment.ts`);
}

main().catch(console.error);
