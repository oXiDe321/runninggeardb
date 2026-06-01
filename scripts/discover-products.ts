#!/usr/bin/env tsx
/**
 * Auto-Discovery Script — finds new running products from Reddit, Amazon AU,
 * and running news sites. Extracts specs via DeepSeek, enriches with Amazon
 * data, fetches community quotes, and generates full reviews.
 *
 * Usage:
 *   npx tsx scripts/discover-products.ts [--dry-run] [--limit 5] [--min-confidence 0.6]
 *   npx tsx scripts/discover-products.ts --source amazon  # Amazon-only discovery
 *   npx tsx scripts/discover-products.ts --source reddit   # Reddit-only discovery
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

// ── Clients ────────────────────────────────────────────────────────

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const ai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

// ── Config ─────────────────────────────────────────────────────────

const DELAY = 2500;
const AFFILIATE_TAG = 'trailgear-22';
const AMAZON_BASE = 'www.amazon.com.au';
const REDDIT_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const KNOWN_BRANDS = [
  'HOKA', 'Nike', 'Salomon', 'Brooks', 'Saucony', 'ASICS', 'Adidas',
  'On', 'New Balance', 'Altra', 'Inov-8', 'La Sportiva', 'Puma',
  'Mizuno', 'Topo Athletic', 'Reebok', 'Black Diamond', 'Nathan',
  'Osprey', 'Ultimate Direction', 'Maurten', 'GU Energy', 'SiS',
  'Precision Fuel', 'Precision Fuel & Hydration', 'Spring Energy',
  'Tailwind', 'Clif', 'Clif Bar', 'Huma', 'Honey Stinger', 'Skratch',
  'Torq', 'High5', 'UltrAspire', 'Patagonia', "Arc'teryx", 'Raidlight',
  'CamelBak', 'Compressport', 'Montane', 'Dynafit', 'The North Face',
  'Orange Mud', 'Naked', 'Neversecond', 'Hammer Nutrition', 'Gatorade',
  'Muir Energy', 'Myprotein', 'Decathlon', 'Styrkr', 'Veloforte',
  'Bonk Breaker', 'Naak', 'Lucho Dillitos', 'Gregory', 'Harrier',
  'Topo', 'GU', 'New Balance', 'Arc\'teryx',
];

// Brand aliases: what Reddit users actually say → canonical brand name
const BRAND_ALIASES: Record<string, string> = {
  'topo': 'Topo Athletic',
  'adizero': 'Adidas',
  'adios': 'Adidas',
  'norda': 'Norda',
  'nnormal': 'Nnormal',
  'craft': 'Craft',
};

const SHOE_KEYWORDS = ['shoe', 'sneaker', 'trainer', 'runner', 'foam', 'midsole', 'stack', 'drop', 'plate', 'carbon', 'lug ', 'outsole'];
const VEST_KEYWORDS = ['vest', 'pack', 'hydration', 'belt', 'carry', 'reservoir', 'bottle', 'bladder', 'flask'];
const GEL_KEYWORDS = ['gel', 'fuel', 'nutrition', 'chew', 'drink mix', 'carb', 'waffle', 'bar', 'energy', 'electrolyte', 'protein bar'];

const REDDIT_QUERIES = [
  'new release', 'just released', 'just dropped', 'now available',
  'first run', 'first impressions', 'initial review', 'in hand',
  'unboxing', 'maiden voyage', 'fresh pickup', 'new pickup',
  'deal alert', 'on sale', 'price drop', 'restock',
];

const SUBREDDITS = ['RunningShoeGeeks', 'trailrunning', 'running', 'ultrarunning'];

const AMAZON_SHOE_SEARCHES = [
  'running shoes 2026 new release',
  'trail running shoes 2026',
  'carbon plate running shoes',
];

// ── Types ──────────────────────────────────────────────────────────

interface RawDiscovery {
  source: string;
  source_url: string;
  raw_name: string;
  brand: string;
  model: string;
  table_hint: 'shoes' | 'vests' | 'gels' | null;
  asin?: string;
  image_url?: string;
}

interface ValidatedProduct {
  brand: string;
  model: string;
  table: 'shoes' | 'vests' | 'gels';
  slug: string;
  is_real: boolean;
  confidence: number;
  reasoning: string;
}

interface ExtractedSpecs {
  our_rating: number;
  tagline: string;
  spec_confidence: number;
  // shoes
  discipline?: string;
  drop_mm?: number;
  weight_g?: number;
  stack_heel_mm?: number;
  stack_forefoot_mm?: number;
  carbon_plate?: boolean;
  price_usd?: number;
  terrain?: string;
  // vests
  capacity_l?: number;
  utmb_compliant?: boolean;
  soft_flask_included?: boolean;
  front_pockets?: number;
  back_pockets?: number;
  // gels
  carbs_per_serving_g?: number;
  sodium_mg?: number;
  caffeine_mg?: number;
  calories?: number;
  price_per_serving?: number;
  format?: string;
  real_food?: boolean;
}

interface DiscoveryRun {
  discovered: number;
  deduplicated: number;
  validated: number;
  specs_extracted: number;
  enriched: number;
  inserted: number;
  failed: number;
  products: Array<{ slug: string; table: string; brand: string; model: string; source: string }>;
}

// ── Helpers ────────────────────────────────────────────────────────

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithRetry(url: string, maxRetries = 3): Promise<string> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': REDDIT_UA, 'Accept-Language': 'en-AU,en;q=0.9' },
        signal: AbortSignal.timeout(15000),
      });
      if (res.status === 429) {
        const wait = (attempt + 1) * 5000;
        await sleep(wait);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (err: any) {
      if (attempt < maxRetries - 1) {
        await sleep(3000);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Max retries exceeded');
}

function slugify(brand: string, model: string): string {
  return `${brand}-${model}`
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function keywordClassify(name: string): 'shoes' | 'vests' | 'gels' | null {
  const lower = name.toLowerCase();
  let scores: Record<string, number> = { shoes: 0, vests: 0, gels: 0 };
  for (const kw of SHOE_KEYWORDS) if (lower.includes(kw)) scores.shoes++;
  for (const kw of VEST_KEYWORDS) if (lower.includes(kw)) scores.vests++;
  for (const kw of GEL_KEYWORDS) if (lower.includes(kw)) scores.gels++;
  const max = Math.max(scores.shoes, scores.vests, scores.gels);
  if (max === 0) return null;
  if (scores.shoes === max) return 'shoes';
  if (scores.vests === max) return 'vests';
  return 'gels';
}

function extractProductName(title: string): { brand: string; model: string; raw_name: string } | null {
  const sorted = [...KNOWN_BRANDS].sort((a, b) => b.length - a.length);
  const cleanTitle = title.replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();

  for (const brand of sorted) {
    // Case-insensitive brand match at word boundary or start
    const escaped = brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const brandRe = new RegExp(`(?:^|\\s)(${escaped})(?:\\s+|$)`, 'i');
    const brandMatch = cleanTitle.match(brandRe);
    if (!brandMatch) continue;

    const afterBrand = cleanTitle.slice(brandMatch.index! + brandMatch[0].length);

    // Extract model: everything up to a stop word or end of string
    const stopWords = [
      'review', 'first run', 'initial', 'impressions', 'new colorway',
      'colorway', 'colourway', 'just dropped', 'now available', 'release',
      'deal', 'sale', 'specs', 'preview', 'restock', 'unbox', 'comparison',
      'vs', 'versus', 'check', 'official', 'confirmed', 'leak', 'early',
      'rumor', 'prototype', 'sample', '2025', '2026', '2027',
      '- specs', '- first', '- new', '- review', '- just', '- now',
    ];

    let model = afterBrand;
    let bestCut = afterBrand.length;
    for (const sw of stopWords) {
      const idx = afterBrand.toLowerCase().indexOf(sw);
      if (idx > 0 && idx < bestCut) bestCut = idx;
    }
    model = afterBrand.slice(0, bestCut).trim();

    // Clean up
    model = model.replace(/^[-–—\s]+|[-–—\s]+$/g, '');
    model = model.replace(/^(the|a|an)\s+/i, '');
    model = model.replace(/\s+/g, ' ').trim();

    if (model.length < 2) continue;

    // Apply brand alias
    const matchedBrandLower = brandMatch[1].toLowerCase();
    const canonicalBrand = BRAND_ALIASES[matchedBrandLower] || brand;
    return { brand: canonicalBrand, model, raw_name: `${canonicalBrand} ${model}` };
  }
  return null;
}

// ── Phase 1: Discovery ────────────────────────────────────────────

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': REDDIT_UA, 'Accept-Language': 'en-AU,en;q=0.9' }, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function discoverFromReddit(): Promise<RawDiscovery[]> {
  const results: RawDiscovery[] = [];
  const seen = new Set<string>();

  for (const sub of SUBREDDITS) {
    for (const query of REDDIT_QUERIES.slice(0, 6)) { // Use top 6 queries to reduce requests
      try {
        await sleep(DELAY * 2); // Longer delay for Reddit
        const searchUrl = `https://old.reddit.com/r/${sub}/search?q=${encodeURIComponent(query)}&restrict_sr=on&sort=new&t=month`;
        const html = await fetchWithRetry(searchUrl);

        // Extract search result titles and links from old.reddit.com
        // Reddit returns full URLs (https://old.reddit.com/r/...) or relative (/r/...)
        const linkRegex = /<a[^>]*href="(https?:\/\/old\.reddit\.com)?(\/r\/[^"]+)"[^>]*class="[^"]*search-title[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
        let m;
        while ((m = linkRegex.exec(html)) !== null) {
          const link = m[2]; // /r/sub/comments/.../slug/
          const title = m[3].replace(/<[^>]+>/g, '').trim();
          const key = `${sub}:${link}`;
          if (seen.has(key)) continue;
          seen.add(key);

          const extracted = extractProductName(title);
          if (extracted) {
            results.push({
              source: `r/${sub}`,
              source_url: `https://www.reddit.com${link}`,
              raw_name: extracted.raw_name,
              brand: extracted.brand,
              model: extracted.model,
              table_hint: keywordClassify(title + ' ' + extracted.raw_name),
            });
          }
        }
      } catch {
        // silent — Reddit rate limits happen, move to next query
      }
    }
  }
  return results;
}

async function discoverFromAmazon(): Promise<RawDiscovery[]> {
  const results: RawDiscovery[] = [];
  const seen = new Set<string>();

  for (const query of AMAZON_SHOE_SEARCHES) {
    try {
      await sleep(DELAY * 2);
      const searchUrl = `https://${AMAZON_BASE}/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;
      const html = await fetchWithRetry(searchUrl);

      // Extract ASIN + title from search results
      const productRe = /data-asin="(B[A-Z0-9]{9})"[^>]*>[\s\S]*?<h2[^>]*>\s*<a[^>]*>\s*<span[^>]*>([^<]+)<\/span>/gi;
      let m;
      while ((m = productRe.exec(html)) !== null) {
        const asin = m[1];
        const title = m[2].trim();
        if (seen.has(asin)) continue;
        seen.add(asin);

        const extracted = extractProductName(title);
        if (extracted) {
          results.push({
            source: 'amazon-search',
            source_url: `https://${AMAZON_BASE}/dp/${asin}?tag=${AFFILIATE_TAG}`,
            raw_name: extracted.raw_name,
            brand: extracted.brand,
            model: extracted.model,
            table_hint: keywordClassify(title + ' ' + extracted.raw_name) || 'shoes',
            asin,
          });
        }
      }
    } catch { /* skip */ }
  }
  return results;
}

