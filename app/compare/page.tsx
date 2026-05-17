import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compare Gear — RunningGearDB',
  description: 'Side-by-side gear comparison tool. Select 2-4 products and compare specs instantly.',
};

export default function ComparePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-950 mb-2">Compare Gear</h1>
        <p className="text-lg text-slate-600 mb-8">
          Select 2-4 products to compare specs side-by-side.
        </p>
      </div>

      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
        <p className="text-slate-600 mb-4">
          Comparison tool coming soon. In the meantime, browse our gear categories:
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/shoes" className="inline-block px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700">
            Shoes
          </a>
          <a href="/vests" className="inline-block px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700">
            Vests
          </a>
          <a href="/gels" className="inline-block px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700">
            Nutrition
          </a>
        </div>
      </div>
    </div>
  );
}
