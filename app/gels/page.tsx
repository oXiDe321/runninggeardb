import CategoryPage from '@/components/category-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Running Gels & Nutrition — Compare Carbs, Caffeine & Price',
  description:
    'Filter running gels, chews, and drinks by carbs per serving, sodium, caffeine, and cost. Real-food options tagged.',
  openGraph: {
    type: 'website',
    url: 'https://runninggeardb.com/gels',
    title: 'Running Gels & Nutrition — Compare Carbs, Caffeine & Price',
    description: 'Filter running gels, chews, and drinks by carbs per serving, sodium, caffeine, and cost. Real-food options tagged.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Running Gels & Nutrition — Compare Carbs, Caffeine & Price',
    description: 'Filter running gels, chews, and drinks by carbs per serving, sodium, caffeine, and cost. Real-food options tagged.',
  },
  alternates: { canonical: 'https://runninggeardb.com/gels' },
};

export default function GelsPage() {
  return (
    <CategoryPage
      title="Running Nutrition"
      description="Gels, chews, drinks. Filter by carbs, sodium, caffeine, real food, and price."
      category="gels"
      table="gels"
      slug="/gels"
    />
  );
}
