// lib/review-types.ts
// TypeScript types for the v2 review payload.
// These extend the existing Database['public']['Tables']['shoes']['Row']
// shape with the E-E-A-T fields added in migration 003.

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

// The full hydrated payload a review page needs.
export interface ShoeReviewPayload {
  // raw row
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

  // specs
  drop_mm: number | null;
  stack_heel_mm: number | null;
  stack_forefoot_mm: number | null;
  weight_g: number | null;          // mfr spec
  in_house_weight_g: number | null; // verified
  carbon_plate: boolean;
  rock_plate: boolean;

  // E-E-A-T
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

  // content
  review_content: string | null;
  faqs: ReviewFaq[];
  quotes: CommunityQuote[];

  // dimension scores
  dimensions: DimensionScore[];

  // commerce
  retailer_prices: RetailerPrice[];
  price_history: PriceHistoryPoint[];

  // related (loaded separately)
  related: Array<Pick<ShoeReviewPayload, 'id' | 'slug' | 'brand' | 'model' | 'image_url' | 'our_rating' | 'weight_g' | 'drop_mm' | 'price_usd'>>;
}
