// components/review/spec-sheet.tsx
// Full-width data sheet grouped by spec category.
// Server-compatible — no client hooks.

import type { DimensionScore } from '@/lib/review-types';

interface Props {
  drop_mm: number | null;
  weight_g: number | null;
  in_house_weight_g: number | null;
  stack_heel_mm: number | null;
  stack_forefoot_mm: number | null;
  carbon_plate: boolean;
  rock_plate: boolean;
  msrp_usd: number | null;
  best_price: number | null;
  discipline: string | null;
  released_at: string | null;
  dimensions: DimensionScore[];
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-1.5 font-mono text-[13px]">
      <span className="text-ink-50 text-[11px]">{label}</span>
      <span className="text-carbon">{value}</span>
    </div>
  );
}

export default function SpecSheet(props: Props) {
  const {
    drop_mm, weight_g, in_house_weight_g, stack_heel_mm, stack_forefoot_mm,
    carbon_plate, rock_plate, msrp_usd, best_price, discipline, released_at,
    dimensions,
  } = props;

  const weightStr = in_house_weight_g
    ? `${in_house_weight_g}g · in-house`
    : weight_g
      ? `${weight_g}g`
      : null;

  const stackStr = stack_heel_mm != null
    ? `${stack_heel_mm}${stack_forefoot_mm != null ? `/${stack_forefoot_mm}` : ''}mm`
    : null;

  const discountPct = best_price && msrp_usd && msrp_usd > 0
    ? Math.round(((msrp_usd - best_price) / msrp_usd) * 100)
    : null;

  const specs: { group: string; items: [string, string | null][] }[] = [
    {
      group: 'dimensions',
      items: [
        ['drop', drop_mm != null ? `${drop_mm}mm` : null],
        ['weight', weightStr],
        ['stack', stackStr],
      ],
    },
    {
      group: 'construction',
      items: [
        ['plate', carbon_plate ? 'carbon' : '— none'],
        ['rock plate', rock_plate ? 'yes' : 'no'],
        ['discipline', discipline],
        ['released', released_at ? new Date(released_at).getFullYear().toString() : null],
      ],
    },
    {
      group: 'pricing',
      items: [
        ['MSRP', msrp_usd ? `$${msrp_usd}` : null],
        ['current best', best_price ? `$${best_price}` : null],
        ['saving', discountPct != null ? `${discountPct}% off` : null],
      ],
    },
  ];

  return (
    <section className="border-b border-rule px-8 py-5">
      <div className="mx-auto max-w-7xl">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-rust">
          spec sheet
        </span>
        <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
          {specs.map(({ group, items }) => {
            const visible = items.filter(([, v]) => v != null);
            if (visible.length === 0) return null;
            return (
              <div key={group} className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50 mb-1.5">
                  {group}
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {visible.map(([k, v]) => (
                    <Spec key={k} label={k} value={v!} />
                  ))}
                </div>
              </div>
            );
          })}
          {dimensions.length > 0 && (
            <div className="min-w-0">
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-50 mb-1.5">
                scores
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                {dimensions.map((d) => (
                  <Spec key={d.key} label={d.label} value={d.value.toFixed(1)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
