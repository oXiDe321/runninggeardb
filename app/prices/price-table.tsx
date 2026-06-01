'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PriceSparkline from '@/components/price-sparkline';
import type { ProductPrice, PriceHistoryPoint } from '@/lib/price-data';
import { useCurrency } from '@/lib/currency';

type Kind = 'all' | 'shoe' | 'vest' | 'gel';

const KIND_LABEL: Record<string, string> = { shoe: 'SHOES', vest: 'VESTS', gel: 'FUEL' };

// Reduce history to ~15 evenly-spaced daily points for sparkline
function sparklinePoints(history: PriceHistoryPoint[]) {
  // Deduplicate to one point per day (lowest price)
  const daily = new Map<string, number>();
  for (const p of history) {
    const prev = daily.get(p.observed_on);
    if (prev == null || p.price_usd < prev) daily.set(p.observed_on, p.price_usd);
  }
  const sorted = [...daily.entries()].sort(([a], [b]) => a.localeCompare(b));
  if (sorted.length <= 15) return sorted.map(([d, v]) => ({ d, v }));

  // Sample evenly
  const step = (sorted.length - 1) / 14;
  const sampled: { d: string; v: number }[] = [];
  for (let i = 0; i < 15; i++) {
    const idx = Math.round(i * step);
    sampled.push({ d: sorted[idx][0], v: sorted[idx][1] });
  }
  return sampled;
}

export default function PriceTable({ products }: { products: ProductPrice[] }) {
  const { fmt } = useCurrency();
  const [kind, setKind] = useState<Kind>('all');
  const [sort, setSort] = useState<'discount' | 'price' | 'name'>('discount');

  const filtered = useMemo(() => {
    let out = kind === 'all' ? products : products.filter((p) => p.kind === kind);
    return [...out].sort((a, b) => {
      if (sort === 'discount') return (b.discount_pct ?? -1) - (a.discount_pct ?? -1);
      if (sort === 'price') return (a.current_price ?? Infinity) - (b.current_price ?? Infinity);
      return a.model.localeCompare(b.model);
    });
  }, [products, kind, sort]);

  const withPrices = filtered.filter((p) => p.current_price != null);
  const discounted = withPrices.filter((p) => (p.discount_pct ?? 0) > 0);

  return (
    <div className="space-y-5">
      {/* Stats strip */}
      <div className="flex flex-wrap items-center gap-4 rounded border border-rule bg-paper px-4 py-3 font-mono text-[11.5px]">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
          prices
        </span>
        <span className="text-ink-50">filter:</span>
        {(['all', 'shoe', 'vest', 'gel'] as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`rounded-[3px] border px-2.5 py-1.5 ${
              kind === k
                ? 'border-carbon bg-carbon text-sand'
                : 'border-rule bg-sand text-carbon'
            }`}
          >
            · {k === 'all' ? 'all' : k}
          </button>
        ))}
        <span className="h-5 w-px bg-rule" />
        <span className="text-ink-50">sort:</span>
        {([
          { k: 'discount', label: 'biggest discount' },
          { k: 'price', label: 'lowest price' },
          { k: 'name', label: 'name' },
        ] as const).map((s) => (
          <button
            key={s.k}
            onClick={() => setSort(s.k)}
            className={`rounded-[3px] border px-2.5 py-1.5 ${
              sort === s.k
                ? 'border-carbon bg-carbon text-sand'
                : 'border-rule bg-sand text-carbon'
            }`}
          >
            · {s.label}
          </button>
        ))}
        <span className="ml-auto flex gap-4 text-ink-50">
          <span>{withPrices.length} tracked</span>
          <span className="text-moss">● {discounted.length} on sale</span>
        </span>
      </div>

      <div className="font-mono text-[11.5px] text-ink-50">
        showing {filtered.length} of {products.length}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border border-rule bg-paper">
        <div className="grid grid-cols-[40px_48px_2fr_80px_80px_72px_100px_80px_100px] items-center gap-3 border-b border-rule bg-sand-deep px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50">
          <span>#</span>
          <span />
          <span>brand / model</span>
          <span className="text-right">price</span>
          <span className="text-right">MSRP</span>
          <span className="text-right">saving</span>
          <span className="text-right">90d range</span>
          <span className="text-center">trend</span>
          <span className="text-right">kind</span>
        </div>
        {filtered.map((p, i) => {
          const sp = sparklinePoints(p.price_history);
          const hasPrice = p.current_price != null;
          return (
            <Link
              key={`${p.kind}:${p.id}`}
              href={`/reviews/${p.slug}`}
              className="grid grid-cols-[40px_48px_2fr_80px_80px_72px_100px_80px_100px] items-center gap-3 border-b border-rule-soft px-4 py-3 no-underline hover:bg-sand-deep/30"
            >
              <span className="font-mono text-[12px] text-ink-50">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="relative h-10 w-10 overflow-hidden rounded-[2px] bg-sand-deep">
                {p.image_url && (
                  <Image src={p.image_url} alt={p.model} fill className="object-cover" sizes="40px" />
                )}
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50">
                  {p.brand?.toUpperCase()}
                </div>
                <div className="font-display text-[15px] font-medium tracking-[-0.015em] text-carbon truncate">
                  {p.model}
                </div>
              </div>
              <span className="text-right font-mono text-[13px] font-semibold">
                {hasPrice ? fmt(p.current_price) : '—'}
              </span>
              <span className="text-right font-mono text-[12px] text-ink-50">
                {p.msrp ? fmt(p.msrp) : '—'}
              </span>
              <span className={`text-right font-mono text-[12px] ${(p.discount_pct ?? 0) > 0 ? 'text-moss font-semibold' : 'text-ink-50'}`}>
                {p.discount_pct ? `${p.discount_pct}% off` : '—'}
              </span>
              <span className="text-right font-mono text-[11px] text-ink-50">
                {p.low_90d != null ? `${fmt(p.low_90d)}–${fmt(p.high_90d)}` : '—'}
              </span>
              <span className="flex justify-center">
                <PriceSparkline points={sp} />
              </span>
              <span className="text-right font-mono text-[10px] uppercase tracking-[0.1em] text-ink-50">
                {KIND_LABEL[p.kind]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
