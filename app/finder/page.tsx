// app/finder/page.tsx
// Server component — pre-fetches the shoe pool so the initial render
// shows accurate counts. The client component can still re-fetch later.

import type { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import FinderQuiz from '@/components/finder-quiz';

export const metadata: Metadata = {
  title: 'Shoe Finder — RunningGearDB',
  description: 'Find your running shoe in five questions. Trail, road, Hyrox. No email, no upsells.',
};

export const revalidate = 300;

interface InitialShoe {
  id: string;
  slug: string;
  brand: string;
  model: string;
  image_url: string | null;
  our_rating: number | null;
  weight_g: number | null;
  drop_mm: number | null;
  stack_heel_mm: number | null;
  price_usd: number | null;
  discipline: string;
  carbon_plate: boolean;
}

export default async function FinderPage() {
  const { data } = await supabase
    .from('shoes')
    .select(
      'id, slug, brand, model, image_url, our_rating, weight_g, drop_mm, stack_heel_mm, price_usd, discipline, carbon_plate'
    )
    .eq('published', true)
    .order('our_rating', { ascending: false });

  return <FinderQuiz initialShoes={(data ?? []) as InitialShoe[]} />;
}
