// lib/review-types.ts
// TypeScript types for the v2 review payload.
// Covers shoes, vests, and gels with shared E-E-A-T fields.

export type Discipline = 'trail' | 'road' | 'hyrox' | 'track' | 'road-to-trail' | 'parkrun';

export interface Tester {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  bio: string | null;
  avatar_url: string | null;
  miles_logged_lifetime: number;
  credentials: string[] | null;
  strava_url: string | null;
  linkedin_url: string | null;
  joined_at: string | null;
}

export interface RetailerPrice {
  retailer: string;
  price_usd: number;
  url: string;
  in_stock: boolean;
  stock_label: string | null;
  checked_at: string;
}

export interface PriceHistoryPoint {
  observed_on: string;       // YYYY-MM-DD
  price_usd: number;
  retailer: string;
}

export interface CommunityQuote {
  id: string;
  source: string;            // 'r/trailrunning' | 'letsrun' | 'strava'
  source_url: string | null;
  user_handle: string | null;
  body: string;
  votes: string | null;
  sentiment: number | null;
}

export interface ReviewFaq {
  question: string;
  answer: string;
}

export interface DimensionScore {
  key: string;               // 'grip' | 'comfort' | ...
  label: string;
  value: number;             // 0..10
}

export interface SpecGroup {
  group: string;
  items: [string, string | null][];
}

// ── Shoe Review ──────────────────────────────────────────────────

export interface ShoeReviewPayload {
  id: string;
  slug: string;
  brand: string;
  model: string;
  discipline: Discipline;
  tagline: string | null;
  our_rating: number | null;
  price_usd: number | null;
  msrp_usd: number | null;
  released_at: string | null;
  image_url: string | null;
  affiliate_url: string | null;
  amazon_url: string | null;

  drop_mm: number | null;
  stack_heel_mm: number | null;
  stack_forefoot_mm: number | null;
  weight_g: number | null;
  in_house_weight_g: number | null;
  carbon_plate: boolean;
  rock_plate: boolean;

  tester: Tester | null;
  human_editor: Tester | null;
  miles_tested: number | null;
  weeks_tested: number | null;
  test_terrain: string | null;
  peer_reviewer_count: number;
  ai_drafted_at: string | null;
  human_edited_at: string | null;

  best_for: string[];
  not_for: string[];

  review_content: string | null;
  faqs: ReviewFaq[];
  quotes: CommunityQuote[];

  dimensions: DimensionScore[];

  retailer_prices: RetailerPrice[];
  price_history: PriceHistoryPoint[];

  related: Array<Pick<ShoeReviewPayload, 'id' | 'slug' | 'brand' | 'model' | 'image_url' | 'our_rating' | 'weight_g' | 'drop_mm' | 'price_usd'>>;
}

// ── Vest Review ──────────────────────────────────────────────────

export interface VestReviewPayload {
  id: string;
  slug: string;
  brand: string;
  model: string;
  tagline: string | null;
  our_rating: number | null;
  price_usd: number | null;
  msrp_usd: number | null;
  released_at: string | null;
  image_url: string | null;
  affiliate_url: string | null;
  amazon_url: string | null;

  capacity_l: number | null;
  weight_g: number | null;
  in_house_weight_g: number | null;
  front_pockets: number | null;
  back_pockets: number | null;
  soft_flask_included: boolean;
  utmb_compliant: boolean;
  itra_compliant: boolean;
  chest_strap_adjustable: boolean;
  gender: string | null;

  tester: Tester | null;
  human_editor: Tester | null;
  miles_tested: number | null;
  weeks_tested: number | null;
  test_terrain: string | null;
  peer_reviewer_count: number;
  ai_drafted_at: string | null;
  human_edited_at: string | null;

  best_for: string[];
  not_for: string[];

  review_content: string | null;
  faqs: ReviewFaq[];
  quotes: CommunityQuote[];

  retailer_prices: RetailerPrice[];
  price_history: PriceHistoryPoint[];

  related: Array<Pick<VestReviewPayload, 'id' | 'slug' | 'brand' | 'model' | 'image_url' | 'our_rating' | 'weight_g' | 'capacity_l' | 'price_usd'>>;
}

// ── Gel Review ───────────────────────────────────────────────────

export interface GelReviewPayload {
  id: string;
  slug: string;
  brand: string;
  product: string;
  tagline: string | null;
  our_rating: number | null;
  price_per_serving: number | null;
  image_url: string | null;
  affiliate_url: string | null;
  amazon_url: string | null;

  carbs_per_serving_g: number | null;
  sodium_mg: number | null;
  caffeine_mg: number | null;
  calories: number | null;
  format: string | null;
  real_food: boolean;
  fodmap_friendly: boolean;

  tester: Tester | null;
  human_editor: Tester | null;
  servings_tested: number | null;
  ai_drafted_at: string | null;
  human_edited_at: string | null;

  best_for: string[];
  not_for: string[];

  review_content: string | null;
  faqs: ReviewFaq[];
  quotes: CommunityQuote[];

  retailer_prices: RetailerPrice[];
  price_history: PriceHistoryPoint[];

  related: Array<Pick<GelReviewPayload, 'id' | 'slug' | 'brand' | 'product' | 'image_url' | 'our_rating' | 'carbs_per_serving_g' | 'price_per_serving'>>;
}
