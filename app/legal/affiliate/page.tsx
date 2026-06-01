import type { Metadata } from 'next';
import PageShell from '@/components/page-shell';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure — RunningGearDB',
  description: 'How RunningGearDB earns money through affiliate links.',
};

export default function AffiliatePage() {
  return (
    <PageShell slug="/legal/affiliate" title="Affiliate Disclosure" updated="May 2026">
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
        or editorial content. Affiliate relationships never influence our scores or rankings.
      </p>
    </PageShell>
  );
}
