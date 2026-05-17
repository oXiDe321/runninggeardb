import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import CompareTool from '@/components/compare-tool';

export const metadata: Metadata = {
  title: 'Compare Gear — RunningGearDB',
  description: 'Select 2-4 products and compare specs side-by-side. Find the best gear for your needs.',
};

export default async function ComparePage() {
  const [shoes, vests, gels] = await Promise.all([
    supabase.from('shoes').select('*').eq('published', true).order('our_rating', { ascending: false }),
    supabase.from('vests').select('*').eq('published', true).order('our_rating', { ascending: false }),
    supabase.from('gels').select('*').eq('published', true).order('our_rating', { ascending: false }),
  ]);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="relative py-16 bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900 border-b border-slate-200 dark:border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-200/20 dark:from-brand-500/5 to-transparent rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-slate-950 dark:text-white mb-2">Compare Gear</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Select 2-4 products to compare specs side-by-side. Best values highlighted automatically.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <CompareTool
          initialProducts={{
            shoes: shoes.data || [],
            vests: vests.data || [],
            gels: gels.data || [],
          }}
        />
      </div>
    </div>
  );
}
