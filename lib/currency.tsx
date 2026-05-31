'use client';
// lib/currency.tsx — Currency context: USD ↔ AUD toggle, persisted to localStorage.
// Default is AUD (amazon.com.au affiliate links).

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Currency = 'AUD' | 'USD';

// Approximate exchange rate — update periodically. 1 USD ≈ 1.55 AUD.
export const USD_TO_AUD = 1.55;

interface CurrencyCtx {
  currency: Currency;
  toggle: () => void;
  fmt: (usd: number | null | undefined) => string;
  symbol: string;
}

const Ctx = createContext<CurrencyCtx>({
  currency: 'AUD',
  toggle: () => {},
  fmt: (v) => (v == null ? '—' : `A$${Math.round(v * USD_TO_AUD)}`),
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

  const fmt = (usd: number | null | undefined): string => {
    if (usd == null) return '—';
    if (currency === 'USD') return `$${usd}`;
    return `A$${Math.round(usd * USD_TO_AUD)}`;
  };

  const symbol = currency === 'USD' ? '$' : 'A$';

  return <Ctx.Provider value={{ currency, toggle, fmt, symbol }}>{children}</Ctx.Provider>;
}

export function useCurrency() {
  return useContext(Ctx);
}
