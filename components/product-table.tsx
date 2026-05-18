'use client';
// components/product-table.tsx — dense data-engine table with filter chips,
// range sliders, sort, and grid/table view toggle.

import { useMemo, useState } from 'react';

type Category = 'shoes' | 'vests' | 'gels';
type Product = Record<string, any>;

export default function ProductTable({
  products,
  category,
}: {
  products: Product[];
  category: Category;
}) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [view, setView] = useState<'table' | 'grid'>('table');
  const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({
    key: 'our_rating',
    dir: 'desc',
  });

  const filtered = useMemo(() => {
    let out = products;
    if (category === 'shoes') {
      if (filters.discipline) out = out.filter((p) => p.discipline === filters.discipline);
      if (filters.carbon) out = out.filter((p) => p.carbon_plate);
    }
    if (category === 'vests' && filters.utmb) out = out.filter((p) => p.utmb_compliant);
    if (category === 'gels') {
      if (filters.caffeine) out = out.filter((p) => p.caffeine_mg && p.caffeine_mg > 0);
      if (filters.realFood) out = out.filter((p) => p.real_food);
    }
    return [...out].sort((a, b) => {
      const av = a[sort.key] ?? -Infinity;
      const bv = b[sort.key] ?? -Infinity;
      return (av < bv ? -1 : av > bv ? 1 : 0) * (sort.dir === 'asc' ? 1 : -1);
    });
  }, [products, filters, category, sort]);

  const toggle = (k: string, v?: any) =>
    setFilters((p) => ({ ...p, [k]: p[k] === v ? undefined : v }));

  return (
    <div className="space-y-5">
      {/* Filter strip */}
      <div className="flex flex-wrap items-center gap-4 rounded border border-rule bg-paper px-4 py-3 font-mono text-[11.5px]">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
          filter
        </span>

        {category === 'shoes' && (
          <>
            <span className="text-ink-50">discipline:</span>
            {['trail', 'road', 'hyrox', 'parkrun'].map((d) => (
              <Chip
                key={d}
                active={filters.discipline === d}
                onClick={() => toggle('discipline', d)}
              >
                · {d}
              </Chip>
            ))}
            <Sep />
            <Chip active={!!filters.carbon} onClick={() => toggle('carbon', true)}>
              · ◆ carbon
            </Chip>
          </>
        )}

        {category === 'vests' && (
          <Chip active={!!filters.utmb} onClick={() => toggle('utmb', true)}>
            · UTMB compliant
          </Chip>
        )}

        {category === 'gels' && (
          <>
            <Chip active={!!filters.caffeine} onClick={() => toggle('caffeine', true)}>
              · has caffeine
            </Chip>
            <Chip active={!!filters.realFood} onClick={() => toggle('realFood', true)}>
              · real food
            </Chip>
          </>
        )}

        <span className="ml-auto flex items-center gap-2">
          <span className="text-ink-50">sort:</span>
          <select
            value={`${sort.key}:${sort.dir}`}
            onChange={(e) => {
              const [key, dir] = e.target.value.split(':');
              setSort({ key, dir: dir as 'asc' | 'desc' });
            }}
            className="rounded-[3px] border border-rule bg-sand px-2 py-1 font-mono text-[11.5px]"
          >
            <option value="our_rating:desc">rating ↓</option>
            <option value="our_rating:asc">rating ↑</option>
            <option value="price_usd:asc">price ↑</option>
            <option value="price_usd:desc">price ↓</option>
            {category === 'shoes' && <option value="weight_g:asc">weight ↑</option>}
            {category === 'shoes' && <option value="drop_mm:asc">drop ↑</option>}
          </select>
          <div className="ml-2 flex items-center gap-1 rounded border border-rule bg-sand p-0.5">
            <button
              onClick={() => setView('table')}
              className={`rounded-[2px] px-2 py-1 font-mono text-[11px] ${
                view === 'table' ? 'bg-carbon text-sand' : 'text-carbon'
              }`}
              aria-label="Table view"
            >
              ▦
            </button>
            <button
              onClick={() => setView('grid')}
              className={`rounded-[2px] px-2 py-1 font-mono text-[11px] ${
                view === 'grid' ? 'bg-carbon text-sand' : 'text-carbon'
              }`}
              aria-label="Grid view"
            >
              ⊞
            </button>
          </div>
        </span>
      </div>

      <div className="font-mono text-[11.5px] text-ink-50">
        showing {filtered.length} of {products.length}
      </div>

      {/* Table view */}
      {view === 'table' ? (
        <div className="overflow-x-auto rounded border border-rule bg-paper">
          {category === 'shoes' && <ShoeTable rows={filtered} sort={sort} setSort={setSort} />}
          {category === 'vests' && <VestTable rows={filtered} sort={sort} setSort={setSort} />}
          {category === 'gels' && <GelTable rows={filtered} sort={sort} setSort={setSort} />}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} category={category} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── small helpers ─────────────────────────────────────────────────
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-[3px] border px-2.5 py-1.5 ${
        active ? 'border-carbon bg-carbon text-sand' : 'border-rule bg-sand text-carbon'
      }`}
    >
      {children}
    </button>
  );
}
function Sep() {
  return <span className="h-5 w-px bg-rule" />;
}
function TH({
  k,
  align,
  children,
  sort,
  setSort,
}: {
  k?: string;
  align?: 'right';
  children: React.ReactNode;
  sort: { key: string; dir: 'asc' | 'desc' };
  setSort: (s: { key: string; dir: 'asc' | 'desc' }) => void;
}) {
  const isSort = k && sort.key === k;
  return (
    <span
      onClick={() => k && setSort({ key: k, dir: isSort && sort.dir === 'desc' ? 'asc' : 'desc' })}
      className={`select-none ${align === 'right' ? 'text-right' : ''} ${
        k ? 'cursor-pointer' : ''
      } ${isSort ? 'text-carbon' : ''}`}
    >
      {children}
      {isSort && (sort.dir === 'desc' ? ' ↓' : ' ↑')}
    </span>
  );
}

// ── table variants ────────────────────────────────────────────────
function ShoeTable({
  rows,
  sort,
  setSort,
}: {
  rows: Product[];
  sort: { key: string; dir: 'asc' | 'desc' };
  setSort: (s: { key: string; dir: 'asc' | 'desc' }) => void;
}) {
  return (
    <>
      <div className="grid grid-cols-[40px_60px_2fr_60px_70px_70px_70px_90px_130px] items-center gap-3 border-b border-rule bg-sand-deep px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50">
        <span>#</span>
        <span></span>
        <TH k="model" sort={sort} setSort={setSort}>brand / model</TH>
        <TH k="drop_mm" align="right" sort={sort} setSort={setSort}>drop</TH>
        <TH k="weight_g" align="right" sort={sort} setSort={setSort}>wt</TH>
        <TH k="stack_heel_mm" align="right" sort={sort} setSort={setSort}>stack</TH>
        <TH k="price_usd" align="right" sort={sort} setSort={setSort}>$</TH>
        <TH k="our_rating" align="right" sort={sort} setSort={setSort}>score</TH>
        <span className="text-right">buy</span>
      </div>
      {rows.map((s, i) => (
        <a
          key={s.id ?? i}
          href={`/reviews/${s.slug}`}
          className={`grid grid-cols-[40px_60px_2fr_60px_70px_70px_70px_90px_130px] items-center gap-3 border-b border-rule-soft px-4 py-3 ${
            i % 2 ? 'bg-sand-deep/40' : ''
          }`}
        >
          <span className="font-mono text-[12px] text-ink-50">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="h-12 w-12 overflow-hidden rounded-[3px] bg-sand-deep">
            {s.image_url && (
              <img src={s.image_url} alt={s.model} className="h-full w-full object-cover" />
            )}
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50">
              {s.brand?.toUpperCase()}
              {s.carbon_plate && ' · ◆ CARBON'}
            </div>
            <div className="font-display text-[17px] font-medium tracking-[-0.015em] text-carbon">
              {s.model}
            </div>
            <div className="mt-0.5 font-mono text-[10.5px] text-ink-50">
              · {s.discipline}
              {s.tagline ? ` · ${s.tagline}` : ''}
            </div>
          </div>
          <span className="text-right font-mono text-[13px]">
            {s.drop_mm}
            <span className="text-ink-50">mm</span>
          </span>
          <span className="text-right font-mono text-[13px]">
            {s.weight_g}
            <span className="text-ink-50">g</span>
          </span>
          <span className="text-right font-mono text-[13px]">
            {s.stack_heel_mm}
            <span className="text-ink-50">mm</span>
          </span>
          <span className="text-right font-mono text-[13px]">${s.price_usd}</span>
          <div className="flex justify-end">
            <ScoreCircle score={Number(s.our_rating ?? 0)} />
          </div>
          <span
            className="rounded-[3px] bg-carbon py-2 text-center font-mono text-[11px] font-medium text-sand"
            onClick={(e) => {
              e.preventDefault();
              if (s.amazon_url) window.open(s.amazon_url, '_blank', 'noopener');
            }}
          >
            BUY · ${s.price_usd} →
          </span>
        </a>
      ))}
    </>
  );
}
function VestTable({ rows, sort, setSort }: any) {
  return (
    <>
      <div className="grid grid-cols-[40px_60px_2fr_80px_70px_70px_90px_130px] items-center gap-3 border-b border-rule bg-sand-deep px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50">
        <span>#</span>
        <span></span>
        <TH k="model" sort={sort} setSort={setSort}>brand / model</TH>
        <TH k="capacity_l" align="right" sort={sort} setSort={setSort}>capacity</TH>
        <TH k="weight_g" align="right" sort={sort} setSort={setSort}>wt</TH>
        <TH k="price_usd" align="right" sort={sort} setSort={setSort}>$</TH>
        <TH k="our_rating" align="right" sort={sort} setSort={setSort}>score</TH>
        <span className="text-right">buy</span>
      </div>
      {rows.map((s: any, i: number) => (
        <a
          key={s.id ?? i}
          href={`/reviews/${s.slug}`}
          className={`grid grid-cols-[40px_60px_2fr_80px_70px_70px_90px_130px] items-center gap-3 border-b border-rule-soft px-4 py-3 ${
            i % 2 ? 'bg-sand-deep/40' : ''
          }`}
        >
          <span className="font-mono text-[12px] text-ink-50">{String(i + 1).padStart(2, '0')}</span>
          <div className="h-12 w-12 overflow-hidden rounded-[3px] bg-sand-deep">
            {s.image_url && <img src={s.image_url} alt={s.model} className="h-full w-full object-cover" />}
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50">{s.brand?.toUpperCase()}{s.utmb_compliant && ' · UTMB'}</div>
            <div className="font-display text-[17px] font-medium tracking-[-0.015em] text-carbon">{s.model}</div>
          </div>
          <span className="text-right font-mono text-[13px]">{s.capacity_l}<span className="text-ink-50">L</span></span>
          <span className="text-right font-mono text-[13px]">{s.weight_g}<span className="text-ink-50">g</span></span>
          <span className="text-right font-mono text-[13px]">${s.price_usd}</span>
          <div className="flex justify-end"><ScoreCircle score={Number(s.our_rating ?? 0)} /></div>
          <span className="rounded-[3px] bg-carbon py-2 text-center font-mono text-[11px] font-medium text-sand">BUY · ${s.price_usd} →</span>
        </a>
      ))}
    </>
  );
}
function GelTable({ rows, sort, setSort }: any) {
  return (
    <>
      <div className="grid grid-cols-[40px_60px_2fr_70px_70px_70px_80px_90px_130px] items-center gap-3 border-b border-rule bg-sand-deep px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50">
        <span>#</span><span></span>
        <TH k="product" sort={sort} setSort={setSort}>brand / product</TH>
        <TH k="carbs_per_serving_g" align="right" sort={sort} setSort={setSort}>carbs</TH>
        <TH k="sodium_mg" align="right" sort={sort} setSort={setSort}>sodium</TH>
        <TH k="caffeine_mg" align="right" sort={sort} setSort={setSort}>caffeine</TH>
        <TH k="price_per_serving" align="right" sort={sort} setSort={setSort}>$/srv</TH>
        <TH k="our_rating" align="right" sort={sort} setSort={setSort}>score</TH>
        <span className="text-right">buy</span>
      </div>
      {rows.map((s: any, i: number) => (
        <a key={s.id ?? i} href={`/reviews/${s.slug}`} className={`grid grid-cols-[40px_60px_2fr_70px_70px_70px_80px_90px_130px] items-center gap-3 border-b border-rule-soft px-4 py-3 ${i % 2 ? 'bg-sand-deep/40' : ''}`}>
          <span className="font-mono text-[12px] text-ink-50">{String(i + 1).padStart(2, '0')}</span>
          <div className="h-12 w-12 overflow-hidden rounded-[3px] bg-sand-deep">{s.image_url && <img src={s.image_url} alt={s.product} className="h-full w-full object-cover" />}</div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50">{s.brand?.toUpperCase()}{s.real_food && ' · REAL FOOD'}</div>
            <div className="font-display text-[17px] font-medium tracking-[-0.015em] text-carbon">{s.product}</div>
          </div>
          <span className="text-right font-mono text-[13px]">{s.carbs_per_serving_g}<span className="text-ink-50">g</span></span>
          <span className="text-right font-mono text-[13px]">{s.sodium_mg}<span className="text-ink-50">mg</span></span>
          <span className="text-right font-mono text-[13px]">{s.caffeine_mg ?? 0}<span className="text-ink-50">mg</span></span>
          <span className="text-right font-mono text-[13px]">${s.price_per_serving}</span>
          <div className="flex justify-end"><ScoreCircle score={Number(s.our_rating ?? 0)} /></div>
          <span className="rounded-[3px] bg-carbon py-2 text-center font-mono text-[11px] font-medium text-sand">BUY →</span>
        </a>
      ))}
    </>
  );
}

// ── score ring ────────────────────────────────────────────────────
function ScoreCircle({ score }: { score: number }) {
  const size = 44;
  const stroke = 3;
  const r = size / 2 - stroke - 1;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 10) * circ;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--color-rule-soft)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-rust)"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center font-display text-[13px] font-semibold tracking-[-0.02em]">
        {score.toFixed(1)}
      </div>
    </div>
  );
}

// ── grid-mode card ────────────────────────────────────────────────
function ProductCard({ product, category }: { product: Product; category: Category }) {
  const name = product.model ?? product.product;
  return (
    <a
      href={`/reviews/${product.slug}`}
      className="block overflow-hidden rounded border border-rule bg-paper"
    >
      <div className="aspect-[4/3] overflow-hidden bg-sand-deep">
        {product.image_url && (
          <img src={product.image_url} alt={name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50">
          {product.brand?.toUpperCase()}
        </div>
        <div className="font-display text-[20px] font-semibold tracking-[-0.02em] text-carbon">
          {name}
        </div>
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-rule pt-2.5 font-mono text-[11.5px]">
          {category === 'shoes' && (
            <>
              <Spec label="drop" value={product.drop_mm ? `${product.drop_mm}mm` : '—'} />
              <Spec label="weight" value={product.weight_g ? `${product.weight_g}g` : '—'} />
              <Spec label="stack" value={product.stack_heel_mm ? `${product.stack_heel_mm}mm` : '—'} />
              <Spec label="$" value={product.price_usd ? `$${product.price_usd}` : '—'} />
            </>
          )}
          {category === 'vests' && (
            <>
              <Spec label="capacity" value={product.capacity_l ? `${product.capacity_l}L` : '—'} />
              <Spec label="weight" value={product.weight_g ? `${product.weight_g}g` : '—'} />
              <Spec label="UTMB" value={product.utmb_compliant ? 'yes' : 'no'} />
              <Spec label="$" value={product.price_usd ? `$${product.price_usd}` : '—'} />
            </>
          )}
          {category === 'gels' && (
            <>
              <Spec label="carbs" value={`${product.carbs_per_serving_g}g`} />
              <Spec label="sodium" value={`${product.sodium_mg}mg`} />
              <Spec label="caffeine" value={`${product.caffeine_mg ?? 0}mg`} />
              <Spec label="$/srv" value={`$${product.price_per_serving}`} />
            </>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-rule pt-3">
          <div className="font-mono text-[11.5px] text-rust">read review →</div>
          {product.our_rating && <ScoreCircle score={Number(product.our_rating)} />}
        </div>
      </div>
    </a>
  );
}
function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-ink-50">{label}</span>
      <span className="text-carbon">{value}</span>
    </div>
  );
}
