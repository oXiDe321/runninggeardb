import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — RunningGearDB',
  description: 'Gear guides, training tips, and race-specific running gear comparisons.',
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  const allPosts = posts || [];

  return (
    <div className="bg-sand text-carbon">
      <header className="border-b border-rule px-8 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
            rgd ▸ <span className="text-rust">/blog</span> · {allPosts.length} post{allPosts.length !== 1 ? 's' : ''}
          </div>
          <h1 className="m-0 mt-3 font-display text-[68px] font-semibold leading-[0.95] tracking-[-0.04em]">
            Blog
          </h1>
          <p className="mt-3 max-w-[720px] font-mono text-[14px] text-ink-70">
            Guides, comparisons, and data-driven insights for running gear.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 py-10">
        {allPosts.length === 0 ? (
          <div className="py-16 text-center font-mono text-[13px] text-ink-50 border-2 border-dashed border-rule rounded-2xl">
            No blog posts yet. Check back soon.
          </div>
        ) : (
          <div className="overflow-hidden rounded border border-rule bg-paper">
            <div className="grid grid-cols-[140px_1fr_100px] border-b border-rule bg-sand-deep px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50">
              <span>date</span>
              <span>title</span>
              <span className="text-right">category</span>
            </div>
            {allPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="grid grid-cols-[140px_1fr_100px] items-center border-b border-rule-soft px-4 py-3.5 last:border-0"
              >
                <time className="font-mono text-[12px] text-ink-50">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: '2-digit',
                      }).toUpperCase().replace(/ /g, '-')
                    : '—'}
                </time>
                <div>
                  <div className="font-display text-[18px] font-medium tracking-[-0.015em] text-carbon">
                    {post.title}
                  </div>
                  {post.excerpt && (
                    <div className="mt-0.5 truncate font-mono text-[12px] text-ink-50">
                      {post.excerpt}
                    </div>
                  )}
                </div>
                <span className="text-right font-mono text-[11px] uppercase tracking-[0.08em] text-ink-50">
                  {post.category || '—'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
