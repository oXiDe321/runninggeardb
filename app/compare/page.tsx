import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import CategoryHeader from '@/components/category-header';
import CompareTool from '@/components/compare-tool';

export const metadata: Metadata = {
  title: 'Compare Running Gear Side-by-Side — Specs, Weight & Price',
  description: 'Select 2-4 shoes, vests, or gels and compare every spec side-by-side. Drop, stack height, weight, price — best value auto-highlighted.',
  openGraph: {
    type: 'website',
    url: 'https://runninggeardb.com/compare',
    title: 'Compare Running Gear Side-by-Side — Specs, Weight & Price',
    description: 'Select 2-4 shoes, vests, or gels and compare every spec side-by-side. Drop, stack height, weight, price — best value auto-highlighted.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Compare Running Gear Side-by-Side — Specs, Weight & Price',
    description: 'Select 2-4 shoes, vests, or gels and compare every spec side-by-side. Drop, stack height, weight, price — best value auto-highlighted.',
  },
  alternates: { canonical: 'https://runninggeardb.com/compare' },
};

export default async function ComparePage() {
  const [shoes, vests, gels] = await Promise.all([
    supabase.from('shoes').select('*').eq('published', true).order('our_rating', { ascending: false }),
    supabase.from('vests').select('*').eq('published', true).order('our_rating', { ascending: false }),
    supabase.from('gels').select('*').eq('published', true).order('our_rating', { ascending: false }),
  ]);

  const total = (shoes.data?.length ?? 0) + (vests.data?.length ?? 0) + (gels.data?.length ?? 0);

  return (
    <div className="bg-sand text-carbon">
      <CategoryHeader
        slug="/compare"
        title="compare"
        total={total}
        description="Select 2-4 products to compare specs side-by-side. Best values highlighted automatically."
        metadata={[
          { k: 'categories', v: 'shoes · vests · fuel' },
          { k: 'active skus', v: String(total), good: true },
          { k: 'select up to', v: '4 at once' },
          { k: 'best value', v: 'auto-highlighted' },
        ]}
      />
      <section className="mx-auto max-w-7xl px-8 py-8">
        <CompareTool
          initialProducts={{
            shoes: shoes.data || [],
            vests: vests.data || [],
            gels: gels.data || [],
          }}
        />
      </section>
    </div>
  );
}
