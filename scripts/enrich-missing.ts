// scripts/enrich-missing.ts
// Targeted re-scrape for products that didn't get ASINs on the first pass.
// Uses broader search queries to catch more matches on amazon.com.au.
// Usage: npx tsx scripts/enrich-missing.ts

import * as fs from 'fs';
import * as path from 'path';

interface Target {
  brand: string;
  model: string;
  table: 'shoes' | 'vests' | 'gels';
  slug: string;
  altQuery?: string;
}

const TARGETS: Target[] = [
  // Shoes — try broader queries
  { brand: 'Nike', model: 'Alphafly 3', table: 'shoes', slug: 'nike-alphafly-3', altQuery: 'Nike Alphafly 3 running shoes mens' },
  // Vests — use more specific searches
  { brand: 'Black Diamond', model: 'Distance 4', table: 'vests', slug: 'bd-distance-4', altQuery: 'Black Diamond Distance 4 hydration vest' },
  { brand: 'Black Diamond', model: 'Pursuit 10', table: 'vests', slug: 'bd-pursuit-10', altQuery: 'Black Diamond Pursuit 10 running vest pack' },
  { brand: 'Salomon', model: 'ADV Skin 5', table: 'vests', slug: 'salomon-adv-skin-5', altQuery: 'Salomon Advanced Skin 5 Set running vest' },
  { brand: 'Salomon', model: 'Sense Pro 10', table: 'vests', slug: 'salomon-sense-pro-10', altQuery: 'Salomon Sense Pro 10 running vest pack' },
  { brand: 'Ultimate Direction', model: 'Mountain Vest 7.0', table: 'vests', slug: 'ud-mountain-vest-7', altQuery: 'Ultimate Direction Mountain Vest 7 trail running' },
  { brand: 'Ultimate Direction', model: 'Ultra Vest 6.0', table: 'vests', slug: 'ud-ultra-vest-6', altQuery: 'Ultimate Direction Ultra Vest 6.0 trail running' },
  { brand: 'Arc\'teryx', model: 'Norvan 14', table: 'vests', slug: 'arcteryx-norvan-14', altQuery: 'Arc\'teryx Norvan 14 running vest backpack' },
  { brand: 'Patagonia', model: 'Slope Runner 8L', table: 'vests', slug: 'patagonia-slope-runner-8l', altQuery: 'Patagonia Slope Runner Endurance Vest 8L' },
  { brand: 'Raidlight', model: 'Responsiv 10L', table: 'vests', slug: 'raidlight-responsiv-10l', altQuery: 'Raidlight Responsiv 10L trail running vest' },
  { brand: 'Raidlight', model: 'Ultralight 3L', table: 'vests', slug: 'raidlight-ultralight-3l', altQuery: 'Raidlight Ultralight 3L running waist pack' },
  { brand: 'Inov-8', model: 'Race Ultra Pro 2-in-1', table: 'vests', slug: 'inov8-race-ultra-pro-2in1', altQuery: 'Inov-8 Race Ultra Pro 2-in-1 running vest' },
  { brand: 'Harrier', model: 'Kinder 10L', table: 'vests', slug: 'harrier-kinder-10l', altQuery: 'Harrier Kinder 10L trail running vest' },
  { brand: 'Compressport', model: 'Ultrun S Pack 15L', table: 'vests', slug: 'compressport-ultrun-s-15l', altQuery: 'Compressport Ultrun S Pack trail running vest' },
  { brand: 'Gregory', model: 'Pace 3', table: 'vests', slug: 'gregory-pace-3', altQuery: 'Gregory Pace 3 hydration running vest' },
  // Gels — try different queries
  { brand: 'Precision Fuel', model: 'PF 90 Gel', table: 'gels', slug: 'precision-fuel-pf90', altQuery: 'Precision Fuel PF 90 energy gel' },
  { brand: 'GU Energy', model: 'Energy Chews', table: 'gels', slug: 'gu-energy-chews', altQuery: 'GU Energy Chews sports nutrition' },
  { brand: 'Spring Energy', model: 'Awesome Sauce', table: 'gels', slug: 'spring-awesome-sauce', altQuery: 'Spring Energy Awesome Sauce gel' },
  { brand: 'Clif', model: 'Shot Gel', table: 'gels', slug: 'clif-shot-gel', altQuery: 'Clif Shot energy gel running' },
  { brand: 'Tailwind', model: 'Endurance Fuel', table: 'gels', slug: 'tailwind-endurance-fuel', altQuery: 'Tailwind Endurance Fuel drink mix' },
  { brand: 'Tailwind', model: 'Rapid Hydration', table: 'gels', slug: 'tailwind-rapid-hydration', altQuery: 'Tailwind Rapid Hydration drink mix' },
  { brand: 'Styrkr', model: 'Gel50', table: 'gels', slug: 'styrkr-gel50', altQuery: 'Styrkr Gel50 energy gel' },
  { brand: 'Veloforte', model: 'Energy Chews', table: 'gels', slug: 'veloforte-energy-chews', altQuery: 'Veloforte energy chews running' },
  { brand: 'Bonk Breaker', model: 'Energy Chews', table: 'gels', slug: 'bonk-breaker-chews', altQuery: 'Bonk Breaker energy chews sports' },
  { brand: 'Naak', model: 'Ultra Energy Waffle', table: 'gels', slug: 'naak-ultra-waffle', altQuery: 'Naak ultra energy waffle running' },
  { brand: 'Lucho Dillitos', model: 'Bocadillo', table: 'gels', slug: 'lucho-dillitos-bocadillo', altQuery: 'Lucho Dillitos bocadillo guava energy' },
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';
const TAG = 'trailgear-22';

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
  const brandWords = brand.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const modelWords = model.toLowerCase().split(/\s+/).filter(w => w.length > 1);
  const brandOk = brandWords.every((w) => t.includes(w));
  const modelOk = modelWords.filter((w) => t.includes(w)).length >= Math.max(1, Math.ceil(modelWords.length / 2));
  return brandOk && modelOk;
}

