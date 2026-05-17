/**
 * Regenerates comparison blog posts with proper markdown tables.
 * Usage: npx tsx scripts/generate-tables.ts
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

const updates = [
  {
    slug: 'best-trail-running-shoes-2026',
    tablePrompt: `Regenerate the blog post for "${'Best Trail Running Shoes 2026: Specs Compared'}".
The new version MUST include a comparison table like this:

| Shoe | Weight | Drop | Stack | Price | Rating | Best For |
|------|--------|------|-------|-------|--------|----------|
| HOKA Speedgoat 6 | 228g | 7mm | 38/31mm | $145 | 4.8/5 | Technical terrain |
| Salomon Sense Ride 5 | 240g | 8mm | 32/24mm | $130 | 4.6/5 | Long ultras |
| Nike Pegasus Trail 5 | 244g | 10mm | 37/27mm | $120 | 4.4/5 | Budget all-arounder |
| Brooks Cascadia 17 | 248g | 10mm | — | $140 | 4.5/5 | Rocky terrain |
| HOKA Tecton X 3 | 226g | 5mm | — | $275 | 4.9/5 | Carbon-plated racing |

Keep the same structure, keywords, and SEO focus. Add the table early in the post. Keep the rest of the content similar in length and quality. Format in Markdown.`,
  },
  {
    slug: 'maurten-precision-fuel-sis-gel-comparison',
    tablePrompt: `Regenerate the blog post for "${'Maurten vs Precision Fuel vs SiS: Gel Data Compared'}".
The new version MUST include a comparison table like this:

| Brand | Product | Carbs | Caffeine | Sodium | Price/serve | Rating |
|-------|---------|-------|----------|--------|-------------|--------|
| Maurten | Gel 100 | 25g | 0mg | 0mg | $3.50 | 4.8/5 |
| Maurten | Gel 100 Caf 100 | 25g | 100mg | 0mg | $3.80 | 4.7/5 |
| Precision Fuel | PF 30 Gel | 30g | 0mg | 0mg | $3.00 | 4.7/5 |
| Precision Fuel | PF 30 Caf | 30g | 75mg | 0mg | $3.20 | 4.6/5 |
| SiS | Go Isotonic | 22g | 0mg | 0mg | $2.50 | 4.3/5 |
| SiS | Go Isotonic + Caf | 22g | 75mg | 0mg | $2.80 | 4.4/5 |
| GU | Roctane Gel | 21g | 35mg | 125mg | $2.50 | 4.4/5 |

Keep the same structure, keywords, and SEO focus. Add the table early. Format in Markdown.`,
  },
  {
    slug: 'real-food-running-gels-comparison',
    tablePrompt: `Regenerate the blog post for "${'Real Food Running Gels: Spring Energy vs Huma vs Honeystinger'}".
The new version MUST include a comparison table like this:

| Brand | Product | Carbs | Caffeine | Real Food | Price/serve | Rating |
|-------|---------|-------|----------|-----------|-------------|--------|
| Spring Energy | Awesome Sauce | 25g | 0mg | Yes | $5.50 | 4.6/5 |
| Spring Energy | Energy Bar | 40g | 0mg | Yes | $5.00 | 4.5/5 |
| Huma | Chia Gel | 21g | 0mg | Yes | $2.80 | 4.2/5 |
| Huma | Chia Gel + Caf | 21g | 25mg | Yes | $2.80 | 4.3/5 |
| Huma | Chia Gel Plus | 22g | 50mg | Yes | $3.20 | 4.4/5 |
| Honey Stinger | Organic Gel | 24g | 0mg | Yes | $2.50 | 4.1/5 |

Keep the same structure, keywords, and SEO focus. Add the table early. Format in Markdown.`,
  },
];

async function main() {
  console.log('Regenerating posts with tables...\n');

  for (const update of updates) {
    console.log(`  ${update.slug}...`);

    try {
      const response = await ai.chat.completions.create({
        model: 'deepseek-chat',
        max_tokens: 2800,
        temperature: 0.7,
        messages: [{ role: 'user', content: update.tablePrompt }],
      });

      const content = response.choices[0].message.content;
      if (!content) {
        console.log('    ✗ empty response');
        continue;
      }

      const { error } = await supabase
        .from('blog_posts')
        .update({ content })
        .eq('slug', update.slug);

      if (error) {
        console.log(`    ✗ ${error.message}`);
      } else {
        console.log(`    ✓ ${content.length} chars`);
      }
    } catch (err: any) {
      console.log(`    ✗ ${err.message}`);
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  console.log('\nDone.');
}

main();
