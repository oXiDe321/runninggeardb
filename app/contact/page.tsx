import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — RunningGearDB',
  description: 'Get in touch with RunningGearDB.',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight text-carbon mb-2">Contact</h1>
      <p className="text-ink-50 mb-10 text-sm leading-relaxed">
        Questions or corrections? We read every message.
      </p>

      <div className="space-y-6 text-sm leading-relaxed text-ink-70">
        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-30 mb-2">Email</h2>
          <a href="mailto:hello@runninggeardb.com" className="text-rust underline underline-offset-2">
            hello@runninggeardb.com
          </a>
        </div>

        <div>
          <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-30 mb-2">Corrections</h2>
          <p>
            If you find an error in a spec, price, or review, email us with the subject line
            "correction" plus the product slug. We log every correction to the public changelog.
          </p>
        </div>

      </div>
    </div>
  );
}
