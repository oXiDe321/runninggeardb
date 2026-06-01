// app/best/[category]/page.tsx
// Programmatic "best for" landing pages: /best/trail-running-shoes, etc.
// Each page is a static pre-rendered list from Supabase, filtered by the
// category config in lib/best-pages.ts.

import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { supabase } from '@/lib/supabase';
import { BEST_PAGES, getBestPage, type BestPageConfig } from '@/lib/best-pages';
import PriceDisplay from '@/components/price-display';
import WeightDisplay from '@/components/weight-display';

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ category: string }>;
}

// ── Static params ─────────────────────────────────────────────────
export function generateStaticParams() {
  return BEST_PAGES.map((p) => ({ category: p.slug }));
}

// ── Metadata ──────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const cfg = getBestPage(category);
  if (!cfg) return { title: 'Not Found' };

  const url = `https://runninggeardb.com/best/${cfg.slug}`;
  return {
    title: cfg.metaTitle,
    description: cfg.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      title: cfg.metaTitle,
      description: cfg.metaDescription,
      siteName: 'RunningGearDB',
    },
    twitter: {
      card: 'summary_large_image',
      title: cfg.metaTitle,
      description: cfg.metaDescription,
    },
  };
}

// ── Data fetching ─────────────────────────────────────────────────
async function fetchShoes(cfg: BestPageConfig) {
  let query = supabase
    .from('shoes')
    .select('id, slug, brand, model, image_url, our_rating, weight_g, drop_mm, stack_heel_mm, price_usd, discipline, carbon_plate, tagline')
    .eq('published', true);

  if (cfg.filter.discipline) query = query.eq('discipline', cfg.filter.discipline);
  if (cfg.filter.carbon_plate !== undefined) query = query.eq('carbon_plate', cfg.filter.carbon_plate);
  if (cfg.filter.drop_lte !== undefined) query = query.lte('drop_mm', cfg.filter.drop_lte);
  if (cfg.filter.drop_gte !== undefined) query = query.gte('drop_mm', cfg.filter.drop_gte);
  if (cfg.filter.stack_heel_gte !== undefined) query = query.gte('stack_heel_mm', cfg.filter.stack_heel_gte);
  if (cfg.filter.weight_lte !== undefined) query = query.lte('weight_g', cfg.filter.weight_lte);

  const { data } = await query.order('our_rating', { ascending: false }).limit(20);
  return data ?? [];
}

// ── JSON-LD ───────────────────────────────────────────────────────
function BestPageJsonLd({ cfg, shoes, siteUrl }: {
  cfg: BestPageConfig;
  shoes: Array<{ id: string; slug: string; brand: string; model: string; image_url: string | null; our_rating: number | null; price_usd: number | null }>;
  siteUrl: string;
}) {
  const pageUrl = `${siteUrl}/best/${cfg.slug}`;

  const graph: unknown[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Shoes', item: `${siteUrl}/shoes` },
        { '@type': 'ListItem', position: 3, name: cfg.h1, item: pageUrl },
      ],
    },
    {
      '@type': 'ItemList',
      name: cfg.h1,
      description: cfg.metaDescription,
      url: pageUrl,
      numberOfItems: shoes.length,
      itemListElement: shoes.map((s, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Product',
          name: `${s.brand} ${s.model}`,
          url: `${siteUrl}/reviews/${s.slug}`,
          image: s.image_url ?? undefined,
          offers: s.price_usd ? {
            '@type': 'Offer',
            price: s.price_usd,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          } : undefined,
          ...(s.our_rating != null ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: s.our_rating,
              bestRating: 10,
              worstRating: 0,
              ratingCount: 1,
            },
          } : {}),
        },
      })),
    },
  ];

  if (cfg.faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: cfg.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 0),
      }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────