async function main() {
  // Load existing enrichment
  const enrichPath = path.join(__dirname, '..', 'lib', 'amazon-enrichment.ts');
  const enrichMod = await import(enrichPath);
  const existing = { ...enrichMod.AMAZON_ENRICHMENT } as Record<string, { asin: string; image_id: string }>;

  let newMatches = 0;

  for (let i = 0; i < TARGETS.length; i++) {
    const p = TARGETS[i];
    console.log(`\n[${i + 1}/${TARGETS.length}] ${p.brand} ${p.model} (${p.table})`);

    // Try primary query, then alt query
    const queries = [p.altQuery || `${p.brand} ${p.model}`, `${p.brand} ${p.model}`];
    let found: { asin: string; title: string; image: string } | null = null;

    for (const query of [...new Set(queries)]) {
      if (found) break;
      console.log(`   Searching: "${query}"`);
      const asins = await searchAmazon(query);
      console.log(`   Found ${asins.length} ASINs`);

      for (const asin of asins) {
        const info = await getProductInfo(asin);
        if (!info) continue;

        if (matchTitle(info.title, p.brand, p.model)) {
          found = { asin, ...info };
          break;
        }
        console.log(`   ✗ ${asin}: "${info.title.slice(0, 80)}..."`);
      }
    }

    if (found) {
      const imageId = found.image.split('/I/')[1]?.split('._')[0] || '';
      console.log(`   ✓ ${found.asin}: ${found.title.slice(0, 80)}`);
      console.log(`   🖼  ${imageId}`);
      existing[p.slug] = { asin: found.asin, image_id: imageId };
      newMatches++;
    } else {
      console.log(`   ⚠ Still no match`);
    }

    // Write incrementally
    const lines = Object.entries(existing)
      .filter(([, d]) => d.asin && d.image_id)
      .map(([slug, d]) => `  '${slug}': { asin: '${d.asin}', image_id: '${d.image_id}' },`);
    const count = Object.keys(existing).filter(k => existing[k].asin && existing[k].image_id).length;
    fs.writeFileSync(enrichPath,
      `// lib/amazon-enrichment.ts — generated by scripts/enrich-amazon.ts\n` +
      `// Last run: ${new Date().toISOString()}\n` +
      `// Matched: ${count}/${26 + 64 /* approximate total */}\n\n` +
      `export const AMAZON_ENRICHMENT: Record<string, { asin: string; image_id: string }> = {\n` +
      lines.join('\n') + '\n};\n'
    );

    if (i < TARGETS.length - 1) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n✅ New matches: ${newMatches}/${TARGETS.length}`);
  console.log(`Results written to lib/amazon-enrichment.ts`);
  console.log(`\nNow run: curl -X POST http://localhost:3000/api/seed`);
}

main().catch(console.error);
