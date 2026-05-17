import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug} — RunningGearDB Blog`,
    description: 'Data-driven gear guide and running insights.',
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;

  // Mock blog content
  const post = {
    title: 'Best Trail Running Shoes 2026',
    date: '2026-05-17',
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
- **Rocky:** Speedgoat, Cascadia
- **Muddy:** Sense Ride, Speedgoat
- **Mixed:** Trailfly, Lone Peak
- **Fast/Technical:** Pegasus Trail, Speedgoat

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

Compare full specs in our [shoes database](/shoes) to find your match.
    `,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <article>
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-600">
            <time>{post.date}</time>
            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded font-semibold">
              {post.category}
            </span>
          </div>
        </header>

        <div className="prose prose-slate max-w-none mb-12">
          {post.content.split('\n').map((paragraph, idx) => {
            if (paragraph.startsWith('##')) {
              const level = paragraph.match(/^#+/)?.[0].length || 2;
              const text = paragraph.replace(/^#+\s/, '');
              if (level === 2) {
                return (
                  <h2 key={idx} className="text-2xl font-bold text-slate-950 mt-8 mb-4">
                    {text}
                  </h2>
                );
              }
              return (
                <h3 key={idx} className="text-xl font-bold text-slate-950 mt-6 mb-3">
                  {text}
                </h3>
              );
            }
            if (paragraph.startsWith('###')) {
              return (
                <h3 key={idx} className="text-lg font-bold text-slate-950 mt-6 mb-3">
                  {paragraph.replace(/^###\s/, '')}
                </h3>
              );
            }
            if (paragraph.startsWith('**') && paragraph.includes(':')) {
              const [name, rest] = paragraph.split('|');
              return (
                <div key={idx} className="bg-slate-50 p-4 rounded border border-slate-200 my-4">
                  <p className="font-semibold text-slate-950 mb-2">{name.replace(/\*\*/g, '')}</p>
                  {rest && <p className="text-sm text-slate-600">{rest}</p>}
                </div>
              );
            }
            if (paragraph.startsWith('-')) {
              return (
                <li key={idx} className="text-slate-600 ml-4">
                  {paragraph.replace(/^-\s/, '')}
                </li>
              );
            }
            if (paragraph.trim()) {
              return (
                <p key={idx} className="text-slate-600 mb-4 leading-relaxed">
                  {paragraph}
                </p>
              );
            }
            return null;
          })}
        </div>

        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-lg font-bold text-slate-950 mb-4">Ready to find your shoe?</h3>
          <a
            href="/shoes"
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-full font-medium hover:bg-orange-700 transition"
          >
            Browse All Shoes
          </a>
        </div>
      </article>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            datePublished: post.date,
            author: {
              '@type': 'Organization',
              name: 'RunningGearDB',
            },
            articleBody: post.content.substring(0, 500),
          }),
        }}
      />
    </div>
  );
}
