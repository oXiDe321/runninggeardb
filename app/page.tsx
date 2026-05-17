import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero with atmospheric gradient */}
      <section className="relative overflow-hidden py-40">
        {/* Background gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-slate-50 to-blue-50" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-300/20 to-red-300/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300/20 to-slate-300/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-block mb-6">
              <span className="inline-block px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                ✓ Data-First Gear Database
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight text-slate-950 mb-6 leading-tight">
              Every Spec.
              <br />
              <span className="bg-gradient-to-r from-orange-600 via-red-600 to-orange-500 bg-clip-text text-transparent">
                Every Run.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Filterable specs. Real reviews. No marketing. Trail, road, Hyrox, parkrun—find your gear.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shoes"
                className="inline-block px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-orange-500/30 transition transform hover:scale-105"
              >
                Browse Gear
              </Link>
              <Link
                href="/compare"
                className="inline-block px-8 py-4 bg-white text-slate-950 rounded-full font-bold border-2 border-slate-200 hover:border-orange-300 hover:shadow-lg transition transform hover:scale-105"
              >
                Compare Specs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories with gradient cards */}
      <section className="relative py-24 bg-gradient-to-b from-white via-slate-50/50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-950 mb-4">Gear Categories</h2>
            <p className="text-lg text-slate-600">Explore spec databases for every running discipline</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Link
              href="/shoes"
              className="group relative overflow-hidden rounded-2xl p-8 border border-slate-200 hover:border-orange-300 transition duration-500"
            >
              {/* Card background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-white opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative">
                <div className="inline-block mb-4 p-3 bg-gradient-to-br from-orange-100 to-orange-50 rounded-lg">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m0 0v2m0 2v2m0 2a2 2 0 100-4m0 4a2 2 0 110-4m0 0v-2" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-950 mb-2 group-hover:text-orange-600 transition">Running Shoes</h3>
                <p className="text-slate-600 group-hover:text-slate-700 transition">Trail, road, Hyrox — filterable by drop, weight, terrain, and more.</p>
              </div>
            </Link>

            <Link
              href="/vests"
              className="group relative overflow-hidden rounded-2xl p-8 border border-slate-200 hover:border-blue-300 transition duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative">
                <div className="inline-block mb-4 p-3 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-950 mb-2 group-hover:text-blue-600 transition">Vests & Packs</h3>
                <p className="text-slate-600 group-hover:text-slate-700 transition">UTMB compliant, ultra-rated, capacity and weight compared.</p>
              </div>
            </Link>

            <Link
              href="/gels"
              className="group relative overflow-hidden rounded-2xl p-8 border border-slate-200 hover:border-green-300 transition duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white opacity-0 group-hover:opacity-100 transition duration-500" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />

              <div className="relative">
                <div className="inline-block mb-4 p-3 bg-gradient-to-br from-green-100 to-green-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-950 mb-2 group-hover:text-green-600 transition">Nutrition</h3>
                <p className="text-slate-600 group-hover:text-slate-700 transition">Gels, chews, drinks — compare carbs, sodium, caffeine, price.</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Why RunningGearDB with dark gradient */}
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
        {/* Accent gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full blur-3xl" />
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
                title: 'Real Reviews',
                desc: 'Honest, data-driven takes. Pros, cons, trade-offs. No sponsored content.',
                icon: '⭐',
              },
              {
                title: 'Auto-Updated',
                desc: 'New gear added weekly. Reviews generated automatically. Never stale.',
                icon: '🔄',
              },
            ].map((item, idx) => (
              <div key={idx} className="group p-8 bg-white/5 backdrop-blur border border-white/10 rounded-2xl hover:border-orange-500/50 hover:bg-white/10 transition duration-500">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-400 transition">{item.title}</h3>
                <p className="text-slate-300 group-hover:text-slate-100 transition">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
