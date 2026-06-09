// scripts/fetch-prices.ts
// Daily cron — fetches live Amazon AU prices for every product with an amazon_url.
// Updates retailer_prices (for the "best price" widget) and inserts into
// price_history (for the 90-day sparkline).
//
// Run: npx tsx scripts/fetch-prices.ts
// Cron: vercel crons (configured in vercel.json)

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DELAY_MS = 2000; // polite delay between Amazon requests
const TIMEOUT_MS = 12000;

// ── Amazon AU price scraper ──────────────────────────────────────

function cleanPrice(raw: string): number | null {
  const n = parseFloat(raw.replace(/,/g, ''));
  return n > 0 ? n : null;
}

/**
 * Extract the main product price from an Amazon AU product page.
 * All prices are in AUD. We want the "buy box" price — not Subscribe & Save,
 * not installment amounts.
 */
async function scrapeAmazonPrice(url: string): Promise<{
  price_aud: number;
  in_stock: boolean;
} | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept-Language': 'en-AU,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) return null;
    const html = await res.text();

    // Strategy: find all a-offscreen price spans in order.
    // The main product price is typically the first one.
    // Skip obviously-wrong amounts (< $10 is likely a different currency or
    // shipping, > $5000 is an error).
    const priceRegex = /<span class="a-offscreen"[^>]*>\$?([\d,.]+)<\/span>/gi;
    const candidates: number[] = [];

    let m;
    while ((m = priceRegex.exec(html)) !== null) {
      const p = cleanPrice(m[1]);
      if (p !== null && p >= 10 && p <= 5000) {
        candidates.push(p);
      }
    }

    if (candidates.length === 0) return null;

    // The main product price appears first in the DOM
    const price = candidates[0];

    const outOfStock = /currently unavailable|out of stock|temporarily out/i.test(html);
    const inStock = /In Stock|Add to Cart|Buy Now/i.test(html);

    return {
      price_aud: price,
      in_stock: inStock || (!outOfStock && candidates.length > 0),
    };
  } catch {
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const start = Date.now();
  console.log('[prices] fetching Amazon AU prices...\n');

  // Build a name map for changelog summaries
  const [shoesRes, vestsRes, gelsRes] = await Promise.all([
    supabase.from('shoes').select('id, brand, model'),
    supabase.from('vests').select('id, brand, model'),
    supabase.from('gels').select('id, brand, product'),
  ]);
  const nameMap = new Map<string, string>();
  for (const r of shoesRes.data ?? []) nameMap.set(`shoes:${r.id}`, `${r.brand} ${r.model}`);
  for (const r of vestsRes.data ?? []) nameMap.set(`vests:${r.id}`, `${r.brand} ${r.model}`);
  for (const r of gelsRes.data ?? []) nameMap.set(`gels:${r.id}`, `${r.brand} ${r.product}`);

  // Get all products with Amazon URLs
  const { data: products } = await supabase
    .from('retailer_prices')
    .select('id, product_table, product_id, retailer, url, price_usd')
    .eq('retailer', 'amazon')
    .order('product_table');

  if (!products || products.length === 0) {
    console.log('[prices] no products with Amazon URLs found.');
    return;
  }

  console.log(`[prices] ${products.length} products to check\n`);

  const today = new Date().toISOString().slice(0, 10);
  let updated = 0;
  let unchanged = 0;
  let failed = 0;
  let priceChanges = 0;

  for (let i = 0; i < products.length; i++) {
    const row = products[i];
    const pct = Math.round((i / products.length) * 100);

    if (i > 0 && i % 20 === 0) {
      console.log(`   ... ${i}/${products.length} (${pct}%) updated=${updated} failed=${failed}`);
    }

    const result = await scrapeAmazonPrice(row.url);
    await sleep(DELAY_MS);

    if (!result) {
      failed++;
      continue;
    }

    const oldPrice = Number(row.price_usd);

    // Update retailer_prices live row
    const { error: updateErr } = await supabase
      .from('retailer_prices')
      .update({
        price_usd: result.price_aud,
        in_stock: result.in_stock,
        stock_label: result.in_stock ? 'in stock' : 'out',
        checked_at: new Date().toISOString(),
      })
      .eq('id', row.id);

    if (updateErr) {
      failed++;
      continue;
    }

    // Insert price history point
    await supabase
      .from('price_history')
      .upsert(
        {
          product_table: row.product_table,
          product_id: row.product_id,
          retailer: 'amazon',
          price_usd: result.price_aud,
          observed_on: today,
        },
        { onConflict: 'product_table,product_id,retailer,observed_on' }
      );

    // Log significant price changes to changelog
    if (oldPrice > 0 && Math.abs(result.price_aud - oldPrice) > 1) {
      priceChanges++;
      await supabase.from('changelog').insert({
        kind: 'price',
        product_table: row.product_table,
        product_id: row.product_id,
        summary: `${nameMap.get(`${row.product_table}:${row.product_id}`) ?? 'unknown'}: amazon A$${oldPrice.toFixed(0)} → A$${result.price_aud.toFixed(0)}`,
        actor: 'cron/fetch-prices',
      });
    }

    if (oldPrice > 0 && Math.abs(result.price_aud - oldPrice) < 1) {
      unchanged++;
    } else {
      updated++;
    }
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(0);
  console.log(`\n[prices] done in ${elapsed}s`);
  console.log(`  updated: ${updated}`);
  console.log(`  unchanged: ${unchanged}`);
  console.log(`  failed: ${failed}`);
  console.log(`  price changes logged: ${priceChanges}`);
}

main().catch((e) => {
  console.error('[prices] fatal:', e);
  process.exit(1);
});
