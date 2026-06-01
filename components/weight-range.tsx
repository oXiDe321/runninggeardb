'use client';
// components/weight-range.tsx — Inline min–max weight range that follows the
// units toggle (g ↔ oz). Used for aggregate range chips (e.g. category cards).

import { useCurrency } from '@/lib/currency';

export default function WeightRange({
  min,
  max,
}: {
  min: number;
  max: number;
}) {
  const { fmtWeight } = useCurrency();
  if (!Number.isFinite(min) || !Number.isFinite(max)) return <>—</>;
  if (min === max) return <>{fmtWeight(min)}</>;
  return <>{fmtWeight(min)}–{fmtWeight(max)}</>;
}
