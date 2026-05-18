// lib/price-data.ts
// Fetches all product prices with 90-day history for the /prices page.

import { supabase } from './supabase';

export interface PriceHistoryPoint {
  observed_on: string;
  price_usd: number;
  retailer: string;
}

export interface ProductPrice {
  id: string;
  slug: string;
  kind: 'shoe' | 'vest' | 'gel';
  brand: string;
  model: string;
  image_url: string | null;
  current_price: number | null;
  msrp: number | null;
  discount_pct: number | null;
  retailer_count: number;
  low_90d: number | null;
  high_90d: number | null;
  last_checked: string | null;
  price_history: PriceHistoryPoint[];
}

export async function getAllProductPrices(): Promise<ProductPrice[]> {
  // Fetch products from all three tables
  const [shoesRes, vestsRes, gelsRes] = await Promise.all([
    supabase.from('shoes').select('id, slug, brand, model, image_url, price_usd').eq('published', true),
    supabase.from('vests').select('id, slug, brand, model, image_url, price_usd').eq('published', true),
    supabase.from('gels').select('id, slug, brand, product, image_url, price_per_serving').eq('published', true),
  ]);

  // Fetch current retailer prices (distinct, lowest per product)
  const { data: retailerPrices } = await supabase
    .from('retailer_prices')
    .select('product_table, product_id, retailer, price_usd, checked_at')
    .eq('in_stock', true)
    .order('price_usd', { ascending: true });

  // Fetch 90-day price history
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  const { data: priceHistory } = await supabase
    .from('price_history')
    .select('product_table, product_id, retailer, price_usd, observed_on')
    .gte('observed_on', ninetyDaysAgo.toISOString().slice(0, 10))
    .order('observed_on', { ascending: true });

  // Index retailer prices by product_table + product_id
  const rpMap = new Map<string, { prices: { retailer: string; price_usd: number }[]; checked_at: string | null }>();
  for (const rp of retailerPrices ?? []) {
    const key = `${rp.product_table}:${rp.product_id}`;
    const entry = rpMap.get(key);
    if (entry) {
      entry.prices.push({ retailer: rp.retailer, price_usd: rp.price_usd });
      if (!entry.checked_at || rp.checked_at > entry.checked_at) entry.checked_at = rp.checked_at;
    } else {
      rpMap.set(key, {
        prices: [{ retailer: rp.retailer, price_usd: rp.price_usd }],
        checked_at: rp.checked_at,
      });
    }
  }

  // Index price history by product_table + product_id
  const phMap = new Map<string, PriceHistoryPoint[]>();
  for (const ph of priceHistory ?? []) {
    const key = `${ph.product_table}:${ph.product_id}`;
    const arr = phMap.get(key) ?? [];
    arr.push({ observed_on: ph.observed_on, price_usd: ph.price_usd, retailer: ph.retailer });
    phMap.set(key, arr);
  }

  const results: ProductPrice[] = [];

  function build(
    product: any,
    kind: ProductPrice['kind'],
    table: string,
    msrpField: string,
    modelField: string,
  ) {
    const key = `${table}:${product.id}`;
    const rp = rpMap.get(key);
    const history = phMap.get(key) ?? [];
    const currentPrice = rp?.prices[0]?.price_usd ?? null;
    const msrp = product[msrpField] ?? null;
    const discountPct = currentPrice && msrp && msrp > 0
      ? Math.round(((msrp - currentPrice) / msrp) * 100)
      : null;

    const histPrices = history.map((h) => h.price_usd);
    const low90d = histPrices.length > 0 ? Math.min(...histPrices) : null;
    const high90d = histPrices.length > 0 ? Math.max(...histPrices) : null;

    results.push({
      id: product.id,
      slug: product.slug,
      kind,
      brand: product.brand,
      model: product[modelField] ?? '',
      image_url: product.image_url,
      current_price: currentPrice,
      msrp,
      discount_pct: discountPct,
      retailer_count: rp?.prices.length ?? 0,
      low_90d: low90d,
      high_90d: high90d,
      last_checked: rp?.checked_at ?? null,
      price_history: history,
    });
  }

  for (const s of shoesRes.data ?? []) build(s, 'shoe', 'shoes', 'price_usd', 'model');
  for (const v of vestsRes.data ?? []) build(v, 'vest', 'vests', 'price_usd', 'model');
  for (const g of gelsRes.data ?? []) build(g, 'gel', 'gels', 'price_per_serving', 'product');

  return results;
}
