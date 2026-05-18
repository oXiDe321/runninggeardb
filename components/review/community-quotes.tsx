// components/review/community-quotes.tsx
// Quotes pulled from Reddit / forums / Strava. Google rewards balanced, third-party
// opinions; this block also doubles as an honest counter-perspective vs the review body.

import type { CommunityQuote } from '@/lib/review-types';

export default function CommunityQuotes({ quotes }: { quotes: CommunityQuote[] }) {
  if (!quotes.length) return null;

  const avgSentiment =
    quotes.reduce((s, q) => s + (q.sentiment ?? 0), 0) /
    quotes.filter((q) => q.sentiment != null).length;
  const positivePct = Number.isFinite(avgSentiment) ? Math.round(((avgSentiment + 1) / 2) * 100) : null;

  return (
    <section className="mt-8">
      <h2 className="m-0 mb-3.5 font-display text-[32px] font-semibold tracking-[-0.03em] text-carbon">
        · What runners are saying
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {quotes.map((q) => (
          <article
            key={q.id}
            className="rounded border border-rule bg-paper p-4"
          >
            <header className="flex justify-between font-mono text-[10.5px] tracking-[0.1em] text-ink-50">
              <span className="text-rust">· {q.source}</span>
              {q.votes && <span>{q.votes}</span>}
            </header>
            <p className="my-2.5 mb-2 text-[14px] italic leading-[1.55] text-carbon">
              &ldquo;{q.body}&rdquo;
            </p>
            {q.user_handle && (
              <div className="font-mono text-[11px] text-ink-50">— {q.user_handle}</div>
            )}
          </article>
        ))}
      </div>
      {positivePct != null && (
        <div className="mt-2.5 font-mono text-[10.5px] text-ink-50">
          aggregated from public posts · sentiment: {positivePct}% positive (n={quotes.length})
        </div>
      )}
    </section>
  );
}
