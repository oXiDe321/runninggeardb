# RunningGearDB Deployment Guide

## Phase 1f: Database Schema & Seeding

### 1. Create Database Schema

Run the SQL in `migrations/001_init_schema.sql` in your Supabase dashboard:
- Go to **Supabase Dashboard → SQL Editor**
- Copy the entire migration SQL
- Execute it

This creates 4 tables: `shoes`, `vests`, `gels`, `blog_posts` with proper indexes and RLS policies.

### 2. Seed Initial Data

You have two options:

#### Option A: Use Supabase Dashboard (Manual)
1. Go to **Table Editor**
2. Open `shoes` table
3. Click **Insert** and add 10 products
4. Repeat for `vests` (8 products) and `gels` (10 products)

#### Option B: Use SQL (Bulk Insert)
Run this in SQL Editor:

```sql
INSERT INTO shoes (brand, model, slug, discipline, drop_mm, weight_g, price_usd, our_rating, published, amazon_url) VALUES
('HOKA', 'Speedgoat 6', 'hoka-speedgoat-6', 'trail', 7, 228, 145, 4.8, TRUE, 'https://amazon.com'),
('Salomon', 'Sense Ride 5', 'salomon-sense-ride-5', 'trail', 8, 240, 130, 4.6, TRUE, 'https://amazon.com'),
('Brooks', 'Cascadia 17', 'brooks-cascadia-17', 'trail', 10, 248, 140, 4.5, TRUE, 'https://amazon.com'),
('On', 'Cloudmonster', 'on-cloudmonster', 'road', 10.5, 264, 160, 4.7, TRUE, 'https://amazon.com'),
('Nike', 'Pegasus Trail 5', 'nike-pegasus-trail-5', 'trail', 10, 244, 120, 4.4, TRUE, 'https://amazon.com'),
('Altra', 'Lone Peak 8', 'altra-lone-peak-8', 'trail', 0, 222, 155, 4.6, TRUE, 'https://amazon.com'),
('Inov-8', 'Trailfly Ultra G 270', 'inov8-trailfly-ultra-g-270', 'trail', 8, 270, 165, 4.7, TRUE, 'https://amazon.com'),
('Saucony', 'Endorphin Speed 4', 'saucony-endorphin-speed-4', 'road', 8, 210, 135, 4.5, TRUE, 'https://amazon.com'),
('ASICS', 'Gel-Kayano 30', 'asics-gel-kayano-30', 'road', 10, 310, 160, 4.3, TRUE, 'https://amazon.com'),
('New Balance', 'Fresh Foam X 1080v14', 'nb-fresh-foam-x-1080v14', 'road', 10, 300, 175, 4.4, TRUE, 'https://amazon.com');

INSERT INTO vests (brand, model, slug, capacity_l, weight_g, price_usd, our_rating, utmb_compliant, published, amazon_url) VALUES
('Ultimate Direction', 'Adventure Vesta 6', 'ud-adventure-vesta-6', 6, 113, 150, 4.7, TRUE, TRUE, 'https://amazon.com'),
('Salomon', 'ADV Skin 12', 'salomon-adv-skin-12', 12, 220, 140, 4.6, TRUE, TRUE, 'https://amazon.com'),
('Nathan', 'VaporAiress 7L', 'nathan-vaporairess-7l', 7, 130, 130, 4.4, TRUE, TRUE, 'https://amazon.com'),
('Osprey', 'Dyna 6', 'osprey-dyna-6', 6, 140, 160, 4.5, FALSE, TRUE, 'https://amazon.com'),
('Black Diamond', 'Distance 15', 'black-diamond-distance-15', 15, 280, 200, 4.8, TRUE, TRUE, 'https://amazon.com'),
('Raidlight', 'Revolutiv 20', 'raidlight-revolutiv-20', 20, 350, 220, 4.6, TRUE, TRUE, 'https://amazon.com'),
('Naked Running Band', 'Band', 'naked-running-band-band', 0, 40, 50, 4.2, FALSE, TRUE, 'https://amazon.com'),
('UD', 'FastPack 20', 'ud-fastpack-20', 20, 300, 180, 4.5, TRUE, TRUE, 'https://amazon.com');

INSERT INTO gels (brand, product, slug, carbs_per_serving_g, caffeine_mg, price_per_serving, our_rating, published, amazon_url) VALUES
('Maurten', 'Gel 100', 'maurten-gel-100', 25, 0, 1.2, 4.8, TRUE, 'https://amazon.com'),
('Precision Fuel', 'PF 30', 'precision-fuel-pf-30', 30, 75, 1.5, 4.7, TRUE, 'https://amazon.com'),
('SiS', 'Go Isotonic Gel', 'sis-go-isotonic-gel', 22, 0, 0.8, 4.3, TRUE, 'https://amazon.com'),
('Spring Energy', 'Energy Bar', 'spring-energy-bar', 40, 0, 2.0, 4.5, TRUE, 'https://amazon.com'),
('GU Energy', 'Original Gel', 'gu-original-gel', 21, 40, 1.0, 4.2, TRUE, 'https://amazon.com'),
('Hüma', 'Chia Gel', 'huma-chia-gel', 26, 0, 1.3, 4.4, TRUE, 'https://amazon.com'),
('Clif', 'Bloks', 'clif-bloks', 24, 50, 1.1, 4.3, TRUE, 'https://amazon.com'),
('Skratch', 'Chews', 'skratch-chews', 22, 0, 0.9, 4.2, TRUE, 'https://amazon.com'),
('Tailwind', 'Drink Mix', 'tailwind-drink-mix', 35, 0, 0.7, 4.4, TRUE, 'https://amazon.com'),
('Larabar', 'Cashew Crunch', 'larabar-cashew-crunch', 30, 0, 1.8, 4.1, TRUE, 'https://amazon.com');
```

