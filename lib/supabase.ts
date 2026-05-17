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
          created_at: string;
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
          created_at: string;
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
          created_at: string;
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
          keywords: string[] | null;
          published: boolean;
          published_at: string | null;
          generated_at: string | null;
          featured_image_url: string | null;
          created_at: string;
        };
      };
    };
  };
};
