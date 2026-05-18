// lib/stats-data.ts
// Category-level aggregates for "vs average" deltas on review pages.

import { supabase } from './supabase';

export interface CategoryStats {
  count: number;
  avg_weight_g: number | null;
  avg_drop_mm: number | null;
  avg_stack_heel_mm: number | null;
  avg_price_usd: number | null;
  avg_rating: number | null;
}

export async function getCategoryStats(category: 'shoes' | 'vests' | 'gels'): Promise<CategoryStats> {
  const table = category;
  const select = table === 'gels'
    ? 'weight_g, price_per_serving, our_rating'
    : table === 'vests'
      ? 'weight_g, price_usd, our_rating'
      : 'weight_g, drop_mm, stack_heel_mm, price_usd, our_rating';

  const { data } = await supabase
    .from(table)
    .select(select)
    .eq('published', true);

  const rows = data ?? [];
  const count = rows.length;

  const avg = (vals: number[]) => vals.length > 0 ? vals.reduce((s, n) => s + n, 0) / vals.length : null;

  const weights = rows.map((r: any) => Number(r.weight_g)).filter((n: number) => Number.isFinite(n));
  const prices = rows.map((r: any) => Number(r.price_usd ?? r.price_per_serving)).filter((n: number) => Number.isFinite(n));
  const ratings = rows.map((r: any) => Number(r.our_rating)).filter((n: number) => Number.isFinite(n));

  let avg_drop_mm: number | null = null;
  let avg_stack_heel_mm: number | null = null;

  if (category === 'shoes') {
    const drops = rows.map((r: any) => Number(r.drop_mm)).filter((n: number) => Number.isFinite(n));
    const stacks = rows.map((r: any) => Number(r.stack_heel_mm)).filter((n: number) => Number.isFinite(n));
    avg_drop_mm = avg(drops);
    avg_stack_heel_mm = avg(stacks);
  }

  return {
    count,
    avg_weight_g: avg(weights),
    avg_drop_mm,
    avg_stack_heel_mm,
    avg_price_usd: avg(prices),
    avg_rating: avg(ratings),
  };
}