// ── Phase 2: Deduplication ────────────────────────────────────────

async function getExistingSlugs(): Promise<{ exact: Set<string>; normalized: Map<string, string> }> {
  const exact = new Set<string>();
  const normalized = new Map<string, string>();
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const table of ['shoes', 'vests', 'gels'] as const) {
    const { data } = await supabase.from(table).select('slug').eq('published', true);
    for (const row of data ?? []) {
      exact.add(row.slug);
      normalized.set(normalize(row.slug), row.slug);
    }
  }
  return { exact, normalized };
}

function isDuplicate(slug: string, existing: { exact: Set<string>; normalized: Map<string, string> }): string | null {
  if (existing.exact.has(slug)) return 'exact match';
  const norm = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (existing.normalized.has(norm)) return `normalized match: ${existing.normalized.get(norm)}`;
  // Near-match check
  for (const [n, orig] of existing.normalized) {
    if (Math.abs(n.length - norm.length) <= 3 && levenshtein(norm, n) < 3) {
      return `near match: ${orig}`;
    }
  }
  return null;
}

// ── Phase 3: Validation ───────────────────────────────────────────

async function validateProduct(r: RawDiscovery): Promise<ValidatedProduct | null> {
  const slug = slugify(r.brand, r.model);
  const hint = r.table_hint ? `It appears to be a running ${r.table_hint}. ` : '';

  const prompt = `You are a running gear product validator. Determine if this is a real, commercially-released running product.

Product name: ${r.raw_name}
Source: ${r.source}
${hint}

Reply in JSON only:
{"is_real":true/false,"brand":"corrected brand","model":"corrected model","type":"shoe|vest|gel","confidence":0.0-1.0,"reasoning":"one sentence"}`;

  try {
    const response = await ai.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 300,
      temperature: 0.1,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.is_real || parsed.confidence < 0.5) return null;

    return {
      brand: parsed.brand || r.brand,
      model: parsed.model || r.model,
      table: parsed.type === 'shoe' ? 'shoes' : parsed.type === 'vest' ? 'vests' : 'gels',
      slug: slugify(parsed.brand || r.brand, parsed.model || r.model),
      is_real: true,
      confidence: parsed.confidence || 0.7,
      reasoning: parsed.reasoning || '',
    };
  } catch {
    return null;
  }
}

