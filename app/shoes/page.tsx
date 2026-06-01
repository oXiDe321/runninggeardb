import CategoryPage from '@/components/category-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Running Shoes Database — Compare Specs, Weight & Drop',
  description:
    'Filter and compare trail, road, Hyrox, and parkrun running shoes by drop, stack height, weight, and price. Built on real spec data.',
  openGraph: {
    type: 'website',
    url: 'https://runninggeardb.com/shoes',
    title: 'Running Shoes Database — Compare Specs, Weight & Drop',
    description: 'Filter and compare trail, road, Hyrox, and parkrun running shoes by drop, stack height, weight, and price. Built on real spec data.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Running Shoes Database — Compare Specs, Weight & Drop',
    description: 'Filter and compare trail, road, Hyrox, and parkrun running shoes by drop, stack height, weight, and price. Built on real spec data.',
  },
  alternates: { canonical: 'https://runninggeardb.com/shoes' },
};

export default function ShoesPage() {
  return (
    <CategoryPage
      title="Running Shoes"
      description="Trail, road, Hyrox, parkrun. Filter by discipline, drop, weight, and more to find your perfect shoe."
      category="shoes"
      table="shoes"
      slug="/shoes"
    />
  );
}
