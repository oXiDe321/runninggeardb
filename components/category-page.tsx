import ProductTable from '@/components/product-table';
import { supabase } from '@/lib/supabase';

interface CategoryPageProps {
  title: string;
  description: string;
  category: 'shoes' | 'vests' | 'gels';
  accent: 'orange' | 'blue' | 'emerald';
  table: 'shoes' | 'vests' | 'gels';
}

const accentStyles = {
  orange: {
    section: 'from-brand-50 via-slate-50 to-white dark:from-brand-950/20 dark:via-slate-950 dark:to-slate-950',
    border: 'border-brand-100 dark:border-brand-900/30',
    orb: 'from-brand-200/20 dark:from-brand-500/5',
  },
  blue: {
    section: 'from-blue-50 via-slate-50 to-white dark:from-blue-950/20 dark:via-slate-950 dark:to-slate-950',
    border: 'border-blue-100 dark:border-blue-900/30',
    orb: 'from-blue-200/20 dark:from-blue-500/5',
  },
  emerald: {
    section: 'from-emerald-50 via-slate-50 to-white dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950',
    border: 'border-emerald-100 dark:border-emerald-900/30',
    orb: 'from-emerald-200/20 dark:from-emerald-500/5',
  },
};

export default async function CategoryPage({
  title,
  description,
  category,
  accent,
  table,
}: CategoryPageProps) {
  const s = accentStyles[accent];

  const { data: products } = await supabase
    .from(table)
    .select('*')
    .eq('published', true)
    .order('our_rating', { ascending: false });

  return (
    <div className="w-full">
      {/* Header */}
      <section
        className={`relative py-16 bg-gradient-to-br ${s.section} border-b ${s.border}`}
      >
        <div
          className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${s.orb} to-transparent rounded-full blur-3xl`}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold text-slate-950 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            {description}
          </p>
        </div>
      </section>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <ProductTable products={products || []} category={category} />
      </div>
    </div>
  );
}
