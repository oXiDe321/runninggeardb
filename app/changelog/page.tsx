// app/changelog/page.tsx
// Public changelog — every score/price/review change, versioned.
// Linked from the homepage feed. Not in main nav, but crawlable.

import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export const metadata = {
  title: 'Changelog — RunningGearDB',
  description: 'Every score update, price change, and review revision on RunningGearDB, publicly tracked.',
};

const BADGES: Record<string, string> = {
  add: 'bg-moss/15 text-moss border-moss/20',
  update: 'bg-ochre/15 text-ochre border-ochre/20',
  price: 'bg-rust/10 text-rust border-rust/20',
  review: 'bg-ink-70/10 text-ink-70 border-ink-70/20',
  remove: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
};

export default async function ChangelogPage() {
  const { data: entries } = await supabase
    .from('changelog')
    .select('*')
    .order('occurred_at', { ascending: false })
    .limit(200);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-carbon mb-2">Changelog</h1>
      <p className="text-ink-50 mb-10 text-sm leading-relaxed">
        Every price update, score revision, and review change on RunningGearDB is tracked here.
        This page is the receipt — transparency is the point.
      </p>

      {!entries || entries.length === 0 ? (
        <p className="text-ink-30 text-sm py-12 text-center">
          No entries yet. Changes will appear here as the database grows.
        </p>
      ) : (
        <ul className="space-y-1">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex items-start gap-3 py-3 border-b border-rule-soft last:border-0"
            >
              <span
                className={`shrink-0 mt-0.5 text-[11px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${BADGES[entry.kind] ?? BADGES.update}`}
              >
                {entry.kind}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-carbon leading-relaxed break-words">{entry.summary}</p>
                <time
                  dateTime={entry.occurred_at}
                  className="text-[11px] text-ink-30 mt-0.5 block tabular-nums"
                >
                  {new Date(entry.occurred_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-16 text-xs text-ink-30 text-center">
        <Link href="/" className="underline underline-offset-2 hover:text-ink-50 transition-colors">
          Back to RunningGearDB
        </Link>
      </p>
    </div>
  );
}
