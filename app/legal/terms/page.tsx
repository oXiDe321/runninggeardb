import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service — RunningGearDB',
  description: 'Terms of service for RunningGearDB.',
};

export default function TermsPage() {
  return (
    <div className="bg-sand font-sans text-carbon min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-carbon mb-2">Terms of Service</h1>
        <p className="text-ink-30 text-[11px] font-mono mb-10">Last updated: May 2026</p>

        <div className="prose prose-sm text-ink-70 leading-relaxed space-y-4">
          <p>
            RunningGearDB provides gear specifications, prices, and reviews for informational
            purposes. While we strive for accuracy, we make no guarantees about the completeness
            or correctness of the data presented.
          </p>
          <p>
            Prices shown are indicative and may differ from the retailer&apos;s current price.
            Always verify the price on the retailer&apos;s site before purchasing.
          </p>
          <p>
            The content on this site — including reviews, spec sheets, and images — is the
            property of RunningGearDB unless otherwise attributed. Do not reproduce without
            permission.
          </p>
          <p>
            By using this site, you agree that RunningGearDB is not liable for any decisions
            made based on the information provided here. Gear choices are personal — test
            before you commit to a race.
          </p>
        </div>
      </div>
    </div>
  );
}
