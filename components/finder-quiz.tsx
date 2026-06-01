'use client';
// components/finder-quiz.tsx
// Client-side 5-question shoe finder. Receives initial shoe pool from the
// server so the first paint already shows the right count.
// No client-side Supabase query — the server component handles freshness.

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useCurrency } from '@/lib/currency';

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
      { v: 'any', l: 'No preference', d: 'Show me the best across all.' },
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
      { v: 'any', l: 'No preference', d: 'Show me the best across all.' },
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
    sub: 'A wide-fit shoe on narrow feet slides. A narrow shoe on wide feet hurts. Note: many shoes come in wide (2E/4E) variants on Amazon.',
    opts: [
      { v: 'narrow', l: 'Narrow', d: 'My feet feel small in most shoes.' },
      { v: 'regular', l: 'Regular (recommended)', d: 'Most shoes fit fine.' },
      { v: 'wide', l: 'Wide', d: 'I need extra room in the toe box.' },
      { v: 'any', l: 'No preference', d: "Don't filter by fit." },
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

export default function FinderQuiz({ initialShoes }: { initialShoes: Shoe[] }) {
  const { fmt, fmtWeight } = useCurrency();
  const [shoes] = useState<Shoe[]>(initialShoes);
  const [answers, setAnswers] = useState<AnswerState>({
    terrain: null,
    distance: null,
    cushion: null,
    fit: null,
    budget: null,
  });
  const [step, setStep] = useState(0);

  // Live filtering — relaxed bands to avoid empty outcomes.
  const matches = useMemo(() => {
    let pool = shoes;
    if (answers.terrain === 'trail') pool = pool.filter((s) => s.discipline === 'trail');
    if (answers.terrain === 'road') pool = pool.filter((s) => s.discipline === 'road' || s.discipline === 'parkrun' || s.discipline === 'hyrox');
    if (answers.terrain === 'mixed')
      pool = pool.filter((s) => s.discipline === 'trail' || s.discipline === 'road' || s.discipline === 'road-to-trail' || s.discipline === 'parkrun' || s.discipline === 'hyrox');

    if (answers.distance === 'ultra') pool = pool.filter((s) => (s.stack_heel_mm ?? 0) >= 26);
    if (answers.distance === '5k') pool = pool.filter((s) => (s.weight_g ?? 999) <= 270);

    if (answers.cushion === 'firm') pool = pool.filter((s) => (s.stack_heel_mm ?? 0) < 34);
    if (answers.cushion === 'plush') pool = pool.filter((s) => (s.stack_heel_mm ?? 0) >= 34);
    if (answers.cushion === 'balanced') pool = pool.filter((s) => {
      const st = (s.stack_heel_mm ?? 30);
      return st >= 28 && st <= 38;
    });

    if (answers.fit === 'wide') pool = pool.filter((s) => /altra|topo|new balance|hoka/i.test(s.brand));
    if (answers.fit === 'narrow') pool = pool.filter((s) => /nike|salomon|la sportiva|adidas/i.test(s.brand));

    if (answers.budget && answers.budget !== '999')
      pool = pool.filter((s) => (s.price_usd ?? 999) <= Number(answers.budget));

    // Fallback: if filters produce nothing, show all shoes.
    if (pool.length === 0) pool = shoes;

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
      <header className="border-b border-rule px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
            rgd ▸ <span className="text-rust">/finder</span> · 5 questions · &lt; 60 sec
          </div>
          <h1 className="m-0 mt-3 font-display text-[38px] font-semibold leading-[0.95] tracking-[-0.04em] sm:text-[52px] lg:text-[68px]">
            Find your shoe <span className="text-rust">in five questions.</span>
          </h1>
          <p className="mt-3 max-w-[720px] font-mono text-[14px] text-ink-70">
            Five hard filters narrow {counts.pool} SKU down to three shoes that match how you
            actually run. No quiz-funnel emails, no upsells.
          </p>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-4 py-8 sm:px-6 sm:py-10 lg:grid-cols-[240px_1fr_360px] lg:gap-8 lg:px-8">
        {/* Stepper — hidden on mobile, shown as sidebar on desktop */}
        <aside className="hidden lg:block">
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
          {/* Mobile progress dots */}
          <div className="mb-4 flex gap-1.5 lg:hidden">
            {QUESTIONS.map((qq, i) => (
              <button
                key={qq.id}
                onClick={() => setStep(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-rust' : answers[qq.id] ? 'w-3 bg-moss' : 'w-3 bg-rule'
                }`}
                aria-label={`Go to question ${i + 1}`}
              />
            ))}
          </div>
          <div className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-ink-50">
            QUESTION {String(step + 1).padStart(2, '0')} / 05
          </div>
          <h2 className="m-0 mt-1 font-display text-[32px] font-semibold leading-[1.02] tracking-[-0.035em] sm:text-[38px] lg:text-[44px]">
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
              filtered from {counts.pool} · preview top {counts.matches}
            </div>
            <div className="mt-3 grid gap-2.5">
              {matches.map((s, i) => (
                <a
                  key={s.id}
                  href={`/reviews/${s.slug}`}
                  className="grid grid-cols-[56px_1fr_44px] items-center gap-3 rounded-[3px] p-2.5"
                  style={i === 0 ? { background: 'rgba(196,88,44,0.06)' } : undefined}
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-[3px] bg-sand-deep">
                    {s.image_url && (
                      <Image
                        src={s.image_url}
                        alt={s.model}
                        fill
                        className="object-cover"
                        sizes="56px"
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
                      {fmtWeight(s.weight_g)} · {s.drop_mm}mm · {fmt(s.price_usd)}
                    </div>
                  </div>
                  <div className="grid h-11 w-11 place-items-center rounded-full border border-rust font-display text-[14px] font-semibold text-rust">
                    {s.our_rating?.toFixed(1)}
                  </div>
                </a>
              ))}
              {matches.length === 0 && (
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
              the shortlist comes from our spec database — real numbers, no sponsored placements.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
