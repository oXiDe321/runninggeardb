import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — RunningGearDB',
  description: 'Privacy policy for RunningGearDB.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-sand font-sans text-carbon min-h-screen">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-carbon mb-2">Privacy Policy</h1>
        <p className="text-ink-30 text-[11px] font-mono mb-10">Last updated: May 2026</p>

        <div className="prose prose-sm text-ink-70 leading-relaxed space-y-4">
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
            <a href="mailto:hello@runninggeardb.com" className="text-rust underline underline-offset-2">
              hello@runninggeardb.com
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
