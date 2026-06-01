// lib/review-data.ts
// Server-side fetchers for shoe, vest, and gel reviews.
// Each joins the product table + tester + editor + sidecar tables.

import { supabase } from './supabase';
import type {
  ShoeReviewPayload,
  VestReviewPayload,
  GelReviewPayload,
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

// ── Shared helpers ────────────────────────────────────────────────

function extractDimensions(row: any): DimensionScore[] {
  return DIM_KEYS
    .map(d => ({ key: d.key, label: d.label, value: Number(row[d.col]) }))
    .filter(d => Number.isFinite(d.value) && d.value > 0);
}

function isoDaysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

// ── Shoe Reviews ─────────────────────────────────────────────────

export async function getShoeReview(slug: string): Promise<ShoeReviewPayload | null> {
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

    dimensions: extractDimensions(shoe),
    retailer_prices: (pricesRes.data as RetailerPrice[]) ?? [],
    price_history: (historyRes.data as PriceHistoryPoint[]) ?? [],

    related: (relatedRes.data as ShoeReviewPayload['related']) ?? [],
  };
}

export async function getAllShoeSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('shoes')
    .select('slug')
    .eq('published', true);
  return (data ?? []).map(r => r.slug);
}

// ── Vest Reviews ─────────────────────────────────────────────────

