'use client';
// components/review/retailer-list.tsx
// Multi-retailer live price block. Click-tracked affiliate links live here.

import { affiliateUrl } from '@/lib/amazon';
import type { RetailerPrice } from '@/lib/review-types';
import { useCurrency } from '@/lib/currency';

export default function RetailerList({
  prices,
  msrp,
}: {
  prices: RetailerPrice[];
  msrp: number | null;
}) {
  const { fmt } = useCurrency();
  if (!prices.length) return null;
  const best = prices[0];
  const discountPct =
    msrp && best.price_usd < msrp ? Math.round(((msrp - best.price_usd) / msrp) * 100) : 0;

  return (
    <div className="rounded bg-carbon p-[22px] text-sand">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ochre">
          best price · live
        </span>
        <span className="font-mono text-[10.5px] text-ink-30">
          checked {timeAgoShort(best.checked_at)}
        </span>
      </div>

      <div className="mt-1.5 flex items-baseline gap-2.5">
        <span className="font-display text-[56px] font-semibold leading-none tracking-[-0.04em]">
          {fmt(best.price_usd)}
        </span>
        {msrp && best.price_usd < msrp && (
          <>
            <span className="font-mono text-[13px] text-ink-30 line-through">{fmt(msrp)}</span>
            <span className="ml-auto font-mono text-[11px] text-ochre">−{discountPct}%</span>
          </>
        )}
      </div>

      <a
        href={affiliateUrl(best.url)}
        rel="sponsored nofollow noopener"
        target="_blank"
        className="mt-3.5 block w-full rounded-[3px] bg-rust py-[13px] text-center font-mono text-[13px] font-semibold tracking-[0.04em] text-sand"
      >
        BUY ON {best.retailer.toUpperCase()} →
      </a>

      {prices.length > 1 && (
        <div className="mt-2 grid gap-1.5">
          {prices.slice(1).map((p) => (
            <a
              key={p.retailer}
              href={affiliateUrl(p.url)}
              rel="sponsored nofollow noopener"
              target="_blank"
              className="grid grid-cols-[1fr_auto_auto] gap-2 rounded-[3px] bg-carbon-80 px-2.5 py-[7px] font-mono text-[11.5px]"
            >
              <span className="capitalize">{p.retailer}</span>
              <span>{fmt(p.price_usd)}</span>
              <span className={p.stock_label?.includes('low') ? 'text-ochre' : 'text-moss'}>
                ● {p.stock_label ?? (p.in_stock ? 'in stock' : 'out')}
              </span>
            </a>
          ))}
        </div>
      )}

      <div className="mt-2.5 font-mono text-[9.5px] uppercase leading-[1.5] tracking-[0.12em] text-ink-30">
        RGD earns a commission on qualifying purchases · re-checked every 30 min
      </div>
    </div>
  );
}

function timeAgoShort(iso: string) {
  const sec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return `just now`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86400)}d ago`;
}
