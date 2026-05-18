'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

interface ChangelogEntry {
  id: string;
  occurred_at: string;
  kind: 'add' | 'update' | 'price' | 'review' | 'remove';
  product_table: string | null;
  summary: string;
  product_url: string | null;
}

const KINDS = ['all', 'add', 'update', 'price', 'review', 'remove'] as const;
const TABLES = ['all', 'shoes', 'vests', 'gels'] as const;

const BADGES: Record<string, string> = {
  add: 'bg-moss/15 text-moss border-moss/20',
  update: 'bg-ochre/15 text-ochre border-ochre/20',
  price: 'bg-rust/10 text-rust border-rust/20',
  review: 'bg-moss/15 text-moss border-moss/20',
  remove: 'bg-rust/10 text-rust border-rust/20',
};

export default function ChangelogView({ entries }: { entries: ChangelogEntry[] }) {
  const [kind, setKind] = useState<string>('all');
  const [table, setTable] = useState<string>('all');

  const filtered = useMemo(() => {
    let out = entries;
    if (kind !== 'all') out = out.filter((e) => e.kind === kind);
    if (table !== 'all') out = out.filter((e) => e.product_table === table);
    return out;
  }, [entries, kind, table]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, ChangelogEntry[]>();
    for (const e of filtered) {
      const date = e.occurred_at.slice(0, 10);
      const arr = map.get(date) ?? [];
      arr.push(e);
      map.set(date, arr);
    }
    return [...map.entries()];
  }, [filtered]);

  return (
    <div className="space-y-5">
      {/* Filter strip */}
      <div className="flex flex-wrap items-center gap-4 rounded border border-rule bg-paper px-4 py-3 font-mono text-[11.5px]">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
          filter
        </span>

        <span className="text-ink-50">kind:</span>
        {KINDS.map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`rounded-[3px] border px-2.5 py-1.5 ${
              kind === k
                ? 'border-carbon bg-carbon text-sand'
                : 'border-rule bg-sand text-carbon'
            }`}
          >
            · {k}
          </button>
        ))}

        <span className="h-5 w-px bg-rule" />
        <span className="text-ink-50">table:</span>
        {TABLES.map((t) => (
          <button
            key={t}
            onClick={() => setTable(t)}
            className={`rounded-[3px] border px-2.5 py-1.5 ${
              table === t
                ? 'border-carbon bg-carbon text-sand'
                : 'border-rule bg-sand text-carbon'
            }`}
          >
            · {t === 'all' ? 'all' : t}
          </button>
        ))}

        <span className="ml-auto text-ink-50">
          {filtered.length} entry{filtered.length !== 1 ? 'ies' : 'y'}
        </span>
      </div>

      {/* Grouped entries */}
      {grouped.length === 0 ? (
        <div className="py-16 text-center font-mono text-[13px] text-ink-50 border-2 border-dashed border-rule rounded-2xl">
          No entries match the current filters.
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(([date, items]) => (
            <div key={date}>
              <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-rust">
                {new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                <span className="ml-2 text-ink-50">· {items.length} change{items.length !== 1 ? 's' : ''}</span>
              </div>
              <ul className="space-y-px rounded border border-rule bg-paper overflow-hidden">
                {items.map((entry) => (
                  <li
                    key={entry.id}
                    className="flex items-start gap-3 px-4 py-3 border-b border-rule-soft last:border-0"
                  >
                    <span
                      className={`shrink-0 mt-0.5 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border ${
                        BADGES[entry.kind] ?? BADGES.update
                      }`}
                    >
                      {entry.kind}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] text-carbon leading-relaxed font-mono">
                        {entry.product_url ? (
                          <Link href={entry.product_url} className="text-rust hover:underline">
                            {entry.summary}
                          </Link>
                        ) : (
                          entry.summary
                        )}
                      </p>
                      <div className="flex gap-3 mt-0.5">
                        <time
                          dateTime={entry.occurred_at}
                          className="text-[11px] text-ink-50 tabular-nums"
                        >
                          {new Date(entry.occurred_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </time>
                        {entry.product_table && (
                          <span className="text-[10px] text-ink-50 uppercase font-mono">
                            {entry.product_table}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
