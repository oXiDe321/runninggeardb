// app/page.tsx — Specs-Engine homepage.
// Server component: live SKU counts, top-12 table, category cards,
// changelog feed + recent price changes.

import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export const revalidate = 300;

async function loadHome() {
  const [shoesRes, vestsRes, gelsRes, topRes, changelogRes, priceLogRes] = await Promise.all([
    supabase.from('shoes').select('id, weight_g, drop_mm, stack_heel_mm, price_usd', { count: 'exact' }).eq('published', true),
    supabase.from('vests').select('id, capacity_l, weight_g, price_usd', { count: 'exact' }).eq('published', true),
    supabase.from('gels').select('id, carbs_per_serving_g, caffeine_mg, price_per_serving', { count: 'exact' }).eq('published', true),
    supabase
      .from('shoes')
      .select('id, slug, brand, model, image_url, our_rating, weight_g, drop_mm, stack_heel_mm, price_usd, discipline, carbon_plate, tagline')
      .eq('published', true)
      .order('our_rating', { ascending: false })
      .limit(12),
    supabase
      .from('changelog')
      .select('id, occurred_at, kind, summary')
      .order('occurred_at', { ascending: false })
      .limit(6),
    supabase
      .from('changelog')
      .select('id, occurred_at, kind, summary')
      .eq('kind', 'price')
      .order('occurred_at', { ascending: false })
      .limit(5),
  ]);

  const shoesData = shoesRes.data ?? [];
  const vestsData = vestsRes.data ?? [];
  const gelsData  = gelsRes.data  ?? [];

  const range = (arr: number[]) => {
    const f = arr.filter((n) => Number.isFinite(n));
    return f.length ? [Math.min(...f), Math.max(...f)] : [0, 0];
  };

  const shoeStats = {
    count: shoesRes.count ?? shoesData.length,
    weight: range(shoesData.map((s: any) => Number(s.weight_g))),
    drop:   range(shoesData.map((s: any) => Number(s.drop_mm))),
    stack:  range(shoesData.map((s: any) => Number(s.stack_heel_mm))),
    price:  range(shoesData.map((s: any) => Number(s.price_usd))),
  };
  const vestStats = {
    count: vestsRes.count ?? vestsData.length,
    cap: range(vestsData.map((s: any) => Number(s.capacity_l))),
    weight: range(vestsData.map((s: any) => Number(s.weight_g))),
    price: range(vestsData.map((s: any) => Number(s.price_usd))),
  };
  const gelStats = {
    count: gelsRes.count ?? gelsData.length,
    carbs: range(gelsData.map((s: any) => Number(s.carbs_per_serving_g))),
    caffeine: range(gelsData.map((s: any) => Number(s.caffeine_mg))),
    price: range(gelsData.map((s: any) => Number(s.price_per_serving))),
  };

  const totalCount = shoeStats.count + vestStats.count + gelStats.count;
  const allPrices = [
    ...shoesData.map((s: any) => Number(s.price_usd)),
    ...vestsData.map((s: any) => Number(s.price_usd)),
  ].filter(Number.isFinite);
  const avgPrice =
    allPrices.length > 0 ? (allPrices.reduce((a, b) => a + b, 0) / allPrices.length).toFixed(2) : '—';

  return {
    totalCount,
    shoeStats,
    vestStats,
    gelStats,
    top: topRes.data ?? [],
    changelog: changelogRes.data ?? [],
    priceLog: priceLogRes.data ?? [],
    avgPrice,
  };
}

