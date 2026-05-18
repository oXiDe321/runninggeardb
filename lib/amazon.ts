// lib/amazon.ts
// Amazon affiliate URL utilities. Appends tracking tag to every Amazon link.

const AFFILIATE_TAG = 'trailgear-22';
const AMAZON_BASE = 'www.amazon.com.au';

/** Append the affiliate tag to any Amazon URL. Safe to call on already-tagged URLs. */
export function affiliateUrl(url: string): string {
  if (!url || url === 'https://amazon.com' || url === 'https://www.amazon.com' || url === 'https://amazon.com.au' || url === 'https://www.amazon.com.au') return url;

  try {
    const u = new URL(url);
    // Remove any existing tag
    u.searchParams.delete('tag');
    u.searchParams.set('tag', AFFILIATE_TAG);
    return u.toString();
  } catch {
    return url;
  }
}

/** Build an Amazon search URL for a product. Used when no specific ASIN URL exists. */
export function amazonSearchUrl(brand: string, model: string): string {
  const query = encodeURIComponent(`${brand} ${model}`);
  return `https://${AMAZON_BASE}/s?k=${query}&tag=${AFFILIATE_TAG}`;
}

/** Build an Amazon URL from an ASIN. */
export function amazonAsinUrl(asin: string): string {
  return `https://${AMAZON_BASE}/dp/${asin}?tag=${AFFILIATE_TAG}`;
}

export { AFFILIATE_TAG, AMAZON_BASE };
