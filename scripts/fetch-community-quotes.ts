/**
 * Fetch Community Quotes — searches Reddit via old.reddit.com HTML pages
 * (the JSON API requires OAuth now, but HTML pages are open) and extracts
 * real user quotes for each product.
 *
 * Usage:
 *   npx tsx scripts/fetch-community-quotes.ts [--table shoes|vests|gels] [--limit N] [--dry-run]
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } },
);

// ── Config ────────────────────────────────────────────────────────

const SUBREDDITS_BY_TYPE: Record<string, string[]> = {
  shoes: ['trailrunning', 'RunningShoeGeeks', 'running'],
  vests: ['trailrunning', 'ultrarunning', 'running'],
  gels: ['running', 'ultrarunning', 'trailrunning'],
};

const MIN_QUOTE_LENGTH = 80;
const MAX_QUOTES_PER_PRODUCT = 5;
const DELAY_MS = 2000;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml',
  'Accept-Language': 'en-US,en;q=0.9',
};

// ── Types ─────────────────────────────────────────────────────────

interface QuoteInput {
  product_table: string;
  product_id: string;
  source: string;
  source_url: string;
  user_handle: string;
  body: string;
  votes: string;
  sentiment: number | null;
  display_order: number;
}

// ── HTML scraping helpers ─────────────────────────────────────────

function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.text();
}

/** Extract Reddit thread links from a subreddit search results page */
function parseSearchResults(html: string, subreddit: string): Array<{
  permalink: string;
  title: string;
  score: number;
  numComments: number;
}> {
  const results: Array<{ permalink: string; title: string; score: number; numComments: number }> = [];

  // old.reddit.com search results have a consistent structure.
  // Each result is a div with class "search-result"
  const resultRegex = /<div class="search-result"[^>]*>([\s\S]*?)<\/div>\s*<(?:div|\/div)/gi;
  let match;
  while ((match = resultRegex.exec(html)) !== null) {
    const block = match[1];

    // Extract permalink: <a class="search-link" href="/r/.../comments/.../">
    const linkMatch = block.match(/<a[^>]*class="[^"]*search-link[^"]*"[^>]*href="(\/r\/[^"]+)"/);
    if (!linkMatch) continue;

    // Extract title: <a class="search-title" ...>TITLE</a>
    const titleMatch = block.match(/<a[^>]*class="[^"]*search-title[^"]*"[^>]*>([\s\S]*?)<\/a>/);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    // Skip posts that are clearly not reviews/discussions
    const skipWords = ['weekly', 'megathread', 'daily', 'general discussion', 'what are you wearing'];
    if (skipWords.some(w => title.toLowerCase().includes(w))) continue;

    // Extract score
    const scoreMatch = block.match(/<span class="search-score"[^>]*>(\d+)\s*points?<\/span>/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    // Extract comment count
    const commentsMatch = block.match(/<a[^>]*class="[^"]*search-comments[^"]*"[^>]*>(\d+)\s*comments?<\/a>/i);
    const numComments = commentsMatch ? parseInt(commentsMatch[1]) : 0;

    results.push({
      permalink: linkMatch[1],
      title,
      score,
      numComments,
    });
  }

  return results;
}

/** Extract comments from an old.reddit.com thread page */
function extractComments(html: string): Array<{ body: string; score: number; author: string; permalink: string }> {
  const comments: Array<{ body: string; score: number; author: string; permalink: string }> = [];

  // Each top-level comment is in a div with class "entry unvoted" or "entry likes/dislikes"
  const entryRegex = /<div class="entry\s+(?:unvoted|likes|dislikes)"[^>]*>([\s\S]*?)<\/div>\s*<div class="child/gi;
  let match;
  while ((match = entryRegex.exec(html)) !== null) {
    const block = match[1];

    // Extract author
    const authorMatch = block.match(/<a[^>]*class="[^"]*author[^"]*"[^>]*>([^<]+)<\/a>/);
    const author = authorMatch ? authorMatch[1].trim() : '[deleted]';

    // Extract score
    const scoreMatch = block.match(/<span class="score[^"]*"[^>]*>(\d+)\s*points?<\/span>/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 0;

    // Extract permalink
    const permalinkMatch = block.match(/<a[^>]*class="[^"]*bylink[^"]*"[^>]*href="([^"]+)"/);
    const permalink = permalinkMatch ? permalinkMatch[1] : '';

    // Extract comment body (the actual text content inside the usertext div)
    const bodyMatch = block.match(/<div class="usertext-body[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/form/);
    if (!bodyMatch) continue;

    let body = bodyMatch[1]
      .replace(/<p>/g, '\n')
      .replace(/<\/p>/g, '')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .trim();

    // Clean up excessive whitespace
    body = body.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ');

    comments.push({ body, score, author, permalink });
  }

  return comments;
}

