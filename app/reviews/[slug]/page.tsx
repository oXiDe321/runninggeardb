// app/reviews/[slug]/page.tsx
// v2 review page — server component, async params, JSON-LD graph,
// E-E-A-T scaffolding throughout. Next.js 16 / React 19.

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getShoeReview, getAllShoeSlugs } from '@/lib/review-data';

import DisclosureStrip from '@/components/review/disclosure-strip';
import ScorePanel from '@/components/review/score-panel';
import TesterByline from '@/components/review/tester-byline';
import BestForMatrix from '@/components/review/best-for-matrix';
import RetailerList from '@/components/review/retailer-list';
import PriceHistory from '@/components/review/price-history';
import CommunityQuotes from '@/components/review/community-quotes';
import AiTransparency from '@/components/review/ai-transparency';
import StickyBuyBar from '@/components/review/sticky-buy-bar';
import ReviewProse from '@/components/review/review-prose';
import ReviewJsonLd from '@/components/review/review-jsonld';

const SITE_URL = 'https://runninggeardb.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── Metadata ──────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const review = await getShoeReview(slug);
  if (!review) return { title: 'Review not found · RunningGearDB' };

  const title = `${review.brand} ${review.model} Review — ${review.our_rating ?? '—'}/10 · RunningGearDB`;
  const description =
    review.tagline ??
    `${review.brand} ${review.model}: in-depth review, full specs, live retailer prices.${review.miles_tested ? ` Tested over ${review.miles_tested} miles.` : ''}`;
  const url = `${SITE_URL}/reviews/${review.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      images: review.image_url ? [{ url: review.image_url }] : [],
      siteName: 'RunningGearDB',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: review.image_url ? [review.image_url] : [],
    },
  };
}

// ── Static params (one page per shoe) ─────────────────────────────
export async function generateStaticParams() {
  const slugs = await getAllShoeSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── Page ──────────────────────────────────────────────────────────
export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const r = await getShoeReview(slug);
  if (!r) return notFound();

  const bestPrice = r.retailer_prices[0];
  const buyUrl =
    bestPrice?.url ?? r.affiliate_url ?? r.amazon_url ?? `${SITE_URL}/reviews/${r.slug}`;
  const buyPrice = bestPrice?.price_usd ?? r.price_usd ?? null;
  const lastChecked = bestPrice?.checked_at ?? null;
  const retailer = bestPrice?.retailer ?? 'amazon';

  return (
    <div className="bg-sand font-sans text-carbon">
      <ReviewJsonLd payload={r} siteUrl={SITE_URL} />
      <DisclosureStrip lastCheckedAt={lastChecked} />

      {/* ── Header strip ───────────────────────────────────────── */}
      <header className="border-b border-rule px-8 pb-[22px] pt-7">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-ink-50">
            rgd ▸ index ▸ shoes ▸ {r.discipline} ▸ <span className="text-rust">{r.slug}</span>
          </div>
          <div className="mt-3.5 grid grid-cols-[1.4fr_1fr] gap-12">
            <div>
              <div className="mb-1.5 font-mono text-[11.5px] tracking-[0.14em] text-ink-50">
                <span className="text-rust">● REVIEW</span> · SKU {r.id.slice(0, 4).toUpperCase()}{' '}
                · {r.discipline.toUpperCase()}
                {r.human_edited_at && (
                  <>
                    {' · UPDATED '}
                    {new Date(r.human_edited_at)
                      .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
                      .toUpperCase()
                      .replace(/ /g, '-')}
                  </>
                )}
                {r.miles_tested != null && <> · {r.miles_tested} MI</>}
                {r.peer_reviewer_count > 0 && <> · {r.peer_reviewer_count + 1} TESTERS</>}
              </div>
              <h1 className="m-0 font-display text-[72px] font-semibold leading-[0.96] tracking-[-0.04em]">
                {r.brand} <span className="text-rust">{r.model}.</span>
              </h1>
              {r.tagline && (
                <p className="mt-3.5 max-w-[560px] font-mono text-[16px] leading-[1.6] text-ink-70">
                  &gt; {r.tagline}
                </p>
              )}
            </div>
            {r.our_rating != null && (
              <ScorePanel
                overall={r.our_rating}
                dimensions={r.dimensions}
              />
            )}
          </div>
        </div>
      </header>

      {/* ── Two-column main ─────────────────────────────────────── */}
      <div className="mx-auto grid max-w-7xl grid-cols-[1.55fr_1fr] gap-0 border-b border-rule">
        {/* LEFT */}
        <article className="border-r border-rule px-8 pb-10 pt-6">
          {r.tester && (
            <TesterByline
              tester={r.tester}
              milesTested={r.miles_tested}
              weeksTested={r.weeks_tested}
              testTerrain={r.test_terrain}
              peerReviewers={r.peer_reviewer_count}
            />
          )}

          <BestForMatrix bestFor={r.best_for} notFor={r.not_for} />

          {r.image_url && (
            <figure className="mt-6">
              <div className="aspect-[16/9] overflow-hidden bg-sand-deep">
                <img
                  src={r.image_url}
                  alt={`${r.brand} ${r.model}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-50">
                Fig. 01 · Unit tested
                {r.miles_tested != null && <> · {r.miles_tested} mi</>}
                {r.test_terrain && <> · {r.test_terrain}</>}
              </figcaption>
            </figure>
          )}

          <ReviewProse content={r.review_content} />

          {r.related.length > 0 && (
            <section className="mt-9">
              <h2 className="mb-3.5 font-display text-[30px] font-semibold tracking-[-0.03em]">
                · Versus the field
              </h2>
              <div className="overflow-hidden rounded border border-rule">
                <div className="grid grid-cols-[1.4fr_70px_70px_70px_60px] bg-sand-deep px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50">
                  <span>model</span>
                  <span className="text-right">wt</span>
                  <span className="text-right">drop</span>
                  <span className="text-right">$</span>
                  <span className="text-right">score</span>
                </div>
                {[
                  {
                    id: r.id,
                    brand: r.brand,
                    model: r.model,
                    image_url: r.image_url,
                    weight_g: r.weight_g,
                    drop_mm: r.drop_mm,
                    price_usd: r.price_usd,
                    our_rating: r.our_rating,
                    self: true,
                  },
                  ...r.related.map((x) => ({ ...x, self: false })),
                ].map((c, i, arr) => (
                  <div
                    key={c.id}
                    className={`grid grid-cols-[1.4fr_70px_70px_70px_60px] items-center px-3.5 py-2.5 font-mono text-[12.5px] ${
                      i < arr.length - 1 ? 'border-b border-rule-soft' : ''
                    } ${c.self ? 'bg-rust/[0.06]' : ''}`}
                  >
                    <span>
                      <span className="text-ink-50">{c.brand}</span> {c.model}
                      {c.self && <span className="ml-1.5 text-rust">★ this</span>}
                    </span>
                    <span className="text-right">{c.weight_g}g</span>
                    <span className="text-right">{c.drop_mm}mm</span>
                    <span className="text-right">${c.price_usd}</span>
                    <span className={`text-right ${c.self ? 'font-semibold text-rust' : ''}`}>
                      {c.our_rating}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <CommunityQuotes quotes={r.quotes} />

          {r.faqs.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-2 font-display text-[30px] font-semibold tracking-[-0.03em]">
                · FAQ
              </h2>
              {r.faqs.map((f, i) => (
                <div key={i} className="border-b border-rule py-3.5 font-mono text-[13px]">
                  <div className="flex gap-2.5 font-medium text-carbon">
                    <span className="text-rust">Q.</span>
                    {f.question}
                  </div>
                  <div className="mt-1.5 flex gap-2.5 text-ink-70">
                    <span className="text-moss">A.</span>
                    {f.answer}
                  </div>
                </div>
              ))}
            </section>
          )}

          <AiTransparency
            tester={r.tester}
            editor={r.human_editor}
            milesTested={r.miles_tested}
            weeksTested={r.weeks_tested}
            testTerrain={r.test_terrain}
            aiDraftedAt={r.ai_drafted_at}
            humanEditedAt={r.human_edited_at}
            reviewId={r.id}
          />
        </article>

        {/* RIGHT RAIL */}
        <aside className="px-8 pb-10 pt-6">
          {r.retailer_prices.length > 0 ? (
            <RetailerList prices={r.retailer_prices} msrp={r.msrp_usd} />
          ) : (
            // Single-source fallback so the button is never empty.
            r.amazon_url && buyPrice && (
              <RetailerList
                msrp={r.msrp_usd}
                prices={[
                  {
                    retailer: 'amazon',
                    price_usd: buyPrice,
                    url: r.amazon_url,
                    in_stock: true,
                    stock_label: 'in stock',
                    checked_at: new Date().toISOString(),
                  },
                ]}
              />
            )
          )}

          <PriceHistory points={r.price_history} currentPrice={buyPrice} />

          {/* Spec sheet */}
          <div className="mt-3.5 rounded border border-rule bg-paper p-[18px]">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
              spec sheet
            </span>
            <dl className="mt-2.5 font-mono text-[12px]">
              {[
                ['drop', r.drop_mm != null ? `${r.drop_mm} mm` : null],
                [
                  'weight (M9)',
                  r.in_house_weight_g
                    ? `${r.in_house_weight_g} g · in-house ✓`
                    : r.weight_g
                    ? `${r.weight_g} g`
                    : null,
                ],
                ['stack · heel', r.stack_heel_mm != null ? `${r.stack_heel_mm} mm` : null],
                [
                  'stack · fore',
                  r.stack_forefoot_mm != null ? `${r.stack_forefoot_mm} mm` : null,
                ],
                ['plate', r.carbon_plate ? 'carbon' : '— none'],
                ['rock plate', r.rock_plate ? 'yes' : 'no'],
                ['discipline', r.discipline],
                ['released', r.released_at ? new Date(r.released_at).getFullYear().toString() : null],
                ['msrp', r.msrp_usd ? `$${r.msrp_usd}` : null],
              ]
                .filter(([, v]) => v != null)
                .map(([k, v]) => (
                  <div
                    key={k as string}
                    className="flex justify-between border-b border-rule-soft py-1.5"
                  >
                    <dt className="text-ink-50">{k}</dt>
                    <dd className="text-carbon">{v}</dd>
                  </div>
                ))}
            </dl>
          </div>

          {/* See also */}
          {r.related.length > 0 && (
            <div className="mt-3.5 rounded border border-rule bg-paper p-[18px]">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
                see also
              </span>
              <ul className="mt-2.5 grid gap-2.5">
                {r.related.map((c) => (
                  <li
                    key={c.id}
                    className="grid grid-cols-[44px_1fr_50px] items-center gap-3"
                  >
                    <a
                      href={`/reviews/${c.slug}`}
                      className="h-11 w-11 overflow-hidden rounded-[3px]"
                    >
                      {c.image_url && (
                        <img
                          src={c.image_url}
                          alt={c.model}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </a>
                    <a href={`/reviews/${c.slug}`}>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-50">
                        {c.brand.toUpperCase()}
                      </div>
                      <div className="font-display text-[15px] font-medium tracking-[-0.015em] text-carbon">
                        {c.model}
                      </div>
                    </a>
                    <span className="text-right font-mono text-[12px] text-carbon">
                      {c.our_rating}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <StickyBuyBar
        brand={r.brand}
        model={r.model}
        discipline={r.discipline}
        rating={r.our_rating}
        price={buyPrice}
        retailer={retailer}
        buyUrl={buyUrl}
        image={r.image_url}
      />
    </div>
  );
}
