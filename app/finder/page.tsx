'use client';
// app/finder/page.tsx
// 5-question shoe finder. Filters Supabase-loaded shoes client-side.
// The whole page is a client component so the live shortlist updates
// without round-trips; the initial list is hydrated from the server.

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Shoe {
  id: string;
  slug: string;
  brand: string;
  model: string;
  image_url: string | null;
  our_rating: number | null;
  weight_g: number | null;
  drop_mm: number | null;
  stack_heel_mm: number | null;
  price_usd: number | null;
  discipline: string;
  carbon_plate: boolean;
}

type Answer = string | null;
interface AnswerState {
  terrain: Answer;
  distance: Answer;
  cushion: Answer;
  fit: Answer;
  budget: Answer;
}

const QUESTIONS = [
  {
    id: 'terrain' as const,
    title: 'Where will you run?',
    sub: 'Hard filter. Road shoes and trail shoes are built around different priorities.',
    opts: [
      { v: 'road', l: 'Road', d: 'Pavement, track, parkrun, marathon.' },
      { v: 'trail', l: 'Trail', d: 'Singletrack, mountains, ultras.' },
      { v: 'mixed', l: 'Road-to-trail', d: 'Mostly road, some dirt approach.' },
    ],
  },
  {
    id: 'distance' as const,
    title: 'How far, typically?',
    sub: 'Longer distances reward more cushion and durability; shorter reward weight.',
    opts: [
      { v: '5k', l: '5K · 10K', d: 'Short, fast.' },
      { v: 'half', l: 'Half · Marathon', d: '13 – 26 miles.' },
      { v: 'ultra', l: 'Ultra', d: '50K and up.' },
    ],
  },
  {
    id: 'cushion' as const,
    title: 'How do you want it to feel underfoot?',
    sub: "The question most quizzes skip — and the one that decides if a shoe ranks high on paper but feels wrong on the run.",
    opts: [
      { v: 'firm', l: 'Firm / responsive', d: 'Ground-feel, snappy, low stack.' },
      { v: 'balanced', l: 'Balanced (recommended)', d: 'Mid stack, supportive, versatile.' },
      { v: 'plush', l: 'Plush / max-cushion', d: 'High stack, soft, long-haul comfort.' },
      { v: 'any', l: 'No preference', d: 'Show me the best across all.' },
    ],
  },
  {
    id: 'fit' as const,
    title: 'How do your feet sit?',
    sub: 'A wide-fit shoe on narrow feet slides. A narrow shoe on wide feet hurts.',
    opts: [
      { v: 'narrow', l: 'Narrow', d: 'My feet feel small in most shoes.' },
      { v: 'regular', l: 'Regular', d: 'Most shoes fit fine.' },
      { v: 'wide', l: 'Wide', d: 'I need extra room in the toe box.' },
    ],
  },
  {
    id: 'budget' as const,
    title: "What's your ceiling?",
    sub: 'We sort by best match, but cap at your number.',
    opts: [
      { v: '120', l: 'Under $120', d: 'Daily trainer territory.' },
      { v: '180', l: 'Under $180', d: 'Most premium daily / trail shoes.' },
      { v: '999', l: 'No limit', d: 'Show me race shoes too.' },
    ],
  },
];