// ── Quality filters ────────────────────────────────────────────────

function isQualityQuote(body: string): boolean {
  if (body === '[deleted]' || body === '[removed]' || body === '') return false;

  const botPhrases = ['TL;DR:', 'TLDW:', 'I am a bot', 'beep boop', '/u/', 'r/'];
  if (botPhrases.some(p => body.includes(p))) return false;

  const clean = body.replace(/\s+/g, ' ').trim();
  if (clean.length < MIN_QUOTE_LENGTH) return false;
  if (clean.startsWith('http') && clean.split(' ').length <= 3) return false;

  // Skip comments that are mostly quoting someone else
  const quoteLines = (clean.match(/^>.*$/gm) ?? []).join('').length;
  if (quoteLines > clean.length * 0.5) return false;

  return true;
}

function basicSentiment(body: string): number | null {
  const pos = [
    'love', 'best', 'great', 'excellent', 'favorite', 'perfect', 'amazing',
    'recommend', 'outstanding', 'fantastic', 'impressed', 'good', 'solid',
  ];
  const neg = [
    'disappointed', 'worst', 'terrible', 'awful', 'garbage', 'return',
    'waste', 'avoid', 'regret', 'overrated', 'uncomfortable', 'bad', 'poor',
    'blister', 'issue', 'problem', 'rip', 'tore', 'fell apart',
  ];
  const lower = body.toLowerCase();
  let score = 0;
  for (const w of pos) if (lower.includes(w)) score += 1;
  for (const w of neg) if (lower.includes(w)) score -= 1;
  if (score === 0) return null;
  return Math.max(-1, Math.min(1, score / Math.max(1, Math.abs(score))));
}

// ── Per-product research ──────────────────────────────────────────

async function fetchQuotesForProduct(
  product: any,
  productTable: string,
  subreddits: string[],
): Promise<QuoteInput[]> {
  const name = productTable === 'gels'
    ? `${product.brand} ${product.product}`
    : `${product.brand} ${product.model}`;

  const allQuotes: QuoteInput[] = [];
  const seenUrls = new Set<string>();
  let displayOrder = 0;

  for (const sub of subreddits) {
    if (allQuotes.length >= MAX_QUOTES_PER_PRODUCT) break;

    await sleep(DELAY_MS);

    try {
      const searchUrl = `https://old.reddit.com/r/${sub}/search?q=${encodeURIComponent(name)}&restrict_sr=on&sort=relevance`;
      const html = await fetchHtml(searchUrl);
      const results = parseSearchResults(html, sub);

      // Filter: skip threads with no discussion
      const relevant = results.filter(r => r.numComments > 1);

      for (const thread of relevant.slice(0, 3)) {
        if (allQuotes.length >= MAX_QUOTES_PER_PRODUCT) break;

        await sleep(DELAY_MS * 0.5);

        try {
          const threadHtml = await fetchHtml(`https://old.reddit.com${thread.permalink}?limit=50`);
          const comments = extractComments(threadHtml);

          // Filter comments that mention the brand or product name
          const brandLower = product.brand.toLowerCase();
          const nameWords = name.toLowerCase().split(' ').filter((w: string) => w.length > 2);

          for (const c of comments) {
            if (allQuotes.length >= MAX_QUOTES_PER_PRODUCT) break;
            if (!isQualityQuote(c.body)) continue;
            if (c.score < 2) continue;

            const bodyLower = c.body.toLowerCase();
            const mentionsProduct = bodyLower.includes(brandLower) ||
              nameWords.some((w: string) => bodyLower.includes(w));

            if (!mentionsProduct) continue;

            const sourceUrl = `https://www.reddit.com${c.permalink}`;
            if (seenUrls.has(sourceUrl)) continue;
            seenUrls.add(sourceUrl);

            let display = c.body.replace(/\s+/g, ' ').trim();
            if (display.length > 500) display = display.slice(0, 497) + '...';

            allQuotes.push({
              product_table: productTable,
              product_id: product.id,
              source: `r/${sub}`,
              source_url: sourceUrl,
              user_handle: c.author !== '[deleted]' ? `u/${c.author}` : 'deleted',
              body: display,
              votes: String(c.score),
              sentiment: basicSentiment(display),
              display_order: displayOrder++,
            });
          }
        } catch {
          // Thread fetch failed — skip
        }
      }
    } catch {
      // Search failed — skip this subreddit
    }
  }

  return allQuotes.slice(0, MAX_QUOTES_PER_PRODUCT);
}

