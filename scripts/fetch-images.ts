/**
 * Fetches product images from manufacturer websites and Amazon.
 * Tries multiple sources for each product, saves the first working image.
 * Usage: npx tsx scripts/fetch-images.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const TAG = 'trailgear-22';

const supabase = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36';

async function urlExists(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': UA } });
    return res.ok;
  } catch {
    return false;
  }
}

// Known-good manufacturer image URL builders
async function findImage(brand: string, model: string): Promise<string | null> {
  const sources: string[] = [];

  // Try Amazon search result images (most reliable for affiliate sites)
  const amzQuery = encodeURIComponent(`${brand} ${model}`);
  sources.push(
    `https://www.amazon.com.au/s?k=${amzQuery}&tag=${TAG}`,
  );

  // Amazon direct image CDN (works when we know the image hash)
  // We'll try to extract from HTML

  try {
    const res = await fetch(sources[0], {
      headers: { 'User-Agent': UA, 'Accept': 'text/html' },
    });
    const html = await res.text();

    // Extract first product image from search results
    const imgMatch = html.match(/src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+\.(?:jpg|png|jpeg))"/i);
    if (imgMatch) return imgMatch[1];

    // Try data-old-hires variant
    const hiresMatch = html.match(/data-old-hires="(https:\/\/[^"]+)"/);
    if (hiresMatch) return hiresMatch[1];
  } catch {
    // Continue to fallback URLs
  }

  // Manufacturer-specific fallback URLs
  const lc = (s: string) => s.toLowerCase().replace(/\s+/g, '-');
  const fallbacks: Record<string, string[]> = {
    'HOKA': [`https://www.hoka.com/content/dam/hoka/products/men/m-${lc(model)}/product-1.jpg`],
    'Nike': [`https://static.nike.com/a/images/t_PDP_864_v1/f_auto,b_rgb:f5f5f5/${lc(model)}.jpg`],
    'Salomon': [`https://www.salomon.com/sites/default/files/styles/product_full/public/products/${lc(model)}.jpg`],
    'Brooks': [`https://www.brooksrunning.com/dw/image/v2/BGPF_PRD/on/demandware.static/-/Sites-brooks-master/default/${lc(model)}.jpg`],
    'ASICS': [`https://images.asics.com/is/image/asics/${lc(model)}?$sfcc-product$`],
    'Saucony': [`https://www.saucony.com/on/demandware.static/-/Sites-saucony_us-Library/default/${lc(model)}.jpg`],
    'On': [`https://www.on-running.com/dw/image/v2/BBLL_PRD/on/demandware.static/-/Sites-ON/default/${lc(model)}.jpg`],
    'Altra': [`https://www.altrarunning.com/dw/image/v2/BBLL_PRD/on/demandware.static/-/Sites-ON/default/${lc(model)}.jpg`],
    'Adidas': [`https://assets.adidas.com/images/w_600,f_auto,q_auto/${lc(model)}.jpg`],
    'New Balance': [`https://nb.scene7.com/is/image/NB/${lc(model)}`],
  };

  const brandUrls = fallbacks[brand] || [];
  for (const url of brandUrls) {
    if (await urlExists(url)) return url;
  }

  return null;
}

async function main() {
  console.log('Fetching product images...\n');

  const tables = ['shoes', 'vests', 'gels'] as const;

  for (const table of tables) {
    const { data: products } = await supabase
      .from(table)
      .select('*')
      .eq('published', true);

    if (!products?.length) continue;

    console.log(`${table} (${products.length} products):`);
    let found = 0;
    let updated = 0;

    for (const product of products) {
      // Skip if already has an image
      if (product.image_url) {
        found++;
        continue;
      }

      const name = product.model || product.product;
      const keywords = `${product.brand} ${name}`;
      process.stdout.write(`  ${keywords}... `);

      const imageUrl = await findImage(product.brand, name);

      if (imageUrl) {
        const { error } = await supabase
          .from(table)
          .update({ image_url: imageUrl })
          .eq('id', product.id);

        if (error) {
          console.log(`save failed: ${error.message}`);
        } else {
          console.log(`✓ ${imageUrl.substring(0, 60)}...`);
          updated++;
          found++;
        }
      } else {
        console.log('✗ not found');
      }

      // Rate limit
      await new Promise((r) => setTimeout(r, 800));
    }

    console.log(`  → ${updated} new, ${found} total with images\n`);
  }

  console.log('Done.');
}

main();
