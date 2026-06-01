'use client';
// components/currency-toggle.tsx — Clickable AUD/USD toggle for the nav topbar.

import { useCurrency } from '@/lib/currency';

export default function CurrencyToggle() {
  const { currency, units, toggle } = useCurrency();
  return (
    <button
      onClick={toggle}
      title={currency === 'AUD' ? 'Switch to USD / imperial' : 'Switch to AUD / metric'}
      className="rounded-[2px] px-1.5 py-0.5 font-mono text-[10.5px] tracking-[0.06em] text-ochre transition-colors hover:bg-ochre/20 hover:text-ochre"
    >
      {currency} · {units.toUpperCase()}
    </button>
  );
}
