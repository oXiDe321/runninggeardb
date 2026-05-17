import CategoryPage from '@/components/category-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Running Nutrition — Gels, Chews, Drinks | RunningGearDB',
  description:
    'Filterable database of running gels, chews, and drinks. Compare carbs, sodium, caffeine, and price.',
};

export default function GelsPage() {
  return (
    <CategoryPage
      title="Running Nutrition"
      description="Gels, chews, drinks. Filter by carbs, sodium, caffeine, real food, and price."
      category="gels"
      accent="emerald"
      table="gels"
    />
  );
}
