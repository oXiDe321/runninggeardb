import OpenAI from 'openai';

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export interface CommunityQuote {
  source: string;
  source_url?: string | null;
  user_handle?: string | null;
  body: string;
  votes?: string | null;
  sentiment?: number | null;
}

export async function generateReview(
  table: 'shoes' | 'vests' | 'gels',
  product: any,
  alternatives: any[],
  communityQuotes?: CommunityQuote[],
) {
  const specs = formatSpecs(table, product);
  const altText = alternatives
    .map((alt) => {
      const altSpecs = formatSpecs(table, alt);
      return `- ${alt.brand} ${alt.model}: ${altSpecs} (Rating: ${alt.our_rating || 'N/A'}/5)`;
    })
    .join('\n');

  // Build community quotes section if we have real data
  let communitySection = '';
  if (communityQuotes && communityQuotes.length > 0) {
    const quoteText = communityQuotes
      .map(q => `"${q.body}" —${q.user_handle || 'anonymous'} via ${q.source}${q.votes ? ` (+${q.votes})` : ''}`)
      .join('\n\n');
    communitySection = `
Real community quotes about this product (use these in your "What the Community Says" section):
${quoteText}

When referencing these quotes, cite them naturally: "As one r/trailrunning user put it..." or "A recurring theme on ${communityQuotes[0]?.source || 'Reddit'} is..."
`;
  } else {
    communitySection = `
Note: Limited community discussion was found for this specific product on Reddit and running forums. In the "What the Community Says" section, focus on the general consensus you're aware of from your training data about this brand/product line. If community discussion is genuinely sparse, be honest: note that this product has limited community discussion and explain what that typically means (newer release, niche product, or limited distribution). Do NOT fabricate specific quotes or pretend to have found forum threads that don't exist.
`;
  }

  const prompt = `You are writing a data-driven product analysis for a running gear database. This is NOT a first-person review. There is no human tester. The analysis must be based on: (1) the product's published specifications, (2) consensus from online running communities (Reddit r/trailrunning, r/running, r/ultrarunning; LetsRun forums; Strava comments; YouTube reviews), and (3) comparison against similar products in the database.

Product: ${product.brand} ${product.model}
Specs: ${specs}
${product.discipline ? `Discipline: ${product.discipline}` : ''}
${product.terrain ? `Terrain: ${product.terrain}` : ''}
${product.distance_sweet_spot ? `Distance sweet spot: ${product.distance_sweet_spot}` : ''}

Alternatives for comparison:
${altText}
${communitySection}
Write a 1000-1400 word analysis in Markdown. Use this exact structure:

## Overview
2-3 sentences. What this product is, where it sits in the market, what type of runner it targets. No opinion language — state facts about its category position and intended use.

## Specs Breakdown
Walk through the key numbers and what they mean in practical terms. For shoes: weight, drop, stack, plate, lug depth, price. For vests: capacity, weight, pocket count, compliance. For gels: carbs, sodium, caffeine, format, price per serving. Compare each spec to category norms. Flag anything notably high or low. No "I felt" or "in my experience" — just "at X grams this is lighter than the category average" or "the 4mm drop puts this in low-drop territory." Be precise and quantitative.

## What the Community Says
Synthesize the consensus from online running communities. What patterns emerge from Reddit threads, forum discussions, and comment sections? What do runners actually report after using this product? What complaints recur? What do people consistently praise? Be specific.

Frame everything as community consensus, never as personal experience: "r/trailrunning users consistently report..." or "a recurring complaint on LetsRun is..." or "the consensus across forums is..." or "multiple YouTube reviewers note..."

IMPORTANT: If real community quotes were provided above, use them directly and cite the specific sources. If limited community data was noted, be honest about the sparse discussion and do NOT invent quotes or threads.

## Pros
4-6 bullet points. List spec advantages AND community-verified strengths. Use + as the bullet marker. Be concrete — reference numbers or forum consensus. Examples:
+ At 255g, among the lighter shoes in its class that still includes a full rock plate
+ r/ultrarunning users widely agree the pocket layout is best-in-segment for accessible storage

## Cons
4-6 bullet points. List spec trade-offs AND recurring community complaints. Be honest — no product is perfect. Use + as the bullet marker. Examples:
+ 4mm lugs struggle in deep mud — a common complaint on r/trailrunning
+ Narrow midfoot fit widely noted across forums — half-size up is the consensus recommendation

## Vs Alternatives
How this product compares to the alternatives listed above. Use the spec data to make direct, numerical comparisons. Point out where this product wins on numbers and where alternatives beat it. Don't declare a single winner — just present trade-offs clearly.

## Verdict
3-4 sentences. What type of runner this product suits, based on specs and community consensus. What type of runner should look elsewhere. End with a data-driven summary.

Critical rules:
- NEVER use "I", "we", "our team", "in testing", "after X miles", or any first-person language
- NEVER invent testing anecdotes, mileage claims, or personal experiences
- NEVER name a fictional tester or claim hands-on use
- ALWAYS attribute experiential claims to community sources ("Reddit users report...", "forum consensus is...", "multiple reviewers note...")
- ALWAYS ground analysis in the actual spec numbers provided
- Use short paragraphs (2-3 sentences max)
- Be genuinely critical — if a spec is mediocre or community feedback is mixed, say so
- No affiliate CTAs, no "buy now" language — this is analysis, not sales copy`;

  const response = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 2500,
    temperature: 0.5,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content || '';
}

export async function generateBlogPost(
  title: string,
  keywords: string[],
  category: 'guide' | 'comparison' | 'race' | 'nutrition'
) {
  const keywordStr = keywords.join(', ');

  const prompt = `Write a 1200-1500 word SEO-optimized blog post for trail, road, and Hyrox runners. Use natural language, not keyword stuffing.

Title: ${title}
Target keywords: ${keywordStr}
Category: ${category}

Requirements:
- Include ${keywords[0]} naturally in the first 100 words
- Use short paragraphs (2-3 sentences max)
- Include 3-4 subheadings (H2)
- Cite data and specs from real products when relevant
- End with a CTA encouraging readers to compare specs on our site
- Use Markdown formatting

Write in a conversational but authoritative tone. A runner should feel like an expert is giving them practical advice.`;

  const response = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  return response.choices[0].message.content || '';
}

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
