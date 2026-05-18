// app/sitemap.ts
// Dynamic sitemap pulled from Supabase. Every published shoe / vest / gel
// gets a /reviews/[slug] entry; blog posts get their own; static routes
// (home, category indexes, finder, compare) are pinned.

import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const SITE = 'https://runninggeardb.com';
const NOW = new Date();

export const revalidate = 3600; // re-generate hourly

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [shoes, vests, gels, blog] = await Promise.all([
    supabase
      .from('shoes')
      .select('slug, human_edited_at, created_at')
      .eq('published', true),
    supabase
      .from('vests')
      .select('slug, human_edited_at, created_at')
      .eq('published', true),
    supabase
      .from('gels')
      .select('slug, human_edited_at, created_at')
      .eq('published', true),
    supabase
      .from('blog_posts')
      .select('slug, published_at, created_at')
      .eq('published', true),
  ]);

  const reviews = (table: 'shoes' | 'vests' | 'gels', rows: { slug: string; human_edited_at: string | null; created_at: string }[] | null) =>
    (rows ?? []).map((r) => ({
      url: `${SITE}/reviews/${r.slug}`,
      lastModified: new Date(r.human_edited_at ?? r.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  return [
    // pinned static routes
    { url: `${SITE}/`,             lastModified: NOW, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE}/shoes`,        lastModified: NOW, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE}/vests`,        lastModified: NOW, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE}/gels`,         lastModified: NOW, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE}/compare`,      lastModified: NOW, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE}/finder`,       lastModified: NOW, changeFrequency: 'monthly', priority: 0.9 },

    { url: `${SITE}/blog`,         lastModified: NOW, changeFrequency: 'daily',   priority: 0.7 },
    { url: `${SITE}/changelog`,    lastModified: NOW, changeFrequency: 'daily',   priority: 0.5 },

    // dynamic
    ...reviews('shoes', shoes.data),
    ...reviews('vests', vests.data),
    ...reviews('gels',  gels.data),
    ...(blog.data ?? []).map((b) => ({
      url: `${SITE}/blog/${b.slug}`,
      lastModified: new Date(b.published_at ?? b.created_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
