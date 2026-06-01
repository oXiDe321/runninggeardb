'use client';
// components/weight-display.tsx — Inline weight that respects the unit system
// (metric grams ↔ imperial ounces). Use wherever a server component needs to
// render a weight that should follow the currency/units toggle.

import { useCurrency } from '@/lib/currency';

export default function WeightDisplay({
  grams,
  className,
  fallback = '—',
}: {
  grams: number | null | undefined;
  className?: string;
  fallback?: string;
}) {
  const { fmtWeight } = useCurrency();
  if (grams == null) return <span className={className}>{fallback}</span>;
  return <span className={className}>{fmtWeight(grams)}</span>;
}
