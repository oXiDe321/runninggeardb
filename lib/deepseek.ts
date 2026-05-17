import OpenAI from 'openai';

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

export async function generateReview(
  table: 'shoes' | 'vests' | 'gels',
  product: any,
  alternatives: any[]
) {
  const specs = formatSpecs(table, product);
  const altText = alternatives
    .map((alt) => `- ${alt.brand} ${alt.model} (${alt.our_rating || 'N/A'}/5)`)
    .join('\n');

  const prompt = `Write an 800-1200 word product review for runners in a minimal, data-driven style. Cover strengths and weaknesses factually.

Product: ${product.brand} ${product.model}
Specs: ${specs}

Similar alternatives in database:
${altText}

Structure:
1. Intro: 2-3 sentences on why this product matters
2. Specs summary: Key numbers and features
3. Performance breakdown: How it performs in real conditions
4. Pros/Cons: 4-5 bullet points each
5. Compared to alternatives: How it stacks against the 3 listed products
6. Verdict: Clear recommendation for who should buy
7. Affiliate CTA: Suggest checking Amazon or brand site
${product.from_the_trail ? `8. From the Trail: "${product.from_the_trail}"` : ''}

Keep language direct and factual. Use the data to support conclusions.`;

  const response = await deepseek.chat.completions.create({
    model: 'deepseek-chat',
    max_tokens: 1500,
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
    return `Weight: ${product.weight_g}g, Drop: ${product.drop_mm}mm, Stack (heel/forefoot): ${product.stack_heel_mm}/${product.stack_forefoot_mm}mm, Price: $${product.price_usd}, Rating: ${product.our_rating}/5`;
  }
  if (table === 'vests') {
    return `Capacity: ${product.capacity_l}L, Weight: ${product.weight_g}g, Pockets: ${product.front_pockets}F/${product.back_pockets}B, Price: $${product.price_usd}, Rating: ${product.our_rating}/5`;
  }
  if (table === 'gels') {
    return `Carbs: ${product.carbs_per_serving_g}g, Sodium: ${product.sodium_mg}mg, Caffeine: ${product.caffeine_mg}mg, Price: $${product.price_per_serving}, Rating: ${product.our_rating}/5`;
  }
  return '';
}
