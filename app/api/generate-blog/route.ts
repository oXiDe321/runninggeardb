import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateBlogPost } from '@/lib/deepseek';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function POST(request: NextRequest) {
  try {
    const { title, keywords, category, excerpt } = await request.json();

    if (!title || !keywords || !category) {
      return NextResponse.json(
        { error: 'Missing title, keywords, or category' },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const content = await generateBlogPost(title, keywords, category);

    const { data, error } = await supabaseAdmin.from('blog_posts').insert({
      title,
      slug,
      excerpt: excerpt || content.substring(0, 160),
      content,
      category,
      keywords,
      published: true,
      published_at: new Date().toISOString(),
      generated_at: new Date().toISOString(),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, slug, content });
  } catch (error: any) {
    console.error('Blog generation error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
