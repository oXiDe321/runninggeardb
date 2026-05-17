/**
 * Fetches real product images from Amazon search results.
 * Extracts m.media-amazon.com image URLs for each product.
 * Usage: npx tsx scripts/fetch-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

async function fetchAmazonImage(searchTerm: string): Promise<string | null> {
  const url = `https://www.amazon.com/s?k=${encodeURIComponent(searchTerm)}`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, 'Accept': 'text/html', 'Accept-Language': 'en-US,en;q=0.9' },
      signal: AbortSignal.timeout(8000),
    });

    const html = await res.text();

    // Strategy 1: Extract from data-old-hires (highest quality image)
    const hiresMatch = html.match(/data-old-hires="(https:\/\/[^"]+)"/);
    if (hiresMatch) return hiresMatch[1];

    // Strategy 2: Extract src from img with data-asin parent
    const srcs = [...html.matchAll(/<img[^>]+src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.(?:jpg|png|jpeg))"/gi)];
    if (srcs.length > 0) return srcs[0][1];

    // Strategy 3: Any m.media-amazon.com image
    const anyMedia = html.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[^"\s]+\.(?:jpg|png|jpeg)/);
    if (anyMedia) return anyMedia[0];

    return null;
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log('Fetching real product images from Amazon...\n');

  const tables = ['shoes', 'vests', 'gels'] as const;

  for (const table of tables) {
    const { data: products } = await supabase
      .from(table)
      .select('id, brand, model, product')
      .eq('published', true);

    if (!products?.length) continue;

    console.log(`${table} (${products.length}):`);
    let updated = 0;

    for (const p of products) {
      const name = p.model || p.product;
      const search = `${p.brand} ${name}`;
      process.stdout.write(`  ${search}... `);

      const img = await fetchAmazonImage(search);
      if (img) {
        const { error } = await supabase
          .from(table)
          .update({ image_url: img })
          .eq('id', p.id);

        if (error) {
          console.log(`save error: ${error.message}`);
        } else {
          console.log(`✓ ${img.substring(0, 55)}...`);
          updated++;
        }
      } else {
        console.log('✗');
      }

      // Rate limit — be polite to Amazon
      await new Promise((r) => setTimeout(r, 1200 + Math.random() * 800));
    }

    console.log(`  → ${updated} updated\n`);
  }

  console.log('Done.');
}

main();
