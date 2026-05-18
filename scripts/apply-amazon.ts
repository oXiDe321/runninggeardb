// scripts/apply-amazon.ts — Apply Amazon ASINs, images, and affiliate URLs to seed products.
import 'dotenv/config';
import { supabaseAdmin } from '../lib/supabase';

const DATA: Record<string, { asin: string; image_url: string; amazon_url: string }> = {
  // Shoes
  'hoka-speedgoat-6': { asin: 'B0DMT7T2ZR', image_url: 'https://m.media-amazon.com/images/I/71i0iPhrz0L._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0DMT7T2ZR?tag=trailgear-22' },
  'salomon-sense-ride-5': { asin: 'B0C46K36B4', image_url: 'https://m.media-amazon.com/images/I/81fX+8jgyXL._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0C46K36B4?tag=trailgear-22' },
  'brooks-cascadia-17': { asin: 'B0CH1NBVD3', image_url: 'https://m.media-amazon.com/images/I/71dPUdpiOwL._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0CH1NBVD3?tag=trailgear-22' },
  'on-cloudmonster': { asin: 'B098NM355R', image_url: 'https://m.media-amazon.com/images/I/61+AEfQ7+2L._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B098NM355R?tag=trailgear-22' },
  'nike-pegasus-trail-5': { asin: 'B0DHLGB9QV', image_url: 'https://m.media-amazon.com/images/I/71wH9qPlMrL._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0DHLGB9QV?tag=trailgear-22' },
  // Vests
  'ud-adventure-vesta-6': { asin: 'B09WZ66JZM', image_url: 'https://m.media-amazon.com/images/I/71mkvMWxkeL._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B09WZ66JZM?tag=trailgear-22' },
  'salomon-adv-skin-12': { asin: 'B0992F7C9P', image_url: 'https://m.media-amazon.com/images/I/71LeYvbr-VL._AC_SL1200_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0992F7C9P?tag=trailgear-22' },
  'nathan-vaporairess-7l': { asin: 'B0BLV67Q6C', image_url: 'https://m.media-amazon.com/images/I/61-eBhdBKkL._AC_SL1000_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0BLV67Q6C?tag=trailgear-22' },
  'osprey-dyna-6': { asin: 'B0CPKYBJC9', image_url: 'https://m.media-amazon.com/images/I/61NIvI531nL._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0CPKYBJC9?tag=trailgear-22' },
  'bd-distance-15': { asin: 'B0BR62PSVW', image_url: 'https://m.media-amazon.com/images/I/61QUP6TEReL._AC_SL1000_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0BR62PSVW?tag=trailgear-22' },
  // Gels
  'maurten-gel-100': { asin: 'B07H319S3V', image_url: 'https://m.media-amazon.com/images/I/710vQKAUK4L._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B07H319S3V?tag=trailgear-22' },
  'precision-fuel-pf30': { asin: 'B0BT22QR5H', image_url: 'https://m.media-amazon.com/images/I/71PXZk4pe9L._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0BT22QR5H?tag=trailgear-22' },
  'sis-go-isotonic': { asin: 'B0768NDFZ8', image_url: 'https://m.media-amazon.com/images/I/719lcIM3F1L._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0768NDFZ8?tag=trailgear-22' },
  'spring-energy-bar': { asin: 'B09TVCT5T8', image_url: 'https://m.media-amazon.com/images/I/81zpUvWAFNL._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B09TVCT5T8?tag=trailgear-22' },
  'gu-original-gel': { asin: 'B0009W6X3W', image_url: 'https://m.media-amazon.com/images/I/61xDJIqJkeL._AC_SL1500_.jpg', amazon_url: 'https://www.amazon.com.au/dp/B0009W6X3W?tag=trailgear-22' },
};

async function apply() {
  for (const [slug, d] of Object.entries(DATA)) {
    const tables = ['shoes', 'vests', 'gels'] as const;
    for (const table of tables) {
      const { error } = await supabaseAdmin
        .from(table)
        .update({ image_url: d.image_url, amazon_url: d.amazon_url } as any)
        .eq('slug', slug);
      if (!error) console.log(`✓ ${table}.${slug}`);
      else if (error.code !== 'PGRST116') console.error(`✗ ${table}.${slug}: ${error.message}`);
    }
  }
  console.log('Done.');
}

apply().catch(console.error);