### 3. Generate Reviews (Optional for MVP)

To auto-generate reviews for seeded products:

```bash
curl -X POST http://localhost:3000/api/generate-review \
  -H "Content-Type: application/json" \
  -d '{"table": "shoes", "productId": "PRODUCT_ID_HERE"}'
```

Replace `PRODUCT_ID_HERE` with actual product IDs from Supabase.

---

## Phase 1g: Deploy to Vercel

### 1. Create GitHub Repository

```bash
# Add GitHub remote
git remote add origin https://github.com/oxide321/runninggeardb.git
git branch -M main
git push -u origin main
```

**Note:** You'll need to create the repo on GitHub first at `https://github.com/oxide321/runninggeardb`

### 2. Deploy to Vercel

1. Go to **Vercel Dashboard** → **Add New → Project**
2. Select the GitHub repo: `oxide321/runninggeardb`
3. Configure environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://ktgyjhlwfktflgjikced.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (your anon key from .env.local)
   - `SUPABASE_SERVICE_ROLE_KEY`: (get from Supabase Settings → API)
   - `DEEPSEEK_API_KEY`: (your DeepSeek key)

4. Set custom domain:
   - Go to **Project Settings → Domains**
   - Add `runninggeardb.com`
   - Update your DNS records to point to Vercel

### 3. Verify Commission Factory

After deployment, verify that this file is accessible:
```
https://runninggeardb.com/commission-factory-8cc6ca8d47b4462c97f57548702ef37e.html
```

---

## Post-Deployment Checklist

- [ ] Database schema created in Supabase
- [ ] 30 products seeded (10 shoes, 8 vests, 10 gels)
- [ ] GitHub repo created and pushed
- [ ] Vercel project deployed
- [ ] Environment variables configured
- [ ] Custom domain pointing to Vercel
- [ ] Commission Factory verification file accessible
- [ ] Homepage loads at runninggeardb.com
- [ ] Category pages work: /shoes, /vests, /gels
- [ ] Filters work on category pages

---

## Next Steps (Phase 2)

- Build `/compare` page (multi-select side-by-side comparison)
- Create 5+ SEO blog posts (auto-generate via `/api/generate-blog`)
- Set up weekly scheduled DeepSeek agent for new product discovery

---

## Support

For issues:
1. Check Supabase logs: Supabase Dashboard → Logs
2. Check Vercel logs: Vercel Dashboard → Deployments → Logs
3. Check network requests: Browser DevTools → Network tab
