import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export type Database = {
  public: {
    Tables: {
      shoes: {
        Row: {
          id: string;
          brand: string;
          model: string;
          slug: string;
          price_usd: number | null;
          weight_g: number | null;
          stack_heel_mm: number | null;
          stack_forefoot_mm: number | null;
          drop_mm: number | null;
          rock_plate: boolean;
          carbon_plate: boolean;
          waterproof_version: boolean;
          discipline: 'trail' | 'road' | 'hyrox' | 'track' | 'road-to-trail' | 'parkrun';
          terrain: string | null;
          distance_sweet_spot: string | null;
          our_rating: number | null;
          claimed_vs_actual: string | null;
          review_content: string | null;
          review_generated_at: string | null;
          from_the_trail: string | null;
          published: boolean;
          affiliate_url: string | null;
          amazon_url: string | null;
          image_url: string | null;
          created_at: string;
          // E-E-A-T (003)
          tester_id: string | null;
          in_house_weight_g: number | null;
          miles_tested: number | null;
          weeks_tested: number | null;
          test_terrain: string | null;
          best_for: string[] | null;
          not_for: string[] | null;
          score_grip: number | null;
          score_comfort: number | null;
          score_weight: number | null;
          score_durability: number | null;
          score_value: number | null;
          score_fit: number | null;
          ai_drafted_at: string | null;
          human_edited_at: string | null;
          human_editor_id: string | null;
          peer_reviewer_count: number;
          released_at: string | null;
          msrp_usd: number | null;
          tagline: string | null;
        };
      };
      vests: {
        Row: {
          id: string;
          brand: string;
          model: string;
          slug: string;
          capacity_l: number | null;
          weight_g: number | null;
          front_pockets: number | null;
          back_pockets: number | null;
          soft_flask_included: boolean;
          utmb_compliant: boolean;
          itra_compliant: boolean;
          chest_strap_adjustable: boolean;
          gender: 'unisex' | 'women' | 'men';
          price_usd: number | null;
          our_rating: number | null;
          claimed_vs_actual: string | null;
          review_content: string | null;
          review_generated_at: string | null;
          from_the_trail: string | null;
          published: boolean;
          affiliate_url: string | null;
          amazon_url: string | null;
          image_url: string | null;
          created_at: string;
          // E-E-A-T (003)
          tester_id: string | null;
          in_house_weight_g: number | null;
          miles_tested: number | null;
          best_for: string[] | null;
          not_for: string[] | null;
          ai_drafted_at: string | null;
          human_edited_at: string | null;
          human_editor_id: string | null;
          tagline: string | null;
        };
      };
      gels: {
        Row: {
          id: string;
          brand: string;
          product: string;
          slug: string;
          carbs_per_serving_g: number | null;
          sodium_mg: number | null;
          caffeine_mg: number | null;
          calories: number | null;
          format: 'gel' | 'chew' | 'drink' | 'bar';
          real_food: boolean;
          fodmap_friendly: boolean;
          price_per_serving: number | null;
          our_rating: number | null;
          review_content: string | null;
          review_generated_at: string | null;
          from_the_trail: string | null;
          published: boolean;
          affiliate_url: string | null;
          amazon_url: string | null;
          image_url: string | null;
          created_at: string;
          // E-E-A-T (003)
          tester_id: string | null;
          servings_tested: number | null;
          best_for: string[] | null;
          not_for: string[] | null;
          ai_drafted_at: string | null;
          human_edited_at: string | null;
          human_editor_id: string | null;
          tagline: string | null;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          category: 'guide' | 'comparison' | 'race' | 'nutrition' | null;
          published: boolean;
          published_at: string | null;
          generated_at: string | null;
          created_at: string;
        };
      };
      testers: {
        Row: {
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
          active: boolean;
          created_at: string;
        };
      };
      retailer_prices: {
        Row: {
          id: string;
          product_table: 'shoes' | 'vests' | 'gels';
          product_id: string;
          retailer: string;
          price_usd: number;
          url: string;
          in_stock: boolean;
          stock_label: string | null;
          checked_at: string;
        };
      };
      price_history: {
        Row: {
          id: string;
          product_table: 'shoes' | 'vests' | 'gels';
          product_id: string;
          retailer: string;
          price_usd: number;
          observed_on: string;
        };
      };
      community_quotes: {
        Row: {
          id: string;
          product_table: 'shoes' | 'vests' | 'gels';
          product_id: string;
          source: string;
          source_url: string | null;
          user_handle: string | null;
          body: string;
          votes: string | null;
          sentiment: number | null;
          captured_at: string;
          display_order: number;
        };
      };
      review_faqs: {
        Row: {
          id: string;
          product_table: 'shoes' | 'vests' | 'gels';
          product_id: string;
          question: string;
          answer: string;
          display_order: number;
        };
      };
      changelog: {
        Row: {
          id: string;
          occurred_at: string;
          kind: 'add' | 'update' | 'price' | 'review' | 'remove';
          product_table: string | null;
          product_id: string | null;
          summary: string;
          actor: string | null;
        };
      };
    };
  };
};
