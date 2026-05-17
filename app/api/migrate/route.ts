const migrationSQL = `
-- Create shoes table
create table if not exists shoes (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  slug text unique not null,
  discipline text check (discipline in ('trail','road','hyrox','track','parkrun')) default 'trail',
  drop_mm int,
  weight_g int,
  price_usd numeric,
  our_rating numeric(3,1),
  carbon_plate boolean default false,
  review_content text,
  review_generated_at timestamptz,
  published boolean default false,
  affiliate_url text,
  amazon_url text,
  created_at timestamptz default now()
);

-- Create vests table
create table if not exists vests (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  slug text unique not null,
  capacity_l numeric,
  weight_g int,
  utmb_compliant boolean default false,
  price_usd numeric,
  our_rating numeric(3,1),
  review_content text,
  review_generated_at timestamptz,
  published boolean default false,
  affiliate_url text,
  amazon_url text,
  created_at timestamptz default now()
);

-- Create gels table
create table if not exists gels (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  product text not null,
  slug text unique not null,
  carbs_per_serving_g int,
  caffeine_mg int,
  price_per_serving numeric,
  our_rating numeric(3,1),
  real_food boolean default false,
  review_content text,
  review_generated_at timestamptz,
  published boolean default false,
  affiliate_url text,
  amazon_url text,
  created_at timestamptz default now()
);

-- Create blog_posts table
create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  category text,
  published boolean default false,
  published_at timestamptz,
  generated_at timestamptz,
  created_at timestamptz default now()
);

-- Enable RLS
alter table shoes enable row level security;
alter table vests enable row level security;
alter table gels enable row level security;
alter table blog_posts enable row level security;

-- Public read policy for published content
create policy if not exists "Public read published shoes" on shoes for select using (published = true);
create policy if not exists "Public read published vests" on vests for select using (published = true);
create policy if not exists "Public read published gels" on gels for select using (published = true);
create policy if not exists "Public read published blog" on blog_posts for select using (published = true);

-- Service role full access
create policy if not exists "Service role shoes" on shoes using (auth.role() = 'service_role');
create policy if not exists "Service role vests" on vests using (auth.role() = 'service_role');
create policy if not exists "Service role gels" on gels using (auth.role() = 'service_role');
create policy if not exists "Service role blog" on blog_posts using (auth.role() = 'service_role');
`;

export async function GET() {
  return Response.json({
    instructions: 'Run the SQL below in your Supabase SQL Editor',
    sql: migrationSQL,
    dashboard_url: `https://supabase.com/dashboard/project/${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('.')[0]}/sql`
  });
}

export async function POST() {
  return Response.json({
    message: 'Copy the SQL from GET /api/migrate and run it in Supabase SQL Editor',
    instructions_url: '/api/migrate'
  });
}
