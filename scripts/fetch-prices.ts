// scripts/fetch-prices.ts
// Daily cron wrapper — delegates to lib/price-fetcher.ts
// Run with: `tsx scripts/fetch-prices.ts`
// Or trigger via the HTTP cron: GET /api/refresh-prices

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { runPriceFetch } from '../lib/price-fetcher';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

async function main() {
  console.log('[prices] starting daily fetch…');
  const result = await runPriceFetch(supabase);
  console.log(
    `[prices] done in ${result.elapsed_ms / 1000}s — updated ${result.updated}, skipped ${result.skipped}, errors ${result.errors}`,
  );
}

main().catch((e) => {
  console.error('[prices] fatal:', e);
  process.exit(1);
});
