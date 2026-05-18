// components/review/ai-transparency.tsx
// The post-2025-helpful-content-update survival kit.
// Be explicit about how the review was made. Counter-intuitively, this helps.

import type { Tester } from '@/lib/review-types';

interface Props {
  tester: Tester | null;
  editor: Tester | null;
  milesTested: number | null;
  weeksTested: number | null;
  testTerrain: string | null;
  aiDraftedAt: string | null;
  humanEditedAt: string | null;
  reviewId: string;
  revision?: number;
}

export default function AiTransparency({
  tester,
  editor,
  milesTested,
  weeksTested,
  testTerrain,
  aiDraftedAt,
  humanEditedAt,
  reviewId,
  revision = 1,
}: Props) {
  // Doesn't render unless we can at least name the tester or the editor — saying
  // "AI-drafted, edited by nobody" is worse than saying nothing.
  if (!tester && !editor) return null;

  return (
    <aside className="mt-8 rounded bg-carbon p-5 text-sand">
      <header className="flex items-start justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ochre">
          · how this review was made ·
        </span>
        <span className="font-mono text-[10.5px] text-ink-30">
          doc-id REV-{reviewId.slice(0, 6).toUpperCase()} · rev {revision}
        </span>
      </header>

      <p className="mt-2.5 max-w-[720px] text-[14.5px] leading-[1.65]">
        Drafted by RGD&apos;s review engine from{' '}
        {tester && milesTested != null && (
          <span className="text-ochre">
            {milesTested} mi of field notes by {tester.name}
          </span>
        )}
        {tester && weeksTested != null && (
          <>
            {' '}
            ({weeksTested} wk{testTerrain ? `, ${testTerrain}` : ''})
          </>
        )}{' '}
        and our verified spec database.
        {editor && (
          <>
            {' '}
            Edited by <span className="text-ochre">{editor.name}</span>
            {humanEditedAt && (
              <>
                {' '}
                on{' '}
                <span className="font-mono">
                  {new Date(humanEditedAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
            .
          </>
        )}{' '}
        <span className="text-ochre">We do not accept gear for free</span> — every test unit is
        purchased at MSRP and disposed of after 600 mi (or donated). Affiliate commissions cover
        the bill.
      </p>

      <div className="mt-3.5 flex flex-wrap gap-4 font-mono text-[11px] text-ink-30">
        {milesTested != null && <span><span className="text-moss">●</span> human-tested</span>}
        {editor && <span><span className="text-moss">●</span> human-edited</span>}
        <span><span className="text-moss">●</span> peer-reviewed</span>
        <span><span className="text-moss">●</span> purchased at MSRP</span>
        {aiDraftedAt && (
          <span><span className="text-ochre">●</span> AI-drafted from verified data</span>
        )}
        <a
          href="/legal/affiliate"
          className="ml-auto border-b border-sand/40 text-sand"
        >
          full disclosure →
        </a>
      </div>
    </aside>
  );
}
