import { Metadata } from 'next';
import Link from 'next/link';
import { Footprints, ShoppingBag, FlaskConical } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compare Gear — RunningGearDB',
  description: 'Side-by-side gear comparison tool. Select 2-4 products and compare specs instantly.',
};

const categories = [
  {
    title: 'Shoes',
    description: 'Compare trail, road, and Hyrox shoes by drop, weight, stack, and price.',
    href: '/shoes',
    icon: Footprints,
    accent: 'orange',
    gradient: 'from-brand-500/20 to-brand-600/5',
    border: 'border-brand-200 dark:border-brand-900/30',
    hoverBorder: 'group-hover:border-brand-300 dark:group-hover:border-brand-700',
    badge: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  },
  {
    title: 'Vests & Packs',
    description: 'Compare capacity, weight, pocket count, and UTMB compliance across packs.',
    href: '/vests',
    icon: ShoppingBag,
    accent: 'blue',
    gradient: 'from-blue-500/20 to-blue-600/5',
    border: 'border-blue-200 dark:border-blue-900/30',
    hoverBorder: 'group-hover:border-blue-300 dark:group-hover:border-blue-700',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    title: 'Nutrition',
    description: 'Compare carbs, sodium, caffeine, and price per serving across gels and chews.',
    href: '/gels',
    icon: FlaskConical,
    accent: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-600/5',
    border: 'border-emerald-200 dark:border-emerald-900/30',
    hoverBorder: 'group-hover:border-emerald-300 dark:group-hover:border-emerald-700',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
];

export default function ComparePage() {
  return (
    <div className="w-full">
      {/* Header */}
      <section className="relative py-16 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-200/20 dark:from-brand-500/5 to-transparent rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-slate-950 dark:text-white mb-2">Compare Gear</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Select 2-4 products within any category to compare specs side-by-side. Find the best gear for your needs.
          </p>
        </div>
      </section>

      {/* Category cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <Link key={cat.href} href={cat.href} className="group">
              <div
                className={`relative h-full p-8 rounded-2xl border ${cat.border} bg-white dark:bg-slate-900 surface-elevated card-hover transition-all duration-300 ${cat.hoverBorder}`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.gradient} to-transparent rounded-full blur-2xl`} />
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
                    <cat.icon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-950 dark:text-white mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    {cat.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${cat.badge}`}>
                      Browse & Compare
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Coming soon notice */}
        <div className="mt-12 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Full side-by-side comparison tool coming soon. For now, each category page lets you filter and compare specs in table view.
          </p>
        </div>
      </div>
    </div>
  );
}
