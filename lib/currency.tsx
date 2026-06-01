'use client';
// lib/currency.tsx — Currency + units context.
// Toggling currency (AUD ↔ USD) also flips the measurement system:
//   AUD → metric  (grams)
//   USD → imperial (ounces)
// Persisted to localStorage. Default is AUD / metric (amazon.com.au links).

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Currency = 'AUD' | 'USD';
export type Units = 'metric' | 'imperial';

// Approximate exchange rate — update periodically. 1 USD ≈ 1.55 AUD.
export const USD_TO_AUD = 1.55;
const GRAMS_PER_OZ = 28.3495;

function unitsFor(currency: Currency): Units {
  return currency === 'USD' ? 'imperial' : 'metric';
}

function fmtUsd(usd: number | null | undefined, currency: Currency): string {
  if (usd == null) return '—';
  if (currency === 'USD') return `$${Math.round(usd)}`;
  return `A$${Math.round(usd * USD_TO_AUD)}`;
}

function fmtGrams(g: number | null | undefined, units: Units): string {
  if (g == null) return '—';
  if (units === 'imperial') return `${(g / GRAMS_PER_OZ).toFixed(1)}oz`;
  return `${Math.round(g)}g`;
}

interface CurrencyCtx {
  currency: Currency;
  units: Units;
  toggle: () => void;
  fmt: (usd: number | null | undefined) => string;
  fmtWeight: (grams: number | null | undefined) => string;
  symbol: string;
  weightUnit: string;
}

const Ctx = createContext<CurrencyCtx>({
  currency: 'AUD',
  units: 'metric',
  toggle: () => {},
  fmt: (v) => fmtUsd(v, 'AUD'),
  fmtWeight: (g) => fmtGrams(g, 'metric'),
  symbol: 'A$',
  weightUnit: 'g',
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

  const units = unitsFor(currency);
  const fmt = (usd: number | null | undefined) => fmtUsd(usd, currency);
  const fmtWeight = (grams: number | null | undefined) => fmtGrams(grams, units);
  const symbol = currency === 'USD' ? '$' : 'A$';
  const weightUnit = units === 'imperial' ? 'oz' : 'g';

  return (
    <Ctx.Provider value={{ currency, units, toggle, fmt, fmtWeight, symbol, weightUnit }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCurrency() {
  return useContext(Ctx);
}
