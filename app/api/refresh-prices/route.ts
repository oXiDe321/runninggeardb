import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { supabaseAdmin } from '@/lib/supabase';
import { runPriceFetch } from '@/lib/price-fetcher';

// Allow up to 5 minutes — fetching every retailer row takes time
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  // Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`.
  // When CRON_SECRET is set, reject any caller that doesn't know it.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    const result = await runPriceFetch(supabaseAdmin);

    // Invalidate all statically-rendered review/vest/gel pages so fresh prices
    // are served on the next request after the cron completes.
    revalidatePath('/reviews', 'layout');
    revalidatePath('/vests', 'layout');
    revalidatePath('/gels', 'layout');

    console.log(`[refresh-prices] updated=${result.updated} skipped=${result.skipped} errors=${result.errors} ms=${result.elapsed_ms}`);

    return NextResponse.json({ success: true, ...result });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[refresh-prices]', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
