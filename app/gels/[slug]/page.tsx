// app/gels/[slug]/page.tsx
// Gel review page — Specs-Engine template adapted for nutrition products.

export const revalidate = 300;

import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { getGelReview, getAllGelSlugs } from '@/lib/review-data';
import { getCategoryStats } from '@/lib/stats-data';
import { affiliateUrl, amazonSearchUrl, amazonAsinUrl } from '@/lib/amazon';
import { AMAZON_ENRICHMENT } from '@/lib/amazon-enrichment';

import DisclosureStrip from '@/components/review/disclosure-strip';
import BestForMatrix from '@/components/review/best-for-matrix';
import CommunityQuotes from '@/components/review/community-quotes';
import AiTransparency from '@/components/review/ai-transparency';
import StickyBuyBar from '@/components/review/sticky-buy-bar';
import ReviewProse from '@/components/review/review-prose';

const SITE_URL = 'https://runninggeardb.com';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// ── Metadata ──────────────────────────────────────────────────────
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const review = await getGelReview(slug);
  if (!review) return { title: 'Gel not found · RunningGearDB' };

  const title = `${review.brand} ${review.product} Review · RunningGearDB`;
  const description = review.tagline ?? `${review.brand} ${review.product}: nutrition facts, community consensus.`;
  const url = `${SITE_URL}/gels/${review.slug}`;

  return {
    title, description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article', url, title, description,
      images: review.image_url ? [{ url: review.image_url }] : [],
      siteName: 'RunningGearDB',
    },
    twitter: { card: 'summary_large_image', title, description, images: review.image_url ? [review.image_url] : [] },
  };
}

export async function generateStaticParams() {
  const slugs = await getAllGelSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ── Helpers ─────────────────────────────────────────────────────
function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.split(/\s+/).length / 200));
}

function firstWords(content: string, n: number): string {
  const words = content.split(/\s+/).slice(0, n);
  return words.join(' ') + (content.split(/\s+/).length > n ? '…' : '');
}

function delta(val: number | null, avg: number | null): string | null {
  if (val == null || avg == null) return null;
  const diff = val - avg;
  if (Math.abs(diff) < 0.05) return 'avg';
  return diff > 0 ? `+${diff.toFixed(1)}` : diff.toFixed(1);
}

