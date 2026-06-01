// lib/price-fetcher.ts — core price-fetching logic shared by the API route and the
// standalone script. All prices are stored as USD; prices fetched from amazon.com.au
// (which are in AUD) are divided by USD_TO_AUD before writing to the DB.

import type { SupabaseClient } from '@supabase/supabase-js';

const USD_TO_AUD = 1.55;

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

export interface FetchResult {
  updated: number;
  skipped: number;
  errors: number;
  elapsed_ms: number;
}

function isAudUrl(url: string): boolean {
  return url.includes('amazon.com.au');
}

async function fetchAmazonPrice(url: string): Promise<PriceProbe | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept-Language': 'en-AU,en;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) return null;
    const html = await res.text();

    const patterns = [
      /"priceblock_ourprice"[^>]*>\s*\$?([\d,.]+)/i,
      /"priceblock_dealprice"[^>]*>\s*\$?([\d,.]+)/i,
      /data-asin-price="([\d.]+)"/i,
      /<span[^>]*class="a-offscreen"[^>]*>\$?([\d,.]+)<\/span>/i,
      /"priceValue":"([\d.]+)"/i,
    ];

    for (const re of patterns) {
      const m = html.match(re);
      if (m) {
        let price = parseFloat(m[1].replace(/,/g, ''));
        if (price > 0) {
          // amazon.com.au returns AUD — convert to USD for consistent storage
          if (isAudUrl(url)) price = price / USD_TO_AUD;
          const inStock = !/currently unavailable|out of stock/i.test(html);
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
          return { price_usd: price, in_stock: inStock, stock_label: inStock ? 'in stock' : 'out' };
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

    const ldJson = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
    let m: RegExpExecArray | null;
    while ((m = ldJson.exec(html)) !== null) {
      try {
        const data = JSON.parse(m[1]);
        const product =
          data['@type'] === 'Product'
            ? data
            : // eslint-disable-next-line @typescript-eslint/no-explicit-any
              data['@graph']?.find((n: any) => n['@type'] === 'Product');
        if (product?.offers) {
          const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
          const price = parseFloat(offer.price);
          if (price > 0) {
            const inStock = /instock|in_stock|onlineonly/i.test(offer.availability ?? '');
            return { price_usd: price, in_stock: inStock, stock_label: inStock ? 'in stock' : 'out' };
          }
        }
      } catch { /* skip */ }
    }

    const pm = html.match(/"salePrice"\s*:\s*([\d.]+)/i);
    if (pm) {
      const price = parseFloat(pm[1]);
      if (price > 0) return { price_usd: price, in_stock: true, stock_label: 'in stock' };
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

export async function runPriceFetch(supabase: SupabaseClient): Promise<FetchResult> {
  const start = Date.now();

  const { data: rows, error } = await supabase
    .from('retailer_prices')
    .select('id, product_table, product_id, retailer, url, price_usd');

  if (error) throw new Error(`Failed to load retailer_prices: ${error.message}`);

  let updated = 0;
  let skipped = 0;
  let errors = 0;
  const today = new Date().toISOString().slice(0, 10);

  for (const row of rows as RetailerRow[]) {
    const probe = probeFor(row.retailer);
    if (!probe) { skipped++; continue; }

    const result = await probe(row.url);
    if (!result) { skipped++; continue; }

    const { error: updateErr } = await supabase
      .from('retailer_prices')
      .update({
        price_usd: result.price_usd,
        in_stock: result.in_stock,
        stock_label: result.stock_label,
        checked_at: new Date().toISOString(),
      })
      .eq('id', row.id);

    if (updateErr) { errors++; continue; }

    await supabase.from('price_history').upsert(
      {
        product_table: row.product_table,
        product_id: row.product_id,
        retailer: row.retailer,
        price_usd: result.price_usd,
        observed_on: today,
      },
      { onConflict: 'product_table,product_id,retailer,observed_on' },
    );

    if (Math.abs(result.price_usd - Number(row.price_usd)) > 0.01) {
      await supabase.from('changelog').insert({
        kind: 'price',
        product_table: row.product_table,
        product_id: row.product_id,
        summary: `price · ${row.retailer} · $${Number(row.price_usd).toFixed(2)} → $${result.price_usd.toFixed(2)}`,
        actor: 'cron/fetch-prices',
      });
    }

    updated++;
  }

  return { updated, skipped, errors, elapsed_ms: Date.now() - start };
}
