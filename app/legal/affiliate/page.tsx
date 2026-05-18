import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — RunningGearDB',
  description: 'How RunningGearDB earns money through affiliate links.',
};

export default function AffiliatePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-carbon mb-2">Affiliate Disclosure</h1>
      <p className="text-ink-30 text-[11px] font-mono mb-10">Last updated: May 2026</p>

      <div className="prose prose-sm text-ink-70 leading-relaxed space-y-4">
        <p>
          RunningGearDB is a participant in the Amazon Services LLC Associates Program,
          an affiliate advertising program designed to provide a means for sites to earn
          advertising fees by advertising and linking to amazon.com.
        </p>
        <p>
          We also participate in affiliate programs with Running Warehouse, REI, and other
          retailers. When you click a link and make a purchase, we may earn a commission at
          no additional cost to you.
        </p>
        <p>
          We do not accept payment for reviews. No brand can pay for placement, ratings,
          or editorial content. Every test unit is purchased at MSRP.
        </p>
        <p>
          Gear we review is purchased at MSRP unless otherwise noted. Loaner units from
          brands are disclosed in the review&apos;s transparency block.
        </p>
      </div>
    </div>
  );
}
