import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false } });
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36';

async function findImageUrl(query: string): Promise<string | null> {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(query)}`;
  const resp = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' } });
  if (!resp.ok) return null;
  const html = await resp.text();
  const matches = [...html.matchAll(/https:\/\/m\.media-amazon\.com\/images\/I\/[^"'\s]+\.(?:jpg|png)/gi)];
  return matches.length > 0 ? matches[0][0].replace(/\._[A-Z0-9_,]+_\./g, '._AC_SL1500_.') : null;
}

async function main() {
  console.log('[bd-distance-4]');
  const img = await findImageUrl('Black Diamond Distance 4 hydration running vest');
  if (img) {
    console.log(`   ✓ ${img.slice(0, 80)}`);
    const { error } = await supabase.from('vests').update({ image_url: img }).eq('slug', 'bd-distance-4');
    if (error) console.log(`   ✗ ${error.message}`);
    else console.log('   ✓ DB updated');
  } else {
    console.log('   ⚠ No image found');
  }
}

main().catch(console.error);
