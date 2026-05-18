// scripts/fetch-prices.ts
// Daily cron — fetches current price for every (product, retailer) pair
// and (1) upserts retailer_prices for the live "best price" widget,
// (2) inserts a row into price_history for the sparkline.
//
// Run with: `tsx scripts/fetch-prices.ts`
// Schedule with: Vercel Cron, GitHub Actions, or Supabase Edge Functions.

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface RetailerRow {
  id: string;
  product_table: 'shoes' | 'vests' | 'gels';
  product_id: string;
  retailer: string;
  url: string;
  price_usd: number;
}

interface PriceProbe {
  price_usd: number;
  in_stock: boolean;
  stock_label: string;
}

// ── Real price fetchers ──────────────────────────────────────────

async function fetchAmazonPrice(url: string): Promise<PriceProbe | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Amazon embeds price in several well-known DOM patterns.
    // Try core price selectors in order of reliability.
    const patterns = [
      /"priceblock_ourprice"[^>]*>\s*\$?([\d,.]+)/i,
      /"priceblock_dealprice"[^>]*>\s*\$?([\d,.]+)/i,
      /data-asin-price="([\d.]+)"/i,
      /<span[^>]*class="a-price"[^>]*>.*?<span[^>]*class="a-offscreen"[^>]*>\$?([\d,.]+)<\/span>/is,
      /"priceValue":"([\d.]+)"/i,
    ];

    for (const re of patterns) {
      const m = html.match(re);
      if (m) {
        const price = parseFloat(m[1].replace(/,/g, ''));
        if (price > 0) {
          const inStock =
            !/currently unavailable|out of stock/i.test(html);
          return {
            price_usd: price,
            in_stock: inStock,
            stock_label: inStock ? 'in stock' : 'out',
          };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchRunningWarehousePrice(url: string): Promise<PriceProbe | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Running Warehouse renders price in a few known patterns.
    const patterns = [
      /<span[^>]*class="price"[^>]*>\s*\$?([\d,.]+)/i,
      /<meta[^>]*itemprop="price"[^>]*content="([\d.]+)"/i,
      /data-price="([\d.]+)"/i,
      /"price"\s*:\s*"?([\d.]+)"?/i,
    ];

    for (const re of patterns) {
      const m = html.match(re);
      if (m) {
        const price = parseFloat(m[1].replace(/,/g, ''));
        if (price > 0) {
          const inStock = !/out of stock|notify me|backorder/i.test(html);
          return {
            price_usd: price,
            in_stock: inStock,
            stock_label: inStock ? 'in stock' : 'out',
          };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function fetchReiPrice(url: string): Promise<PriceProbe | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();

    // REI uses JSON-LD for product pricing.
    const ldJson = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let m: RegExpExecArray | null;
    while ((m = ldJson.exec(html)) !== null) {
      try {
        const data = JSON.parse(m[1]);
        if (data['@type'] === 'Product' || (Array.isArray(data['@graph']) && data['@graph'].some((n: any) => n['@type'] === 'Product'))) {
          const product = data['@type'] === 'Product' ? data : data['@graph'].find((n: any) => n['@type'] === 'Product');
          if (product?.offers) {
            const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
            const price = parseFloat(offer.price);
            if (price > 0) {
              const availability = offer.availability || '';
              const inStock = /instock|in_stock|onlineonly/i.test(availability);
              return {
                price_usd: price,
                in_stock: inStock,
                stock_label: inStock ? 'in stock' : 'out',
              };
            }
          }
        }
      } catch { /* skip malformed JSON */ }
    }

    // Fallback: REI product page regex
    const priceRe = /"salePrice"\s*:\s*([\d.]+)/i;
    const pm = html.match(priceRe);
    if (pm) {
      const price = parseFloat(pm[1]);
      if (price > 0) {
        return {
          price_usd: price,
          in_stock: true,
          stock_label: 'in stock',
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

function probeFor(retailer: string) {
  if (retailer === 'amazon') return fetchAmazonPrice;
  if (retailer === 'rei') return fetchReiPrice;
  if (retailer === 'running-warehouse') return fetchRunningWarehousePrice;
  return null;
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  const start = Date.now();
  console.log('[prices] starting daily fetch…');

  const { data: rows, error } = await supabase
    .from('retailer_prices')
    .select('id, product_table, product_id, retailer, url, price_usd');

  if (error) {
    console.error('[prices] failed to load retailer_prices:', error);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;
  const today = new Date().toISOString().slice(0, 10);

  for (const row of rows as RetailerRow[]) {
    const probe = probeFor(row.retailer);
    if (!probe) {
      skipped++;
      continue;
    }

    const result = await probe(row.url);
    if (!result) {
      skipped++;
      continue;
    }

    // 1. Update the live "best price" row.
    await supabase
      .from('retailer_prices')
      .update({
        price_usd: result.price_usd,
        in_stock: result.in_stock,
        stock_label: result.stock_label,
        checked_at: new Date().toISOString(),
      })
      .eq('id', row.id);

    // 2. Insert a history row (one per retailer per day; UNIQUE constraint
    //    means re-runs the same day no-op).
    await supabase
      .from('price_history')
      .upsert(
        {
          product_table: row.product_table,
          product_id: row.product_id,
          retailer: row.retailer,
          price_usd: result.price_usd,
          observed_on: today,
        },
        { onConflict: 'product_table,product_id,retailer,observed_on' }
      );

    // 3. If price changed, log it to the public changelog.
    if (Math.abs(result.price_usd - Number(row.price_usd)) > 0.01) {
      await supabase.from('changelog').insert({
        kind: 'price',
        product_table: row.product_table,
        product_id: row.product_id,
        summary: `price · ${row.retailer} · $${row.price_usd} → $${result.price_usd}`,
        actor: 'cron/fetch-prices',
      });
    }

    updated++;
  }

  console.log(
    `[prices] done in ${(Date.now() - start) / 1000}s — updated ${updated}, skipped ${skipped}`
  );
}

main().catch((e) => {
  console.error('[prices] fatal:', e);
  process.exit(1);
});
