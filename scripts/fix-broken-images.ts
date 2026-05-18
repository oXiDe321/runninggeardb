// scripts/fix-broken-images.ts — fix the 14 shoes with broken brand CDN image URLs
// Searches amazon.com and extracts m.media-amazon.com image URLs, then updates DB
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const TARGETS = [
  { slug: 'asics-fuji-speed-2', query: 'ASICS Fuji Speed 2 trail running shoe' },
  { slug: 'asics-gel-kayano-31', query: 'ASICS Gel Kayano 31 running shoe' },
  { slug: 'brooks-cascadia-18', query: 'Brooks Cascadia 18 trail running shoe' },
  { slug: 'brooks-ghost-16', query: 'Brooks Ghost 16 running shoe' },
  { slug: 'hoka-clifton-9', query: 'HOKA Clifton 9 running shoe' },
  { slug: 'inov-8-trailfly-ultra-g-300-max', query: 'Inov-8 Trailfly Ultra G 300 Max trail shoe' },
  { slug: 'la-sportiva-jackal-iii', query: 'La Sportiva Jackal III trail running shoe' },
  { slug: 'new-balance-fresh-foam-x-1080-v14', query: 'New Balance Fresh Foam 1080 v14 running shoe' },
  { slug: 'on-cloudmonster-2', query: 'On Cloudmonster 2 running shoe' },
  { slug: 'saucony-endorphin-speed-4', query: 'Saucony Endorphin Speed 4 running shoe' },
  { slug: 'saucony-peregrine-14', query: 'Saucony Peregrine 14 trail running shoe' },
];

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';

function upgradeImageUrl(url: string): string {
  // Replace any size suffix with _AC_SL1500_ for max quality
  return url.replace(/\._[A-Z0-9_,]+_\./g, '._AC_SL1500_.');
}

async function findImageUrl(query: string): Promise<string | null> {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Cache-Control': 'no-cache',
      },
    });
    if (!resp.ok) { console.log(`   HTTP ${resp.status}`); return null; }
    const html = await resp.text();

    // Look for m.media-amazon.com image URLs in the search results
    const matches = [...html.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/[^"'\s]+\.(?:jpg|png)/gi)];
    if (matches.length > 0) {
      return upgradeImageUrl(matches[0][0]);
    }
    return null;
  } catch (e) {
    console.log(`   Error: ${e}`);
    return null;
  }
}

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  console.log('Fixing broken brand CDN image URLs...\n');
  let fixed = 0;

  for (const target of TARGETS) {
    console.log(`[${target.slug}]`);
    console.log(`   Searching: "${target.query}"`);
    await sleep(1500 + Math.random() * 1000);
    const imageUrl = await findImageUrl(target.query);

    if (imageUrl) {
      console.log(`   ✓ ${imageUrl.slice(0, 70)}...`);
      const { error } = await supabase
        .from('shoes')
        .update({ image_url: imageUrl })
        .eq('slug', target.slug);

      if (error) {
        console.log(`   ✗ DB error: ${error.message}`);
      } else {
        console.log(`   ✓ DB updated`);
        fixed++;
      }
    } else {
      console.log(`   ⚠ No image found`);
    }
  }

  console.log(`\n✅ Fixed ${fixed}/${TARGETS.length} shoes`);
}

main().catch(console.error);
