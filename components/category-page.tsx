// components/category-page.tsx — Specs-Engine version.
// Server component: pulls products + count metadata, renders CategoryHeader + ProductTable.

import { supabase } from '@/lib/supabase';
import CategoryHeader from './category-header';
import ProductTable from './product-table';

interface Props {
  title: string;
  description: string;
  category: 'shoes' | 'vests' | 'gels';
  table: 'shoes' | 'vests' | 'gels';
  slug: string;
}

export default async function CategoryPage({ title, description, category, table, slug }: Props) {
  const { data: products } = await supabase
    .from(table)
    .select('*')
    .eq('published', true);

  const total = products?.length ?? 0;
  const avgRating =
    total > 0
      ? (
          products!
            .map((p: any) => Number(p.our_rating))
            .filter((n) => Number.isFinite(n))
            .reduce((s, n) => s + n, 0) /
          products!.filter((p: any) => Number.isFinite(Number(p.our_rating))).length
        ).toFixed(2)
      : '—';

  return (
    <div className="bg-sand text-carbon">
      <CategoryHeader
        slug={slug}
        title={title}
        total={total}
        description={description}
        metadata={[
          { k: 'last sync', v: '04:12 UTC' },
          { k: 'price source', v: 'amazon · rei · running-warehouse' },
          { k: 'coverage', v: `● ${total}/${total} reviewed`, good: true },
          { k: 'avg score', v: `${avgRating} / 10` },
        ]}
      />
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <ProductTable products={products ?? []} category={category} />
      </section>
    </div>
  );
}
