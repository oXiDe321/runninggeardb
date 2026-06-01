// app/best/page.tsx — Index of all "best for" category pages.
// Acts as an internal linking hub and a crawlable entry point.

import Link from 'next/link';
import type { Metadata } from 'next';
import { BEST_PAGES } from '@/lib/best-pages';

export const metadata: Metadata = {
  title: 'Best Running Gear Guides — By Category & Use Case',
  description: 'Find the best running shoes for every use case: trail, road, Hyrox, zero drop, max cushion, carbon plate, and more. Every recommendation backed by spec data.',
  openGraph: {
    type: 'website',
    url: 'https://runninggeardb.com/best',
    title: 'Best Running Gear Guides — By Category & Use Case',
    description: 'Find the best running shoes for every use case: trail, road, Hyrox, zero drop, max cushion, carbon plate, and more. Every recommendation backed by spec data.',
  },
  alternates: { canonical: 'https://runninggeardb.com/best' },
};

export default function BestIndexPage() {
  return (
    <div className="bg-sand text-carbon">
      <header className="border-b border-rule px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
            <Link href="/" className="hover:text-rust">rgd</Link>
            {' ▸ '}
            <span className="text-rust">best</span>
          </div>
          <h1 className="m-0 mt-3 font-display text-[48px] font-semibold leading-[0.96] tracking-[-0.04em] sm:text-[64px]">
            Best running gear.
            <br />
            <span className="text-rust">By the numbers.</span>
          </h1>
          <p className="mt-4 max-w-[680px] font-mono text-[14px] leading-[1.7] text-ink-70">
            Every "best for" list on this site is generated directly from our spec database — no affiliate ranking, no sponsored placements. Sort by the numbers that matter.
          </p>
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {BEST_PAGES.map((p) => (
              <Link
                key={p.slug}
                href={`/best/${p.slug}`}
                className="block rounded-[6px] border border-rule bg-paper p-5 hover:border-carbon"
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-rust">
                  /best/{p.slug}
                </span>
                <h2 className="m-0 mt-2 font-display text-[20px] font-semibold tracking-[-0.02em]">
                  {p.h1}
                </h2>
                <p className="mt-1.5 font-mono text-[12px] leading-[1.6] text-ink-50 line-clamp-2">
                  {p.metaDescription}
                </p>
                <span className="mt-3 inline-block font-mono text-[11.5px] text-rust">
                  view rankings →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
