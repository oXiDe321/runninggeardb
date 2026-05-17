import Link from 'next/link';
import { ArrowRight, Footprints, ShoppingBag, FlaskConical } from 'lucide-react';

const gearCategories = [
  {
    href: '/shoes',
    label: 'Running Shoes',
    desc: 'Trail, road, Hyrox — filterable by drop, weight, terrain, and more.',
    accent: 'orange' as const,
    icon: Footprints,
  },
  {
    href: '/vests',
    label: 'Vests & Packs',
    desc: 'UTMB compliant, ultra-rated, capacity and weight compared.',
    accent: 'blue' as const,
    icon: ShoppingBag,
  },
  {
    href: '/gels',
    label: 'Nutrition',
    desc: 'Gels, chews, drinks — compare carbs, sodium, caffeine, price.',
    accent: 'green' as const,
    icon: FlaskConical,
  },
] as const;

const accentStyles = {
  orange: {
    card: 'hover:border-brand-400',
    iconBg: 'bg-brand-100',
    iconFg: 'text-brand-600',
    hoverText: 'group-hover:text-brand-600',
    orb: 'from-brand-200/30',
    cardBg: 'from-brand-50',
  },
  blue: {
    card: 'hover:border-blue-300',
    iconBg: 'bg-blue-100',
    iconFg: 'text-blue-600',
    hoverText: 'group-hover:text-blue-600',
    orb: 'from-blue-200/30',
    cardBg: 'from-blue-50',
  },
  green: {
    card: 'hover:border-emerald-300',
    iconBg: 'bg-emerald-100',
    iconFg: 'text-emerald-600',
    hoverText: 'group-hover:text-emerald-600',
    orb: 'from-emerald-200/30',
    cardBg: 'from-emerald-50',
  },
};

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero — deep base with mesh gradient (Stripe + Nike inspired) */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Mesh gradient orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-gradient-to-br from-brand-500/25 via-red-500/15 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-[-30%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-brand-600/15 via-slate-500/10 to-transparent rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-conic from-brand-500/10 via-transparent to-blue-500/10 rounded-full blur-3xl" />

        {/* Grid pattern overlay (data-grid feel) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          {/* Live badge (Stripe/Linear style) */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/5 backdrop-blur border border-white/10 rounded-full text-sm text-brand-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            Data-First Gear Database
          </div>

          {/* Display typography (Nike scale) */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl text-display text-white mb-6">
            Every Spec.
            <br />
            <span className="bg-gradient-to-r from-brand-400 via-red-400 to-brand-500 bg-clip-text text-transparent">
              Every Run.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-[450]">
            Filterable specs across trail, road, Hyrox, parkrun. Compare data, find your gear.
          </p>

          {/* CTAs — white pill + ghost pill (Raycast/Linear style) */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shoes"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-950 rounded-full font-semibold hover:bg-brand-50 hover:scale-105 transition-all duration-200 shadow-lg shadow-white/10"
            >
              Browse Gear
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 backdrop-blur border border-white/15 text-white rounded-full font-semibold hover:bg-white/10 hover:border-brand-500/40 hover:scale-105 transition-all duration-200"
            >
              Compare Specs
            </Link>
          </div>

          {/* Stats row (Nike-style confident data) */}
          <div className="mt-20 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white tracking-[-0.03em]">150+</p>
              <p className="text-sm text-slate-500 font-medium">Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-white tracking-[-0.03em]">3</p>
              <p className="text-sm text-slate-500 font-medium">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold text-brand-400 tracking-[-0.03em]">4.2</p>
              <p className="text-sm text-slate-500 font-medium">Avg Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gear Categories */}
      <section className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4">Gear Categories</h2>
            <p className="text-lg text-slate-600">Explore spec databases for every running discipline</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {gearCategories.map((cat) => {
              const s = accentStyles[cat.accent];
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className={`group relative overflow-hidden rounded-2xl p-8 border border-slate-200 ${s.card} transition duration-500`}
                >
                  {/* Card background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${s.cardBg} to-white opacity-0 group-hover:opacity-100 transition duration-500`}
                  />
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${s.orb} to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500`}
                  />

                  <div className="relative">
                    <div
                      className={`inline-flex items-center justify-center mb-4 w-12 h-12 ${s.iconBg} rounded-xl`}
                    >
                      <Icon className={`w-6 h-6 ${s.iconFg}`} />
                    </div>
                    <h3
                      className={`text-2xl font-bold text-slate-950 mb-2 ${s.hoverText} transition`}
                    >
                      {cat.label}
                    </h3>
                    <p className="text-slate-600 group-hover:text-slate-700 transition">{cat.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why RunningGearDB */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Accent gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-500/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why RunningGearDB</h2>
            <p className="text-lg text-slate-300">Data-first approach beats listicles every time</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Filterable Specs',
                desc: 'Drop, weight, terrain, compliance. Filter, then compare side-by-side. Real data, instantly.',
                icon: '⚙️',
              },
              {
                title: 'All Disciplines',
                desc: 'Trail to road to Hyrox to parkrun. One database. No walled gardens or sport silos.',
                icon: '🏃',
              },
              {
                title: 'Data-Driven Ratings',
                desc: 'Specs compared side-by-side. Ratings based on measurable criteria, not sponsorships.',
                icon: '⭐',
              },
              {
                title: 'Auto-Updated',
                desc: 'New gear added weekly. Reviews generated automatically. Never stale.',
                icon: '🔄',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-brand-500/50 hover:bg-white/10 transition duration-500"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-brand-400 transition">
                  {item.title}
                </h3>
                <p className="text-slate-300 group-hover:text-slate-100 transition">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
