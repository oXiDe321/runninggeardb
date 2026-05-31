import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

async function main() {
  const { data: vests } = await supabase.from('vests').select('slug, brand, model, image_url');
  const { data: gels } = await supabase.from('gels').select('slug, brand, product, image_url');
  const { data: shoes } = await supabase.from('shoes').select('slug, brand, model, image_url').is('image_url', null);

  console.log('\n=== VESTS broken/missing images ===');
  for (const v of vests ?? []) {
    const url = v.image_url ?? '';
    if (!url || (!url.includes('amazon') && url.includes('cdn'))) {
      console.log(`  "${v.slug}": ${v.brand} ${v.model}`);
      if (url) console.log(`    ${url.slice(0, 70)}`);
    }
  }

  console.log('\n=== GELS broken/missing images ===');
  for (const g of gels ?? []) {
    const url = g.image_url ?? '';
    if (!url || (!url.includes('amazon') && url.includes('cdn'))) {
      console.log(`  "${g.slug}": ${g.brand} ${g.product}`);
      if (url) console.log(`    ${url.slice(0, 70)}`);
    }
  }

  console.log('\n=== SHOES missing images ===');
  for (const s of shoes ?? []) console.log(`  "${s.slug}": ${s.brand} ${s.model}`);
}
main().catch(console.error);
