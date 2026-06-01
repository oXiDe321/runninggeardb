import type { Metadata } from 'next';
import PageShell from '@/components/page-shell';

export const metadata: Metadata = {
  title: 'Privacy Policy — RunningGearDB',
  description: 'Privacy policy for RunningGearDB.',
};

export default function PrivacyPage() {
  return (
    <PageShell slug="/legal/privacy" title="Privacy Policy" updated="May 2026">
      <p>
        RunningGearDB does not collect personal data beyond what is necessary for the
        site to function. We do not have user accounts, and we do not store email
        addresses or personal information.
      </p>
      <p>
        We use anonymous analytics (Google Analytics) to understand traffic patterns.
        This data is aggregated and cannot be used to identify individual visitors.
      </p>
      <p>
        Affiliate links on this site may set cookies for the purpose of tracking referrals.
        These cookies are set by the retailer, not by RunningGearDB.
      </p>
      <p>
        If you have questions about privacy, contact{' '}
        <a href="mailto:hello@runninggeardb.com">hello@runninggeardb.com</a>.
      </p>
    </PageShell>
  );
}
