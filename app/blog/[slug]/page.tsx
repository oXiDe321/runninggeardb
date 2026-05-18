import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const categoryStyles: Record<string, string> = {
  guide: 'bg-sand text-rust-deep dark:bg-carbon-80/40 dark:text-rust',
  comparison: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  race: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  nutrition: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

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
    <div className="w-full">
      {/* Header */}
      <section className="relative py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rust/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${categoryStyles[category] || categoryStyles.guide}`}>
              {category}
            </span>
            {post.published_at && (
              <time className="text-sm text-slate-400">
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </time>
            )}
            <span className="text-sm text-slate-500">{readMin} min read</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-slate-400">{post.excerpt}</p>
          )}
        </div>
      </section>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose prose-slate dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:text-slate-950 dark:prose-headings:text-white
          prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
          prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-lg prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
          prose-li:text-slate-600 dark:prose-li:text-slate-300
          prose-a:text-rust prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-950 dark:prose-strong:text-white prose-strong:font-semibold
          prose-table:rounded-xl prose-table:overflow-hidden
          prose-th:bg-slate-100 dark:prose-th:bg-slate-800 prose-th:px-4 prose-th:py-2 prose-th:text-sm prose-th:font-semibold
          prose-td:px-4 prose-td:py-2 prose-td:text-sm prose-td:border-b prose-td:border-slate-100 dark:prose-td:border-white/5
          prose-thead:border-b prose-thead:border-slate-200 dark:prose-thead:border-white/10
          prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-blockquote:border-l-rust prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
        ">
          {post.content ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              No content available.
            </p>
          )}
        </article>

        <footer className="border-t border-slate-200 dark:border-white/10 pt-8 mt-16">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-4">
            Compare specs yourself
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/shoes" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-rust-deep dark:hover:bg-rust transition-colors">
              Browse Shoes
            </Link>
            <Link href="/vests" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Browse Vests
            </Link>
            <Link href="/gels" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              Browse Nutrition
            </Link>
          </div>
        </footer>

        {/* JSON-LD structured data */}
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
