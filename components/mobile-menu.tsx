'use client';
// components/mobile-menu.tsx — hamburger toggle for nav on mobile (<md).
import { useState, useEffect } from 'react';
import Link from 'next/link';

const links = [
  { href: '/shoes', label: '/shoes' },
  { href: '/vests', label: '/vests' },
  { href: '/gels', label: '/fuel' },
  { href: '/compare', label: '/compare' },
  { href: '/finder', label: '/finder' },
  { href: '/prices', label: '/prices' },
  { href: '/changelog', label: '/changelog' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  // Close on escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="relative flex h-9 w-9 flex-col items-center justify-center gap-[5px] rounded-[3px] border border-rule bg-paper md:hidden"
      >
        <span
          className="block h-px w-[18px] bg-carbon transition-all duration-200"
          style={open ? { transform: 'translateY(6px) rotate(45deg)' } : {}}
        />
        <span
          className="block h-px w-[18px] bg-carbon transition-all duration-200"
          style={open ? { opacity: 0 } : {}}
        />
        <span
          className="block h-px w-[18px] bg-carbon transition-all duration-200"
          style={open ? { transform: 'translateY(-6px) rotate(-45deg)' } : {}}
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown panel */}
          <div className="absolute inset-x-0 top-full z-50 border-b border-rule bg-sand shadow-md md:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block border-b border-rule-soft px-5 py-4 font-mono text-[13px] text-carbon hover:bg-paper"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
