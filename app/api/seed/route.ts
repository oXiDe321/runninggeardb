import { supabaseAdmin } from '@/lib/supabase';

export async function POST() {
  try {
    // Clear existing data
    await supabaseAdmin.from('shoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('vests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('gels').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    // Seed shoes
    const shoes = [
      { brand: 'HOKA', model: 'Speedgoat 6', slug: 'hoka-speedgoat-6', discipline: 'trail', drop_mm: 7, weight_g: 228, price_usd: 145, our_rating: 4.8, carbon_plate: false, amazon_url: 'https://amazon.com', published: true },
      { brand: 'Salomon', model: 'Sense Ride 5', slug: 'salomon-sense-ride-5', discipline: 'trail', drop_mm: 8, weight_g: 240, price_usd: 130, our_rating: 4.6, carbon_plate: false, amazon_url: 'https://amazon.com', published: true },
      { brand: 'Brooks', model: 'Cascadia 17', slug: 'brooks-cascadia-17', discipline: 'trail', drop_mm: 10, weight_g: 248, price_usd: 140, our_rating: 4.5, carbon_plate: false, amazon_url: 'https://amazon.com', published: true },
      { brand: 'On', model: 'Cloudmonster', slug: 'on-cloudmonster', discipline: 'road', drop_mm: 11, weight_g: 264, price_usd: 160, our_rating: 4.7, carbon_plate: true, amazon_url: 'https://amazon.com', published: true },
      { brand: 'Nike', model: 'Pegasus Trail 5', slug: 'nike-pegasus-trail-5', discipline: 'trail', drop_mm: 10, weight_g: 244, price_usd: 120, our_rating: 4.4, carbon_plate: false, amazon_url: 'https://amazon.com', published: true },
    ];

    // Seed vests
    const vests = [
      { brand: 'Ultimate Direction', model: 'Adventure Vesta 6', slug: 'ud-adventure-vesta-6', capacity_l: 6, weight_g: 113, price_usd: 150, our_rating: 4.7, utmb_compliant: true, amazon_url: 'https://amazon.com', published: true },
      { brand: 'Salomon', model: 'ADV Skin 12', slug: 'salomon-adv-skin-12', capacity_l: 12, weight_g: 220, price_usd: 140, our_rating: 4.6, utmb_compliant: true, amazon_url: 'https://amazon.com', published: true },
      { brand: 'Nathan', model: 'VaporAiress 7L', slug: 'nathan-vaporairess-7l', capacity_l: 7, weight_g: 130, price_usd: 130, our_rating: 4.4, utmb_compliant: true, amazon_url: 'https://amazon.com', published: true },
      { brand: 'Osprey', model: 'Dyna 6', slug: 'osprey-dyna-6', capacity_l: 6, weight_g: 140, price_usd: 160, our_rating: 4.5, utmb_compliant: false, amazon_url: 'https://amazon.com', published: true },
      { brand: 'Black Diamond', model: 'Distance 15', slug: 'bd-distance-15', capacity_l: 15, weight_g: 280, price_usd: 200, our_rating: 4.8, utmb_compliant: true, amazon_url: 'https://amazon.com', published: true },
    ];

    // Seed gels
    const gels = [
      { brand: 'Maurten', product: 'Gel 100', slug: 'maurten-gel-100', carbs_per_serving_g: 25, caffeine_mg: 0, price_per_serving: 1.2, our_rating: 4.8, real_food: false, amazon_url: 'https://amazon.com', published: true },
      { brand: 'Precision Fuel', product: 'PF 30', slug: 'precision-fuel-pf30', carbs_per_serving_g: 30, caffeine_mg: 75, price_per_serving: 1.5, our_rating: 4.7, real_food: false, amazon_url: 'https://amazon.com', published: true },
      { brand: 'SiS', product: 'Go Isotonic Gel', slug: 'sis-go-isotonic', carbs_per_serving_g: 22, caffeine_mg: 0, price_per_serving: 0.8, our_rating: 4.3, real_food: false, amazon_url: 'https://amazon.com', published: true },
      { brand: 'Spring Energy', product: 'Energy Bar', slug: 'spring-energy-bar', carbs_per_serving_g: 40, caffeine_mg: 0, price_per_serving: 2.0, our_rating: 4.5, real_food: true, amazon_url: 'https://amazon.com', published: true },
      { brand: 'GU Energy', product: 'Original Gel', slug: 'gu-original-gel', carbs_per_serving_g: 21, caffeine_mg: 40, price_per_serving: 1.0, our_rating: 4.2, real_food: false, amazon_url: 'https://amazon.com', published: true },
    ];

    // Insert data
    const [shoesResult, vestsResult, gelsResult] = await Promise.all([
      supabaseAdmin.from('shoes').insert(shoes),
      supabaseAdmin.from('vests').insert(vests),
      supabaseAdmin.from('gels').insert(gels),
    ]);

    if (shoesResult.error) throw shoesResult.error;
    if (vestsResult.error) throw vestsResult.error;
    if (gelsResult.error) throw gelsResult.error;

    return Response.json({
      success: true,
      message: 'Database seeded successfully',
      inserted: {
        shoes: shoes.length,
        vests: vests.length,
        gels: gels.length,
      }
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
