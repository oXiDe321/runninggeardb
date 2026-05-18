// components/nav.tsx — Specs-Engine version. Server component.
// Includes the terminal-style topbar pulling live SKU counts from Supabase.

import Link from 'next/link';
import Logo from './logo';
import SearchTrigger from './search-trigger';
import { supabase } from '@/lib/supabase';
import { getAllSearchableProducts } from '@/lib/search-data';

const links = [
  { href: '/shoes',       label: '/shoes' },
  { href: '/vests',       label: '/vests' },
  { href: '/gels',        label: '/fuel' },
  { href: '/compare',     label: '/compare' },
  { href: '/finder',      label: '/finder' },
  { href: '/prices',      label: '/prices' },
  { href: '/changelog',   label: '/changelog' },
];

async function getCounts() {
  const [shoes, vests, gels] = await Promise.all([
    supabase.from('shoes').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('vests').select('id', { count: 'exact', head: true }).eq('published', true),
    supabase.from('gels').select('id', { count: 'exact', head: true }).eq('published', true),
  ]);
  const s = shoes.count ?? 0;
  const v = vests.count ?? 0;
  const g = gels.count ?? 0;
  return { shoes: s, vests: v, gels: g, total: s + v + g };
}

export default async function Nav() {
  const [counts, searchProducts] = await Promise.all([
    getCounts(),
    getAllSearchableProducts(),
  ]);
  return (
    <nav className="sticky top-0 z-30 bg-sand">
      {/* Topbar */}
      <div className="bg-carbon px-8 py-2 font-mono text-[10.5px] tracking-[0.06em] text-sand">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex gap-6">
            <span><span className="text-ochre">●</span> RGD/INDEX</span>
            <span>SKU·{counts.total}</span>
            <span>SHOES·{counts.shoes}</span>
            <span>VESTS·{counts.vests}</span>
            <span>FUEL·{counts.gels}</span>
            <span className="text-ink-30">SYNC·LIVE</span>
          </div>
          <div className="hidden gap-6 text-ink-30 md:flex">
            <span>v4.2</span>
            <span><span className="text-moss">●</span> STATUS · OK</span>
            <span>USD · METRIC</span>
          </div>
        </div>
      </div>

      {/* Main row */}
      <div className="border-b border-rule px-8 py-3.5">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" aria-label="RunningGearDB home">
            <Logo />
          </Link>

          <div className="hidden items-center gap-1 rounded border border-rule bg-paper p-1 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-[3px] px-3.5 py-1.5 font-mono text-[12px] text-carbon hover:bg-carbon hover:text-sand"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <SearchTrigger products={searchProducts} />
        </div>
      </div>
    </nav>
  );
}
