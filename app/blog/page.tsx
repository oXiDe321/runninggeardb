import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — RunningGearDB',
  description: 'Gear guides, training tips, and race-specific running gear comparisons.',
};

const mockPosts = [
  {
    slug: 'best-trail-running-shoes-2026',
    title: 'Best Trail Running Shoes 2026',
    excerpt: 'A data-driven breakdown of the top trail shoes for different terrain types and distance.',
    date: '2026-05-17',
    category: 'guide',
  },
  {
    slug: 'hyrox-shoes-speed-vs-stability',
    title: 'Best Hyrox Shoes: Speed vs Stability',
    excerpt: 'Analyzing the trade-offs between responsive road shoes and technical trail shoes for Hyrox racing.',
    date: '2026-05-10',
    category: 'race',
  },
  {
    slug: 'best-running-vests-ultras',
    title: 'Best Running Vests for Ultras (UTMB Compliant)',
    excerpt: 'Finding the right pack for 30+ hour races. We compare capacity, weight, and durability.',
    date: '2026-05-03',
    category: 'guide',
  },
  {
    slug: 'maurten-vs-precision-fuel',
    title: 'Maurten vs Precision Fuel — The Data',
    excerpt: 'Breaking down carbs, sodium, and GI effects. Which fuel works best for your gut?',
    date: '2026-04-26',
    category: 'comparison',
  },
  {
    slug: 'trail-running-shoe-drop-guide',
    title: 'Trail Running Shoe Drop Guide',
    excerpt: 'Understanding drop, stack height, and how they affect your running economy and injury risk.',
    date: '2026-04-19',
    category: 'guide',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-950 mb-2">Blog</h1>
        <p className="text-lg text-slate-600">
          Guides, comparisons, and data-driven insights for running gear.
        </p>
      </div>

      <div className="space-y-6">
        {mockPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <article className="p-6 border border-slate-200 rounded-xl hover:border-orange-300 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-2">
                <h2 className="text-2xl font-bold text-slate-950 hover:text-orange-600">
                  {post.title}
                </h2>
                <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded font-semibold whitespace-nowrap ml-4">
                  {post.category}
                </span>
              </div>
              <p className="text-slate-600 mb-4">{post.excerpt}</p>
              <time className="text-sm text-slate-500">{post.date}</time>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
