import type { Metadata } from 'next';
import PageShell from '@/components/page-shell';

export const metadata: Metadata = {
  title: 'About — RunningGearDB',
  description: 'An open, data-first database of running gear. Every spec measured, every claim sourced.',
};

export default function AboutPage() {
  return (
    <PageShell
      slug="/about"
      title="About"
      subtitle="RunningGearDB is an open database. We track specs, prices, and reviews across every running discipline — trail, road, Hyrox, parkrun, track."
    >
      <h2>What we do</h2>
      <p>
        We collect manufacturer specs, verify weights and dimensions in-house, track prices
        across retailers, and publish structured reviews generated from spec data. Every score,
        price, and data point is sourced and logged to the public changelog.
      </p>

      <h2>How we earn</h2>
      <p>
        RunningGearDB participates in affiliate programs. When you buy through our links, we
        earn a commission at no extra cost to you. We never accept payment for reviews, and
        no brand can buy placement. Read our full{' '}
        <a href="/legal/affiliate">affiliate disclosure</a>.
      </p>

      <h2>Data practices</h2>
      <p>
        Every change to a score, price, or review is logged to our{' '}
        <a href="/changelog">public changelog</a>. Price history is tracked over 90-day
        windows. Community sentiment is sourced from public forums and attributed.
      </p>
    </PageShell>
  );
}
