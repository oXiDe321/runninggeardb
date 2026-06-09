// app/changelog/page.tsx
// Public changelog — server fetches entries + product slugs, client handles
// filters and grouping.

import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import CategoryHeader from '@/components/category-header';
import ChangelogView from './changelog-view';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Changelog — RunningGearDB',
  description: 'Every score update, price change, and review revision on RunningGearDB, publicly tracked.',
};

async function getProductSlugMap() {
  const [shoes, vests, gels] = await Promise.all([
    supabase.from('shoes').select('id, slug').eq('published', true),
    supabase.from('vests').select('id, slug').eq('published', true),
    supabase.from('gels').select('id, slug').eq('published', true),
  ]);
  const map = new Map<string, string>();
  for (const r of shoes.data ?? []) map.set(`shoes:${r.id}`, `/reviews/${r.slug}`);
  for (const r of vests.data ?? []) map.set(`vests:${r.id}`, `/vests/${r.slug}`);
  for (const r of gels.data ?? []) map.set(`gels:${r.id}`, `/gels/${r.slug}`);
  return map;
}

export default async function ChangelogPage() {
  const [entriesRes, slugMap] = await Promise.all([
    supabase
      .from('changelog')
      .select('*')
      .order('occurred_at', { ascending: false })
      .limit(200),
    getProductSlugMap(),
  ]);

  const entries = (entriesRes.data ?? []).map((e) => ({
    ...e,
    product_url: e.product_table && e.product_id
      ? slugMap.get(`${e.product_table}:${e.product_id}`) ?? null
      : null,
  }));

  return (
    <div className="bg-sand text-carbon">
      <CategoryHeader
        slug="/changelog"
        title="changelog"
        total={entries.length}
        description="Every price update, score revision, and review change on RunningGearDB is tracked here. This page is the receipt — transparency is the point."
        metadata={[
          { k: 'entries', v: String(entries.length), good: true },
          { k: 'kinds', v: 'add · update · price · review · remove' },
          { k: 'span', v: 'last 200 entries' },
          { k: 'format', v: 'grouped by date' },
        ]}
      />
      <section className="mx-auto max-w-7xl px-8 py-8">
        <ChangelogView entries={entries} />
      </section>
    </div>
  );
}
