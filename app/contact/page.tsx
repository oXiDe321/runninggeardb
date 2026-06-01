import type { Metadata } from 'next';
import PageShell from '@/components/page-shell';

export const metadata: Metadata = {
  title: 'Contact — RunningGearDB',
  description: 'Get in touch with RunningGearDB.',
};

export default function ContactPage() {
  return (
    <PageShell
      slug="/contact"
      title="Contact"
      subtitle="Questions or corrections? We read every message."
    >
      <h2>Email</h2>
      <p>
        <a href="mailto:hello@runninggeardb.com">hello@runninggeardb.com</a>
      </p>

      <h2>Corrections</h2>
      <p>
        If you find an error in a spec, price, or review, email us with the subject line
        &quot;correction&quot; plus the product slug. We log every correction to the public changelog.
      </p>
    </PageShell>
  );
}