// ── Phase 4: Spec Extraction ──────────────────────────────────────

async function extractSpecs(v: ValidatedProduct): Promise<ExtractedSpecs | null> {
  const fieldSets: Record<string, string> = {
    shoes: `discipline (trail/road/hyrox/track/road-to-trail/parkrun), drop_mm, weight_g, stack_heel_mm, stack_forefoot_mm, carbon_plate (true/false), price_usd, terrain (short), tagline (under 30 chars), our_rating (1-10 based on community & reviewer consensus)`,
    vests: `capacity_l, weight_g, price_usd, utmb_compliant (true/false), soft_flask_included (true/false), front_pockets, back_pockets, tagline (under 30 chars), our_rating (1-10 based on community & reviewer consensus)`,
    gels: `carbs_per_serving_g, sodium_mg, caffeine_mg, calories, price_per_serving, format (gel/chew/drink/bar/waffle/solid), real_food (true/false), tagline (under 30 chars), our_rating (1-10 based on community & reviewer consensus)`,
  };

  const prompt = `You are extracting structured specifications from your training data. For ${v.brand} ${v.model} (${v.table}), extract these fields using your knowledge of product specs, reviews, and manufacturer data.

Type: ${v.table}
Fields: ${fieldSets[v.table]}

Where uncertain, use null. Do NOT guess values. Only return specs you're confident about.

Reply in JSON only with these exact keys.`;

  try {
    const response = await ai.chat.completions.create({
      model: 'deepseek-chat',
      max_tokens: 500,
      temperature: 0.1,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.choices[0].message.content || '';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const s = JSON.parse(jsonMatch[0]);

    // Count how many spec fields are non-null
    let filled = 0, total = 0;
    const keys = Object.keys(fieldSets[v.table]).length > 0 ? [] : [];
    for (const k of Object.keys(s)) {
      if (k === 'tagline' || k === 'our_rating') continue;
      total++;
      if (s[k] !== null && s[k] !== undefined) filled++;
    }

    return {
      our_rating: typeof s.our_rating === 'number' ? Math.min(10, Math.max(1, s.our_rating)) : 4.0,
      tagline: typeof s.tagline === 'string' ? s.tagline : '',
      spec_confidence: total > 0 ? filled / total : 0.3,
      // shoes
      discipline: s.discipline || undefined,
      drop_mm: typeof s.drop_mm === 'number' ? s.drop_mm : undefined,
      weight_g: typeof s.weight_g === 'number' ? s.weight_g : undefined,
      stack_heel_mm: typeof s.stack_heel_mm === 'number' ? s.stack_heel_mm : undefined,
      stack_forefoot_mm: typeof s.stack_forefoot_mm === 'number' ? s.stack_forefoot_mm : undefined,
      carbon_plate: typeof s.carbon_plate === 'boolean' ? s.carbon_plate : undefined,
      price_usd: typeof s.price_usd === 'number' ? s.price_usd : undefined,
      terrain: s.terrain || undefined,
      // vests
      capacity_l: typeof s.capacity_l === 'number' ? s.capacity_l : undefined,
      utmb_compliant: typeof s.utmb_compliant === 'boolean' ? s.utmb_compliant : undefined,
      soft_flask_included: typeof s.soft_flask_included === 'boolean' ? s.soft_flask_included : undefined,
      front_pockets: typeof s.front_pockets === 'number' ? s.front_pockets : undefined,
      back_pockets: typeof s.back_pockets === 'number' ? s.back_pockets : undefined,
      // gels
      carbs_per_serving_g: typeof s.carbs_per_serving_g === 'number' ? s.carbs_per_serving_g : undefined,
      sodium_mg: typeof s.sodium_mg === 'number' ? s.sodium_mg : undefined,
      caffeine_mg: typeof s.caffeine_mg === 'number' ? s.caffeine_mg : undefined,
      calories: typeof s.calories === 'number' ? s.calories : undefined,
      price_per_serving: typeof s.price_per_serving === 'number' ? s.price_per_serving : undefined,
      format: s.format || undefined,
      real_food: typeof s.real_food === 'boolean' ? s.real_food : undefined,
    };
  } catch {
    return null;
  }
}

function meetsMinSpecs(specs: ExtractedSpecs, table: string): boolean {
  if (!specs || specs.spec_confidence < 0.3) return false;
  if (table === 'shoes') {
    const fields = [specs.weight_g, specs.drop_mm, specs.price_usd, specs.discipline];
    return fields.filter(f => f != null).length >= 3;
  }
  if (table === 'vests') {
    const fields = [specs.capacity_l, specs.weight_g, specs.price_usd];
    return fields.filter(f => f != null).length >= 2;
  }
  if (table === 'gels') {
    const fields = [specs.carbs_per_serving_g, specs.caffeine_mg, specs.calories, specs.price_per_serving];
    return fields.filter(f => f != null).length >= 2;
  }
  return false;
}

// ── Phase 5: Amazon Enrichment ────────────────────────────────────

async function enrichWithAmazon(brand: string, model: string): Promise<{ asin: string; imageUrl: string; amazonUrl: string } | null> {
  try {
    const query = encodeURIComponent(`${brand} ${model}`);
    const searchHtml = await fetchHtml(`https://${AMAZON_BASE}/s?k=${query}`);

    const asinMatch = searchHtml.match(/\/dp\/(B0[A-Z0-9]{8})/);
    if (!asinMatch) return null;

    const asin = asinMatch[1];
    const productHtml = await fetchHtml(`https://${AMAZON_BASE}/dp/${asin}`);
    await sleep(1500);

    const imageMatch = productHtml.match(/"hiRes":"([^"]+)"/);
    if (imageMatch) {
      const fullUrl = imageMatch[1].replace(/\\/g, '');
      const imageId = fullUrl.split('/I/')[1]?.split('._')[0];
      if (imageId) {
        return {
          asin,
          imageUrl: `https://m.media-amazon.com/images/I/${imageId}._AC_SL1500_.jpg`,
          amazonUrl: `https://${AMAZON_BASE}/dp/${asin}?tag=${AFFILIATE_TAG}`,
        };
      }
    }

    // Fallback: extract image from search results
    const searchImage = searchHtml.match(/https:\/\/m\.media-amazon\.com\/images\/I\/[a-zA-Z0-9%._-]+\._AC_SL1500_\.jpg/);
    return {
      asin,
      imageUrl: searchImage ? searchImage[0] : '',
      amazonUrl: `https://${AMAZON_BASE}/dp/${asin}?tag=${AFFILIATE_TAG}`,
    };
  } catch {
    return null;
  }
}

// ── Phase 6: Insert + Generate Content ─────────────────────────────

async function insertProduct(
  table: 'shoes' | 'vests' | 'gels',
  v: ValidatedProduct,
  specs: ExtractedSpecs,
  imageUrl: string,
  amazonUrl: string,
): Promise<string | null> {
  const now = new Date().toISOString();
  const base: Record<string, any> = {
    brand: v.brand,
    slug: v.slug,
    our_rating: specs.our_rating,
    tagline: specs.tagline || null,
    image_url: imageUrl || null,
    amazon_url: amazonUrl || null,
    published: true,
    ai_drafted_at: now,
  };

  if (table === 'shoes') {
    Object.assign(base, {
      model: v.model,
      discipline: specs.discipline || 'trail',
      drop_mm: specs.drop_mm ?? null,
      weight_g: specs.weight_g ?? null,
      stack_heel_mm: specs.stack_heel_mm ?? null,
      stack_forefoot_mm: specs.stack_forefoot_mm ?? null,
      carbon_plate: specs.carbon_plate ?? false,
      price_usd: specs.price_usd ?? null,
      terrain: specs.terrain || null,
    });
  } else if (table === 'vests') {
    Object.assign(base, {
      model: v.model,
      capacity_l: specs.capacity_l ?? null,
      weight_g: specs.weight_g ?? null,
      price_usd: specs.price_usd ?? null,
      utmb_compliant: specs.utmb_compliant ?? false,
      soft_flask_included: specs.soft_flask_included ?? false,
      front_pockets: specs.front_pockets ?? null,
      back_pockets: specs.back_pockets ?? null,
    });
  } else {
    Object.assign(base, {
      product: v.model,
      carbs_per_serving_g: specs.carbs_per_serving_g ?? null,
      sodium_mg: specs.sodium_mg ?? null,
      caffeine_mg: specs.caffeine_mg ?? 0,
      calories: specs.calories ?? null,
      price_per_serving: specs.price_per_serving ?? null,
      format: specs.format || null,
      real_food: specs.real_food ?? false,
    });
  }

  const { data, error } = await supabase.from(table).upsert(base, { onConflict: 'slug' }).select('id').single();
  if (error) throw new Error(error.message);
  return data.id;
}

async function generateReviewForProduct(
  table: 'shoes' | 'vests' | 'gels',
  productId: string,
  brand: string,
  model: string,
  specs: ExtractedSpecs,
): Promise<string> {
  // Fetch alternatives
  const { data: alternatives } = await supabase
    .from(table)
    .select('*')
    .eq('published', true)
    .neq('id', productId)
    .order('our_rating', { ascending: false })
    .limit(3);

  // Fetch community quotes if any exist
  const { data: quotes } = await supabase
    .from('community_quotes')
    .select('source, source_url, user_handle, body, votes, sentiment')
    .eq('product_table', table)
    .eq('product_id', productId)
    .order('display_order', { ascending: true })
    .limit(5);

  // Build product object matching formatSpecs expectations
  const product: any = {
    brand,
    model,
    ...specs,
  };

  return generateReview(table, product, alternatives || [], (quotes as any) || []);
}

// Re-export of generateReview pattern (used above)
function formatSpecs(table: string, product: any): string {
  if (table === 'shoes') {
    const parts = [
      `Weight: ${product.weight_g ?? '?'}g`,
      `Drop: ${product.drop_mm ?? '?'}mm`,
      `Stack: ${product.stack_heel_mm ?? '?'}/${product.stack_forefoot_mm ?? '?'}mm`,
    ];
    if (product.carbon_plate) parts.push('Carbon plate');
    parts.push(`Price: $${product.price_usd ?? '?'}`);
    parts.push(`Rating: ${product.our_rating ?? '?'}/10`);
    return parts.join(', ');
  }
  if (table === 'vests') {
    const parts = [
      `Capacity: ${product.capacity_l ?? '?'}L`,
      `Weight: ${product.weight_g ?? '?'}g`,
      `Pockets: ${product.front_pockets ?? '?'}F/${product.back_pockets ?? '?'}B`,
    ];
    if (product.utmb_compliant) parts.push('UTMB compliant');
    if (product.soft_flask_included) parts.push('Soft flasks included');
    parts.push(`Price: $${product.price_usd ?? '?'}`);
    parts.push(`Rating: ${product.our_rating ?? '?'}/10`);
    return parts.join(', ');
  }
  if (table === 'gels') {
    const parts = [
      `Carbs: ${product.carbs_per_serving_g ?? '?'}g`,
      `Sodium: ${product.sodium_mg ?? '?'}mg`,
      `Caffeine: ${product.caffeine_mg ?? 0}mg`,
    ];
    if (product.format) parts.push(`Format: ${product.format}`);
    if (product.real_food) parts.push('Real food');
    parts.push(`Price: $${product.price_per_serving ?? '?'}/serving`);
    parts.push(`Rating: ${product.our_rating ?? '?'}/10`);
    return parts.join(', ');
  }
  return '';
}

async function generateReview(
  table: 'shoes' | 'vests' | 'gels',
  product: any,
  alternatives: any[],
  communityQuotes?: any[],
): Promise<string> {
  const specs = formatSpecs(table, product);
  const altText = alternatives
    .map((alt: any) => {
      const altSpecs = formatSpecs(table, alt);
      const name = table === 'gels' ? alt.product : alt.model;
      return `- ${alt.brand} ${name}: ${altSpecs} (Rating: ${alt.our_rating || 'N/A'}/10)`;
    })
    .join('\n');

  let communitySection = '';
  if (communityQuotes && communityQuotes.length > 0) {
    const quoteText = communityQuotes
      .map((q: any) => `"${q.body}" —${q.user_handle || 'anonymous'} via ${q.source}${q.votes ? ` (+${q.votes})` : ''}`)
      .join('\n\n');
    communitySection = `\nReal community quotes (use these in "What the Community Says"):\n${quoteText}\n`;
  } else {
    communitySection = `\nNote: This is a newly discovered product with limited community discussion. Be honest about this. Do NOT fabricate quotes.\n`;
  }

  const name = table === 'gels' ? `${product.brand} ${product.model}` : `${product.brand} ${product.model}`;

  const prompt = `You are writing a data-driven product analysis for a running gear database. No first-person review. No human tester.

Product: ${name}
Specs: ${specs}
${product.discipline ? `Discipline: ${product.discipline}` : ''}

Alternatives for comparison:
${altText}
${communitySection}
Write a 1000-1400 word analysis in Markdown. Structure: ## Overview, ## Specs Breakdown, ## What the Community Says, ## Pros, ## Cons, ## Vs Alternatives, ## Verdict.

Critical rules:
- NEVER use "I", "we", "our team", "in testing", or first-person language
- NEVER invent testing anecdotes or personal experiences
- ALWAYS attribute claims to community sources
- ALWAYS ground analysis in spec numbers
- Use short paragraphs (2-3 sentences max)
- Be genuinely critical
- No affiliate CTAs`;

  const response = await ai.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 2500,
    temperature: 0.5,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content || '';
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limitArg = args.indexOf('--limit');
  const limit = limitArg >= 0 ? parseInt(args[limitArg + 1]) : 10;
  const confIdx = args.indexOf('--min-confidence');
  const minConfidence = confIdx >= 0 ? parseFloat(args[confIdx + 1]) : 0.6;
  const srcIdx = args.indexOf('--source');
  const sourceFilter = srcIdx >= 0 ? args[srcIdx + 1] : null;

  const startTime = Date.now();
  const run: DiscoveryRun = { discovered: 0, deduplicated: 0, validated: 0, specs_extracted: 0, enriched: 0, inserted: 0, failed: 0, products: [] };

  console.log('\n🔍 RunningGearDB — Product Discovery');
  console.log(`   Limit: ${limit} · Min confidence: ${minConfidence}`);
  if (dryRun) console.log('   DRY RUN — no DB writes');
  console.log('');

  // ── Phase 1: Discovery ─────────────────────────────────────────
  console.log('── Phase 1: Discovery ──');

  let discoveries: RawDiscovery[] = [];

  if (!sourceFilter || sourceFilter === 'reddit') {
    console.log('   Searching Reddit...');
    const reddit = await discoverFromReddit();
    console.log(`   Reddit: ${reddit.length} candidates`);
    discoveries.push(...reddit);
  }

  if (!sourceFilter || sourceFilter === 'amazon') {
    console.log('   Scraping Amazon AU...');
    const amazon = await discoverFromAmazon();
    console.log(`   Amazon: ${amazon.length} candidates`);
    discoveries.push(...amazon);
  }

  // Deduplicate by slug within discoveries
  const seenSlugs = new Set<string>();
  discoveries = discoveries.filter(d => {
    const slug = slugify(d.brand, d.model);
    if (seenSlugs.has(slug)) return false;
    seenSlugs.add(slug);
    return true;
  });

  run.discovered = discoveries.length;
  console.log(`   Total unique: ${discoveries.length}\n`);

  // ── Phase 2: Deduplication ─────────────────────────────────────
  console.log('── Phase 2: Deduplication ──');
  const existing = await getExistingSlugs();
  console.log(`   ${existing.exact.size} existing slugs in DB`);

  const novel = discoveries.filter(d => {
    const slug = slugify(d.brand, d.model);
    const dup = isDuplicate(slug, existing);
    if (dup) { run.deduplicated++; return false; }
    return true;
  });
  console.log(`   ${novel.length} novel candidates\n`);

  if (novel.length === 0) {
    console.log('No new products found. Done.\n');
    return;
  }

  // Try candidates until we hit the limit of successful insertions
  const batch = novel.slice(0, limit * 3); // Over-sample since some will fail validation

  // ── Phase 3: Validation ────────────────────────────────────────
  console.log('── Phase 3: Validation ──');
  const validated: Array<{ v: ValidatedProduct; discovery: RawDiscovery }> = [];

  for (const d of batch) {
    if (validated.length >= limit * 2) break; // Got enough valid candidates
    process.stdout.write(`   ${d.raw_name} ... `);
    await sleep(DELAY);
    const v = await validateProduct(d);
    if (v && v.confidence >= minConfidence) {
      run.validated++;
      validated.push({ v, discovery: d });
      console.log(`✓ ${v.table} (${(v.confidence * 100).toFixed(0)}%)`);
    } else {
      console.log(v ? `✗ low confidence (${(v.confidence * 100).toFixed(0)}%)` : '✗ not a real product');
    }
  }
  console.log(`   ${run.validated} validated, ${run.failed} rejected\n`);

  // ── Phase 4: Spec Extraction ───────────────────────────────────
  console.log('── Phase 4: Spec Extraction ──');
  const pendingReview: any[] = [];
  const withSpecs: Array<{ v: ValidatedProduct; discovery: RawDiscovery; specs: ExtractedSpecs }> = [];

  for (const { v, discovery } of validated) {
    if (run.inserted + withSpecs.length >= limit) break; // Stop at limit
    process.stdout.write(`   ${v.brand} ${v.model} ... `);
    await sleep(DELAY);
    const specs = await extractSpecs(v);
    if (specs && meetsMinSpecs(specs, v.table)) {
      run.specs_extracted++;
      withSpecs.push({ v, discovery, specs });
      console.log(`✓ ${(specs.spec_confidence * 100).toFixed(0)}% spec coverage · rating ${specs.our_rating}/10`);
    } else if (specs) {
      console.log(`⚠ low spec coverage (${(specs.spec_confidence * 100).toFixed(0)}%) — queued for review`);
      pendingReview.push({ v, discovery, specs, reason: 'low spec coverage' });
    } else {
      run.failed++;
      console.log('✗ extraction failed');
    }
  }
  console.log(`   ${run.specs_extracted} with specs\n`);

  // ── Phase 5: Amazon Enrichment ─────────────────────────────────
  console.log('── Phase 5: Amazon Enrichment ──');
  const enriched: Array<{ v: ValidatedProduct; specs: ExtractedSpecs; imageUrl: string; amazonUrl: string }> = [];

  for (const { v, specs } of withSpecs) {
    process.stdout.write(`   ${v.brand} ${v.model} ... `);
    await sleep(DELAY);
    const result = await enrichWithAmazon(v.brand, v.model);
    if (result && result.asin) {
      run.enriched++;
      enriched.push({ v, specs, imageUrl: result.imageUrl, amazonUrl: result.amazonUrl });
      console.log(`✓ ${result.asin}`);
    } else {
      // Still proceed — just without Amazon data
      enriched.push({ v, specs, imageUrl: '', amazonUrl: `https://${AMAZON_BASE}/s?k=${encodeURIComponent(v.brand + ' ' + v.model)}&tag=${AFFILIATE_TAG}` });
      console.log('⚠ no Amazon match');
    }
  }
  console.log(`   ${run.enriched} enriched\n`);

  // ── Phase 6: Insert + Generate ─────────────────────────────────
  console.log(`── Phase 6: ${dryRun ? 'Dry Run (no writes)' : 'Insertion + Review Generation'} ──`);

  for (const { v, specs, imageUrl, amazonUrl } of enriched) {
    if (run.inserted >= limit) break; // Hit the insertion limit
    const label = `${v.brand} ${v.model}`;
    process.stdout.write(`   ${label} ... `);

    if (dryRun) {
      console.log(`would insert as ${v.table}/${v.slug} · rating ${specs.our_rating}/10`);
      run.inserted++;
      run.products.push({ slug: v.slug, table: v.table, brand: v.brand, model: v.model, source: 'discovery' });
      continue;
    }

    try {
      const productId = await insertProduct(v.table, v, specs, imageUrl, amazonUrl);
      if (!productId) { run.failed++; console.log('✗ insert failed'); continue; }

      console.log('generating review...');
      await sleep(DELAY);

      const review = await generateReviewForProduct(v.table, productId, v.brand, v.model, specs);
      const now = new Date().toISOString();
      await supabase.from(v.table).update({
        review_content: review,
        review_generated_at: now,
        ai_drafted_at: now,
      }).eq('id', productId);

      // Changelog
      await supabase.from('changelog').insert({
        kind: 'add',
        product_table: v.table,
        product_id: productId,
        summary: `Auto-discovered: ${label} (confidence: ${(v.confidence * 100).toFixed(0)}%)`,
        actor: 'script/discover-products',
      });

      run.inserted++;
      run.products.push({ slug: v.slug, table: v.table, brand: v.brand, model: v.model, source: 'discovery' });
      console.log('✓ done');
    } catch (err: any) {
      run.failed++;
      console.log(`✗ ${err.message}`);
    }
  }

  // ── Summary ────────────────────────────────────────────────────
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  // Write pending review file if anything queued
  if (pendingReview.length > 0) {
    const dir = path.resolve('data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'pending-review.json'), JSON.stringify(pendingReview.map(p => ({
      brand: p.v.brand,
      model: p.v.model,
      table: p.v.table,
      slug: p.v.slug,
      confidence: p.v.confidence,
      specCoverage: p.specs?.spec_confidence,
      reason: p.reason,
    })), null, 2));
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`   Done in ${elapsed} min`);
  console.log(`   Discovered: ${run.discovered}`);
  console.log(`   Duplicates: ${run.deduplicated}`);
  console.log(`   Validated: ${run.validated}`);
  console.log(`   Specs extracted: ${run.specs_extracted}`);
  console.log(`   Amazon enriched: ${run.enriched}`);
  console.log(`   Inserted: ${run.inserted}`);
  console.log(`   Failed: ${run.failed}`);
  if (pendingReview.length > 0) {
    console.log(`   Pending review: ${pendingReview.length} → data/pending-review.json`);
  }
  if (run.products.length > 0) {
    console.log(`\n   New products:`);
    for (const p of run.products) {
      console.log(`   · ${p.brand} ${p.model} (${p.table}/${p.slug})`);
    }
  }
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);
