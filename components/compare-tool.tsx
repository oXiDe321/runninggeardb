'use client';

import { useState } from 'react';
import { X, Plus, ArrowLeftRight } from 'lucide-react';
import { affiliateUrl, amazonSearchUrl } from '@/lib/amazon';

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
  ],
  vests: [
    { label: 'Capacity', key: 'capacity_l', format: (v) => `${v}L` },
    { label: 'Weight', key: 'weight_g', format: (v) => `${v}g` },
    { label: 'UTMB Compliant', key: 'utmb_compliant', format: (v) => v ? 'Yes' : 'No' },
    { label: 'Price', key: 'price_usd', format: (v) => `$${v}` },
  ],
  gels: [
    { label: 'Format', key: 'format' },
    { label: 'Carbs', key: 'carbs_per_serving_g', format: (v) => `${v}g` },
    { label: 'Sodium', key: 'sodium_mg', format: (v) => v > 0 ? `${v}mg` : 'None' },
    { label: 'Caffeine', key: 'caffeine_mg', format: (v) => v > 0 ? `${v}mg` : 'None' },
    { label: 'Calories', key: 'calories', format: (v) => v ? `${v}` : '—' },
    { label: 'Real Food', key: 'real_food', format: (v) => v ? 'Yes' : 'No' },
    { label: 'Price/serving', key: 'price_per_serving', format: (v) => `$${v}` },
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
            className={`px-4 py-2 font-mono text-[11px] tracking-wider uppercase transition-all duration-150 border border-transparent ${
              category === cat
                ? 'bg-rust text-sand border-rust'
                : 'bg-paper text-ink-50 border-rule hover:border-carbon hover:text-carbon'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Product picker */}
        <div className="lg:col-span-1">
          <h3 className="text-[10px] font-semibold text-ink-30 font-mono uppercase tracking-[0.16em] mb-3">
            Select products ({selected.length}/4)
          </h3>
          <div className="space-y-px border border-rule rounded overflow-y-auto max-h-[500px]">
            {products.map((product) => {
              const isSelected = selected.some((p) => p.id === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => toggleProduct(product)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-sand border-l-2 border-rust'
                      : 'hover:bg-paper border-l-2 border-transparent'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-carbon">{product.brand}</p>
                    <p className="text-xs text-ink-30">{product.model || product.product}</p>
                  </div>
                  {isSelected ? (
                    <X className="w-4 h-4 text-rust" />
                  ) : (
                    <Plus className="w-4 h-4 text-ink-30" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comparison table */}
        <div className="lg:col-span-2">
          {selected.length < 2 ? (
            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-rule rounded-2xl text-center">
              <ArrowLeftRight className="w-10 h-10 text-ink-30 mb-3" />
              <p className="text-ink-50 text-lg font-medium">Select 2-4 products to compare</p>
              <p className="text-sm text-ink-30 mt-1">Pick from the list on the left</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded border border-rule">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-sand">
                    <th className="text-left py-3 px-4 font-semibold text-carbon sticky left-0 bg-sand z-10 font-mono text-[10px] uppercase tracking-[0.12em]">
                      Spec
                    </th>
                    {selected.map((product) => (
                      <th key={product.id} className="text-center py-3 px-4 font-semibold text-carbon min-w-[140px]">
                        <div>
                          <p className="text-[10px] text-ink-30 font-normal font-mono">{product.brand}</p>
                          <p className="font-mono text-[11px]">{product.model || product.product}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {specs.map((spec, i) => (
                    <tr key={spec.key} className={i % 2 === 0 ? 'bg-paper dark:bg-carbon' : 'bg-sand dark:bg-carbon-80'}>
                      <td className="py-3 px-4 font-mono text-[11px] text-ink-70 sticky left-0 bg-inherit">
                        {spec.label}
                      </td>
                      {selected.map((product) => {
                        const val = product[spec.key];
                        const display = val != null ? (spec.format ? spec.format(val) : String(val)) : '—';
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
                            className={`text-center py-3 px-4 font-mono text-[12px] ${
                              isBest
                                ? 'text-rust font-semibold'
                                : 'text-ink-50'
                            }`}
                          >
                            {display}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {/* Buy row */}
                  <tr className="border-t-2 border-rule bg-sand">
                    <td className="py-3 px-4 font-semibold text-carbon sticky left-0 bg-sand font-mono text-[10px] uppercase tracking-[0.12em]">
                      Buy
                    </td>
                    {selected.map((product) => (
                      <td key={product.id} className="text-center py-3 px-4">
                        {(() => {
                          const url = product.amazon_url && product.amazon_url !== 'https://amazon.com'
                            ? affiliateUrl(product.amazon_url)
                            : amazonSearchUrl(product.brand, (product.model || product.product || ''));
                          return (
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-4 py-1.5 bg-rust text-sand font-mono text-[11px] font-semibold hover:bg-rust-deep transition-colors"
                            >
                              View on Amazon
                            </a>
                          );
                        })()}
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
