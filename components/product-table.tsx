'use client';
// components/product-table.tsx — dense data-engine table with filter chips,
// range sliders, sort, and grid/table view toggle. Single unified table
// driven by SPEC_COLUMNS config.

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { affiliateUrl, amazonSearchUrl } from '@/lib/amazon';

type Category = 'shoes' | 'vests' | 'gels';
type Product = Record<string, any>;

interface ColDef {
  key: string;
  label: string;
  width: string;
  unit?: string;
}

const SPEC_COLUMNS: Record<Category, ColDef[]> = {
  shoes: [
    { key: 'drop_mm', label: 'drop', width: '60px', unit: 'mm' },
    { key: 'weight_g', label: 'wt', width: '70px', unit: 'g' },
    { key: 'stack_heel_mm', label: 'stack', width: '70px', unit: 'mm' },
    { key: 'price_usd', label: '$', width: '70px' },
  ],
  vests: [
    { key: 'capacity_l', label: 'capacity', width: '80px', unit: 'L' },
    { key: 'weight_g', label: 'wt', width: '70px', unit: 'g' },
    { key: 'price_usd', label: '$', width: '70px' },
  ],
  gels: [
    { key: 'carbs_per_serving_g', label: 'carbs', width: '70px', unit: 'g' },
    { key: 'sodium_mg', label: 'sodium', width: '70px', unit: 'mg' },
    { key: 'caffeine_mg', label: 'caffeine', width: '70px', unit: 'mg' },
    { key: 'price_per_serving', label: '$/srv', width: '80px' },
  ],
};

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

  const cols = SPEC_COLUMNS[category];
  const sortKeys = [
    { key: 'our_rating', label: 'rating' },
    { key: 'price_usd', label: 'price' },
    ...(category === 'shoes'
      ? [{ key: 'weight_g', label: 'weight' }, { key: 'drop_mm', label: 'drop' }]
      : []),
  ];

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
            {sortKeys.flatMap((sk) => [
              <option key={`${sk.key}:desc`} value={`${sk.key}:desc`}>{sk.label} ↓</option>,
              <option key={`${sk.key}:asc`} value={`${sk.key}:asc`}>{sk.label} ↑</option>,
            ])}
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
          <UnifiedTable
            rows={filtered}
            category={category}
            cols={cols}
            sort={sort}
            setSort={setSort}
          />
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

// ── Unified table ──────────────────────────────────────────────────

function UnifiedTable({
  rows,
  category,
  cols,
  sort,
  setSort,
}: {
  rows: Product[];
  category: Category;
  cols: ColDef[];
  sort: { key: string; dir: 'asc' | 'desc' };
  setSort: (s: { key: string; dir: 'asc' | 'desc' }) => void;
}) {
  const colWidths = cols.map((c) => c.width).join(' ');
  const gridCols = `40px 60px 2fr ${colWidths} 90px 130px`;

  return (
    <>
      {/* Header */}
      <div
        className="grid items-center gap-3 border-b border-rule bg-sand-deep px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-50"
        style={{ gridTemplateColumns: gridCols }}
      >
        <span>#</span>
        <span />
        <TH k={category === 'gels' ? 'product' : 'model'} sort={sort} setSort={setSort}>
          brand / {category === 'gels' ? 'product' : 'model'}
        </TH>
        {cols.map((c) => (
          <TH key={c.key} k={c.key} align="right" sort={sort} setSort={setSort}>
            {c.label}
          </TH>
        ))}
        <TH k="our_rating" align="right" sort={sort} setSort={setSort}>
          score
        </TH>
        <span className="text-right">buy</span>
      </div>

      {/* Rows */}
      {rows.map((p, i) => {
        const modelName = category === 'gels' ? p.product : p.model;
        const buyPrice = category === 'gels' ? '' : ` · $${p.price_usd}`;
        const buyHref = p.amazon_url && p.amazon_url !== 'https://amazon.com'
          ? affiliateUrl(p.amazon_url)
          : amazonSearchUrl(p.brand, modelName);
        return (
          <Link
            key={p.id ?? i}
            href={category === 'shoes' ? `/reviews/${p.slug}` : `/${category === 'vests' ? 'vests' : 'gels'}?highlight=${p.slug}`}
            className="grid items-center gap-3 border-b border-rule-soft px-4 py-3 no-underline"
            style={{
              gridTemplateColumns: gridCols,
              backgroundColor: i % 2 ? 'var(--color-sand-deep, #d9d3c1) / 0.4' : undefined,
            }}
          >
            <span className="font-mono text-[12px] text-ink-50">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="relative h-12 w-12 overflow-hidden rounded-[3px] bg-sand-deep">
              {p.image_url && (
                <Image src={p.image_url} alt={modelName} fill className="object-cover" sizes="48px" />
              )}
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50">
                {p.brand?.toUpperCase()}
                {category === 'shoes' && p.carbon_plate && ' · ◆ CARBON'}
                {category === 'vests' && p.utmb_compliant && ' · UTMB'}
                {category === 'gels' && p.real_food && ' · REAL FOOD'}
              </div>
              <div className="font-display text-[17px] font-medium tracking-[-0.015em] text-carbon">
                {modelName}
              </div>
              {category === 'shoes' && (
                <div className="mt-0.5 font-mono text-[10.5px] text-ink-50">
                  · {p.discipline}
                  {p.tagline ? ` · ${p.tagline}` : ''}
                </div>
              )}
            </div>
            {cols.map((c) => (
              <span key={c.key} className="text-right font-mono text-[13px]">
                {c.unit && c.key === 'price_usd' ? `$${p[c.key]}` : p[c.key] ?? '—'}
                {c.unit && c.key !== 'price_usd' && c.key !== 'price_per_serving' && (
                  <span className="text-ink-50">{c.unit}</span>
                )}
              </span>
            ))}
            <div className="flex justify-end">
              <ScoreCircle score={Number(p.our_rating ?? 0)} />
            </div>
            <span
              className="rounded-[3px] bg-carbon py-2 text-center font-mono text-[11px] font-medium text-sand"
              onClick={(e) => {
                e.preventDefault();
                window.open(buyHref, '_blank', 'noopener');
              }}
            >
              BUY{buyPrice} →
            </span>
          </Link>
        );
      })}
    </>
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
    <Link
      href={category === 'shoes' ? `/reviews/${product.slug}` : `/${category === 'vests' ? 'vests' : 'gels'}?highlight=${product.slug}`}
      className="block overflow-hidden rounded border border-rule bg-paper no-underline"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-deep">
        {product.image_url && (
          <Image src={product.image_url} alt={name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
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
          <div className="font-mono text-[11.5px] text-rust">{category === 'shoes' ? 'read review →' : 'view specs →'}</div>
          {product.our_rating && <ScoreCircle score={Number(product.our_rating)} />}
        </div>
      </div>
    </Link>
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
