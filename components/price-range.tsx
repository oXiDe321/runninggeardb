'use client';
// components/price-range.tsx — Inline min–max price range that follows the
// currency toggle. Used for aggregate range chips (e.g. category cards).

import { useCurrency } from '@/lib/currency';

export default function PriceRange({
  min,
  max,
}: {
  min: number;
  max: number;
}) {
  const { fmt } = useCurrency();
  if (!Number.isFinite(min) || !Number.isFinite(max)) return <>—</>;
  if (min === max) return <>{fmt(min)}</>;
  return <>{fmt(min)}–{fmt(max)}</>;
}
