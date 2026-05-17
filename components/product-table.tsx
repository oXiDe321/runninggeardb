'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ProductTableProps {
  products: any[];
  category: 'shoes' | 'vests' | 'gels';
  onFilter?: (filtered: any[]) => void;
}

export default function ProductTable({ products, category, onFilter }: ProductTableProps) {
  const [filters, setFilters] = useState<Record<string, any>>({});

  const filtered = useMemo(() => {
    let result = products;

    if (category === 'shoes') {
      if (filters.discipline) {
        result = result.filter((p) => p.discipline === filters.discipline);
      }
      if (filters.carbon) {
        result = result.filter((p) => p.carbon_plate);
      }
      if (filters.maxPrice) {
        result = result.filter((p) => !p.price_usd || p.price_usd <= filters.maxPrice);
      }
    } else if (category === 'vests') {
      if (filters.utmb) {
        result = result.filter((p) => p.utmb_compliant);
      }
      if (filters.maxCapacity) {
        result = result.filter((p) => !p.capacity_l || p.capacity_l <= filters.maxCapacity);
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

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {category === 'shoes' && (
          <>
            <select
              value={filters.discipline || ''}
              onChange={(e) => updateFilter('discipline', e.target.value || undefined)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="">All Disciplines</option>
              <option value="trail">Trail</option>
              <option value="road">Road</option>
              <option value="hyrox">Hyrox</option>
              <option value="parkrun">Parkrun</option>
            </select>
            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={filters.carbon || false}
                onChange={(e) => updateFilter('carbon', e.target.checked || undefined)}
              />
              Carbon Plate
            </label>
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice || ''}
              onChange={(e) => updateFilter('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-32"
            />
          </>
        )}
        {category === 'vests' && (
          <>
            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={filters.utmb || false}
                onChange={(e) => updateFilter('utmb', e.target.checked || undefined)}
              />
              UTMB Compliant
            </label>
            <input
              type="number"
              placeholder="Max Capacity (L)"
              value={filters.maxCapacity || ''}
              onChange={(e) => updateFilter('maxCapacity', e.target.value ? parseInt(e.target.value) : undefined)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm w-40"
            />
          </>
        )}
        {category === 'gels' && (
          <>
            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={filters.caffeine || false}
                onChange={(e) => updateFilter('caffeine', e.target.checked || undefined)}
              />
              Has Caffeine
            </label>
            <label className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={filters.realFood || false}
                onChange={(e) => updateFilter('realFood', e.target.checked || undefined)}
              />
              Real Food
            </label>
          </>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-3 px-4 font-semibold text-slate-950">Brand</th>
              <th className="text-left py-3 px-4 font-semibold text-slate-950">Model</th>
              {category === 'shoes' && (
                <>
                  <th className="text-right py-3 px-4 font-semibold text-slate-950 font-mono">Drop</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-950 font-mono">Weight</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-950 font-mono">Price</th>
                </>
              )}
              {category === 'vests' && (
                <>
                  <th className="text-right py-3 px-4 font-semibold text-slate-950 font-mono">Capacity</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-950 font-mono">Price</th>
                </>
              )}
              {category === 'gels' && (
                <>
                  <th className="text-right py-3 px-4 font-semibold text-slate-950 font-mono">Carbs</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-950 font-mono">Price</th>
                </>
              )}
              <th className="text-center py-3 px-4 font-semibold text-slate-950">Rating</th>
              <th className="text-center py-3 px-4 font-semibold text-slate-950">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-600">
                  No products found. Try adjusting filters.
                </td>
              </tr>
            ) : (
              filtered.map((product, idx) => (
                <tr key={product.id || idx} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="py-3 px-4 font-medium text-slate-950">{product.brand}</td>
                  <td className="py-3 px-4 text-slate-600">{product.model}</td>
                  {category === 'shoes' && (
                    <>
                      <td className="text-right py-3 px-4 font-mono text-slate-600">{product.drop_mm}mm</td>
                      <td className="text-right py-3 px-4 font-mono text-slate-600">{product.weight_g}g</td>
                      <td className="text-right py-3 px-4 font-mono text-slate-600">${product.price_usd}</td>
                    </>
                  )}
                  {category === 'vests' && (
                    <>
                      <td className="text-right py-3 px-4 font-mono text-slate-600">{product.capacity_l}L</td>
                      <td className="text-right py-3 px-4 font-mono text-slate-600">${product.price_usd}</td>
                    </>
                  )}
                  {category === 'gels' && (
                    <>
                      <td className="text-right py-3 px-4 font-mono text-slate-600">{product.carbs_per_serving_g}g</td>
                      <td className="text-right py-3 px-4 font-mono text-slate-600">${product.price_per_serving}</td>
                    </>
                  )}
                  <td className="text-center py-3 px-4">
                    {product.our_rating ? (
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm font-semibold">
                        {product.our_rating}/5
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {product.amazon_url ? (
                      <a
                        href={product.amazon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-3 py-1 bg-orange-600 text-white text-sm rounded-full hover:bg-orange-700 transition"
                      >
                        Buy
                      </a>
                    ) : (
                      <span className="text-slate-400 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-slate-500">Showing {filtered.length} of {products.length} products</p>
    </div>
  );
}
