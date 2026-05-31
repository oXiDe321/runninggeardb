'use client';
// components/price-display.tsx — Inline price that respects the currency context.
// Use wherever a server component needs to show a converted price.

import { useCurrency } from '@/lib/currency';

export default function PriceDisplay({
  usd,
  className,
}: {
  usd: number | null | undefined;
  className?: string;
}) {
  const { fmt } = useCurrency();
  return <span className={className}>{fmt(usd)}</span>;
}
