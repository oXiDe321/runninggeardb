import ProductTable from '@/components/product-table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Running Nutrition — Gels, Chews, Drinks | RunningGearDB',
  description: 'Filterable database of running gels, chews, and drinks. Compare carbs, sodium, caffeine, and price.',
};

const mockGels = [
  {
    id: '1',
    brand: 'Maurten',
    product: 'Gel 100',
    carbs_per_serving_g: 25,
    caffeine_mg: 0,
    price_per_serving: 1.2,
    our_rating: 4.8,
    real_food: false,
  },
  {
    id: '2',
    brand: 'Precision Fuel',
    product: 'PF 30',
    carbs_per_serving_g: 30,
    caffeine_mg: 75,
    price_per_serving: 1.5,
    our_rating: 4.7,
    real_food: false,
  },
  {
    id: '3',
    brand: 'SiS',
    product: 'Go Isotonic Gel',
    carbs_per_serving_g: 22,
    caffeine_mg: 0,
    price_per_serving: 0.8,
    our_rating: 4.3,
    real_food: false,
  },
  {
    id: '4',
    brand: 'Spring Energy',
    product: 'Energy Bar',
    carbs_per_serving_g: 40,
    caffeine_mg: 0,
    price_per_serving: 2.0,
    our_rating: 4.5,
    real_food: true,
  },
  {
    id: '5',
    brand: 'GU Energy',
    product: 'Original Gel',
    carbs_per_serving_g: 21,
    caffeine_mg: 40,
    price_per_serving: 1.0,
    our_rating: 4.2,
    real_food: false,
  },
];

export default function GelsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950 mb-2">Running Nutrition</h1>
        <p className="text-lg text-slate-600">
          Gels, chews, drinks. Compare carbs, sodium, caffeine, and value.
        </p>
      </div>

      <ProductTable products={mockGels} category="gels" />
    </div>
  );
}