export default async function HomePage() {
  const d = await loadHome();

  const kindColor: Record<string, string> = {
    add: 'var(--color-moss)',
    update: 'var(--color-ochre)',
    price: 'var(--color-ochre)',
    review: 'var(--color-moss)',
    remove: 'var(--color-rust)',
  };
  const kindLabel: Record<string, string> = {
    add: '+ADD',
    update: '~UPD',
    price: '~PRC',
    review: '+REV',
    remove: '−RMV',
  };

  return (
    <div className="bg-sand text-carbon">
      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="border-b border-rule px-8 pb-12 pt-14">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-end gap-12 lg:grid-cols-[7fr_5fr]">
          <div>
            <div className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
              · RGD/INDEX · {d.totalCount} SKU · {monthYear()} ·
            </div>
            <h1 className="m-0 mt-5 font-display text-[96px] font-semibold leading-[0.92] tracking-[-0.045em]">
              Running gear,
              <br />
              <span className="text-rust">by the numbers.</span>
            </h1>
            <p className="mt-5 max-w-[600px] font-mono text-[15px] leading-[1.6] text-ink-70">
              [{d.totalCount}] SKU indexed across 9 disciplines. Every spec measured,
              normalized, sortable, kept honest. Less listicle, more{' '}
              <code className="rounded bg-paper px-1.5 py-0.5 text-carbon">SELECT * FROM gear</code>.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Link
                href="/shoes"
                className="rounded-[3px] bg-carbon px-[22px] py-3.5 font-mono text-[13px] font-medium text-sand"
              >
                browse the index →
              </Link>
              <Link
                href="/finder"
                className="rounded-[3px] border border-carbon bg-paper px-[22px] py-3.5 font-mono text-[13px] font-medium text-carbon"
              >
                find your shoe (5 questions) ⇄
              </Link>
              <Link
                href="/compare"
                className="rounded-[3px] border border-carbon bg-paper px-[22px] py-3.5 font-mono text-[13px] font-medium text-carbon"
              >
                run a comparison
              </Link>
            </div>
          </div>

          {/* live stats panel */}
          <div className="rounded-[6px] border border-rule bg-paper p-5">
            <div className="mb-3.5 flex items-center justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-50">
                system · live
              </span>
              <span className="font-mono text-[10.5px] text-moss">● live</span>
            </div>
            {[
              ['SKU indexed', String(d.totalCount), 'all categories'],
              ['Reviews live', `${d.totalCount} / ${d.totalCount}`, '100% coverage'],
              ['Avg price', `$${d.avgPrice}`, 'shoes + vests'],
              ['Categories', '3', 'shoes · vests · fuel'],
              ['Editorial standards', 'Published', 'all data sourced from manufacturers'],
            ].map(([l, v, d2], i, arr) => (
              <div
                key={l}
                className={`grid grid-cols-[1fr_auto] gap-3 py-3 ${
                  i < arr.length - 1 ? 'border-b border-rule' : ''
                }`}
              >
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50">
                    {l}
                  </div>
                  <div className="mt-0.5 font-display text-[19px] font-medium tracking-[-0.02em]">
                    {v}
                  </div>
                </div>
                <div className="self-end font-mono text-[11px] text-moss">{d2}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE INDEX (top-12) ──────────────────────────────────── */}
      <section className="border-b border-rule px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
                · the index · top-12 · sorted_by · rating ↓
              </span>
              <h2 className="m-0 mt-2 font-display text-[48px] font-semibold tracking-[-0.03em]">
                Browse like a database.
              </h2>
            </div>
            <Link
              href="/shoes"
              className="rounded-[3px] border border-carbon px-3 py-1.5 font-mono text-[12px] text-carbon"
            >
              see all {d.shoeStats.count} shoes →
            </Link>
          </div>

          <div className="overflow-hidden rounded-[6px] border border-rule bg-paper">
            <div className="grid grid-cols-[40px_56px_1.6fr_60px_70px_70px_70px_90px_120px] border-b border-rule bg-sand-deep px-4 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50">
              <span>#</span><span /><span>brand / model</span>
              <span className="text-right">drop</span>
              <span className="text-right">wt</span>
              <span className="text-right">stack</span>
              <span className="text-right">$</span>
              <span className="text-right">score ↓</span>
              <span className="text-right" />
            </div>
            {d.top.map((s: any, i: number) => (
              <Link
                key={s.id}
                href={`/reviews/${s.slug}`}
                className={`grid grid-cols-[40px_56px_1.6fr_60px_70px_70px_70px_90px_120px] items-center border-b border-rule-soft px-4 py-3.5 last:border-0 ${
                  i === 0 ? 'bg-rust/[0.05]' : ''
                }`}
              >
                <span className="font-mono text-[12px] text-ink-50">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="h-11 w-11 overflow-hidden rounded-[3px] bg-sand-deep">
                  {s.image_url && (
                    <img src={s.image_url} alt={s.model} className="h-full w-full object-cover" />
                  )}
                </div>
                <div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-ink-50">
                    {s.brand?.toUpperCase()} · {s.discipline?.toUpperCase()}
                    {s.carbon_plate && ' · CARBON'}
                  </div>
                  <div className="font-display text-[18px] font-medium tracking-[-0.015em] text-carbon">
                    {s.model}
                  </div>
                </div>
                <span className="text-right font-mono text-[13px]">
                  {s.drop_mm}<span className="text-ink-50">mm</span>
                </span>
                <span className="text-right font-mono text-[13px]">
                  {s.weight_g}<span className="text-ink-50">g</span>
                </span>
                <span className="text-right font-mono text-[13px]">
                  {s.stack_heel_mm}<span className="text-ink-50">mm</span>
                </span>
                <span className="text-right font-mono text-[13px]">${s.price_usd}</span>
                <div
                  className="text-right font-display text-[22px] font-semibold tracking-[-0.02em]"
                  style={{ color: i === 0 ? 'var(--color-rust)' : 'var(--color-carbon)' }}
                >
                  {s.our_rating}
                  <span className="ml-1 font-mono text-[10px] text-ink-50">/10</span>
                </div>
                <span className="rounded-[3px] bg-carbon py-1.5 text-center font-mono text-[11px] text-sand">
                  BUY · ${s.price_usd}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY CARDS ──────────────────────────────────────── */}
      <section className="border-b border-rule px-8 py-12">
        <div className="mx-auto max-w-7xl">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
            · categories · 3 ·
          </span>
          <h2 className="m-0 mt-2 mb-6 font-display text-[48px] font-semibold tracking-[-0.03em]">
            Pick a sub-index.
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CategoryCard
              href="/shoes"
              slug="/shoes"
              title="Running shoes"
              count={d.shoeStats.count}
              stats={[
                ['weight', range(d.shoeStats.weight, 'g')],
                ['drop',   range(d.shoeStats.drop, 'mm')],
                ['stack',  range(d.shoeStats.stack, 'mm')],
                ['$',      range(d.shoeStats.price, '')],
              ]}
            />
            <CategoryCard
              href="/vests"
              slug="/vests"
              title="Vests & packs"
              count={d.vestStats.count}
              stats={[
                ['capacity', range(d.vestStats.cap, 'L')],
                ['weight',   range(d.vestStats.weight, 'g')],
                ['UTMB',     'filterable'],
                ['$',        range(d.vestStats.price, '')],
              ]}
            />
            <CategoryCard
              href="/gels"
              slug="/fuel"
              title="Gels & fuel"
              count={d.gelStats.count}
              stats={[
                ['carbs',     range(d.gelStats.carbs, 'g')],
                ['caffeine',  range(d.gelStats.caffeine, 'mg')],
                ['real-food', 'tagged'],
                ['$/serve',   range(d.gelStats.price, '')],
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── RECENT PRICE CHANGES + CHANGELOG ────────────────────── */}
      <section className="border-b border-rule px-8 py-12">
        <div className="mx-auto max-w-7xl space-y-12">
          {/* Price changes */}
          {d.priceLog.length > 0 && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
              <div>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ochre">
                  · recent price changes ·
                </span>
                <h2 className="m-0 mt-2 font-display text-[36px] font-semibold tracking-[-0.03em]">
                  Prices moving.
                </h2>
                <Link href="/prices" className="mt-2 inline-block font-mono text-[11.5px] text-rust">
                  view all prices →
                </Link>
              </div>
              <div className="rounded-[6px] border border-rule bg-paper p-4 font-mono text-[12.5px]">
                {d.priceLog.map((e: any, i: number) => (
                  <div
                    key={e.id}
                    className={`grid grid-cols-[140px_1fr] items-center gap-3 py-2 ${
                      i < d.priceLog.length - 1 ? 'border-b border-rule-soft' : ''
                    }`}
                  >
                    <span className="text-ink-50">{formatShort(e.occurred_at)}</span>
                    <span>{e.summary}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Changelog */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
            <div>
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
                · /changelog ·
              </span>
              <h2 className="m-0 mt-2 mb-3 font-display text-[36px] font-semibold tracking-[-0.03em]">
                Kept current.
              </h2>
              <p className="m-0 max-w-[460px] font-mono text-[13px] leading-[1.6] text-ink-70">
                Every entry, edit, re-score and price-check is logged. Public, timestamped, and
                reversible.
              </p>
              <Link href="/changelog" className="mt-4 inline-block font-mono text-[11.5px] text-rust">
                open the full log →
              </Link>
            </div>
            <div className="rounded-[6px] border border-rule bg-paper p-4 font-mono text-[12.5px] leading-[1.7]">
              {d.changelog.length > 0 ? (
                d.changelog.map((e: any, i: number) => (
                  <div
                    key={e.id}
                    className={`grid grid-cols-[140px_60px_1fr] items-center gap-3 py-1.5 ${
                      i < d.changelog.length - 1 ? 'border-b border-rule-soft' : ''
                    }`}
                  >
                    <span className="text-ink-50">{formatShort(e.occurred_at)}</span>
                    <span style={{ color: kindColor[e.kind] }} className="font-semibold">
                      {kindLabel[e.kind] ?? e.kind.toUpperCase()}
                    </span>
                    <span>{e.summary}</span>
                  </div>
                ))
              ) : (
                <span className="text-ink-50">
                  · changelog is empty — run an /add or wait for the cron sync ·
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── helpers ─────────────────────────────────────────────────────
function range([a, b]: number[], unit: string) {
  if (a === b) return `${a}${unit}`;
  return `${a}${unit}–${b}${unit}`;
}
function monthYear() {
  return new Date()
    .toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })
    .toUpperCase();
}
function formatShort(iso: string) {
  const d = new Date(iso);
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  return `${hh}:${mm} · ${dd}/${mo}`;
}

function CategoryCard({
  href,
  slug,
  title,
  count,
  stats,
}: {
  href: string;
  slug: string;
  title: string;
  count: number;
  stats: (readonly [string, string])[];
}) {
  return (
    <Link
      href={href}
      className="block overflow-hidden rounded-[6px] border border-rule bg-paper"
    >
      <div className="flex items-center justify-between border-b border-rule px-4 py-3">
        <span className="bg-carbon px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] text-sand">
          {slug}
        </span>
        <span className="bg-sand px-2.5 py-0.5 font-mono text-[11px] font-medium text-carbon">
          {count} SKU
        </span>
      </div>
      <div className="p-5">
        <h3 className="m-0 mb-3 font-display text-[26px] font-semibold tracking-[-0.025em]">
          {title}
        </h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-rule pt-2.5">
          {stats.map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50">
                {k}
              </span>
              <span className="font-mono text-[12px] text-carbon">{v}</span>
            </div>
          ))}
        </div>
        <div className="mt-3.5 font-mono text-[11.5px] text-rust">open the sub-index →</div>
      </div>
    </Link>
  );
}
