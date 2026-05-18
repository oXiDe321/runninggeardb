// scripts/audit-images.ts
// Checks every product image URL is accessible, reports broken links.
// Usage: npx tsx scripts/audit-images.ts

import { supabaseAdmin } from '../lib/supabase';

interface Product {
  id: string; brand: string; model?: string; product?: string;
  slug: string; image_url?: string | null; amazon_url?: string | null;
}

async function checkUrl(url: string): Promise<number> {
  try {
    const resp = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
    return resp.status;
  } catch {
    return -1;
  }
}

async function main() {
  const results: { table: string; slug: string; name: string; url: string; status: string }[] = [];

  for (const table of ['shoes', 'vests', 'gels'] as const) {
    const select = table === 'gels' ? 'brand, product, slug, image_url, amazon_url' : 'brand, model, slug, image_url, amazon_url';
    const { data } = await supabaseAdmin.from(table).select(select);
    const items: Product[] = (data || []) as any;

    for (const item of items) {
      const name = [item.brand, item.model || item.product || (item as any).product].filter(Boolean).join(' ');
      const url = item.image_url;

      if (!url) {
        results.push({ table, slug: item.slug, name, url: '-', status: 'MISSING' });
        continue;
      }

      const status = await checkUrl(url);
      const label = status === 200 ? 'OK' : status === -1 ? 'ERROR' : `${status}`;
      results.push({ table, slug: item.slug, name, url, status: label });
    }
  }

  // Summary
  const ok = results.filter(r => r.status === 'OK');
  const missing = results.filter(r => r.status === 'MISSING');
  const broken = results.filter(r => r.status !== 'OK' && r.status !== 'MISSING');

  console.log(`\n=== IMAGE AUDIT: ${results.length} products ===`);
  console.log(`  OK:      ${ok.length}`);
  console.log(`  Missing: ${missing.length}`);
  console.log(`  Broken:  ${broken.length}\n`);

  if (broken.length) {
    console.log('=== BROKEN IMAGES ===');
    for (const r of broken) {
      console.log(`  ${r.status} | ${r.table} | ${r.name}`);
      console.log(`    ${r.url}\n`);
    }
  }

  if (missing.length) {
    console.log('=== MISSING IMAGES ===');
    for (const r of missing) {
      console.log(`  ${r.table} | ${r.name} (${r.slug})`);
    }
  }
}

main().catch(console.error);
