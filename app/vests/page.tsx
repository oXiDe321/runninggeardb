import CategoryPage from '@/components/category-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trail Running Vests & Packs — Compare Capacity, Weight & Compliance',
  description:
    'Filter trail running vests and hydration packs by capacity, weight, UTMB compliance, and price. Spec data for every model.',
  openGraph: {
    type: 'website',
    url: 'https://runninggeardb.com/vests',
    title: 'Trail Running Vests & Packs — Compare Capacity, Weight & Compliance',
    description: 'Filter trail running vests and hydration packs by capacity, weight, UTMB compliance, and price. Spec data for every model.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trail Running Vests & Packs — Compare Capacity, Weight & Compliance',
    description: 'Filter trail running vests and hydration packs by capacity, weight, UTMB compliance, and price. Spec data for every model.',
  },
  alternates: { canonical: 'https://runninggeardb.com/vests' },
};

export default function VestsPage() {
  return (
    <CategoryPage
      title="Running Vests & Packs"
      description="UTMB compliant, ultra-rated. Filter by capacity, weight, compliance, and find your perfect pack."
      category="vests"
      table="vests"
      slug="/vests"
    />
  );
}
