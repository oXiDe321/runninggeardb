import { Metadata } from 'next';
import CategoryHeader from '@/components/category-header';
import PriceTable from './price-table';
import { getAllProductPrices } from '@/lib/price-data';

export const metadata: Metadata = {
  title: 'Price Tracker — RunningGearDB',
  description: 'Track prices across all running gear. See discounts, 90-day lows, and price history.',
};

export default async function PricesPage() {
  const allPrices = await getAllProductPrices();

  const withPrices = allPrices.filter((p) => p.current_price != null);
  const avgDiscount = withPrices.length > 0
    ? Math.round(withPrices.reduce((s, p) => s + (p.discount_pct ?? 0), 0) / withPrices.length)
    : 0;

  return (
    <div className="bg-sand text-carbon">
      <CategoryHeader
        slug="/prices"
        title="prices"
        total={withPrices.length}
        description="Current prices, discounts, and 90-day trends across all tracked retailers."
        metadata={[
          { k: 'tracked', v: `${withPrices.length} products`, good: true },
          { k: 'avg discount', v: `${avgDiscount}% off MSRP` },
          { k: 'retailers', v: 'amazon · rei · running-warehouse' },
          { k: 'updated', v: 'every 6 hours' },
        ]}
      />
      <section className="mx-auto max-w-7xl px-8 py-8">
        <PriceTable products={allPrices} />
      </section>
    </div>
  );
}