export default async function BestCategoryPage({ params }: PageProps) {
  const { category } = await params;
  const cfg = getBestPage(category);
  if (!cfg) return notFound();

  const shoes = await fetchShoes(cfg);
  const SITE = 'https://runninggeardb.com';

  return (
    <div className="bg-sand text-carbon">
      <BestPageJsonLd cfg={cfg} shoes={shoes} siteUrl={SITE} />

      {/* ── Header ───────────────────────────────────────────────── */}
      <header className="border-b border-rule px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
            <Link href="/" className="hover:text-rust">rgd</Link>
            {' ▸ '}
            <Link href="/shoes" className="hover:text-rust">shoes</Link>
            {' ▸ '}
            <span className="text-rust">{cfg.slug}</span>
          </div>
          <h1 className="m-0 mt-3 font-display text-[44px] font-semibold leading-[0.96] tracking-[-0.04em] sm:text-[60px]">
            {cfg.h1}.
          </h1>
          <p className="mt-4 max-w-[720px] font-mono text-[14px] leading-[1.7] text-ink-70">
            {cfg.intro}
          </p>
          <div className="mt-4 font-mono text-[11.5px] text-ink-50">
            {shoes.length} model{shoes.length !== 1 ? 's' : ''} · sorted by rating ↓ · updated {new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase()}
          </div>
        </div>
      </header>

      {/* ── Ranked list ──────────────────────────────────────────── */}
      <section className="border-b border-rule px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {shoes.length === 0 ? (
            <p className="py-12 text-center font-mono text-[13px] text-ink-50">
              No shoes match these filters yet — check back soon as we add more.
            </p>
          ) : (
            <div className="rounded-[6px] border border-rule bg-paper">
              {/* table header */}
              <div className="hidden md:grid grid-cols-[36px_52px_1.5fr_70px_70px_70px_100px_90px] border-b border-rule bg-sand-deep px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50">
                <span>#</span>
                <span />
                <span>model</span>
                <span className="text-right">drop</span>
                <span className="text-right">weight</span>
                <span className="text-right">stack</span>
                <span className="text-right">price</span>
                <span className="text-right">score ↓</span>
              </div>

              {shoes.map((s, i) => (
                <div key={s.id} className={`border-b border-rule-soft last:border-0${i === 0 ? ' bg-rust/[0.05]' : ''}`}>
                  {/* Mobile */}
                  <Link href={`/reviews/${s.slug}`} className="flex items-center gap-3 px-3 py-3 no-underline md:hidden">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[3px] bg-sand-deep">
                      {s.image_url && <Image src={s.image_url} alt={`${s.brand} ${s.model}`} fill className="object-cover" sizes="56px" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-50">
                        {s.brand?.toUpperCase()} · {(s.discipline as string)?.toUpperCase()}
                      </div>
                      <div className="truncate font-display text-[16px] font-medium tracking-[-0.015em] text-carbon">{s.model}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-ink-50">
                        {s.drop_mm != null ? `${s.drop_mm}mm drop` : '—'} · <WeightDisplay grams={s.weight_g} />
                        {s.price_usd != null ? <> · <PriceDisplay usd={s.price_usd} /></> : ''}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <div className="font-display text-[20px] font-semibold tracking-[-0.02em]" style={{ color: i === 0 ? 'var(--color-rust)' : 'var(--color-carbon)' }}>
                        {s.our_rating ?? '—'}<span className="font-mono text-[9px] text-ink-50">/10</span>
                      </div>
                    </div>
                  </Link>

                  {/* Desktop */}
                  <Link href={`/reviews/${s.slug}`} className="hidden md:grid grid-cols-[36px_52px_1.5fr_70px_70px_70px_100px_90px] items-center gap-3 px-4 py-3.5 no-underline">
                    <span className="font-mono text-[12px] text-ink-50">{String(i + 1).padStart(2, '0')}</span>
                    <div className="relative h-11 w-11 overflow-hidden rounded-[3px] bg-sand-deep">
                      {s.image_url && <Image src={s.image_url} alt={`${s.brand} ${s.model}`} fill className="object-cover" sizes="44px" />}
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50">{s.brand?.toUpperCase()}</div>
                      <div className="truncate font-display text-[17px] font-medium tracking-[-0.015em] text-carbon">{s.model}</div>
                      {s.tagline && <div className="truncate font-mono text-[10.5px] text-ink-50">{s.tagline}</div>}
                    </div>
                    <span className="text-right font-mono text-[13px]">
                      {s.drop_mm != null ? <>{s.drop_mm}<span className="text-ink-50">mm</span></> : <span className="text-ink-50">—</span>}
                    </span>
                    <WeightDisplay grams={s.weight_g} className="text-right font-mono text-[13px]" />
                    <span className="text-right font-mono text-[13px]">
                      {s.stack_heel_mm != null ? <>{s.stack_heel_mm}<span className="text-ink-50">mm</span></> : <span className="text-ink-50">—</span>}
                    </span>
                    <PriceDisplay usd={s.price_usd} className="text-right font-mono text-[13px] font-medium" />
                    <div className="text-right font-display text-[22px] font-semibold tracking-[-0.02em]" style={{ color: i === 0 ? 'var(--color-rust)' : 'var(--color-carbon)' }}>
                      {s.our_rating ?? '—'}<span className="ml-0.5 font-mono text-[10px] text-ink-50">/10</span>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/shoes" className="rounded-[3px] border border-carbon px-4 py-2 font-mono text-[12px] text-carbon">
              Full shoes index →
            </Link>
            <Link href="/compare" className="rounded-[3px] border border-rule px-4 py-2 font-mono text-[12px] text-ink-70">
              Compare side-by-side
            </Link>
            <Link href="/finder" className="rounded-[3px] border border-rule px-4 py-2 font-mono text-[12px] text-ink-70">
              Shoe finder quiz
            </Link>
          </div>
        </div>
      </section>

      {/* ── Buying guide ─────────────────────────────────────────── */}
      <section className="border-b border-rule px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-[28px] font-semibold tracking-[-0.025em]">
            · Buying guide
          </h2>
          <p className="mt-3 font-mono text-[14px] leading-[1.8] text-ink-70">
            {cfg.buyingGuide}
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      {cfg.faqs.length > 0 && (
        <section className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-[28px] font-semibold tracking-[-0.025em]">
              · Frequently asked questions
            </h2>
            <div className="mt-4 divide-y divide-rule">
              {cfg.faqs.map((faq, i) => (
                <div key={i} className="py-4 font-mono text-[13px]">
                  <div className="flex gap-2.5 font-medium text-carbon">
                    <span className="shrink-0 text-rust">Q.</span>
                    <span>{faq.q}</span>
                  </div>
                  <div className="mt-2 flex gap-2.5 leading-[1.7] text-ink-70">
                    <span className="shrink-0 text-moss">A.</span>
                    <span>{faq.a}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
