import ProductTable from '@/components/product-table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Running Vests & Packs — RunningGearDB',
  description: 'Filterable database of trail running vests. UTMB compliant, ultra-rated, compare capacity, weight, pockets.',
};

const mockVests = [
  {
    id: '1',
    brand: 'Ultimate Direction',
    model: 'Adventure Vesta 6',
    capacity_l: 6,
    weight_g: 113,
    price_usd: 150,
    our_rating: 4.7,
    utmb_compliant: true,
    amazon_url: 'https://amazon.com',
  },
  {
    id: '2',
    brand: 'Salomon',
    model: 'ADV Skin 12',
    capacity_l: 12,
    weight_g: 220,
    price_usd: 140,
    our_rating: 4.6,
    utmb_compliant: true,
    amazon_url: 'https://amazon.com',
  },
  {
    id: '3',
    brand: 'Nathan',
    model: 'VaporAiress 7L',
    capacity_l: 7,
    weight_g: 130,
    price_usd: 130,
    our_rating: 4.4,
    utmb_compliant: true,
    amazon_url: 'https://amazon.com',
  },
  {
    id: '4',
    brand: 'Osprey',
    model: 'Dyna 6',
    capacity_l: 6,
    weight_g: 140,
    price_usd: 160,
    our_rating: 4.5,
    utmb_compliant: false,
    amazon_url: 'https://amazon.com',
  },
  {
    id: '5',
    brand: 'Black Diamond',
    model: 'Distance 15',
    capacity_l: 15,
    weight_g: 280,
    price_usd: 200,
    our_rating: 4.8,
    utmb_compliant: true,
    amazon_url: 'https://amazon.com',
  },
];

export default function VestsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950 mb-2">Running Vests & Packs</h1>
        <p className="text-lg text-slate-600">
          UTMB compliant, ultra-rated. Filter by capacity, weight, compliance.
        </p>
      </div>

      <ProductTable products={mockVests} category="vests" />
    </div>
  );
}