export async function getVestReview(slug: string): Promise<VestReviewPayload | null> {
  const { data: vest } = await supabase
    .from('vests')
    .select(`
      *,
      tester:tester_id ( id, slug, name, title, bio, avatar_url, miles_logged_lifetime, credentials, strava_url, linkedin_url, joined_at ),
      human_editor:human_editor_id ( id, slug, name, title, avatar_url, joined_at, credentials, miles_logged_lifetime, bio, strava_url, linkedin_url )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (!vest) return null;

  const [pricesRes, historyRes, quotesRes, faqsRes, relatedRes] = await Promise.all([
    supabase
      .from('retailer_prices')
      .select('retailer, price_usd, url, in_stock, stock_label, checked_at')
      .eq('product_table', 'vests')
      .eq('product_id', vest.id)
      .order('price_usd', { ascending: true }),
    supabase
      .from('price_history')
      .select('observed_on, price_usd, retailer')
      .eq('product_table', 'vests')
      .eq('product_id', vest.id)
      .gte('observed_on', isoDaysAgo(90))
      .order('observed_on', { ascending: true }),
    supabase
      .from('community_quotes')
      .select('id, source, source_url, user_handle, body, votes, sentiment')
      .eq('product_table', 'vests')
      .eq('product_id', vest.id)
      .order('display_order', { ascending: true })
      .limit(3),
    supabase
      .from('review_faqs')
      .select('question, answer')
      .eq('product_table', 'vests')
      .eq('product_id', vest.id)
      .order('display_order', { ascending: true })
      .limit(8),
    supabase
      .from('vests')
      .select('id, slug, brand, model, image_url, our_rating, weight_g, capacity_l, price_usd')
      .eq('published', true)
      .neq('id', vest.id)
      .order('our_rating', { ascending: false })
      .limit(3),
  ]);

  return {
    id: vest.id,
    slug: vest.slug,
    brand: vest.brand,
    model: vest.model,
    tagline: vest.tagline ?? null,
    our_rating: vest.our_rating ?? null,
    price_usd: vest.price_usd ?? null,
    msrp_usd: vest.msrp_usd ?? vest.price_usd ?? null,
    released_at: vest.released_at ?? null,
    image_url: vest.image_url ?? null,
    affiliate_url: vest.affiliate_url ?? null,
    amazon_url: vest.amazon_url ?? null,

    capacity_l: vest.capacity_l ?? null,
    weight_g: vest.weight_g ?? null,
    in_house_weight_g: vest.in_house_weight_g ?? null,
    front_pockets: vest.front_pockets ?? null,
    back_pockets: vest.back_pockets ?? null,
    soft_flask_included: !!vest.soft_flask_included,
    utmb_compliant: !!vest.utmb_compliant,
    itra_compliant: !!vest.itra_compliant,
    chest_strap_adjustable: !!vest.chest_strap_adjustable,
    gender: vest.gender ?? null,

    tester: (vest.tester as Tester) ?? null,
    human_editor: (vest.human_editor as Tester) ?? null,
    miles_tested: vest.miles_tested ?? null,
    weeks_tested: vest.weeks_tested ?? null,
    test_terrain: vest.test_terrain ?? null,
    peer_reviewer_count: vest.peer_reviewer_count ?? 0,
    ai_drafted_at: vest.ai_drafted_at ?? null,
    human_edited_at: vest.human_edited_at ?? null,

    best_for: (vest.best_for as string[]) ?? [],
    not_for: (vest.not_for as string[]) ?? [],

    review_content: vest.review_content ?? null,
    faqs: (faqsRes.data as ReviewFaq[]) ?? [],
    quotes: (quotesRes.data as CommunityQuote[]) ?? [],

    retailer_prices: (pricesRes.data as RetailerPrice[]) ?? [],
    price_history: (historyRes.data as PriceHistoryPoint[]) ?? [],

    related: (relatedRes.data as VestReviewPayload['related']) ?? [],
  };
}

export async function getAllVestSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('vests')
    .select('slug')
    .eq('published', true);
  return (data ?? []).map(r => r.slug);
}

// ── Gel Reviews ──────────────────────────────────────────────────

export async function getGelReview(slug: string): Promise<GelReviewPayload | null> {
  const { data: gel } = await supabase
    .from('gels')
    .select(`
      *,
      tester:tester_id ( id, slug, name, title, bio, avatar_url, miles_logged_lifetime, credentials, strava_url, linkedin_url, joined_at ),
      human_editor:human_editor_id ( id, slug, name, title, avatar_url, joined_at, credentials, miles_logged_lifetime, bio, strava_url, linkedin_url )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .maybeSingle();

  if (!gel) return null;

  const [pricesRes, historyRes, quotesRes, faqsRes, relatedRes] = await Promise.all([
    supabase
      .from('retailer_prices')
      .select('retailer, price_usd, url, in_stock, stock_label, checked_at')
      .eq('product_table', 'gels')
      .eq('product_id', gel.id)
      .order('price_usd', { ascending: true }),
    supabase
      .from('price_history')
      .select('observed_on, price_usd, retailer')
      .eq('product_table', 'gels')
      .eq('product_id', gel.id)
      .gte('observed_on', isoDaysAgo(90))
      .order('observed_on', { ascending: true }),
    supabase
      .from('community_quotes')
      .select('id, source, source_url, user_handle, body, votes, sentiment')
      .eq('product_table', 'gels')
      .eq('product_id', gel.id)
      .order('display_order', { ascending: true })
      .limit(3),
    supabase
      .from('review_faqs')
      .select('question, answer')
      .eq('product_table', 'gels')
      .eq('product_id', gel.id)
      .order('display_order', { ascending: true })
      .limit(8),
    supabase
      .from('gels')
      .select('id, slug, brand, product, image_url, our_rating, carbs_per_serving_g, price_per_serving')
      .eq('published', true)
      .neq('id', gel.id)
      .order('our_rating', { ascending: false })
      .limit(3),
  ]);

  return {
    id: gel.id,
    slug: gel.slug,
    brand: gel.brand,
    product: gel.product,
    tagline: gel.tagline ?? null,
    our_rating: gel.our_rating ?? null,
    price_per_serving: gel.price_per_serving ?? null,
    image_url: gel.image_url ?? null,
    affiliate_url: gel.affiliate_url ?? null,
    amazon_url: gel.amazon_url ?? null,

    carbs_per_serving_g: gel.carbs_per_serving_g ?? null,
    sodium_mg: gel.sodium_mg ?? null,
    caffeine_mg: gel.caffeine_mg ?? null,
    calories: gel.calories ?? null,
    format: gel.format ?? null,
    real_food: !!gel.real_food,
    fodmap_friendly: !!gel.fodmap_friendly,

    tester: (gel.tester as Tester) ?? null,
    human_editor: (gel.human_editor as Tester) ?? null,
    servings_tested: gel.servings_tested ?? null,
    ai_drafted_at: gel.ai_drafted_at ?? null,
    human_edited_at: gel.human_edited_at ?? null,

    best_for: (gel.best_for as string[]) ?? [],
    not_for: (gel.not_for as string[]) ?? [],

    review_content: gel.review_content ?? null,
    faqs: (faqsRes.data as ReviewFaq[]) ?? [],
    quotes: (quotesRes.data as CommunityQuote[]) ?? [],

    retailer_prices: (pricesRes.data as RetailerPrice[]) ?? [],
    price_history: (historyRes.data as PriceHistoryPoint[]) ?? [],

    related: (relatedRes.data as GelReviewPayload['related']) ?? [],
  };
}

export async function getAllGelSlugs(): Promise<string[]> {
  const { data } = await supabase
    .from('gels')
    .select('slug')
    .eq('published', true);
  return (data ?? []).map(r => r.slug);
}
