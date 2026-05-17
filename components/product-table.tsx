'use client';

import { useState, useMemo } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import ProductCard from './product-card';

interface ProductTableProps {
  products: any[];
  category: 'shoes' | 'vests' | 'gels';
  onFilter?: (filtered: any[]) => void;
}

const disciplineOptions = ['trail', 'road', 'hyrox', 'parkrun'];

export default function ProductTable({ products, category, onFilter }: ProductTableProps) {
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [view, setView] = useState<'grid' | 'table'>('grid');

  const filtered = useMemo(() => {
    let result = products;

    if (category === 'shoes') {
      if (filters.discipline) {
        result = result.filter((p) => p.discipline === filters.discipline);
      }
      if (filters.carbon) {
        result = result.filter((p) => p.carbon_plate);
      }
    } else if (category === 'vests') {
      if (filters.utmb) {
        result = result.filter((p) => p.utmb_compliant);
      }
    } else if (category === 'gels') {
      if (filters.caffeine) {
        result = result.filter((p) => p.caffeine_mg && p.caffeine_mg > 0);
      }
      if (filters.realFood) {
        result = result.filter((p) => p.real_food);
      }
    }

    onFilter?.(result);
    return result;
  }, [products, filters, category, onFilter]);

  const toggleFilter = (key: string, value?: any) => {
    setFilters((prev) => {
      if (prev[key] === value) return { ...prev, [key]: undefined };
      return { ...prev, [key]: value };
    });
  };

  return (
    <div className="space-y-6">
      {/* Filter bar + view toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex flex-wrap gap-2 flex-1">
          {category === 'shoes' && (
            <>
              {disciplineOptions.map((d) => (
                <button
                  key={d}
                  onClick={() => toggleFilter('discipline', d)}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-150 ${
                    filters.discipline === d
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {d}
                </button>
              ))}
              <button
                onClick={() => toggleFilter('carbon', true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  filters.carbon
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Carbon Plate
              </button>
            </>
          )}
          {category === 'vests' && (
            <button
              onClick={() => toggleFilter('utmb', true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                filters.utmb
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              UTMB Compliant
            </button>
          )}
          {category === 'gels' && (
            <>
              <button
                onClick={() => toggleFilter('caffeine', true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  filters.caffeine
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Has Caffeine
              </button>
              <button
                onClick={() => toggleFilter('realFood', true)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
                  filters.realFood
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Real Food
              </button>
            </>
          )}
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setView('grid')}
            className={`p-2 rounded-md transition ${
              view === 'grid'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded-md transition ${
              view === 'table'
                ? 'bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            aria-label="Table view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl">
          <p className="text-slate-500 dark:text-slate-400 text-lg">No products found.</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Try adjusting filters.</p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product, idx) => (
            <ProductCard
              key={product.id || idx}
              product={product}
              category={category}
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                <th className="text-left py-3 px-4 font-semibold text-slate-950 dark:text-white">Brand</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-950 dark:text-white">Model</th>
                {category === 'shoes' && (
                  <>
                    <th className="text-right py-3 px-4 font-semibold text-slate-950 dark:text-white font-mono">Drop</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-950 dark:text-white font-mono">Weight</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-950 dark:text-white font-mono">Price</th>
                  </>
                )}
                {category === 'vests' && (
                  <>
                    <th className="text-right py-3 px-4 font-semibold text-slate-950 dark:text-white font-mono">Capacity</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-950 dark:text-white font-mono">Price</th>
                  </>
                )}
                {category === 'gels' && (
                  <>
                    <th className="text-right py-3 px-4 font-semibold text-slate-950 dark:text-white font-mono">Carbs</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-950 dark:text-white font-mono">Price</th>
                  </>
                )}
                <th className="text-center py-3 px-4 font-semibold text-slate-950 dark:text-white">Rating</th>
                <th className="text-center py-3 px-4 font-semibold text-slate-950 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product, idx) => (
                <tr
                  key={product.id || idx}
                  className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="py-3 px-4 font-medium text-slate-950 dark:text-white">{product.brand}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{product.model || product.product}</td>
                  {category === 'shoes' && (
                    <>
                      <td className="text-right py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{product.drop_mm}mm</td>
                      <td className="text-right py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{product.weight_g}g</td>
                      <td className="text-right py-3 px-4 font-mono text-slate-600 dark:text-slate-400">${product.price_usd}</td>
                    </>
                  )}
                  {category === 'vests' && (
                    <>
                      <td className="text-right py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{product.capacity_l}L</td>
                      <td className="text-right py-3 px-4 font-mono text-slate-600 dark:text-slate-400">${product.price_usd}</td>
                    </>
                  )}
                  {category === 'gels' && (
                    <>
                      <td className="text-right py-3 px-4 font-mono text-slate-600 dark:text-slate-400">{product.carbs_per_serving_g}g</td>
                      <td className="text-right py-3 px-4 font-mono text-slate-600 dark:text-slate-400">${product.price_per_serving}</td>
                    </>
                  )}
                  <td className="text-center py-3 px-4">
                    {product.our_rating ? (
                      <span className="inline-block px-2 py-1 bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 rounded text-sm font-semibold">
                        {product.our_rating}/5
                      </span>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600">—</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {product.amazon_url ? (
                      <a
                        href={product.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full hover:bg-brand-700 dark:hover:bg-brand-500 transition"
                      >
                        Buy
                      </a>
                    ) : (
                      <span className="text-slate-400 dark:text-slate-600 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        Showing {filtered.length} of {products.length} products
      </p>
    </div>
  );
}
