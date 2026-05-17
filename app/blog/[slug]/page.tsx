import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const categoryStyles: Record<string, string> = {
  guide: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  comparison: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  race: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  nutrition: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

function readingTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function parseMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const key = `line-${i}`;

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key} className="text-2xl font-bold text-slate-950 dark:text-white mt-12 mb-4">
          {line.replace(/^##\s+/, '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key} className="text-xl font-semibold text-slate-950 dark:text-white mt-8 mb-3">
          {line.replace(/^###\s+/, '')}
        </h3>
      );
    } else if (line.match(/^\*\*.*\|\s/)) {
      const [namePart, ...restParts] = line.split('|');
      const name = namePart.replace(/\*\*/g, '').trim();
      const rest = restParts.join('|').trim();
      elements.push(
        <div key={key} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-white/10 my-4">
          <p className="font-semibold text-slate-950 dark:text-white mb-1">{name}</p>
          {rest && <p className="text-sm text-slate-600 dark:text-slate-400 font-mono">{rest}</p>}
        </div>
      );
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].replace(/^-\s+/, ''));
        i++;
      }
      i--;
      elements.push(
        <ul key={key} className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400 mb-4">
          {items.map((item, j) => (
            <li key={`${key}-${j}`}>{item}</li>
          ))}
        </ul>
      );
    } else if (line.trim()) {
      elements.push(
        <p key={key} className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-lg">
          {line}
        </p>
      );
    }
  }

  return elements;
}

const mockPost = {
  title: 'Best Trail Running Shoes 2026',
  published_at: '2026-05-17',
  category: 'guide',
  content: `
## Introduction

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

### Best for Technical Terrain: HOKA Speedgoat 6
**Weight:** 228g | **Drop:** 7mm | **Price:** $145

The Speedgoat 6 dominates steep, rocky terrain. Aggressive lugs grip confidently; lightweight design reduces fatigue on long descents.

### Best for Long Ultras: Salomon Sense Ride 5
**Weight:** 240g | **Drop:** 8mm | **Price:** $130

More cushioning than the Speedgoat, better for 30+ hour efforts where comfort is king.

### Best Value: Nike Pegasus Trail 5
**Weight:** 244g | **Drop:** 10mm | **Price:** $120

Solid all-around shoe at an accessible price. Less aggressive than competitors, but reliable.

## Conclusion

Choose based on your primary terrain and race distance. Rocky, steep terrain? Speedgoat. Long ultras on mixed terrain? Sense Ride. Budget-conscious? Pegasus Trail.

Compare full specs in our shoes database to find your match.
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
  const category = post.category || 'guide';
  const readMin = readingTime(post.content || '');

  return (
    <div className="w-full">
      {/* Header */}
      <section className="relative py-16 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border-b border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-500/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${categoryStyles[category] || categoryStyles.guide}`}>
              {category}
            </span>
            {post.published_at && (
              <time className="text-sm text-slate-400">
                {new Date(post.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            <span className="text-sm text-slate-500">{readMin} min read</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-lg text-slate-400">{post.excerpt}</p>
          )}
        </div>
      </section>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article>
          <div className="prose-custom">
            {post.content ? (
              parseMarkdown(post.content)
            ) : (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                No content available.
              </p>
            )}
          </div>

          <footer className="border-t border-slate-200 dark:border-white/10 pt-8 mt-16">
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-4">
              Ready to find your gear?
            </h3>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/shoes"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-full font-medium text-sm hover:bg-brand-700 dark:hover:bg-brand-500 transition-colors"
              >
                Browse Shoes
              </Link>
              <Link
                href="/vests"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Browse Vests
              </Link>
              <Link
                href="/gels"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full font-medium text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Browse Nutrition
              </Link>
            </div>
          </footer>
        </article>

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              datePublished: post.published_at,
              author: {
                '@type': 'Organization',
                name: 'RunningGearDB',
              },
              articleBody: (post.content || '').substring(0, 500),
            }),
          }}
        />
      </div>
    </div>
  );
}
