import ProductTable from '@/components/product-table';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Running Shoes — RunningGearDB',
  description: 'Filterable database of trail, road, and Hyrox running shoes. Compare specs, weights, drops, and prices.',
};

const mockShoes = [
  {
    id: '1',
    brand: 'HOKA',
    model: 'Speedgoat 6',
    discipline: 'trail',
    drop_mm: 7,
    weight_g: 228,
    price_usd: 145,
    our_rating: 4.8,
    carbon_plate: false,
    amazon_url: 'https://amazon.com',
  },
  {
    id: '2',
    brand: 'Salomon',
    model: 'Sense Ride 5',
    discipline: 'trail',
    drop_mm: 8,
    weight_g: 240,
    price_usd: 130,
    our_rating: 4.6,
    carbon_plate: false,
    amazon_url: 'https://amazon.com',
  },
  {
    id: '3',
    brand: 'Brooks',
    model: 'Cascadia 17',
    discipline: 'trail',
    drop_mm: 10,
    weight_g: 248,
    price_usd: 140,
    our_rating: 4.5,
    carbon_plate: false,
    amazon_url: 'https://amazon.com',
  },
  {
    id: '4',
    brand: 'On',
    model: 'Cloudmonster',
    discipline: 'road',
    drop_mm: 10.5,
    weight_g: 264,
    price_usd: 160,
    our_rating: 4.7,
    carbon_plate: true,
    amazon_url: 'https://amazon.com',
  },
  {
    id: '5',
    brand: 'Nike',
    model: 'Pegasus Trail 5',
    discipline: 'trail',
    drop_mm: 10,
    weight_g: 244,
    price_usd: 120,
    our_rating: 4.4,
    carbon_plate: false,
    amazon_url: 'https://amazon.com',
  },
];

export default function ShoesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-950 mb-2">Running Shoes</h1>
        <p className="text-lg text-slate-600">
          Trail, road, Hyrox, parkrun. Filter by specs and find your perfect shoe.
        </p>
      </div>

      <ProductTable products={mockShoes} category="shoes" />
    </div>
  );
}
