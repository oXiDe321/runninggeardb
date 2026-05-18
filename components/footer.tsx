// components/footer.tsx — Specs-Engine version.

import Link from 'next/link';

const cols = [
  {
    h: 'CATEGORIES',
    items: [
      ['shoes / trail', '/shoes?d=trail'],
      ['shoes / road',  '/shoes?d=road'],
      ['shoes / hyrox', '/shoes?d=hyrox'],
      ['vests / race',  '/vests'],
      ['fuel / gels',   '/gels'],
    ] as const,
  },
  {
    h: 'TOOLS',
    items: [
      ['/finder',    '/finder'],
      ['/compare',   '/compare'],
      ['/changelog', '/changelog'],
    ] as const,
  },
  {
    h: 'NOTES',
    items: [
      ['Blog',         '/blog'],
      ['How we earn',  '/legal/affiliate'],
      ['About',        '/about'],
    ] as const,
  },
  {
    h: 'LEGAL',
    items: [
      ['Affiliate disclosure', '/legal/affiliate'],
      ['Privacy',              '/legal/privacy'],
      ['Terms',                '/legal/terms'],
      ['Contact',              '/contact'],
    ] as const,
  },
];

export default function Footer() {
  return (
    <footer className="bg-carbon px-8 pb-6 pt-12 text-sand">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-[1.4fr_repeat(4,1fr)] gap-8 border-b border-sand/14 pb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center bg-sand font-mono text-[14px] font-bold text-carbon">
                R/
              </div>
              <div className="font-display text-[18px] font-semibold tracking-[-0.02em]">
                RunningGearDB
              </div>
            </div>
            <p className="mt-3.5 max-w-[320px] text-[13px] leading-[1.55] text-ink-30">
              An open database of running gear. Every spec measured, every claim sourced,
              every purchase trackable. Updated by hand &amp; by machine.
            </p>
            <div className="mt-3.5 font-mono text-[10.5px] tracking-[0.1em] text-ochre">
              ● LIVE · SKU INDEXED
            </div>
          </div>

          {cols.map((c) => (
            <div key={c.h}>
              <div className="mb-3 font-mono text-[10px] tracking-[0.16em] text-ink-30">
                {c.h}
              </div>
              <ul className="grid list-none gap-2 p-0 font-mono text-[12px]">
                {c.items.map(([l, href]) => (
                  <li key={l}>
                    <Link href={href} className="text-sand">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-between font-mono text-[10.5px] text-ink-30">
          <span>
            © {new Date().getFullYear()} RGD · we earn from qualifying purchases (
            <Link href="/legal/affiliate" className="border-b border-sand/30">
              full disclosure
            </Link>
            )
          </span>
          <span>
            <span className="text-moss">●</span> all-systems-nominal
          </span>
        </div>
      </div>
    </footer>
  );
}
