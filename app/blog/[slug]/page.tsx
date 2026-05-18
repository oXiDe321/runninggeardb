import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

const mockPost = {
  title: 'Best Trail Running Shoes 2026',
  published_at: '2026-05-17',
  category: 'guide',
  content: `## Introduction

Trail running shoe selection is more nuanced than road shoes. Terrain varies wildly—from smooth fireroads to ankle-breaking technical scree. This guide breaks down the best shoes for each scenario, based on real-world testing data.

## Key Considerations

### Drop

The vertical distance from heel to toe matters. Lower drop (5-7mm) feels more responsive; higher drop (10mm+) is more cushioned.

### Weight

Lighter shoes (< 230g) are faster for short, technical runs. Heavier shoes (> 270g) offer more cushioning for long ultras.

### Lug Depth

Deeper lugs (5-6mm) grip better on loose terrain; shallower lugs (3-4mm) work on packed trails.

### Terrain Type

- Rocky: Speedgoat, Cascadia
- Muddy: Sense Ride, Speedgoat
- Mixed: Trailfly, Lone Peak
- Fast/Technical: Pegasus Trail, Speedgoat

## Best Shoes by Category

| Shoe | Weight | Drop | Price | Best For |
|------|--------|------|-------|----------|
| HOKA Speedgoat 6 | 228g | 7mm | $145 | Technical terrain |
| Salomon Sense Ride 5 | 240g | 8mm | $130 | Long ultras |
| Nike Pegasus Trail 5 | 244g | 10mm | $120 | Budget all-arounder |

### Best for Technical Terrain: HOKA Speedgoat 6

The Speedgoat 6 dominates steep, rocky terrain. Aggressive lugs grip confidently; lightweight design reduces fatigue on long descents.

### Best for Long Ultras: Salomon Sense Ride 5

More cushioning than the Speedgoat, better for 30+ hour efforts where comfort is king.

### Best Value: Nike Pegasus Trail 5

Solid all-around shoe at an accessible price. Less aggressive than competitors, but reliable.

## Conclusion

Choose based on your primary terrain and race distance. Rocky, steep terrain? Speedgoat. Long ultras on mixed terrain? Sense Ride. Budget-conscious? Pegasus Trail.

Compare full specs in our [shoes database](/shoes) to find your match.
  `,
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  return {
    title: post?.title || `${slug.replace(/-/g, ' ')} — RunningGearDB Blog`,
    description: post?.excerpt || 'Data-driven gear guide and running insights.',
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  const { data: dbPost } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  const post = dbPost || { ...mockPost, slug };
  const category = (post.category as string) || 'guide';
  const readMin = readingTime(post.content || '');

  return (
    <div className="bg-sand text-carbon">
      <header className="border-b border-rule px-8 py-10">
        <div className="mx-auto max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
            rgd ▸ <span className="text-rust">/blog</span> ▸ {slug}
          </div>
          <div className="mt-3 flex items-center gap-3 font-mono text-[11px] text-ink-50">
            {post.published_at && (
              <time>
                {new Date(post.published_at).toLocaleDateString('en-GB', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </time>
            )}
            <span>·</span>
            <span>{readMin} min read</span>
            {category && (
              <>
                <span>·</span>
                <span className="uppercase tracking-[0.08em]">{category}</span>
              </>
            )}
          </div>
          <h1 className="m-0 mt-3 font-display text-[52px] font-semibold leading-[1.02] tracking-[-0.035em]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-3 font-mono text-[14px] text-ink-70">{post.excerpt}</p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-8 py-12">
        <article className="prose max-w-none
          prose-headings:font-display prose-headings:font-semibold prose-headings:text-carbon prose-headings:tracking-[-0.02em]
          prose-h2:text-[28px] prose-h2:mt-10 prose-h2:mb-3
          prose-h3:text-[20px] prose-h3:mt-8 prose-h3:mb-2
          prose-p:text-[15px] prose-p:text-ink-70 prose-p:leading-relaxed prose-p:mb-4
          prose-li:text-[15px] prose-li:text-ink-70
          prose-a:text-rust prose-a:no-underline hover:prose-a:underline
          prose-strong:text-carbon prose-strong:font-semibold
          prose-table:rounded prose-table:overflow-hidden prose-table:border prose-table:border-rule
          prose-th:bg-sand-deep prose-th:px-3 prose-th:py-2 prose-th:font-mono prose-th:text-[11px] prose-th:font-semibold prose-th:uppercase prose-th:tracking-[0.08em]
          prose-td:px-3 prose-td:py-2 prose-td:font-mono prose-td:text-[13px] prose-td:border-b prose-td:border-rule-soft
          prose-thead:border-b prose-thead:border-rule
          prose-code:bg-paper prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-[13px]
          prose-blockquote:border-l-rust prose-blockquote:bg-paper prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r
          prose-hr:border-rule
        ">
          {post.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          ) : (
            <p className="font-mono text-[13px] text-ink-50 text-center py-8">
              No content available.
            </p>
          )}
        </article>

        <footer className="border-t border-rule pt-8 mt-12">
          <h3 className="font-display text-[22px] font-semibold tracking-[-0.02em] mb-4">
            Compare specs yourself
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/shoes" className="rounded-[3px] bg-carbon px-5 py-2.5 font-mono text-[13px] font-medium text-sand">
              Browse Shoes →
            </Link>
            <Link href="/vests" className="rounded-[3px] border border-carbon px-5 py-2.5 font-mono text-[13px] text-carbon">
              Browse Vests
            </Link>
            <Link href="/gels" className="rounded-[3px] border border-carbon px-5 py-2.5 font-mono text-[13px] text-carbon">
              Browse Nutrition
            </Link>
          </div>
        </footer>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              datePublished: post.published_at,
              author: { '@type': 'Organization', name: 'RunningGearDB' },
              articleBody: (post.content || '').substring(0, 500),
            }),
          }}
        />
      </div>
    </div>
  );
}
