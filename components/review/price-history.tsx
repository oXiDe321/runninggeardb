'use client';
// components/review/price-history.tsx
// 90-day sparkline + "alert me" CTA.
// Client component because the alert button opens a state-aware modal hook.

import { useMemo, useState } from 'react';
import type { PriceHistoryPoint } from '@/lib/review-types';
import { useCurrency } from '@/lib/currency';

export default function PriceHistory({
  points,
  currentPrice,
}: {
  points: PriceHistoryPoint[];
  currentPrice: number | null;
}) {
  const [alertOpen, setAlertOpen] = useState(false);
  const { fmt, symbol } = useCurrency();

  // Reduce to one observation per day, prefer the lowest retailer that day.
  const daily = useMemo(() => {
    const map = new Map<string, number>();
    for (const p of points) {
      const v = Number(p.price_usd);
      if (!Number.isFinite(v)) continue;
      const prev = map.get(p.observed_on);
      if (prev == null || v < prev) map.set(p.observed_on, v);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([d, v]) => ({ d, v }));
  }, [points]);

  if (daily.length < 2) {
    // Still render the card so the rail layout is stable — just say "tracking now."
    return (
      <div className="mt-3.5 rounded border border-rule bg-paper p-[18px]">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
            price · 90 days
          </span>
          <span className="font-mono text-[10.5px] text-ink-50">tracking…</span>
        </div>
        <div className="mt-1 font-display text-[28px] font-semibold tracking-[-0.03em] text-carbon">
          {fmt(currentPrice)}
        </div>
        <div className="mt-1.5 font-mono text-[11px] text-ink-50">
          History fills in after a few days of price-checks.
        </div>
      </div>
    );
  }

  const prices = daily.map((d) => d.v);
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const w = 280;
  const h = 70;
  const step = w / (daily.length - 1);
  const yFor = (v: number) => (max === min ? h / 2 : h - ((v - min) / (max - min)) * h);
  const path = daily.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * step},${yFor(d.v)}`).join(' ');
  const area = `${path} L ${w},${h} L 0,${h} Z`;

  const last = daily[daily.length - 1].v;
  const first = daily[0].v;
  const delta = last - first;
  const nearLow = last <= min * 1.02;

  return (
    <div className="mt-3.5 rounded border border-rule bg-paper p-[18px]">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
          price · 90 days
        </span>
        <span className={`font-mono text-[10.5px] ${nearLow ? 'text-moss' : 'text-ink-50'}`}>
          {nearLow ? '● near 90-day low' : `range ${fmt(min)}–${fmt(max)}`}
        </span>
      </div>

      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-display text-[30px] font-semibold tracking-[-0.03em] text-carbon">
          {fmt(last)}
        </span>
        {delta !== 0 && (
          <span className="font-mono text-[11.5px] text-ink-50">
            {delta < 0 ? '↓' : '↑'} {fmt(Math.abs(delta))} since{' '}
            {daily[0].d.slice(5)}
          </span>
        )}
      </div>

      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="76" className="mt-2 block">
        <defs>
          <linearGradient id="rgdb-price-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-rust)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--color-rust)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#rgdb-price-grad)" />
        <path d={path} stroke="var(--color-rust)" strokeWidth="1.5" fill="none" />
        <circle cx={w} cy={yFor(last)} r="3.5" fill="var(--color-rust)" />
      </svg>

      <button
        type="button"
        onClick={() => setAlertOpen(true)}
        className="mt-2.5 w-full rounded-[3px] border border-carbon bg-transparent py-[9px] font-mono text-[11.5px] font-semibold text-carbon"
      >
        + alert me when price drops
      </button>

      {alertOpen && (
        <div className="mt-2 rounded-[3px] border border-rule bg-sand-deep p-2.5 font-mono text-[11.5px] text-carbon">
          Email me when {`${fmt(last)} ↓ ${symbol}`}
          <input
            type="number"
            defaultValue={Math.max(min, last - 10)}
            className="mx-1 w-14 border-b border-carbon bg-transparent px-1 text-right"
          />
          <input
            type="email"
            placeholder="you@trail.run"
            className="ml-1 w-40 border-b border-carbon bg-transparent px-1"
          />
          <button className="ml-2 rounded-[3px] bg-carbon px-2 py-0.5 text-sand">set →</button>
        </div>
      )}
    </div>
  );
}
