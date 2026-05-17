import CategoryPage from '@/components/category-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Running Shoes — RunningGearDB',
  description:
    'Filterable database of trail, road, and Hyrox running shoes. Compare specs, weights, drops, and prices.',
};

export default function ShoesPage() {
  return (
    <CategoryPage
      title="Running Shoes"
      description="Trail, road, Hyrox, parkrun. Filter by discipline, drop, weight, and more to find your perfect shoe."
      category="shoes"
      accent="orange"
      table="shoes"
    />
  );
}
