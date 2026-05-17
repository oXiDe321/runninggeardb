import ProductTable from '@/components/product-table';
import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Running Vests & Packs — RunningGearDB',
  description: 'Filterable database of trail running vests. UTMB compliant, ultra-rated, compare capacity, weight, pockets.',
};

export default async function VestsPage() {
  const { data: vests } = await supabase
    .from('vests')
    .select('*')
    .eq('published', true)
    .order('our_rating', { ascending: false });

  return (
    <div className="w-full">
      {/* Header with gradient background */}
      <section className="relative py-16 bg-gradient-to-br from-blue-50 via-slate-50 to-white border-b border-blue-100">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-transparent rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-slate-950 mb-2">Running Vests & Packs</h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            UTMB compliant, ultra-rated. Filter by capacity, weight, compliance, and find your perfect pack.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductTable products={vests || []} category="vests" />
      </div>
    </div>
  );
}
