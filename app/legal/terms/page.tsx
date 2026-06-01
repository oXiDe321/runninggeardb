import type { Metadata } from 'next';
import PageShell from '@/components/page-shell';

export const metadata: Metadata = {
  title: 'Terms of Service — RunningGearDB',
  description: 'Terms of service for RunningGearDB.',
};

export default function TermsPage() {
  return (
    <PageShell slug="/legal/terms" title="Terms of Service" updated="May 2026">
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
    </PageShell>
  );
}
