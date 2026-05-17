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

  return (
    <div className="w-full">
      {/* Header */}
      <section className="relative py-16 bg-gradient-to-br from-purple-50 via-slate-50 to-white border-b border-purple-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-transparent rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-slate-950 mb-2">Blog</h1>
          <p className="text-lg text-slate-600">
            Guides, comparisons, and data-driven insights for running gear.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {posts && posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
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
                  <time className="text-sm text-slate-500">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString() : ''}
                  </time>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 text-center py-8">No blog posts yet.</p>
        )}
      </div>
    </div>
  );
}
