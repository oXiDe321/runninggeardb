import Link from 'next/link';
import Logo from './logo';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-white/10 mt-32">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-brand-200/10 dark:from-brand-500/5 to-transparent rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <Logo />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Data-first gear database. Filterable specs and side-by-side comparisons.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-slate-950 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-brand-600 dark:text-brand-400">→</span> Gear
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/shoes" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition font-medium">
                  Shoes
                </Link>
              </li>
              <li>
                <Link href="/vests" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition font-medium">
                  Vests & Packs
                </Link>
              </li>
              <li>
                <Link href="/gels" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition font-medium">
                  Nutrition
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-950 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-brand-600 dark:text-brand-400">→</span> Explore
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/compare" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition font-medium">
                  Compare Specs
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition font-medium">
                  Guides & Tips
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-slate-950 dark:text-white mb-4 flex items-center gap-2">
              <span className="text-brand-600 dark:text-brand-400">→</span> Legal
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition font-medium">
                  Affiliate Disclosure
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition font-medium">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
            <p>&copy; 2026 RunningGearDB. Built for runners.</p>
            <p className="text-xs">v1.0 — Data-first gear database.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
