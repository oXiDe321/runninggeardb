/**
 * Batch Product Review Generator
 * Generates AI reviews for all products missing review_content.
 * Pulls real community quotes from the community_quotes table.
 *
 * Usage:
 *   npx tsx scripts/generate-reviews.ts [--table shoes|vests|gels] [--limit N] [--dry-run]
 *
 * Process:
 *   1. Fetch products without reviews
 *   2. Fetch community quotes for each product
 *   3. Fetch top 3 alternatives by rating
 *   4. Generate review via DeepSeek with community data injected
 *   5. Save review_content to the product table
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import type { CommunityQuote } from '../lib/deepseek.js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const ai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

// ── Config ────────────────────────────────────────────────────────

const DELAY_MS = 3000; // between generations

// ── formatSpecs (mirrors lib/deepseek.ts) ─────────────────────────

function formatSpecs(table: string, product: any): string {
  if (table === 'shoes') {
    const parts = [
      `Weight: ${product.weight_g ?? '?'}g`,
      `Drop: ${product.drop_mm ?? '?'}mm`,
      `Stack: ${product.stack_heel_mm ?? '?'}/${product.stack_forefoot_mm ?? '?'}mm`,
    ];
    if (product.lug_depth_mm != null) parts.push(`Lugs: ${product.lug_depth_mm}mm`);
    if (product.carbon_plate) parts.push('Carbon plate');
    if (product.rock_plate) parts.push('Rock plate');
    parts.push(`Price: $${product.price_usd ?? '?'}`);
    parts.push(`Rating: ${product.our_rating ?? '?'}/5`);
    return parts.join(', ');
  }
  if (table === 'vests') {
    const parts = [
      `Capacity: ${product.capacity_l ?? '?'}L`,
      `Weight: ${product.weight_g ?? '?'}g`,
      `Pockets: ${product.front_pockets ?? '?'}F/${product.back_pockets ?? '?'}B`,
    ];
    if (product.utmb_compliant) parts.push('UTMB compliant');
    if (product.itra_compliant) parts.push('ITRA compliant');
    if (product.soft_flask_included) parts.push('Soft flasks included');
    if (product.chest_strap_adjustable) parts.push('Adjustable chest strap');
    parts.push(`Price: $${product.price_usd ?? '?'}`);
    parts.push(`Rating: ${product.our_rating ?? '?'}/5`);
    return parts.join(', ');
  }
  if (table === 'gels') {
    const parts = [
      `Carbs: ${product.carbs_per_serving_g ?? '?'}g`,
      `Sodium: ${product.sodium_mg ?? '?'}mg`,
      `Caffeine: ${product.caffeine_mg ?? 0}mg`,
    ];
    if (product.format) parts.push(`Format: ${product.format}`);
    if (product.real_food) parts.push('Real food ingredients');
    if (product.fodmap_friendly) parts.push('FODMAP friendly');
    parts.push(`Price: $${product.price_per_serving ?? '?'}/serving`);
    parts.push(`Rating: ${product.our_rating ?? '?'}/5`);
    return parts.join(', ');
  }
  return '';
}

// ── Prompt builder ────────────────────────────────────────────────

function buildPrompt(
  product: any,
  table: string,
  alternatives: any[],
  communityQuotes: CommunityQuote[],
): string {
  const specs = formatSpecs(table, product);
  const altText = alternatives
    .map((alt: any) => {
      const altSpecs = formatSpecs(table, alt);
      const model = table === 'gels' ? alt.product : alt.model;
      return `- ${alt.brand} ${model}: ${altSpecs} (Rating: ${alt.our_rating || 'N/A'}/5)`;
    })
    .join('\n');

  let communitySection = '';
  if (communityQuotes.length > 0) {
    const quoteText = communityQuotes
      .map(q => `"${q.body}" —${q.user_handle || 'anonymous'} via ${q.source}${q.votes ? ` (+${q.votes})` : ''}`)
      .join('\n\n');
    communitySection = `
Real community quotes about this product (use these in your "What the Community Says" section):
${quoteText}

When referencing these quotes, cite them naturally: "As one ${communityQuotes[0]?.source || 'Reddit'} user put it..."
`;
  } else {
    communitySection = `
Note: Limited community discussion was found for this specific product. In "What the Community Says", focus on general consensus from your training data. If discussion is genuinely sparse, be honest about it — do NOT fabricate quotes.
`;
  }

  const name = table === 'gels'
    ? `${product.brand} ${product.product}`
    : `${product.brand} ${product.model}`;

  return `You are writing a data-driven product analysis for a running gear database. This is NOT a first-person review. There is no human tester.

Product: ${name}
Specs: ${specs}
${product.discipline ? `Discipline: ${product.discipline}` : ''}
${product.terrain ? `Terrain: ${product.terrain}` : ''}
${product.distance_sweet_spot ? `Distance sweet spot: ${product.distance_sweet_spot}` : ''}

Alternatives for comparison:
${altText}
${communitySection}
Write a 1000-1400 word analysis in Markdown. Use this exact structure:

## Overview
2-3 sentences. What this product is, where it sits in the market, what type of runner it targets.

## Specs Breakdown
Walk through the key numbers and what they mean. Compare each spec to category norms. Be precise and quantitative.

## What the Community Says
Synthesize consensus from online running communities (Reddit, forums, YouTube). If real quotes were provided, use them directly. If discussion is sparse, be honest about that.

## Pros
4-6 bullet points. Use + as bullet marker. List spec advantages AND community-verified strengths.

## Cons
4-6 bullet points. Use + as bullet marker. List spec trade-offs AND recurring community complaints. Be genuinely critical.

## Vs Alternatives
Direct numerical comparisons with the alternatives listed. Present trade-offs.

## Verdict
3-4 sentences. Who this product suits, who should skip it.

Critical rules:
- NEVER use "I", "we", "our team", "in testing", or first-person language
- NEVER invent testing anecdotes or personal experiences
- ALWAYS attribute experiential claims to community sources
- ALWAYS ground analysis in spec numbers
- Use short paragraphs (2-3 sentences max)
- No affiliate CTAs`;
}

// ── Generate one review ───────────────────────────────────────────

async function generateOneReview(
  product: any,
  table: string,
): Promise<string | null> {
  // 1. Fetch community quotes
  const { data: quotes } = await supabase
    .from('community_quotes')
    .select('source, source_url, user_handle, body, votes, sentiment')
    .eq('product_table', table)
    .eq('product_id', product.id)
    .order('display_order', { ascending: true })
    .limit(5);

  // 2. Fetch alternatives (same table, highest rated, not this product)
  const { data: alternatives } = await supabase
    .from(table)
    .select('*')
    .eq('published', true)
    .neq('id', product.id)
    .order('our_rating', { ascending: false })
    .limit(3);

  // 3. Build prompt & generate
  const prompt = buildPrompt(product, table, alternatives || [], (quotes as CommunityQuote[]) || []);

  const response = await ai.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 2500,
    temperature: 0.5,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content || null;
}

// ── Main ──────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const args = process.argv.slice(2);
  const tableIdx = args.indexOf('--table');
  const tableArg = tableIdx >= 0 ? args[tableIdx + 1] : null;
  const limitIdx = args.indexOf('--limit');
  const limitArg = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : 0;
  const dryRun = args.includes('--dry-run');

  const tables = tableArg ? [tableArg] : ['shoes', 'gels', 'vests'];
  if (!tables.every(t => ['shoes', 'vests', 'gels'].includes(t))) {
    console.log('Usage: npx tsx scripts/generate-reviews.ts [--table shoes|vests|gels] [--limit N] [--dry-run]');
    process.exit(1);
  }

  console.log(`\n📝 RunningGearDB — Batch Review Generator`);
  console.log(`   Tables: ${tables.join(', ')}`);
  console.log(`   Model: deepseek-chat`);
  if (dryRun) console.log(`   DRY RUN — won't save to DB\n`);
  else console.log('');

  const startTime = Date.now();
  let generated = 0;
  let failed = 0;
  let skipped = 0;

  for (const table of tables) {
    console.log(`\n── ${table.toUpperCase()} ──`);

    const nameCol = table === 'gels' ? 'product' : 'model';

    let query = supabase
      .from(table)
      .select('*')
      .eq('published', true)
      .or(`review_content.is.null,review_content.eq.""`)
      .order('our_rating', { ascending: false });

    if (limitArg) query = query.limit(limitArg);

    const { data: products, error } = await query;
    if (error) { console.log(`   Error: ${error.message}`); continue; }
    if (!products || products.length === 0) {
      console.log('   All products have reviews. Nothing to do.');
      continue;
    }

    console.log(`   ${products.length} products need reviews\n`);

    for (const p of products) {
      const name = table === 'gels'
        ? `${p.brand} ${p.product}`
        : `${p.brand} ${p.model}`;

      const idx = products.indexOf(p) + 1;
      process.stdout.write(`   [${idx}/${products.length}] ${name} ... `);

      try {
        const content = await generateOneReview(p, table);

        if (!content) {
          failed++;
          console.log('empty response');
          continue;
        }

        if (!dryRun) {
          const { error: updateError } = await supabase
            .from(table)
            .update({
              review_content: content,
              review_generated_at: new Date().toISOString(),
              ai_drafted_at: new Date().toISOString(),
            })
            .eq('id', p.id);

          if (updateError) {
            failed++;
            console.log(`DB error: ${updateError.message}`);
            continue;
          }
        }

        generated++;
        const wc = content.split(/\s+/).length;
        console.log(`${wc} words${dryRun ? ' (dry-run)' : ' ✓'}`);
      } catch (err: any) {
        failed++;
        console.log(`error: ${err.message}`);
      }

      await sleep(DELAY_MS);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`   Done in ${elapsed} min`);
  console.log(`   Reviews generated: ${generated}`);
  console.log(`   Failed: ${failed}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);
