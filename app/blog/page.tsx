import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog — RunningGearDB',
  description: 'Gear guides, training tips, and race-specific running gear comparisons.',
};

const categoryStyles: Record<string, string> = {
  guide: 'bg-sand text-rust-deep dark:bg-carbon-80/40 dark:text-rust',
  comparison: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  race: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  nutrition: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

export default async function BlogPage() {
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false });

  const allPosts = posts || [];
  const featured = allPosts[0];
  const remaining = allPosts.slice(1);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="relative py-16 bg-gradient-to-br from-purple-50 via-slate-50 to-white dark:from-purple-950/20 dark:via-slate-950 dark:to-slate-950 border-b border-purple-100 dark:border-purple-900/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 dark:from-purple-500/5 to-transparent rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-slate-950 dark:text-white mb-2">Blog</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Guides, comparisons, and data-driven insights for running gear.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {allPosts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No blog posts yet.</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Check back soon for gear guides and comparisons.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Featured post */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="block group">
                <article className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 border border-white/10 surface-floating transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rust/10 to-purple-500/10 rounded-full blur-3xl" />
                  <div className="relative p-8 sm:p-12">
                    <div className="flex items-center gap-3 mb-4">
                      {featured.category && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${categoryStyles[featured.category] || categoryStyles.guide}`}>
                          {featured.category}
                        </span>
                      )}
                      {featured.published_at && (
                        <time className="text-sm text-slate-400">
                          {new Date(featured.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 group-hover:text-rust transition-colors">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-lg text-slate-400 max-w-2xl">{featured.excerpt}</p>
                    )}
                    <div className="mt-6 inline-flex items-center gap-2 text-rust font-medium">
                      Read article
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Post grid */}
            {remaining.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {remaining.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                    <article className="h-full p-6 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 surface-elevated card-hover transition-all duration-300">
                      <div className="flex items-center gap-2 mb-3">
                        {post.category && (
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${categoryStyles[post.category] || categoryStyles.guide}`}>
                            {post.category}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-slate-950 dark:text-white mb-2 group-hover:text-rust transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                          {post.excerpt}
                        </p>
                      )}
                      {post.published_at && (
                        <time className="text-xs text-slate-500 dark:text-slate-500">
                          {new Date(post.published_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </time>
                      )}
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
