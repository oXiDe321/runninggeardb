import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';

const TARGETS = [
  { slug: 'salomon-sense-pro-10', table: 'vests', query: 'Salomon Sense Pro 10 hydration running vest' },
  { slug: 'black-diamond-distance-15', table: 'vests', query: 'Black Diamond Distance 15 trail running backpack' },
  { slug: 'mizuno-wave-rider-28', table: 'shoes', query: 'Mizuno Wave Rider 28 running shoe' },
];

function upgradeImageUrl(url: string): string {
  return url.replace(/\._[A-Z0-9_,]+_\./g, '._AC_SL1500_.');
}

async function findImageUrl(query: string): Promise<string | null> {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  try {
    const resp = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' } });
    if (!resp.ok) return null;
    const html = await resp.text();
    const matches = [...html.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/[^"'\s]+\.(?:jpg|png)/gi)];
    if (matches.length > 0) return upgradeImageUrl(matches[0][0]);
    return null;
  } catch { return null; }
}

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  for (const t of TARGETS) {
    console.log(`[${t.slug}]`);
    await sleep(2000);
    const img = await findImageUrl(t.query);
    if (img) {
      console.log(`   ✓ ${img.slice(0, 80)}`);
      const { error } = await supabase.from(t.table as any).update({ image_url: img }).eq('slug', t.slug);
      if (error) console.log(`   ✗ ${error.message}`);
      else console.log(`   ✓ DB updated`);
    } else {
      console.log(`   ⚠ No image found`);
    }
  }
  console.log('Done');
}

main().catch(console.error);
