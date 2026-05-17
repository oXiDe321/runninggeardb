import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-50 via-orange-50/30 to-white py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-950 mb-6">
              Every Spec. Every Run.
            </h1>
            <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
              The gear database for trail, road, Hyrox and parkrun runners. Filterable specs. Real reviews. No marketing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/shoes"
                className="inline-block px-8 py-3 bg-orange-600 text-white rounded-full font-medium hover:bg-orange-700 transition"
              >
                Browse Shoes
              </Link>
              <Link
                href="/compare"
                className="inline-block px-8 py-3 border border-slate-200 text-slate-950 rounded-full font-medium hover:bg-slate-50 transition"
              >
                Compare Gear
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-3xl font-bold mb-12 text-slate-950">Gear Categories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            href="/shoes"
            className="p-8 border border-slate-200 rounded-xl hover:border-orange-300 hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold text-slate-950 mb-2">Running Shoes</h3>
            <p className="text-slate-600">Trail, road, Hyrox — find your perfect shoe with detailed specs.</p>
          </Link>
          <Link
            href="/vests"
            className="p-8 border border-slate-200 rounded-xl hover:border-orange-300 hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold text-slate-950 mb-2">Vests & Packs</h3>
            <p className="text-slate-600">UTMB compliant, ultra-rated, compared head-to-head.</p>
          </Link>
          <Link
            href="/gels"
            className="p-8 border border-slate-200 rounded-xl hover:border-orange-300 hover:shadow-lg transition"
          >
            <h3 className="text-2xl font-bold text-slate-950 mb-2">Nutrition</h3>
            <p className="text-slate-600">Gels, chews, drinks — compare carbs, sodium, caffeine.</p>
          </Link>
        </div>
      </section>

      {/* Why RunningGearDB */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-12 text-slate-950">Why RunningGearDB</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Filterable Specs</h3>
              <p className="text-slate-600">
                Skip the listicles. Filter by drop, weight, terrain, compliance — then compare side-by-side. Real data, instantly.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">All Disciplines</h3>
              <p className="text-slate-600">
                Trail to road to Hyrox to parkrun. One database. No walled gardens or sport silos.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Real Reviews</h3>
              <p className="text-slate-600">
                Honest, data-driven takes. Pros, cons, trade-offs. No sponsored content or hidden agendas.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-950 mb-3">Auto-Updated</h3>
              <p className="text-slate-600">
                New gear added weekly. Reviews generated automatically. No stale 2017 content ranking first.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
