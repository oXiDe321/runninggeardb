'use client';

import { useState, useMemo } from 'react';
import { X, Plus, ArrowLeftRight } from 'lucide-react';

interface Product {
  id: string;
  brand: string;
  model?: string;
  product?: string;
  slug: string;
  [key: string]: any;
}

interface CompareToolProps {
  initialProducts: Record<string, Product[]>;
}

type Category = 'shoes' | 'vests' | 'gels';

const categoryLabels: Record<Category, string> = { shoes: 'Shoes', vests: 'Vests & Packs', gels: 'Nutrition' };

const specsForCategory: Record<Category, { label: string; key: string; format?: (v: any) => string }[]> = {
  shoes: [
    { label: 'Discipline', key: 'discipline' },
    { label: 'Drop', key: 'drop_mm', format: (v) => `${v}mm` },
    { label: 'Weight', key: 'weight_g', format: (v) => `${v}g` },
    { label: 'Carbon Plate', key: 'carbon_plate', format: (v) => v ? 'Yes' : 'No' },
    { label: 'Price', key: 'price_usd', format: (v) => `$${v}` },
    { label: 'Rating', key: 'our_rating', format: (v) => `${v}/5` },
  ],
  vests: [
    { label: 'Capacity', key: 'capacity_l', format: (v) => `${v}L` },
    { label: 'Weight', key: 'weight_g', format: (v) => `${v}g` },
    { label: 'UTMB Compliant', key: 'utmb_compliant', format: (v) => v ? 'Yes' : 'No' },
    { label: 'Price', key: 'price_usd', format: (v) => `$${v}` },
    { label: 'Rating', key: 'our_rating', format: (v) => `${v}/5` },
  ],
  gels: [
    { label: 'Format', key: 'format' },
    { label: 'Carbs', key: 'carbs_per_serving_g', format: (v) => `${v}g` },
    { label: 'Caffeine', key: 'caffeine_mg', format: (v) => v > 0 ? `${v}mg` : 'None' },
    { label: 'Real Food', key: 'real_food', format: (v) => v ? 'Yes' : 'No' },
    { label: 'Price/serving', key: 'price_per_serving', format: (v) => `$${v}` },
    { label: 'Rating', key: 'our_rating', format: (v) => `${v}/5` },
  ],
};

export default function CompareTool({ initialProducts }: CompareToolProps) {
  const [category, setCategory] = useState<Category>('shoes');
  const [selected, setSelected] = useState<Product[]>([]);

  const products = initialProducts[category] || [];

  const toggleProduct = (product: Product) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 4) return prev;
      return [...prev, product];
    });
  };

  const specs = specsForCategory[category];

  return (
    <div className="space-y-8">
      {/* Category selector */}
      <div className="flex flex-wrap gap-2">
        {(Object.keys(categoryLabels) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setSelected([]); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 ${
              category === cat
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product picker */}
        <div className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-slate-950 dark:text-white uppercase tracking-wider mb-3">
            Select products ({selected.length}/4)
          </h3>
          <div className="space-y-1 max-h-[500px] overflow-y-auto rounded-xl border border-slate-200 dark:border-white/10">
            {products.map((product) => {
              const isSelected = selected.some((p) => p.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-brand-50 dark:bg-brand-950/30 border-l-2 border-brand-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border-l-2 border-transparent'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-slate-950 dark:text-white">{product.brand}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{product.model || product.product}</p>
                  </div>
                  {isSelected ? (
                    <X className="w-4 h-4 text-brand-500" />
                  ) : (
                    <Plus className="w-4 h-4 text-slate-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison table */}
        <div className="lg:col-span-2">
          {selected.length < 2 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-center">
              <ArrowLeftRight className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Select 2-4 products to compare</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Pick from the list on the left</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left py-3 px-4 font-semibold text-slate-950 dark:text-white sticky left-0 bg-slate-50 dark:bg-slate-800/50 z-10">
                      Spec
                    </th>
                    {selected.map((product) => (
                      <th key={product.id} className="text-center py-3 px-4 font-semibold text-slate-950 dark:text-white min-w-[140px]">
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">{product.brand}</p>
                          <p>{product.model || product.product}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={spec.key} className={i % 2 === 0 ? 'bg-white dark:bg-slate-950' : 'bg-slate-50/50 dark:bg-slate-900/50'}>
                      <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300 sticky left-0 bg-inherit">
                        {spec.label}
                      </td>
                      {selected.map((product) => {
                        const val = product[spec.key];
                        const display = val != null ? (spec.format ? spec.format(val) : String(val)) : '—';
                        // Highlight best-in-row for numeric specs
                        const numericVal = typeof val === 'number' ? val : null;
                        const isBest = numericVal !== null && spec.key !== 'price_usd'
                          ? selected.every((p) => {
                              const pv = Number(p[spec.key]);
                              return isNaN(pv) || numericVal >= pv;
                            })
                          : numericVal !== null && spec.key === 'price_usd'
                            ? selected.every((p) => {
                                const pv = Number(p[spec.key]);
                                return isNaN(pv) || numericVal <= pv;
                              })
                            : false;

                        return (
                          <td
                            key={product.id}
                            className={`text-center py-3 px-4 font-mono ${
                              isBest
                                ? 'text-brand-600 dark:text-brand-400 font-semibold'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {display}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Buy row */}
                  <tr className="border-t-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50">
                    <td className="py-3 px-4 font-semibold text-slate-950 dark:text-white sticky left-0 bg-slate-50 dark:bg-slate-800/50">
                      Buy
                    </td>
                    {selected.map((product) => (
                      <td key={product.id} className="text-center py-3 px-4">
                        {product.amazon_url && product.amazon_url !== 'https://amazon.com' ? (
                          <a
                            href={product.amazon_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:bg-brand-700 dark:hover:bg-brand-500 transition-colors"
                          >
                            View on Amazon
                          </a>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
