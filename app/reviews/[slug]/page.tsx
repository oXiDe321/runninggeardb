import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: `${slug} Review — RunningGearDB`,
    description: 'Detailed gear review with specs and performance breakdown.',
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;

  // Mock review data for now
  const review = {
    brand: 'HOKA',
    model: 'Speedgoat 6',
    rating: 4.8,
    content: `
## Overview

The HOKA Speedgoat 6 continues to dominate the technical trail running shoe category. With a weight of just 228g, aggressive lugs, and HOKA's signature cushioning, this shoe is built for runners tackling rocky, steep terrain.

## Specs Breakdown

- **Weight:** 228g
- **Drop:** 7mm
- **Stack:** 32mm heel / 25mm forefoot
- **Lug Depth:** 5mm
- **Terrain:** Rocky, mixed

## Performance

In real-world testing on steep granite and loose scree, the Speedgoat 6 excels. The aggressive tread grips confidently on descents, while the relatively low stack height keeps your foot closer to the ground for technical footing. It's slightly stiffer than competitors like the Salomon Sense Ride, which some runners prefer for support on long ultras.

### Pros
- Aggressive, reliable grip on technical terrain
- Lightweight for a cushioned shoe
- Durable outsole holds up well over 300+ miles

### Cons
- Narrow midfoot can feel constraining for wider feet
- Less cushioning than heavier competitors (HOKA Stinson)
- Price is on the higher end at $145

## Compared to Alternatives

**vs. Salomon Sense Ride 5:** Speedgoat is lighter and grippier; Sense Ride offers more comfort on long ultras.

**vs. Brooks Cascadia 17:** Cascadia is more cushioned; Speedgoat is more responsive and technical.

**vs. Inov-8 Trailfly Ultra:** Trailfly is lighter but less cushioned; Speedgoat offers more all-around protection.

## Verdict

The Speedgoat 6 is the go-to shoe for technical, rocky terrain. If you're tackling steep descents and technical single-track, this is a solid choice. For longer ultras on flatter terrain, you might prefer more cushioning.

**Best for:** Technical trail running, steep descents, runners prioritizing grip over cushioning.

---

<a href="https://amazon.com" className="inline-block px-4 py-2 bg-orange-600 text-white rounded-full font-medium">
  Buy on Amazon
</a>
    `,
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <article>
        <header className="mb-12">
          <p className="text-orange-600 font-semibold mb-2">Gear Review</p>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4">
            {review.brand} {review.model}
          </h1>
          <div className="flex items-center gap-4">
            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded text-lg font-semibold">
              {review.rating}/5
            </span>
            <p className="text-slate-600">Updated May 2026</p>
          </div>
        </header>

        <div className="prose prose-slate max-w-none mb-12">
          {review.content.split('\n').map((paragraph, idx) => {
            if (paragraph.startsWith('##')) {
              return (
                <h2 key={idx} className="text-2xl font-bold text-slate-950 mt-8 mb-4">
                  {paragraph.replace(/^##\s/, '')}
                </h2>
              );
            }
            if (paragraph.startsWith('-')) {
              return (
                <li key={idx} className="text-slate-600 ml-4">
                  {paragraph.replace(/^-\s/, '')}
                </li>
              );
            }
            if (paragraph.trim().startsWith('**vs.')) {
              return (
                <p key={idx} className="text-slate-600 mb-2">
                  {paragraph}
                </p>
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
          <a
            href="https://amazon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-orange-600 text-white rounded-full font-medium hover:bg-orange-700 transition"
          >
            Buy on Amazon
          </a>
        </div>
      </article>

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Review',
            name: `${review.brand} ${review.model} Review`,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: review.rating,
              bestRating: 5,
              worstRating: 1,
            },
            author: {
              '@type': 'Organization',
              name: 'RunningGearDB',
            },
            reviewBody: review.content.substring(0, 500),
          }),
        }}
      />
    </div>
  );
}
