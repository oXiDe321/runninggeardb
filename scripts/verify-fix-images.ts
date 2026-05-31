// Verify image URLs set by sync-images.ts and fix any that 404
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

async function checkUrl(url: string): Promise<number> {
  try {
    const r = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(8000) });
    return r.status;
  } catch { return -1; }
}

async function searchAmazon(query: string): Promise<string[]> {
  const url = `https://www.amazon.com.au/s?k=${encodeURIComponent(query)}`;
  try {
    const r = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-AU,en;q=0.9' } });
    const html = await r.text();
    const asins = [...new Set(html.match(/\/dp\/(B0[A-Z0-9]{8})/g) ?? [])].map(m => m.replace('/dp/', '')).slice(0, 6);
    const imgIds = [...new Set(html.match(/images\/I\/([A-Za-z0-9+\-]+L)\._/g) ?? [])].map(m => m.replace('images/I/', '').replace('._', '')).slice(0, 10);
    return asins.length ? asins : [];
  } catch { return []; }
}

async function getAsinImage(asin: string): Promise<string> {
  try {
    const r = await fetch(`https://www.amazon.com.au/dp/${asin}`, { headers: { 'User-Agent': UA } });
    const html = await r.text();
    const m = html.match(/"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
    if (m) return m[1];
    const m2 = html.match(/"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
    return m2 ? m2[1] : '';
  } catch { return ''; }
}

async function main() {
  const tables = ['shoes', 'vests', 'gels'] as const;
  const broken: { table: string; slug: string; brand: string; name: string; url: string }[] = [];

  for (const table of tables) {
    const nameField = table === 'gels' ? 'brand, product' : 'brand, model';
    const { data } = await supabase.from(table).select(`slug, ${nameField}, image_url`);
    for (const row of data ?? []) {
      if (!row.image_url) { broken.push({ table, slug: row.slug, brand: row.brand, name: row.model || row.product || '', url: '' }); continue; }
      process.stdout.write(`  checking ${row.slug}... `);
      const status = await checkUrl(row.image_url);
      if (status !== 200) {
        console.log(`${status} ← BROKEN`);
        broken.push({ table, slug: row.slug, brand: row.brand, name: row.model || row.product || '', url: row.image_url });
      } else {
        console.log('OK');
      }
      await new Promise(r => setTimeout(r, 200));
    }
  }

  if (!broken.length) { console.log('\n✅ All images OK!'); return; }

  console.log(`\n=== ${broken.length} broken/missing — searching Amazon ===\n`);
  for (const item of broken) {
    const query = `${item.brand} ${item.name}`;
    console.log(`[${item.table}] ${item.slug} — searching "${query}"`);
    const asins = await searchAmazon(query);
    if (!asins.length) { console.log('  ✗ no ASINs found\n'); continue; }
    
    let fixed = false;
    for (const asin of asins) {
      await new Promise(r => setTimeout(r, 800));
      const imgUrl = await getAsinImage(asin);
      if (imgUrl) {
        console.log(`  ✓ ASIN ${asin} → ${imgUrl.slice(0, 60)}...`);
        await supabase.from(item.table as any).update({
          image_url: imgUrl,
          amazon_url: `https://www.amazon.com.au/dp/${asin}?tag=${TAG}`
        }).eq('slug', item.slug);
        fixed = true;
        break;
      }
    }
    if (!fixed) console.log('  ✗ could not find image\n');
    await new Promise(r => setTimeout(r, 1500));
  }
  console.log('\n✅ Done.');
}

main().catch(console.error);