// ── Page ─────────────────────────────────────────────────────────
export default async function GelReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const [r, stats] = await Promise.all([
    getGelReview(slug),
    getCategoryStats('gels'),
  ]);
  if (!r) return notFound();

  const enrichment = AMAZON_ENRICHMENT[r.slug];
  const rawAmazonUrl = r.amazon_url && r.amazon_url !== 'https://amazon.com' ? r.amazon_url : null;
  const buyUrl =
    r.retailer_prices[0]?.url
      ? affiliateUrl(r.retailer_prices[0].url)
      : r.affiliate_url
        ? affiliateUrl(r.affiliate_url)
        : rawAmazonUrl
          ? affiliateUrl(rawAmazonUrl)
          : enrichment
            ? amazonAsinUrl(enrichment.asin)
            : amazonSearchUrl(r.brand, r.product);

  const wordCount = r.review_content ? r.review_content.split(/\s+/).length : 0;
  const readMin = r.review_content ? readingTime(r.review_content) : 0;

  return (
    <div className="bg-sand font-sans text-carbon">
      <DisclosureStrip />

      {/* ── Header strip ───────────────────────────────────────── */}
      <header className="border-b border-rule px-4 pb-6 pt-6 sm:px-6 sm:pb-[22px] sm:pt-7 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-ink-50">
            rgd ▸ index ▸ gels ▸ <span className="text-rust">{r.slug}</span>
          </div>
          <div className="mt-3.5">
            <div>
              <div className="mb-1.5 font-mono text-[11.5px] tracking-[0.14em] text-ink-50">
                <span className="text-rust">● REVIEW</span> · SKU {r.id.slice(0, 4).toUpperCase()}
                {r.human_edited_at && (
                  <>
                    {' · UPDATED '}
                    {new Date(r.human_edited_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).toUpperCase().replace(/ /g, '-')}
                  </>
                )}
              </div>
              <h1 className="m-0 font-display text-[40px] font-semibold leading-[0.96] tracking-[-0.04em] sm:text-[56px] lg:text-[72px]">
                {r.brand} <span className="text-rust">{r.product}.</span>
              </h1>
              {r.tagline && (
                <p className="mt-3.5 max-w-[560px] font-mono text-[16px] leading-[1.6] text-ink-70">
                  &gt; {r.tagline}
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Gel spec sheet ─────────────────────────────────────── */}
      <section className="border-b border-rule px-8 py-5">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-rust">nutrition facts</span>
          <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            <SpecGroup label="macros" items={[
              ['carbs', r.carbs_per_serving_g != null ? `${r.carbs_per_serving_g}g` : null],
              ['sodium', r.sodium_mg != null ? `${r.sodium_mg}mg` : null],
              ['caffeine', r.caffeine_mg != null ? `${r.caffeine_mg}mg` : r.caffeine_mg === 0 ? '0mg' : null],
              ['calories', r.calories != null ? String(r.calories) : null],
            ]} />
            <SpecGroup label="type" items={[
              ['format', r.format],
              ['real food', r.real_food ? 'yes' : 'no'],
              ['FODMAP', r.fodmap_friendly ? 'friendly' : '—'],
            ]} />
            <SpecGroup label="testing" items={[
              ['servings tested', r.servings_tested != null ? String(r.servings_tested) : null],
              ['ai drafted', r.ai_drafted_at ? new Date(r.ai_drafted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : null],
            ]} />
          </div>
        </div>
      </section>

      {/* ── Two-column main ─────────────────────────────────────── */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 border-b border-rule lg:grid-cols-[1.55fr_1fr]">
        <article className="border-b border-rule px-4 pb-10 pt-6 sm:px-6 lg:border-b-0 lg:border-r lg:px-8">
          <BestForMatrix bestFor={r.best_for} notFor={r.not_for} />

          {r.image_url && (
            <figure className="mt-6">
              <div className="relative aspect-[16/9] overflow-hidden bg-sand-deep">
                <Image src={r.image_url} alt={`${r.brand} ${r.product}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <figcaption className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-50">
                Fig. 01 · {r.brand} {r.product}
              </figcaption>
            </figure>
          )}

          {/* ── Collapsed prose review ──────────────────────────── */}
          {r.review_content ? (
            <details className="mt-6 group" open={wordCount < 300}>
              <summary className="cursor-pointer select-none rounded-[3px] border border-rule bg-paper px-4 py-3 font-mono text-[12px] text-ink-70 hover:border-carbon marker:content-none">
                <span className="text-rust">▶</span>{' '}
                Read full review ({wordCount.toLocaleString()} words, {readMin} min)
                <span className="ml-2 text-ink-50 text-[11px]">— {firstWords(r.review_content, 40)}</span>
              </summary>
              <div className="mt-4"><ReviewProse content={r.review_content} /></div>
            </details>
          ) : (
            <p className="mt-6 font-mono text-[13px] text-ink-50 text-center py-8">Full review coming soon.</p>
          )}

          {/* ── Versus the field ────────────────────────────────── */}
          {r.related.length > 0 && (
            <section className="mt-9">
              <h2 className="mb-3.5 font-display text-[30px] font-semibold tracking-[-0.03em]">· Versus the field</h2>
              <div className="overflow-x-auto rounded border border-rule">
                <div className="grid grid-cols-[1.4fr_70px_70px] bg-sand-deep px-3.5 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50" style={{ minWidth: '300px' }}>
                  <span>product</span><span className="text-right">carbs</span><span className="text-right">Na</span>
                </div>
                {[{ id: r.id, brand: r.brand, name: r.product, image_url: r.image_url, carbs_per_serving_g: r.carbs_per_serving_g, sodium_mg: r.sodium_mg, self: true },
                  ...r.related.map((x) => ({ ...x, name: x.product, self: false }))].map((c: any, i, arr) => (
                  <div key={c.id} style={{ minWidth: '300px' }}
                    className={`grid grid-cols-[1.4fr_70px_70px] items-center px-3.5 py-2.5 font-mono text-[12.5px] ${i < arr.length - 1 ? 'border-b border-rule-soft' : ''} ${c.self ? 'bg-rust/[0.06]' : ''}`}>
                    <span><span className="text-ink-50">{c.brand}</span> {c.name}{c.self && <span className="ml-1.5 text-rust">★ this</span>}</span>
                    <span className="text-right">{c.carbs_per_serving_g}g</span>
                    <span className="text-right">{c.sodium_mg}mg</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <CommunityQuotes quotes={r.quotes} />

          <AiTransparency tester={r.tester} editor={r.human_editor} milesTested={null} weeksTested={null} testTerrain={null} aiDraftedAt={r.ai_drafted_at} humanEditedAt={r.human_edited_at} reviewId={r.id} />
        </article>

        {/* RIGHT RAIL */}
        <aside className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
          {/* Buy CTA */}
          <a
            href={buyUrl}
            rel="sponsored nofollow noopener"
            target="_blank"
            className="block w-full rounded bg-carbon px-[22px] py-5 text-center font-mono text-[14px] font-semibold tracking-[0.04em] text-sand"
          >
            View on Amazon →
          </a>

          {/* vs category avg */}
          <div className="mt-3.5 rounded border border-rule bg-paper p-[18px]">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">vs category avg</span>
            <div className="mt-2.5 font-mono text-[12px]">
              {[
                { label: 'carbs', val: r.carbs_per_serving_g, avg: stats.avg_weight_g, unit: 'g' },
              ].filter(({ val, avg }) => val != null && avg != null).map(({ label, val, avg, unit }) => {
                const d = delta(val, avg);
                const better = (val! > avg!);
                return (
                  <div key={label} className="flex justify-between border-b border-rule-soft py-1.5">
                    <span className="text-ink-50">{label}</span>
                    <span>
                      <span className="text-carbon">{val}{unit}</span>
                      <span className={`ml-2 text-[11px] ${d === 'avg' ? 'text-ink-50' : better ? 'text-moss' : 'text-ink-50'}`}>
                        {d === 'avg' ? 'avg' : `${d} vs avg ${avg?.toFixed(1)}${unit}`}
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 font-mono text-[10px] text-ink-50">vs {stats.count} gels in category</div>
          </div>

          {/* See also */}
          {r.related.length > 0 && (
            <div className="mt-3.5 rounded border border-rule bg-paper p-[18px]">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">see also</span>
              <ul className="mt-2.5 grid gap-2.5">
                {r.related.map((c) => (
                  <li key={c.id} className="grid grid-cols-[44px_1fr] items-center gap-3">
                    <a href={`/gels/${c.slug}`} className="relative block h-11 w-11 overflow-hidden rounded-[3px]">
                      {c.image_url && <Image src={c.image_url} alt={c.product} fill className="object-cover" sizes="44px" />}
                    </a>
                    <a href={`/gels/${c.slug}`}>
                      <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-50">{c.brand.toUpperCase()}</div>
                      <div className="font-display text-[15px] font-medium tracking-[-0.015em] text-carbon">{c.product}</div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <StickyBuyBar brand={r.brand} model={r.product} discipline="" buyUrl={buyUrl} image={r.image_url} />
    </div>
  );
}

// ── Inline spec group ────────────────────────────────────────────
function SpecGroup({ label, items }: { label: string; items: [string, string | null][] }) {
  const visible = items.filter(([, v]) => v != null);
  if (visible.length === 0) return null;
  return (
    <div className="min-w-0">
      <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50 mb-1.5">{label}</div>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {visible.map(([k, v]) => (
          <div key={k} className="flex items-baseline gap-1.5 font-mono text-[13px]">
            <span className="text-ink-50 text-[11px]">{k}</span>
            <span className="text-carbon">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
