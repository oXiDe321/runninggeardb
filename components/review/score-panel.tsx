// components/review/score-panel.tsx
// The big RGDB score block + dimension bars. Source of AggregateRating schema.

import type { DimensionScore } from '@/lib/review-types';

interface Props {
  overall: number;
  dimensions: DimensionScore[];
  prevGenScore?: number | null;
  percentile?: number | null;
}

export default function ScorePanel({ overall, dimensions, prevGenScore, percentile }: Props) {
  const delta = prevGenScore != null ? overall - prevGenScore : null;
  return (
    <div className="rounded bg-carbon p-6 text-sand">
      <div className="flex gap-5">
        <div className="flex-1">
          <div className="font-mono text-[10.5px] tracking-[0.16em] text-ink-30">RGDB SCORE</div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-[84px] font-bold leading-[0.9] tracking-[-0.05em]">
              {overall.toFixed(1)}
            </span>
            <span className="font-mono text-sm text-ink-30">/10</span>
          </div>
          {(delta != null || percentile != null) && (
            <div className="mt-1.5 font-mono text-[11px] tracking-[0.1em] text-ochre">
              {delta != null && (
                <>
                  {delta >= 0 ? '↑' : '↓'} {delta >= 0 ? '+' : ''}
                  {delta.toFixed(1)} vs prev
                </>
              )}
              {delta != null && percentile != null && ' · '}
              {percentile != null && <>pct {percentile}</>}
            </div>
          )}
        </div>
        {dimensions.length > 0 && (
          <div className="flex-1 grid gap-[5px]">
            {dimensions.map((d) => (
              <div key={d.key}>
                <div className="mb-[2px] flex justify-between font-mono text-[10.5px]">
                  <span className="text-ink-30">{d.label.toLowerCase()}</span>
                  <span>{d.value.toFixed(1)}</span>
                </div>
                <div className="h-[3px] bg-[rgba(232,226,213,0.18)]">
                  <div
                    className="h-[3px]"
                    style={{
                      width: `${Math.min(100, d.value * 10)}%`,
                      background: d.value >= 9 ? 'var(--color-ochre)' : 'var(--color-sand)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
