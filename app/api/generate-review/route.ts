import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateReview } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
  try {
    const { table, productId } = await request.json();

    if (!table || !productId) {
      return NextResponse.json({ error: 'Missing table or productId' }, { status: 400 });
    }

    const { data: product, error: fetchError } = await supabaseAdmin
      .from(table)
      .select('*')
      .eq('id', productId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const { data: alternatives } = await supabaseAdmin
      .from(table)
      .select('*')
      .eq('published', true)
      .limit(3);

    const reviewContent = await generateReview(table as any, product, alternatives || []);

    const { error: updateError } = await supabaseAdmin
      .from(table)
      .update({
        review_content: reviewContent,
        review_generated_at: new Date().toISOString(),
        published: true,
      })
      .eq('id', productId);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, reviewContent });
  } catch (error: any) {
    console.error('Review generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
