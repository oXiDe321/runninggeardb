// components/page-shell.tsx — Shared Specs-Engine shell for text pages
// (about, contact, legal). Gives every static page the same themed header
// (breadcrumb + display title) and a consistent mono prose body, matching
// the rest of the site instead of the plain default Tailwind look.

import Link from 'next/link';
import type { ReactNode } from 'react';

export default function PageShell({
  slug,
  title,
  subtitle,
  updated,
  children,
}: {
  slug: string;          // e.g. "/contact" or "/legal/terms"
  title: string;
  subtitle?: string;
  updated?: string;      // e.g. "May 2026"
  children: ReactNode;
}) {
  const crumbs = slug.split('/').filter(Boolean);

  return (
    <div className="bg-sand text-carbon">
      <header className="border-b border-rule px-4 pb-8 pt-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-50">
            <Link href="/" className="hover:text-rust">rgd</Link>
            {crumbs.map((c, i) => (
              <span key={c}>
                {' ▸ '}
                {i === crumbs.length - 1 ? (
                  <span className="text-rust">{c}</span>
                ) : (
                  c
                )}
              </span>
            ))}
          </div>
          <h1 className="m-0 mt-3 font-display text-[44px] font-semibold leading-[0.96] tracking-[-0.04em] sm:text-[56px]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-[620px] font-mono text-[14px] leading-[1.7] text-ink-70">
              {subtitle}
            </p>
          )}
          {updated && (
            <div className="mt-3 font-mono text-[11px] text-ink-50">Last updated: {updated}</div>
          )}
        </div>
      </header>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div
          className="mx-auto max-w-3xl
            [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:font-mono [&_h2]:text-[10px] [&_h2]:uppercase [&_h2]:tracking-[0.16em] [&_h2]:text-ink-50
            [&_p]:mb-4 [&_p]:font-mono [&_p]:text-[13px] [&_p]:leading-[1.8] [&_p]:text-ink-70
            [&_a]:text-rust [&_a]:underline [&_a]:underline-offset-2"
        >
          {children}
        </div>
      </section>
    </div>
  );
}
