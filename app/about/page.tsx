import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — RunningGearDB',
  description: 'An open, data-first database of running gear.',
};

export default function AboutPage() {
  return (
    <div className="bg-sand font-sans text-carbon min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-carbon mb-2">About</h1>
        <p className="text-ink-50 mb-10 text-sm leading-relaxed">
          RunningGearDB is an open database. We track specs, prices, and reviews across every
          running discipline — trail, road, Hyrox, parkrun, track.
        </p>

        <section className="space-y-6 text-sm leading-relaxed text-ink-70">
          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-30 mb-2">What we do</h2>
            <p>
              We collect manufacturer specs, track prices across retailers, and publish
              structured reviews driven by community consensus and spec data. Each review is
              AI-drafted from product data and community research.
            </p>
          </div>

          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-30 mb-2">How we earn</h2>
            <p>
              RunningGearDB participates in affiliate programs. When you buy through our links, we
              earn a commission at no extra cost to you. We never accept payment for reviews, and
              no brand can buy placement. Read our full{' '}
              <a href="/legal/affiliate" className="text-rust underline underline-offset-2">affiliate disclosure</a>.
            </p>
          </div>

          <div>
            <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-30 mb-2">Data practices</h2>
            <p>
              Every change to a score, price, or review is logged to our{' '}
              <a href="/changelog" className="text-rust underline underline-offset-2">public changelog</a>.
              Price history is tracked over 90-day windows. Community sentiment is sourced from
              public forums and attributed.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
