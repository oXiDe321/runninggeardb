import { supabaseAdmin } from '@/lib/supabase';
import { SHOES, VESTS, GELS } from '@/lib/seed-products';
import { AMAZON_ENRICHMENT } from '@/lib/amazon-enrichment';

function amz(asin: string) { return `https://www.amazon.com.au/dp/${asin}?tag=trailgear-22`; }
function img(id: string) { return `https://m.media-amazon.com/images/I/${id}._AC_SL1500_.jpg`; }

function enrich(products: any[], table: string) {
  return products.map((p) => {
    const k = AMAZON_ENRICHMENT[p.slug];
    if (k) return { ...p, image_url: img(k.image_id), amazon_url: amz(k.asin) };
    return p;
  });
}

export async function POST() {
  try {
    // Clear existing data
    await supabaseAdmin.from('shoes').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('vests').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabaseAdmin.from('gels').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    const shoes = enrich(SHOES, 'shoes');
    const vests = enrich(VESTS, 'vests');
    const gels = enrich(GELS, 'gels');

    const [shoesResult, vestsResult, gelsResult] = await Promise.all([
      supabaseAdmin.from('shoes').insert(shoes),
      supabaseAdmin.from('vests').insert(vests),
      supabaseAdmin.from('gels').insert(gels),
    ]);

    if (shoesResult.error) throw shoesResult.error;
    if (vestsResult.error) throw vestsResult.error;
    if (gelsResult.error) throw gelsResult.error;

    const withImages = shoes.filter(p => p.image_url).length + vests.filter(p => p.image_url).length + gels.filter(p => p.image_url).length;

    return Response.json({
      success: true,
      message: `Seeded ${shoes.length} shoes, ${vests.length} vests, ${gels.length} gels (${withImages} with images)`,
      inserted: { shoes: shoes.length, vests: vests.length, gels: gels.length },
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