// ── Storage ───────────────────────────────────────────────────────

async function clearExistingQuotes(productTable: string, productId: string) {
  await supabase
    .from('community_quotes')
    .delete()
    .eq('product_table', productTable)
    .eq('product_id', productId);
}

async function storeQuotes(quotes: QuoteInput[]): Promise<number> {
  if (quotes.length === 0) return 0;

  const { error } = await supabase.from('community_quotes').upsert(
    quotes.map(q => ({
      product_table: q.product_table,
      product_id: q.product_id,
      source: q.source,
      source_url: q.source_url,
      user_handle: q.user_handle,
      body: q.body,
      votes: q.votes,
      sentiment: q.sentiment,
      display_order: q.display_order,
      captured_at: new Date().toISOString(),
    })),
    { onConflict: 'product_table,product_id,source_url' },
  );

  if (error) {
    console.log(`    ⚠ DB error: ${error.message}`);
    return 0;
  }
  return quotes.length;
}

// ── Main ──────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const tableIdx = args.indexOf('--table');
  const tableArg = tableIdx >= 0 ? args[tableIdx + 1] : null;
  const limitIdx = args.indexOf('--limit');
  const limitArg = limitIdx >= 0 ? parseInt(args[limitIdx + 1]) : 0;
  const dryRun = args.includes('--dry-run');

  const tables = tableArg ? [tableArg] : ['shoes', 'gels', 'vests'];
  if (!tables.every(t => ['shoes', 'vests', 'gels'].includes(t))) {
    console.log('Usage: npx tsx scripts/fetch-community-quotes.ts [--table shoes|vests|gels] [--limit N] [--dry-run]');
    process.exit(1);
  }

  console.log(`\n🔍 RunningGearDB — Community Quote Fetcher (old.reddit.com scraper)`);
  console.log(`   Tables: ${tables.join(', ')}`);
  console.log(`   Max quotes per product: ${MAX_QUOTES_PER_PRODUCT}`);
  if (dryRun) console.log(`   DRY RUN — no DB writes\n`);
  else console.log('');

  let processed = 0, found = 0, totalQuotes = 0, skipped = 0;
  const startTime = Date.now();

  for (const table of tables) {
    const subreddits = SUBREDDITS_BY_TYPE[table];
    console.log(`\n── ${table.toUpperCase()} ──`);

    const selectCols = table === 'gels'
      ? 'id, brand, product, slug'
      : 'id, brand, model, slug';

    let query = supabase
      .from(table)
      .select(selectCols)
      .eq('published', true)
      .order('our_rating', { ascending: false });

    if (limitArg) query = query.limit(limitArg);

    const { data: products, error } = await query;
    if (error) { console.log(`   Error: ${error.message}`); continue; }
    if (!products || products.length === 0) { console.log('   No products found.'); continue; }

    console.log(`   ${products.length} products to research\n`);

    for (const p of products) {
      processed++;
      const name = table === 'gels' ? `${p.brand} ${p.product}` : `${p.brand} ${p.model}`;

      process.stdout.write(`   [${processed}/${products.length}] ${name} ... `);

      if (!dryRun) await clearExistingQuotes(table, p.id);

      try {
        const quotes = await fetchQuotesForProduct(p, table, subreddits);

        if (quotes.length === 0) {
          skipped++;
          console.log('no community data');
          continue;
        }

        found++;
        totalQuotes += quotes.length;

        if (!dryRun) {
          const stored = await storeQuotes(quotes);
          console.log(`${stored} quotes`);
        } else {
          console.log(`${quotes.length} quotes (dry-run)`);
          for (const q of quotes) {
            console.log(`      ${q.source} · ${q.user_handle} · +${q.votes}`);
            console.log(`      "${q.body.slice(0, 120)}..."\n`);
          }
        }
      } catch (err: any) {
        console.log(`error: ${err.message}`);
      }

      await sleep(DELAY_MS);
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`   Done in ${elapsed} min`);
  console.log(`   Products processed: ${processed}`);
  console.log(`   With community data: ${found}`);
  console.log(`   Total quotes stored: ${totalQuotes}`);
  console.log(`   No data found: ${skipped}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch(console.error);
