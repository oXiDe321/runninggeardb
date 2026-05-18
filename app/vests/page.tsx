import CategoryPage from '@/components/category-page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Running Vests & Packs — RunningGearDB',
  description:
    'Filterable database of trail running vests. UTMB compliant, ultra-rated, compare capacity, weight, pockets.',
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
