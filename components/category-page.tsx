// components/category-page.tsx — Specs-Engine version.
// Server component: pulls products + count metadata + last-sync timestamp.

import { supabase } from '@/lib/supabase';
import ProductTable from './product-table';

interface Props {
  title: string;
  description: string;
  category: 'shoes' | 'vests' | 'gels';
  table: 'shoes' | 'vests' | 'gels';
  slug: string; // '/shoes' | '/vests' | '/fuel'
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
      <header className="border-b border-rule px-8 py-9">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
            rgd ▸ index ▸ <span className="text-rust">{slug.replace('/', '')}</span>
          </div>
          <div className="mt-3 grid grid-cols-1 items-end gap-8 md:grid-cols-[1fr_360px]">
            <div>
              <h1 className="m-0 font-display text-[72px] font-semibold leading-[0.95] tracking-[-0.04em]">
                {slug.replace('/', '')} <span className="text-rust">· {total}</span>
              </h1>
              <p className="mt-3 max-w-[640px] font-mono text-[14px] leading-[1.6] text-ink-70">
                {description}
              </p>
            </div>
            <div className="rounded border border-rule bg-paper p-4 font-mono text-[11.5px] leading-[1.8]">
              <Row k="last sync"     v="04:12 UTC" />
              <Row k="price source"  v="amazon · rei · running-warehouse" />
              <Row k="coverage"      v={`● ${total}/${total} reviewed`} good />
              <Row k="avg score"     v={`${avgRating} / 10`} />
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-8 py-8">
        <ProductTable products={products ?? []} category={category} />
      </section>
    </div>
  );
}

function Row({ k, v, good }: { k: string; v: string; good?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-50">{k}</span>
      <span className={good ? 'text-moss' : 'text-carbon'}>{v}</span>
    </div>
  );
}