export default function FinderPage() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<AnswerState>({
    terrain: null,
    distance: null,
    cushion: null,
    fit: null,
    budget: null,
  });
  const [step, setStep] = useState(0);

  // Hydrate the shoe pool once.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('shoes')
        .select(
          'id, slug, brand, model, image_url, our_rating, weight_g, drop_mm, stack_heel_mm, price_usd, discipline, carbon_plate'
        )
        .eq('published', true)
        .order('our_rating', { ascending: false });
      if (!cancelled) {
        setShoes(data ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Live filtering.
  const matches = useMemo(() => {
    let pool = shoes;
    if (answers.terrain === 'trail') pool = pool.filter((s) => s.discipline === 'trail');
    if (answers.terrain === 'road') pool = pool.filter((s) => s.discipline === 'road');
    if (answers.terrain === 'mixed')
      pool = pool.filter((s) => s.discipline === 'road' || s.discipline === 'road-to-trail');

    if (answers.distance === 'ultra') pool = pool.filter((s) => (s.stack_heel_mm ?? 0) >= 28);
    if (answers.distance === '5k') pool = pool.filter((s) => (s.weight_g ?? 999) <= 250);

    if (answers.cushion === 'firm') pool = pool.filter((s) => (s.stack_heel_mm ?? 0) < 32);
    if (answers.cushion === 'plush') pool = pool.filter((s) => (s.stack_heel_mm ?? 0) >= 36);

    if (answers.budget && answers.budget !== '999')
      pool = pool.filter((s) => (s.price_usd ?? 999) <= Number(answers.budget));

    return pool.slice(0, 3);
  }, [answers, shoes]);

  const counts = useMemo(() => ({
    pool: shoes.length,
    matches: matches.length,
  }), [shoes, matches]);

  const q = QUESTIONS[step];
  const allAnswered = QUESTIONS.every((qq) => answers[qq.id] != null);

  return (
    <div className="bg-sand text-carbon">
      <header className="border-b border-rule px-8 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
            rgd ▸ <span className="text-rust">/finder</span> · 5 questions · &lt; 60 sec
          </div>
          <h1 className="m-0 mt-3 font-display text-[68px] font-semibold leading-[0.95] tracking-[-0.04em]">
            Find your shoe <span className="text-rust">in five questions.</span>
          </h1>
          <p className="mt-3 max-w-[720px] font-mono text-[14px] text-ink-70">
            Five hard filters narrow {counts.pool} SKU down to three shoes that match how you
            actually run. No quiz-funnel emails, no upsells. Every shoe in the shortlist is
            human-tested.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-[240px_1fr_360px] items-start gap-8 px-8 py-10">
        {/* Stepper */}
        <aside>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ink-50">
            // progress
          </span>
          <ol className="mt-3 list-none p-0">
            {QUESTIONS.map((qq, i) => {
              const isActive = i === step;
              const isDone = answers[qq.id] != null;
              return (
                <li
                  key={qq.id}
                  onClick={() => setStep(i)}
                  className={`mb-1.5 cursor-pointer p-3 ${
                    isActive ? 'bg-paper' : ''
                  }`}
                  style={{
                    borderLeft: `3px solid ${
                      isActive
                        ? 'var(--color-rust)'
                        : isDone
                        ? 'var(--color-moss)'
                        : 'var(--color-rule)'
                    }`,
                  }}
                >
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`font-mono text-[11px] tracking-[0.14em] ${
                        isActive ? 'text-rust' : isDone ? 'text-moss' : 'text-ink-50'
                      }`}
                    >
                      0{i + 1} · {qq.title.split(' ').slice(0, 3).join(' ').toUpperCase()}
                    </span>
                    {isDone && <span className="font-mono text-[11px] text-moss">✓</span>}
                  </div>
                  <div
                    className={`mt-1 font-mono text-[12px] ${
                      isDone ? 'text-carbon' : 'text-ink-50'
                    }`}
                  >
                    {answers[qq.id]
                      ? qq.opts.find((o) => o.v === answers[qq.id])?.l ?? '—'
                      : '—'}
                  </div>
                </li>
              );
            })}
          </ol>
        </aside>

        {/* Question */}
        <div>
          <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-50">
            QUESTION {String(step + 1).padStart(2, '0')} / 05
          </div>
          <h2 className="m-0 mt-1 font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.035em]">
            {q.title}
          </h2>
          <p className="m-0 mt-2 max-w-[560px] font-mono text-[13px] text-ink-70">{q.sub}</p>

          <div className="mt-6 grid gap-2.5">
            {q.opts.map((o) => {
              const selected = answers[q.id] === o.v;
              return (
                <button
                  key={o.v}
                  type="button"
                  onClick={() =>
                    setAnswers((a) => ({ ...a, [q.id]: a[q.id] === o.v ? null : o.v }))
                  }
                  className={`grid grid-cols-[1fr_100px] items-center gap-4 rounded border p-[18px] text-left ${
                    selected
                      ? 'border-carbon bg-carbon text-sand'
                      : 'border-rule bg-paper text-carbon'
                  }`}
                >
                  <div>
                    <div className="font-display text-[22px] font-semibold tracking-[-0.02em]">
                      {o.l}
                      {selected && (
                        <span className="ml-2 font-mono text-[12px] text-ochre">● selected</span>
                      )}
                    </div>
                    <div
                      className={`mt-1 font-mono text-[12px] leading-[1.5] ${
                        selected ? 'text-ink-30' : 'text-ink-70'
                      }`}
                    >
                      {o.d}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-7 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="rounded-[3px] border border-carbon bg-transparent px-5 py-3 font-mono text-[13px] text-carbon disabled:opacity-40"
            >
              ← back
            </button>
            <div className="mx-6 flex flex-1 items-center gap-3.5">
              <div className="relative h-1 flex-1 rounded bg-rule">
                <div
                  className="absolute left-0 top-0 h-1 rounded bg-rust transition-[width]"
                  style={{ width: `${((step + 1) / 5) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-ink-50">{step + 1} / 5</span>
            </div>
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(QUESTIONS.length - 1, s + 1))}
              disabled={step === QUESTIONS.length - 1 || !answers[q.id]}
              className="rounded-[3px] bg-rust px-[22px] py-3 font-mono text-[13px] font-semibold tracking-[0.04em] text-sand disabled:opacity-40"
            >
              next →
            </button>
          </div>
        </div>

        {/* Live shortlist */}
        <aside>
          <div className="rounded border border-rule bg-paper p-[18px]">
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-rust">
                · live shortlist
              </span>
              <span className="font-mono text-[10.5px] text-moss">● updating</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-ink-50">
              {loading
                ? 'loading…'
                : `filtered from ${counts.pool} · preview top ${counts.matches}`}
            </div>
            <div className="mt-3 grid gap-2.5">
              {matches.map((s, i) => (
                <a
                  key={s.id}
                  href={`/reviews/${s.slug}`}
                  className="grid grid-cols-[56px_1fr_44px] items-center gap-3 rounded-[3px] p-2.5"
                  style={i === 0 ? { background: 'rgba(196,88,44,0.06)' } : undefined}
                >
                  <div className="h-14 w-14 overflow-hidden rounded-[3px] bg-sand-deep">
                    {s.image_url && (
                      <img
                        src={s.image_url}
                        alt={s.model}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div>
                    <div className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-ink-50">
                      {s.brand.toUpperCase()}
                      {i === 0 && <span className="ml-1.5 text-rust">★ top match</span>}
                    </div>
                    <div className="font-display text-[15px] font-medium tracking-[-0.015em] text-carbon">
                      {s.model}
                    </div>
                    <div className="mt-0.5 font-mono text-[10.5px] text-ink-50">
                      {s.weight_g}g · {s.drop_mm}mm · ${s.price_usd}
                    </div>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-full border border-rust font-display text-[14px] font-semibold text-rust">
                    {s.our_rating?.toFixed(1)}
                  </div>
                </a>
              ))}
              {!loading && matches.length === 0 && (
                <p className="font-mono text-[12px] text-ink-50">
                  No matches at these filters. Loosen the budget or cushion preference.
                </p>
              )}
            </div>
            {allAnswered && (
              <button
                type="button"
                className="mt-3 w-full rounded-[3px] bg-carbon py-2.5 font-mono text-[12.5px] font-semibold text-sand"
              >
                Lock in shortlist · email me details →
              </button>
            )}
          </div>

          <div className="mt-3.5 rounded bg-carbon p-4 text-sand">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-ochre">
              · how this works
            </span>
            <p className="mt-2 font-mono text-[11.5px] leading-[1.6]">
              We don&apos;t serve you store-filter results dressed up as a quiz. Every shoe in
              the shortlist has been{' '}
              <span className="text-ochre">purchased at MSRP</span>,{' '}
              <span className="text-ochre">tested 100+ mi</span>, and{' '}
              <span className="text-ochre">reviewed by a human</span>.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
