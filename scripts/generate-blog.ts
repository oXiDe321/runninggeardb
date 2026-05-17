/**
 * SEO Blog Generator — generates blog posts via DeepSeek and saves to Supabase.
 * Usage: npx tsx scripts/generate-blog.ts
 *
 * Each post targets specific long-tail keywords, includes structured data
 * patterns, and links to category pages for internal linking SEO.
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

const ai = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

// ── SEO Blog Post Briefs ────────────────────────────────
// Each targets specific high-intent running gear keywords

const briefs = [
  {
    title: 'Best Trail Running Shoes 2026: Specs Compared',
    slug: 'best-trail-running-shoes-2026',
    category: 'comparison',
    keywords: ['best trail running shoes 2026', 'trail running shoe comparison', 'trail shoe specs'],
    excerpt: 'Data-driven comparison of the top trail running shoes for 2026. Compare drop, weight, stack height, and price across HOKA, Salomon, Nike, and more.',
  },
  {
    title: 'How to Choose Trail Running Shoes: A Specs-First Guide',
    slug: 'how-to-choose-trail-running-shoes',
    category: 'guide',
    keywords: ['how to choose trail running shoes', 'trail shoe buying guide', 'running shoe drop explained'],
    excerpt: 'Drop, stack, lug depth, rock plate — understand every spec before you buy. A data-first approach to choosing your next trail shoe.',
  },
  {
    title: 'UTMB Mandatory Kit: Vests, Packs, and What You Actually Need',
    slug: 'utmb-mandatory-kit-vests-packs',
    category: 'race',
    keywords: ['UTMB mandatory kit', 'UTMB vest requirements', 'ultra running pack guide'],
    excerpt: 'What UTMB actually requires for your race vest. Capacity minimums, pocket counts, and which packs pass inspection.',
  },
  {
    title: 'Running Nutrition Guide: Gels vs Chews vs Drinks',
    slug: 'running-nutrition-gels-chews-drinks',
    category: 'nutrition',
    keywords: ['running nutrition guide', 'best running gels', 'running fuel comparison'],
    excerpt: 'Carbs per hour, sodium needs, caffeine timing — compare gels, chews, and drinks by the numbers. Find what works for your race distance.',
  },
  {
    title: 'Carbon Plate Trail Shoes: Worth It for Ultra Running?',
    slug: 'carbon-plate-trail-shoes-ultra-running',
    category: 'comparison',
    keywords: ['carbon plate trail shoes', 'carbon fiber trail running shoes', 'HOKA Tecton X vs Nike Ultrafly'],
    excerpt: 'Analyzing the data on carbon plate trail shoes. Weight penalty, responsiveness gains, and which ultras they actually help.',
  },
  {
    title: 'Hyrox Shoe Guide: Best Shoes for Every Station',
    slug: 'hyrox-shoe-guide-best-for-every-station',
    category: 'guide',
    keywords: ['Hyrox shoes', 'best shoes for Hyrox', 'Hyrox running shoe guide'],
    excerpt: 'Hyrox demands running speed AND gym stability. Compare the best shoes for sled pushes, lunges, and the 1km run laps.',
  },
  {
    title: 'Real Food Running Gels: Spring Energy vs Huma vs Honeystinger',
    slug: 'real-food-running-gels-comparison',
    category: 'comparison',
    keywords: ['real food running gels', 'natural energy gels', 'Spring Energy vs Huma'],
    excerpt: 'Not all gels are synthetic. Compare real-food options — ingredients, carbs per serving, and which sit best in your stomach.',
  },
  {
    title: 'Parkrun Shoe Guide: Best 5K Racing and Training Shoes',
    slug: 'parkrun-shoe-guide-5k-racing',
    category: 'guide',
    keywords: ['parkrun shoes', 'best 5K running shoes', 'parkrun racing shoes'],
    excerpt: 'Every Saturday. 5 kilometers. The right shoe makes a difference. Compare lightweight racers and daily trainers for parkrun.',
  },
  {
    title: 'Trail Running Vest Capacity Guide: 5L to 15L Explained',
    slug: 'trail-running-vest-capacity-guide',
    category: 'guide',
    keywords: ['trail running vest capacity', 'running vest size guide', 'how much capacity for ultra'],
    excerpt: '5L for short runs, 12L+ for 100-milers. Understand vest capacity by race distance, mandatory kit requirements, and personal preference.',
  },
  {
    title: 'Maurten vs Precision Fuel vs SiS: Gel Data Compared',
    slug: 'maurten-precision-fuel-sis-gel-comparison',
    category: 'comparison',
    keywords: ['Maurten vs Precision Fuel', 'best running gel comparison', 'Maurten hydrogel review'],
    excerpt: 'Side-by-side comparison of the three most popular gel brands. Carbs, sodium, caffeine, price per serving, and real-world tolerance.',
  },
];

// ── Generate ────────────────────────────────────────────

async function generatePost(brief: typeof briefs[0]) {
  const prompt = `Write a comprehensive SEO-optimized blog post for runninggeardb.com.

Title: "${brief.title}"
Target Keywords: ${brief.keywords.join(', ')}
Category: ${brief.category}
Excerpt: ${brief.excerpt}

Requirements:
- 1200-1800 words
- Use "${brief.keywords[0]}" naturally in the first 100 words
- Include 3-5 H2 subheadings with keyword variations
- Reference specific product specs from shoes, vests, or gels tables (brand/model names, weights, drops, prices)
- Include at least one comparison data point (e.g., "The HOKA Speedgoat 6 at 228g is Xg lighter than...")
- End with 2-3 internal links to category pages (/shoes, /vests, /gels)
- Use short paragraphs (2-3 sentences max)
- Conversational but authoritative tone
- Format in Markdown with ## for H2, ### for H3

Important: Do not include the title as an H1. The title is already rendered by the page template. Start with the first H2 section.

Write the post now:`;

  console.log(`  Generating: ${brief.title}...`);

  const response = await ai.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 2500,
    temperature: 0.7,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content || '';
}

async function main() {
  console.log(`Generating ${briefs.length} blog posts...\n`);

  for (const brief of briefs) {
    // Check if post already exists
    const { data: existing } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', brief.slug)
      .single();

    if (existing) {
      console.log(`  ✓ ${brief.slug} (already exists)`);
      continue;
    }

    try {
      const content = await generatePost(brief);

      if (!content) {
        console.log(`  ✗ ${brief.slug}: empty response`);
        continue;
      }

      const { error } = await supabase.from('blog_posts').upsert({
        title: brief.title,
        slug: brief.slug,
        excerpt: brief.excerpt,
        content,
        category: brief.category,
        published: true,
        published_at: new Date().toISOString(),
      }, { onConflict: 'slug' });

      if (error) {
        console.log(`  ✗ ${brief.slug}: ${error.message}`);
      } else {
        console.log(`  ✓ ${brief.slug} (${content.length} chars)`);
      }
    } catch (err: any) {
      console.log(`  ✗ ${brief.slug}: ${err.message}`);
    }

    // Rate limit
    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log('\nDone. Blog posts generated.');
}

main();
