// lib/review-data.ts
// Server-side fetcher for a single shoe review.
// Joins shoes + tester + retailer_prices + price_history + community_quotes
// + review_faqs and degrades gracefully when any sidecar table is empty
// (e.g. before the cron has populated price history).

import { supabase } from './supabase';
import type {
  ShoeReviewPayload,
  Tester,
  DimensionScore,
  CommunityQuote,
  ReviewFaq,
  RetailerPrice,
  PriceHistoryPoint,
} from './review-types';

const DIM_KEYS: Array<{ key: string; label: string; col: string }> = [
  { key: 'grip',       label: 'Grip',       col: 'score_grip' },
  { key: 'comfort',    label: 'Comfort',    col: 'score_comfort' },
  { key: 'weight',     label: 'Weight',     col: 'score_weight' },
  { key: 'durability', label: 'Durability', col: 'score_durability' },
  { key: 'value',      label: 'Value',      col: 'score_value' },
  { key: 'fit',        label: 'Fit',        col: 'score_fit' },
];

export async function getShoeReview(slug: string): Promise<ShoeReviewPayload | null> {
  // 1. Primary row + joined tester + editor
  const { data: shoe } = await supabase
    .from('shoes')
    .select(`
      *,
      tester:tester_id ( id, slug, name, title, bio, avatar_url, miles_logged_lifetime, credentials, strava_url, linkedin_url, joined_at ),
      human_editor:human_editor_id ( id, slug, name, title, avatar_url, joined_at, credentials, miles_logged_lifetime, bio, strava_url, linkedin_url )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (!shoe) return null;

  // 2. Sidecar tables in parallel — silent fallbacks if a query fails or returns nothing
  const [pricesRes, historyRes, quotesRes, faqsRes, relatedRes] = await Promise.all([
    supabase
      .from('retailer_prices')
      .select('retailer, price_usd, url, in_stock, stock_label, checked_at')
      .eq('product_table', 'shoes')
      .eq('product_id', shoe.id)
      .order('price_usd', { ascending: true }),
    supabase
      .from('price_history')
      .select('observed_on, price_usd, retailer')
      .eq('product_table', 'shoes')
      .eq('product_id', shoe.id)
      .gte('observed_on', isoDaysAgo(90))
      .order('observed_on', { ascending: true }),
    supabase
      .from('community_quotes')
      .select('id, source, source_url, user_handle, body, votes, sentiment')
      .eq('product_table', 'shoes')
      .eq('product_id', shoe.id)
      .order('display_order', { ascending: true })
      .limit(3),
    supabase
      .from('review_faqs')
      .select('question, answer')
      .eq('product_table', 'shoes')
      .eq('product_id', shoe.id)
      .order('display_order', { ascending: true })
      .limit(8),
    supabase
      .from('shoes')
      .select('id, slug, brand, model, image_url, our_rating, weight_g, drop_mm, price_usd')
      .eq('discipline', shoe.discipline)
      .neq('id', shoe.id)
      .eq('published', true)
      .order('our_rating', { ascending: false })
      .limit(3),
  ]);

  const dimensions: DimensionScore[] = DIM_KEYS
    .map(d => ({ key: d.key, label: d.label, value: Number(shoe[d.col]) }))
    .filter(d => Number.isFinite(d.value) && d.value > 0);

  return {
    id: shoe.id,
    slug: shoe.slug,
    brand: shoe.brand,
    model: shoe.model,
    discipline: shoe.discipline,
    tagline: shoe.tagline ?? null,
    our_rating: shoe.our_rating ?? null,
    price_usd: shoe.price_usd ?? null,
    msrp_usd: shoe.msrp_usd ?? shoe.price_usd ?? null,
    released_at: shoe.released_at ?? null,
    image_url: shoe.image_url ?? null,
    affiliate_url: shoe.affiliate_url ?? null,
    amazon_url: shoe.amazon_url ?? null,

    drop_mm: shoe.drop_mm ?? null,
    stack_heel_mm: shoe.stack_heel_mm ?? null,
    stack_forefoot_mm: shoe.stack_forefoot_mm ?? null,
    weight_g: shoe.weight_g ?? null,
    in_house_weight_g: shoe.in_house_weight_g ?? null,
    carbon_plate: !!shoe.carbon_plate,
    rock_plate: !!shoe.rock_plate,

    tester: (shoe.tester as Tester) ?? null,
    human_editor: (shoe.human_editor as Tester) ?? null,
    miles_tested: shoe.miles_tested ?? null,
    weeks_tested: shoe.weeks_tested ?? null,
    test_terrain: shoe.test_terrain ?? null,
    peer_reviewer_count: shoe.peer_reviewer_count ?? 0,
    ai_drafted_at: shoe.ai_drafted_at ?? null,
    human_edited_at: shoe.human_edited_at ?? null,

    best_for: (shoe.best_for as string[]) ?? [],
    not_for: (shoe.not_for as string[]) ?? [],

    review_content: shoe.review_content ?? null,
    faqs: (faqsRes.data as ReviewFaq[]) ?? [],
    quotes: (quotesRes.data as CommunityQuote[]) ?? [],

    dimensions,
    retailer_prices: (pricesRes.data as RetailerPrice[]) ?? [],
    price_history: (historyRes.data as PriceHistoryPoint[]) ?? [],

    related: (relatedRes.data as ShoeReviewPayload['related']) ?? [],
  };
}

function isoDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// Slugs for generateStaticParams — used by Next 16 cache-components.
export async function getAllShoeSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('shoes')
    .select('slug')
    .eq('published', true);
  return (data ?? []).map(r => r.slug);
}
