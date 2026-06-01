'use client';
// lib/currency.tsx — Currency context: AUD ↔ USD toggle, persisted to localStorage.
// Default is AUD (amazon.com.au affiliate links). DB stores AUD values.

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Currency = 'AUD' | 'USD';

// Approximate exchange rate — update periodically. 1 AUD ≈ 0.65 USD.
export const AUD_TO_USD = 0.65;

interface CurrencyCtx {
  currency: Currency;
  toggle: () => void;
  fmt: (aud: number | null | undefined) => string;
  symbol: string;
}

const Ctx = createContext<CurrencyCtx>({
  currency: 'AUD',
  toggle: () => {},
  fmt: (v) => (v == null ? '—' : `A$${v}`),
  symbol: 'A$',
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('AUD');

  // Hydrate from localStorage after mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('rgd-currency') as Currency | null;
      if (stored === 'USD' || stored === 'AUD') setCurrency(stored);
    } catch {}
  }, []);

  const toggle = () =>
    setCurrency((prev) => {
      const next = prev === 'AUD' ? 'USD' : 'AUD';
      try { localStorage.setItem('rgd-currency', next); } catch {}
      return next;
    });

  const fmt = (aud: number | null | undefined): string => {
    if (aud == null) return '—';
    if (currency === 'AUD') return `A$${aud}`;
    return `$${Math.round(aud * AUD_TO_USD)}`;
  };

  const symbol = currency === 'AUD' ? 'A$' : '$';

  return <Ctx.Provider value={{ currency, toggle, fmt, symbol }}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  return useContext(Ctx);
}
