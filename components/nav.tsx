import Link from 'next/link';
import Logo from './logo';
import ThemeToggle from './theme-toggle';

const navLinks = [
  { href: '/shoes', label: 'Shoes' },
  { href: '/vests', label: 'Vests' },
  { href: '/gels', label: 'Gels' },
  { href: '/blog', label: 'Blog' },
  { href: '/compare', label: 'Compare' },
];

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur border-b border-brand-100 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="transition hover:opacity-80">
            <Logo />
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition font-medium link-underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}
