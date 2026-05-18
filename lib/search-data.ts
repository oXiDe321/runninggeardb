// lib/search-data.ts
// Fetches all published products from shoes/vests/gels in parallel
// and normalizes them into a common SearchResult shape for fuse.js.

import { supabase } from './supabase';

export interface SearchResult {
  id: string;
  slug: string;
  kind: 'shoe' | 'vest' | 'gel';
  brand: string;
  model: string;
  image_url: string | null;
  our_rating: number | null;
  price_usd: number | null;
  discipline: string | null;
  weight_g: number | null;
  drop_mm: number | null;
  category: 'shoes' | 'vests' | 'gels';
}

const SHOE_SELECT = 'id, slug, brand, model, image_url, our_rating, price_usd, discipline, weight_g, drop_mm';
const VEST_SELECT = 'id, slug, brand, model, image_url, our_rating, price_usd, weight_g';
const GEL_SELECT = 'id, slug, brand, product, image_url, our_rating, price_per_serving';

export async function getAllSearchableProducts(): Promise<SearchResult[]> {
  const [shoesRes, vestsRes, gelsRes] = await Promise.all([
    supabase.from('shoes').select(SHOE_SELECT).eq('published', true).order('our_rating', { ascending: false }),
    supabase.from('vests').select(VEST_SELECT).eq('published', true).order('our_rating', { ascending: false }),
    supabase.from('gels').select(GEL_SELECT).eq('published', true).order('our_rating', { ascending: false }),
  ]);

  const results: SearchResult[] = [];

  for (const r of (shoesRes.data ?? [])) {
    results.push({
      id: r.id, slug: r.slug, kind: 'shoe', brand: r.brand,
      model: r.model, image_url: r.image_url, our_rating: r.our_rating,
      price_usd: r.price_usd, discipline: r.discipline,
      weight_g: r.weight_g, drop_mm: r.drop_mm, category: 'shoes',
    });
  }
  for (const r of (vestsRes.data ?? [])) {
    results.push({
      id: r.id, slug: r.slug, kind: 'vest', brand: r.brand,
      model: r.model, image_url: r.image_url, our_rating: r.our_rating,
      price_usd: r.price_usd, discipline: null,
      weight_g: r.weight_g, drop_mm: null, category: 'vests',
    });
  }
  for (const r of (gelsRes.data ?? [])) {
    results.push({
      id: r.id, slug: r.slug, kind: 'gel', brand: r.brand,
      model: (r as any).product ?? '', image_url: r.image_url,
      our_rating: r.our_rating, price_usd: (r as any).price_per_serving ?? null,
      discipline: null, weight_g: null, drop_mm: null, category: 'gels',
    });
  }

  return results;
}
