// app/methodology/page.tsx
// Every E-E-A-T component in the v2 review links here. The page itself is
// the single largest trust-signal asset on the site — keep it dense,
// transparent, dated, and human-named.

import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Methodology · How RunningGearDB tests, scores, and earns',
  description:
    'How we test running gear at RGDB: who tests, miles logged, scoring rubric, conflict-of-interest rules, how affiliate revenue is spent. Public, dated, and reproducible.',
  alternates: { canonical: 'https://runninggeardb.com/methodology' },
};

export default async function MethodologyPage() {
  const { data: testers } = await supabase
    .from('testers')
    .select('slug, name, title, bio, avatar_url, credentials, miles_logged_lifetime, joined_at')
    .eq('active', true)
    .order('joined_at', { ascending: true });

  return (
    <div className="bg-sand text-carbon">
      {/* ── Header ───────────────────────────────────────────── */}
      <header className="border-b border-rule px-8 pb-10 pt-12">
        <div className="mx-auto max-w-5xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
            rgd ▸ <span className="text-rust">/methodology</span> · v4.2 · pub 12-may-2026
          </div>
          <h1 className="m-0 mt-3 font-display text-[80px] font-semibold leading-[0.95] tracking-[-0.04em]">
            How we test, score,
            <br />
            <span className="text-rust">and earn from this.</span>
          </h1>
          <p className="mt-5 max-w-[760px] font-mono text-[15px] leading-[1.65] text-ink-70">
            Public. Dated. Reproducible. If you find an error on RGDB, it&apos;s in our changelog
            within 24 hours. Below is every rule we follow — and every rule we&apos;ve broken in
            the past, with what changed afterwards.
          </p>
        </div>
      </header>

      {/* ── Pillars ──────────────────────────────────────────── */}
      <section className="border-b border-rule px-8 py-10">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-0 overflow-hidden rounded border border-rule">
          {[
            ['NO FREE GEAR', 'Every test unit is purchased at MSRP. We disclose the receipt on request.'],
            ['NAMED TESTERS', 'Every review has a named human attached, with verifiable mileage and credentials.'],
            ['VERSIONED SCORES', 'Re-scores are logged in our public /changelog. We never silently nerf.'],
          ].map(([h, b], i) => (
            <div key={h} className={`p-6 ${i ? 'border-l border-rule' : ''} bg-paper`}>
              <div className="font-mono text-[10.5px] tracking-[0.16em] text-rust">
                · principle 0{i + 1}
              </div>
              <div className="mt-2 font-display text-[24px] font-semibold tracking-[-0.025em]">
                {h}
              </div>
              <p className="mt-2 font-mono text-[12.5px] leading-[1.6] text-ink-70">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Sections ─────────────────────────────────────────── */}
      <section className="px-8 py-12">
        <div className="mx-auto max-w-3xl space-y-12 font-sans text-[16px] leading-[1.75] text-carbon-80">
          <Section n="01" h="How we select what to test">
            <p>
              We test anything currently in production with a full size run in M9 / W7 at a
              first-party retailer. We do not chase exclusives, embargoed launches, or
              brand-supplied loaner units. If a model is out of stock for longer than two weeks,
              it&apos;s flagged in the index with a <code>· low-stock</code> tag.
            </p>
          </Section>

          <Section n="02" h="How we test">
            <p>
              Every shoe gets a minimum of <strong>100 miles</strong> across three terrain bands
              before a score is published. Race-oriented shoes get 60 mi with a workout
              prerequisite. Vests are tested with a 2-litre load at temperature; gels are
              logged through a long effort with a paired hydration plan.
            </p>
            <p>
              We measure weight in-house in M9 (or W7 where applicable). When our number
              disagrees with the spec sheet, we publish <em>both</em> with a <code>· in-house ✓</code>{' '}
              annotation on the verified value.
            </p>
          </Section>

          <Section n="03" h="How we score">
            <p>
              Every product is rated on six dimensions on a 0–10 scale:
              <span className="ml-1 font-mono text-[14px]">
                grip · comfort · weight · durability · value · fit
              </span>
              . Each tester scores blind; we discard outliers and aggregate the mean. The
              category baseline is recalibrated each quarter from the median of the active
              index. <strong>This is why scores move.</strong>
            </p>
          </Section>

          <Section n="04" h="How AI fits in">
            <p>
              We are explicit about this: every review is drafted by an LLM from two inputs —
              the tester&apos;s field notes and the verified spec database. The draft is then
              edited by a named human editor and peer-reviewed by two more testers before
              publishing. <strong>No review goes live without a named human approving every
              numeric claim.</strong>
            </p>
            <p>
              The reason we use AI is speed. The reason we name the tester, the editor, the
              mileage, and the date is trust. Both matter.
            </p>
          </Section>

          <Section n="05" h="How we earn">
            <p>
              RGDB earns a commission on qualifying purchases from Amazon, REI, Running
              Warehouse, and Backcountry. The commission is <em>identical</em> across all
              retailers we link to — we never preference a retailer by margin. The cheapest
              live price is always shown first.
            </p>
            <p>
              Affiliate revenue covers test-unit purchases first, tester stipends second, and
              hosting last. The annual P&amp;L is posted in our changelog every January.
            </p>
          </Section>

          <Section n="06" h="Mistakes & corrections">
            <p>
              Every correction is timestamped and stays in the changelog forever. We do not
              quietly edit. We do not change a publish date to fake freshness. If a score
              changes, the prior score is preserved with a strikethrough.
            </p>
          </Section>
        </div>
      </section>

      {/* ── Testers ──────────────────────────────────────────── */}
      {testers && testers.length > 0 && (
        <section className="border-t border-rule bg-paper px-8 py-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="font-display text-[40px] font-semibold tracking-[-0.03em]">
                · The testers
              </h2>
              <span className="font-mono text-[12px] text-ink-50">
                {testers.length} active · last refresh today
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {testers.map((t) => {
                const initials = t.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <a
                    key={t.slug}
                    href={`/testers/${t.slug}`}
                    className="block rounded border border-rule bg-sand p-5"
                  >
                    <div className="flex items-center gap-3">
                      {t.avatar_url ? (
                        <img
                          src={t.avatar_url}
                          alt={t.name}
                          className="h-14 w-14 rounded-full object-cover"
                        />
                      ) : (
                        <div className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-moss to-carbon font-display text-[18px] font-semibold text-sand">
                          {initials}
                        </div>
                      )}
                      <div>
                        <div className="font-display text-[17px] font-semibold tracking-[-0.02em]">
                          {t.name}
                        </div>
                        <div className="font-mono text-[10.5px] tracking-[0.14em] text-ink-50">
                          {t.title?.toUpperCase()}
                        </div>
                      </div>
                    </div>
                    {t.bio && <p className="mt-3 text-[13px] leading-[1.55] text-ink-70">{t.bio}</p>}
                    <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[11px] text-ink-50">
                      <span>
                        miles · <span className="text-carbon">{t.miles_logged_lifetime}</span>
                      </span>
                      <span>
                        since ·{' '}
                        <span className="text-carbon">
                          {t.joined_at?.slice(0, 4)}
                        </span>
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Section({ n, h, children }: { n: string; h: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="mb-3 flex items-baseline gap-4 border-b border-rule pb-2">
        <span className="font-mono text-[11px] tracking-[0.16em] text-rust">§ {n}</span>
        <h2 className="m-0 font-display text-[34px] font-semibold tracking-[-0.03em]">{h}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
